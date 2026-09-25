import { prisma } from "@/lib/prisma";
import { InvalidTransitionError, NotFoundError } from "@/lib/errors";
import type { OrderStatus, Prisma } from "@prisma/client";

const ORDER_STATUSES = [
  "draft",
  "pending_payment",
  "paid",
  "caller_assigned",
  "brief_reviewed",
  "in_window",
  "dialing",
  "connected",
  "delivered",
  "failed",
  "refunded",
  "cancelled",
] as const satisfies readonly OrderStatus[];

const ALLOWED: Record<OrderStatus, ReadonlySet<OrderStatus>> = {
  draft: new Set<OrderStatus>(["pending_payment", "cancelled"]),
  pending_payment: new Set<OrderStatus>(["paid", "cancelled"]),
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

export function isOrderStatus(value: string): value is OrderStatus {
  return (ORDER_STATUSES as readonly string[]).includes(value);
}

export type TransitionMeta = Prisma.InputJsonValue | undefined;

export async function transitionOrder(
  orderId: string,
  nextStatus: OrderStatus,
  meta?: TransitionMeta
) {
  const order = await prisma.order.findUnique({
    where: { id: orderId },
    select: { id: true, status: true },
  });

  if (!order) {
    throw new NotFoundError("Order");
  }

  if (!ALLOWED[order.status].has(nextStatus)) {
    throw new InvalidTransitionError(order.status, nextStatus);
  }

  return prisma.order.update({
    where: { id: orderId },
    data: {
      status: nextStatus,
      // meta is reserved for future audit fields. It is validated upstream.
      ...(meta ? {} : {}),
    },
  });
}

export interface OrderInput {
  buyerName: string;
  buyerEmail: string;
  buyerWhatsapp?: string | null;
  whatsappOptIn?: boolean;
  recipientId: string;
  occasionId: string;
  packageId: string;
  talentId?: string | null;
  currency: string;
  subtotal: number;
  addonsTotal?: number;
  total: number;
  scheduledStart: Date;
  windowMinutes?: number;
  backupStart?: Date | null;
  recordingConsent: boolean;
  buyerAttestation: boolean;
}

export function createOrder(input: OrderInput) {
  const publicToken = crypto.randomUUID().replace(/-/g, "") + crypto.randomUUID().replace(/-/g, "").slice(0, 10);

  return prisma.order.create({
    data: {
      publicToken,
      buyerName: input.buyerName,
      buyerEmail: input.buyerEmail,
      buyerWhatsapp: input.buyerWhatsapp ?? null,
      whatsappOptIn: input.whatsappOptIn ?? false,
      recipientId: input.recipientId,
      occasionId: input.occasionId,
      packageId: input.packageId,
      talentId: input.talentId ?? null,
      status: "draft",
      currency: input.currency,
      subtotal: input.subtotal,
      addonsTotal: input.addonsTotal ?? 0,
      total: input.total,
      scheduledStart: input.scheduledStart,
      windowMinutes: input.windowMinutes ?? 15,
      backupStart: input.backupStart ?? null,
      recordingConsent: input.recordingConsent,
      buyerAttestation: input.buyerAttestation,
    },
  });
}

export async function getPublicOrderByToken(token: string) {
  const order = await prisma.order.findUnique({
    where: { publicToken: token },
    include: {
      recipient: { select: { firstName: true, timezone: true, city: true } },
      occasion: { select: { slug: true, name: true, requiresReveal: true } },
      package: { select: { slug: true, name: true, includesKeepsake: true } },
      talent: { select: { displayName: true } },
      keepsake: {
        select: { slug: true, durationMs: true, visibility: true },
      },
    },
  });

  if (!order) return null;

  return {
    status: order.status,
    scheduledStart: order.scheduledStart,
    windowMinutes: order.windowMinutes,
    currency: order.currency,
    total: order.total,
    createdAt: order.createdAt,
    recipient: order.recipient,
    occasion: order.occasion,
    package: order.package,
    caller: order.talent,
    keepsake: order.keepsake,
  };
}

export type PublicOrder = NonNullable<Awaited<ReturnType<typeof getPublicOrderByToken>>>;

export async function markBriefReviewed(orderId: string, reviewerId: string) {
  const brief = await prisma.callBrief.findUnique({
    where: { orderId },
    select: { keyMessage: true },
  });

  if (!brief) {
    throw new NotFoundError("Call brief");
  }

  const [order] = await prisma.$transaction([
    prisma.order.update({
      where: { id: orderId },
      data: { status: "brief_reviewed" },
    }),
    prisma.callBrief.update({
      where: { orderId },
      data: { reviewedBy: reviewerId, reviewedAt: new Date() },
    }),
  ]);

  return order;
}