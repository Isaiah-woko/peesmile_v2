import { NextRequest, NextResponse } from "next/server";
import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { getPaymentProvider } from "@/lib/payments";
import { confirmPayment } from "@/lib/services/payments";

export async function POST(request: NextRequest) {
  const provider = getPaymentProvider();

  const rawBody = await request.text();
  const headers: Record<string, string> = {};
  request.headers.forEach((value, key) => {
    headers[key] = value;
  });

  // Reject anything with an invalid signature or an unparseable body.
  const event = await provider.parseWebhook({ rawBody, headers });
  if (!event) {
    return NextResponse.json({ error: "Invalid webhook signature." }, { status: 400 });
  }
  if (!event.providerEventId) {
    return NextResponse.json({ error: "Webhook is missing an event id." }, { status: 400 });
  }

  // Idempotency. Skip only if this exact event was already processed.
  const existing = await prisma.webhookEvent.findUnique({
    where: { id: event.providerEventId },
  });
  if (existing?.processed) {
    return NextResponse.json({ received: true, duplicate: true });
  }

  // Record the event if unseen. The unique constraint guards against
  // concurrent duplicate deliveries.
  if (!existing) {
    try {
      await prisma.webhookEvent.create({
        data: {
          id: event.providerEventId,
          provider: provider.name,
          eventType: event.kind,
          payload: event.raw as Prisma.InputJsonValue,
          processed: false,
        },
      });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
        return NextResponse.json({ received: true, duplicate: true });
      }
      throw error;
    }
  }

  try {
    if (event.kind === "payment.succeeded" && event.orderId) {
      await confirmPayment({ orderId: event.orderId, paymentProvider: provider.name });
      // WhatsApp and email confirmations are wired in Phase 4 Part 3.
    }

    await prisma.webhookEvent.update({
      where: { id: event.providerEventId },
      data: { processed: true },
    });

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("bachs webhook processing failed", error);
    return NextResponse.json({ error: "Webhook processing failed." }, { status: 500 });
  }
}