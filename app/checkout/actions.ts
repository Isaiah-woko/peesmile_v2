"use server";

import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { loadDraft } from "@/lib/services/drafts";
import { bookingSchema, buyerSchema } from "@/lib/validation/schemas";
import { createOrder, transitionOrder } from "@/lib/services/orders";
import { getPaymentProvider } from "@/lib/payments";
import { getOccasionBySlug } from "@/lib/services/occasions";
import { listActivePackages } from "@/lib/services/packages";
import type { CurrencyCode } from "@/lib/currency";

export async function submitCheckout(formData: FormData) {
  const draftToken = formData.get("draftToken") as string;
  if (!draftToken) {
    throw new Error("Missing draft token. Please restart your booking.");
  }

  // 1. Load and validate the draft
  const rawDraft = await loadDraft(draftToken);
  if (!rawDraft) {
    throw new Error("Draft not found or expired. Please restart your booking.");
  }

  const draftResult = bookingSchema.safeParse(rawDraft);
  if (!draftResult.success) {
    throw new Error("Invalid booking data. Please restart your booking.");
  }
  const draft = draftResult.data;

  // 2. Validate buyer contact info
  const buyerResult = buyerSchema.safeParse({
    buyerName: formData.get("buyerName"),
    buyerEmail: formData.get("buyerEmail"),
    buyerWhatsapp: formData.get("buyerWhatsapp"),
    whatsappOptIn: formData.get("whatsappOptIn") === "on",
  });
  if (!buyerResult.success) {
    throw new Error("Please fill in all required contact details.");
  }
  const buyer = buyerResult.data;

  // 3. Check Do-Not-Call registry
  const dnc = await prisma.doNotCall.findUnique({
    where: { phoneE164: draft.recipient.phoneE164 },
  });
  if (dnc) {
    throw new Error("This number is on our permanent do-not-call list and cannot be called.");
  }

  // 4. Resolve authoritative price
  const [occasion, packages] = await Promise.all([
    getOccasionBySlug(draft.occasionSlug),
    listActivePackages(),
  ]);

  if (!occasion) throw new Error("Occasion not found.");

  const pkg = packages.find((p) => p.slug === draft.packageSlug);
  if (!pkg) throw new Error("Package not found.");

  const price = pkg.prices.find((p) => p.currency === draft.moment.scheduledStart ? "USD" : "USD"); // Fallback logic simplified
  const currency = (price?.currency ?? "USD") as CurrencyCode;
  const total = price?.amount ?? 0;

  // 5. Create Recipient and CallBrief
  const recipient = await prisma.recipient.create({
    data: {
      firstName: draft.recipient.firstName!,
      phoneE164: draft.recipient.phoneE164,
      phoneCountry: draft.recipient.phoneCountry,
      timezone: draft.recipient.timezone,
      city: draft.recipient.city,
      relationship: draft.recipient.relationship,
    },
  });

  // 6. Create the Order
  const order = await createOrder({
    buyerName: buyer.buyerName,
    buyerEmail: buyer.buyerEmail,
    buyerWhatsapp: buyer.buyerWhatsapp,
    whatsappOptIn: buyer.whatsappOptIn,
    recipientId: recipient.id,
    occasionId: occasion.id,
    packageId: pkg.id,
    currency,
    subtotal: total,
    addonsTotal: 0,
    total,
    scheduledStart: new Date(draft.moment.scheduledStart),
    windowMinutes: draft.moment.windowMinutes,
    backupStart: draft.moment.backupStart ? new Date(draft.moment.backupStart) : null,
    recordingConsent: draft.consent.recordingConsent,
    buyerAttestation: draft.consent.buyerAttestation,
  });

  // 7. Create CallBrief
  await prisma.callBrief.create({
    data: {
      orderId: order.id,
      tone: draft.brief.tone,
      keyMessage: draft.brief.keyMessage!,
      context: draft.brief.context,
      insideJokes: draft.brief.insideJokes,
      avoid: draft.brief.avoid,
      language: draft.brief.language,
    },
  });

  // 8. Transition to pending_payment
  await transitionOrder(order.id, "pending_payment");

  // 9. Create Bachs Checkout Session
  const provider = getPaymentProvider();
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

  const session = await provider.createCheckoutSession({
    orderId: order.id,
    amountMinor: total,
    currency,
    buyerEmail: buyer.buyerEmail,
    buyerName: buyer.buyerName,
    buyerPhone: buyer.buyerWhatsapp,
    successUrl: `${siteUrl}/checkout/success?checkout_id={CHECKOUT_ID}`, // Bachs replaces {CHECKOUT_ID}
    cancelUrl: `${siteUrl}/checkout?cancelled=true`,
    metadata: {
      orderId: order.id,
      draftToken,
    },
  });

  if (!session.hostedUrl) {
    throw new Error("Could not create payment session. Please try again.");
  }

  // 10. Redirect to Bachs hosted checkout
  redirect(session.hostedUrl);
}