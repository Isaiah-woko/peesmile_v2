import { prisma } from "@/lib/prisma";
import { NotFoundError } from "@/lib/errors";
import { canTransition, transitionOrder } from "@/lib/services/orders";
import type { OrderStatus } from "@prisma/client";

const ALREADY_PAST_PAYMENT: ReadonlySet<OrderStatus> = new Set<OrderStatus>([
  "paid",
  "caller_assigned",
  "brief_reviewed",
  "in_window",
  "dialing",
  "connected",
  "delivered",
]);

export type ConfirmPaymentOutcome = "paid" | "already_processed" | "not_payable";

export interface ConfirmPaymentInput {
  orderId: string;
  paymentProvider: string;
}

export async function confirmPayment(
  input: ConfirmPaymentInput
): Promise<ConfirmPaymentOutcome> {
  const order = await prisma.order.findUnique({
    where: { id: input.orderId },
    select: { id: true, status: true },
  });

  if (!order) {
    throw new NotFoundError("Order");
  }

  if (ALREADY_PAST_PAYMENT.has(order.status)) {
    return "already_processed";
  }

  if (!canTransition(order.status, "paid")) {
    return "not_payable";
  }

  await transitionOrder(order.id, "paid", {
    paymentProvider: input.paymentProvider,
  });

  return "paid";
}