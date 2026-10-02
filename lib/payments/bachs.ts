import { createHmac, timingSafeEqual } from "crypto";
import type {
  CheckoutSession,
  CheckoutSessionInput,
  NormalizedWebhook,
  PaymentProvider,
  RefundInput,
  RefundResult,
  WebhookKind,
} from "./provider";
import { decimalStringToMinor, minorToDecimalString } from "./money";

// Verified against the Bachs documentation.
//   Base URL: https://api.bachs.io/v1 live, https://sandbox-api.bachs.io/v1 sandbox.
//   Auth: Authorization Bearer sk_live_... or sk_sandbox_...
//   Checkout: POST /v1/checkout-sessions with pricing {currency, amount} and inline customer.
//   Amount: positive decimal string such as "32500.00", never minor units.
//   Refunds: POST /v1/refunds, references the charge_id.
//   Webhook signature: HMAC-SHA256 of "{timestamp}.{raw_body}".
//   Signature headers: X-Bachs-Timestamp and X-Bachs-Signature.
//   Timestamp tolerance: 300 seconds for replay protection.

const WEBHOOK_TIMESTAMP_HEADER = "x-bachs-timestamp";
const WEBHOOK_SIGNATURE_HEADER = "x-bachs-signature";
const TIMESTAMP_TOLERANCE_MS = 300 * 1000;

const EVENT_TYPE_MAP: Record<string, WebhookKind> = {
  "collection.succeeded": "payment.succeeded",
  "collection.failed": "payment.failed",
  "collection.underpaid": "payment.underpaid",
  "checkout.expired": "payment.expired",
  "refund.created": "refund.created",
  "refund.paid": "refund.paid",
  "refund.failed": "refund.failed",
};

function baseUrl(): string {
  return process.env.BACHS_API_BASE_URL ?? "https://api.bachs.io/v1";
}

function requireSecret(): string {
  const secret = process.env.BACHS_SECRET_KEY;
  if (!secret) {
    throw new Error("BACHS_SECRET_KEY is not configured.");
  }
  return secret;
}

interface BachsErrorResponse {
  detail?: string;
  error_code?: string;
  errors?: Array<{ field: string; message: string; type: string }>;
}

async function postJson<T>(
  path: string,
  body: unknown,
  idempotencyKey: string
): Promise<T> {
  const response = await fetch(`${baseUrl()}${path}`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${requireSecret()}`,
      "Content-Type": "application/json",
      "Idempotency-Key": idempotencyKey,
    },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    const text = await response.text().catch(() => "");
    let message = `Bachs request to ${path} failed with status ${response.status}.`;
    try {
      const errorBody = JSON.parse(text) as BachsErrorResponse;
      if (errorBody.detail) {
        message += ` ${errorBody.detail}`;
      }
      if (errorBody.error_code) {
        message += ` Code: ${errorBody.error_code}.`;
      }
    } catch {
      if (text) {
        message += ` ${text}`;
      }
    }
    throw new Error(message);
  }

  return (await response.json()) as T;
}

// Accepts either seconds or milliseconds since epoch and normalises to ms.
function parseTimestampMs(value: string): number | null {
  const numeric = Number(value);
  if (!Number.isFinite(numeric)) {
    return null;
  }
  return numeric > 1e12 ? numeric : numeric * 1000;
}

function isValidSignature(
  rawBody: string,
  timestamp: string | undefined,
  signature: string | undefined
): boolean {
  if (!timestamp || !signature) {
    return false;
  }
  const secret = process.env.BACHS_WEBHOOK_SECRET;
  if (!secret) {
    return false;
  }

  const timestampMs = parseTimestampMs(timestamp);
  if (timestampMs === null) {
    return false;
  }
  if (Math.abs(Date.now() - timestampMs) > TIMESTAMP_TOLERANCE_MS) {
    return false;
  }

  // The signed payload uses the exact timestamp string as received.
  const signedPayload = `${timestamp}.${rawBody}`;
  const expected = createHmac("sha256", secret)
    .update(signedPayload, "utf8")
    .digest("hex");

  const expectedBuffer = Buffer.from(expected, "utf8");
  const actualBuffer = Buffer.from(signature, "utf8");
  if (expectedBuffer.length !== actualBuffer.length) {
    return false;
  }
  return timingSafeEqual(expectedBuffer, actualBuffer);
}

interface BachsCheckoutResponse {
  id?: string;
  url?: string;
  [key: string]: unknown;
}

interface BachsRefundResponse {
  id?: string;
  status?: string;
  [key: string]: unknown;
}

interface BachsWebhookData {
  charge_id?: string;
  checkout_id?: string;
  status?: string;
  amount?: string;
  currency?: string;
  metadata?: Record<string, string>;
  [key: string]: unknown;
}

interface BachsEventPayload {
  id?: string;
  type?: string;
  created_at?: string;
  organization_id?: string;
  data?: BachsWebhookData;
  [key: string]: unknown;
}

export const bachsProvider: PaymentProvider = {
  name: "bachs",

  async createCheckoutSession(input: CheckoutSessionInput): Promise<CheckoutSession> {
    const customer: Record<string, string> = {
      email: input.buyerEmail,
      name: input.buyerName,
    };
    if (input.buyerPhone) {
      customer.phone = input.buyerPhone;
    }

    const response = await postJson<BachsCheckoutResponse>(
      "/checkout-sessions",
      {
        pricing: {
          currency: input.currency,
          amount: minorToDecimalString(input.amountMinor, input.currency),
        },
        customer,
        metadata: input.metadata,
        success_url: input.successUrl,
        cancel_url: input.cancelUrl,
      },
      input.orderId
    );

    return {
      providerSessionId: response.id ?? "",
      hostedUrl: response.url ?? null,
      raw: response,
    };
  },

  async parseWebhook(opts): Promise<NormalizedWebhook | null> {
    const timestamp = opts.headers[WEBHOOK_TIMESTAMP_HEADER];
    const signature = opts.headers[WEBHOOK_SIGNATURE_HEADER];

    if (!isValidSignature(opts.rawBody, timestamp, signature)) {
      return null;
    }

    let payload: BachsEventPayload;
    try {
      payload = JSON.parse(opts.rawBody) as BachsEventPayload;
    } catch {
      return null;
    }

    const data = payload.data ?? {};
    const metadata = data.metadata ?? {};
    const kind = EVENT_TYPE_MAP[payload.type ?? ""] ?? "other";

    let amountMinor: number | null = null;
    if (typeof data.amount === "string" && data.currency) {
      amountMinor = decimalStringToMinor(data.amount, data.currency);
    }

    return {
      providerEventId: payload.id ?? "",
      kind,
      orderId: metadata.orderId ?? null,
      providerSessionId: data.checkout_id ?? null,
      providerTransactionId: data.charge_id ?? null,
      amountMinor,
      currency: data.currency ?? null,
      raw: payload,
    };
  },

  async refund(input: RefundInput): Promise<RefundResult> {
    const response = await postJson<BachsRefundResponse>(
      "/refunds",
      {
        charge_id: input.providerTransactionId,
        amount: minorToDecimalString(input.amountMinor, input.currency),
        reason: input.reason,
      },
      `refund-${input.providerTransactionId}`
    );

    return {
      providerRefundId: response.id ?? "",
      amountMinor: input.amountMinor,
      status: response.status === "succeeded" ? "succeeded" : "pending",
      raw: response,
    };
  },
};