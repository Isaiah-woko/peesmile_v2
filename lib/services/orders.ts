import { randomBytes } from "crypto";
import { prisma } from "@/lib/prisma";
import { InvalidTransitionError, NotFoundError } from "@/lib/errors";
import type { Order, OrderStatus, Prisma } from "@prisma/client";

// The v2.0 state machine. Every status change passes through transitionOrder.
const ALLOWED_TRANSITIONS: Record<OrderStatus, ReadonlySet<OrderStatus>> = {
  draft: new Set<OrderStatus>(["pending_payment", "cancelled"]),
  pending_payment: new Set<OrderStatus>(["paid", "failed", "cancelled"]),
  paid: new Set<OrderStatus>(["caller_assigned", "refunded", "cancelled"]),
  caller_assigned: new Set<OrderStatus>(["brief_reviewed", "refunded", "cancelled"]),
  brief_reviewed: new Set<OrderStatus>(["in_window", "refunded", "cancelled"]),
  in_window: new Set<OrderStatus>(["dialing", "failed"]),
  dialing: new Set<OrderStatus>(["connected", "failed"]),
  connected: new Set<OrderStatus>(["delivered", "failed"]),
  delivered: new Set<OrderStatus>(["refunded"]),
  failed: new Set<OrderStatus>(["refunded"]),
  refunded: new Set<OrderStatus>(),
  cancelled: new Set<OrderStatus>(),
};

// Strict whitelist of extra columns that may be written in the same update as
// a transition. Keeps transitionOrder the single gateway for status changes.
export type OrderTransitionPatch = {
  paymentProvider?: string;
  paymentIntentId?: string | null;
};

export function canTransition(from: OrderStatus, to: OrderStatus): boolean {
  return ALLOWED_TRANSITIONS[from]?.has(to) ?? false;
}

export async function transitionOrder(
  orderId: string,
  nextStatus: OrderStatus,
  patch?: OrderTransitionPatch
): Promise<Order> {
  const order = await prisma.order.findUnique({
    where: { id: orderId },
    select: { id: true, status: true },
  });

  if (!order) {
    throw new NotFoundError("Order");
  }

  if (!canTransition(order.status, nextStatus)) {
    throw new InvalidTransitionError(order.status, nextStatus);
  }

  const data: Prisma.OrderUpdateInput = { status: nextStatus };
  if (patch?.paymentProvider !== undefined) {
    data.paymentProvider = patch.paymentProvider;
  }
  if (patch?.paymentIntentId !== undefined) {
    data.paymentIntentId = patch.paymentIntentId;
  }

  return prisma.order.update({ where: { id: orderId }, data });
}

function generatePublicToken(): string {
  // 24 random bytes encode to a 32 character URL-safe token, above the
  // 22 character minimum required by the spec.
  return randomBytes(24).toString("base64url");
}

export interface CreateOrderInput {
  buyerName: string;
  buyerEmail: string;
  buyerWhatsapp?: string | null;
  whatsappOptIn: boolean;
  recipientId: string;
  occasionId: string;
  packageId: string;
  currency: string;
  subtotal: number;
  addonsTotal: number;
  total: number;
  scheduledStart: Date;
  windowMinutes: number;
  backupStart?: Date | null;
  recordingConsent: boolean;
  buyerAttestation: boolean;
}

export async function createOrder(input: CreateOrderInput): Promise<Order> {
  return prisma.order.create({
    data: {
      publicToken: generatePublicToken(),
      status: "draft",
      buyerName: input.buyerName,
      buyerEmail: input.buyerEmail,
      buyerWhatsapp: input.buyerWhatsapp ?? null,
      whatsappOptIn: input.whatsappOptIn,
      recipientId: input.recipientId,
      occasionId: input.occasionId,
      packageId: input.packageId,
      currency: input.currency,
      subtotal: input.subtotal,
      addonsTotal: input.addonsTotal,
      total: input.total,
      scheduledStart: input.scheduledStart,
      windowMinutes: input.windowMinutes,
      backupStart: input.backupStart ?? null,
      recordingConsent: input.recordingConsent,
      buyerAttestation: input.buyerAttestation,
    },
  });
}

// Public read for the magic link tracker. Deliberately excludes phone numbers
// and buyer contact details the visitor does not need.
export async function getPublicOrderByToken(token: string) {
  return prisma.order.findUnique({
    where: { publicToken: token },
    select: {
      id: true,
      status: true,
      scheduledStart: true,
      windowMinutes: true,
      createdAt: true,
      recipient: { select: { firstName: true, timezone: true, city: true } },
      occasion: { select: { name: true, slug: true } },
      package: { select: { name: true, slug: true } },
      talent: { select: { displayName: true } },
      keepsake: { select: { slug: true, visibility: true } },
    },
  });
}

export async function markBriefReviewed(orderId: string, reviewerId: string) {
  return prisma.$transaction(async (tx) => {
    const order = await tx.order.findUnique({
      where: { id: orderId },
      select: { id: true, status: true },
    });
    if (!order) {
      throw new NotFoundError("Order");
    }
    if (!canTransition(order.status, "brief_reviewed")) {
      throw new InvalidTransitionError(order.status, "brief_reviewed");
    }

    const brief = await tx.callBrief.findUnique({
      where: { orderId },
      select: { keyMessage: true },
    });
    if (!brief) {
      throw new NotFoundError("Call brief");
    }

    const [updatedOrder] = await Promise.all([
      tx.order.update({ where: { id: orderId }, data: { status: "brief_reviewed" } }),
      tx.callBrief.update({
        where: { orderId },
        data: { reviewedBy: reviewerId, reviewedAt: new Date() },
      }),
    ]);
    return updatedOrder;
  });
}