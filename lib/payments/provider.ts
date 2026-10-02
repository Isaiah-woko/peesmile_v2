export type WebhookKind =
  | "payment.succeeded"
  | "payment.failed"
  | "payment.underpaid"
  | "payment.expired"
  | "refund.created"
  | "refund.paid"
  | "refund.failed"
  | "other";

export interface CheckoutSessionInput {
  orderId: string;
  amountMinor: number;
  currency: string;
  buyerEmail: string;
  buyerName: string;
  buyerPhone?: string;
  successUrl: string;
  cancelUrl: string;
  metadata: Record<string, string>;
}

export interface CheckoutSession {
  providerSessionId: string;
  hostedUrl: string | null;
  raw: unknown;
}

export interface NormalizedWebhook {
  providerEventId: string;
  kind: WebhookKind;
  orderId: string | null;
  providerSessionId: string | null;
  providerTransactionId: string | null;
  amountMinor: number | null;
  currency: string | null;
  raw: unknown;
}

export interface RefundInput {
  providerTransactionId: string;
  amountMinor: number;
  currency: string;
  reason?: string;
}

export interface RefundResult {
  providerRefundId: string;
  amountMinor: number;
  status: "succeeded" | "pending" | "failed";
  raw: unknown;
}

export interface PaymentProvider {
  readonly name: string;
  createCheckoutSession(input: CheckoutSessionInput): Promise<CheckoutSession>;
  // Returns null when the signature is invalid or the payload cannot parse.
  // Callers must treat null as a rejected webhook.
  parseWebhook(opts: {
    rawBody: string;
    headers: Record<string, string>;
  }): Promise<NormalizedWebhook | null>;
  refund(input: RefundInput): Promise<RefundResult>;
}