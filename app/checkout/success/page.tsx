import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { CheckIcon } from "@phosphor-icons/react";
import Link from "next/link";
import { Button } from "@/components/primitives/Button";

export const dynamic = "force-dynamic";

export default async function CheckoutSuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ checkout_id?: string }>;
}) {
  const params = await searchParams;
  const checkoutId = params.checkout_id;

  if (!checkoutId) {
    redirect("/");
  }

  // Find the order by the Bachs checkout ID (stored in paymentIntentId)
  const order = await prisma.order.findFirst({
    where: { paymentIntentId: checkoutId },
    select: { id: true, publicToken: true, status: true },
  });

  if (!order) {
    // If we can't find it, the webhook might still be processing.
    // Show a generic "processing" state.
    return (
      <div className="mx-auto w-full max-w-2xl px-6 py-24 text-center">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-sage/20">
          <CheckIcon size={32} className="text-pine" weight="bold" />
        </div>
        <h1 className="display-serif text-display-4 mt-6 text-ink">Payment received</h1>
        <p className="text-body-0 text-ink-soft measure mx-auto mt-4">
          We are confirming your payment and prepping your call brief. This usually takes less than a minute.
        </p>
        <p className="text-body-small text-ash mt-2">
          We will send a receipt and your magic tracking link to your email and WhatsApp shortly.
        </p>
      </div>
    );
  }

  // If the webhook already processed it, we can link directly to the tracker
  if (order.status === "paid" || order.status === "caller_assigned" || order.status === "brief_reviewed") {
    return (
      <div className="mx-auto w-full max-w-2xl px-6 py-24 text-center">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-sage/20">
          <CheckIcon size={32} className="text-pine" weight="bold" />
        </div>
        <h1 className="display-serif text-display-4 mt-6 text-ink">You are all set</h1>
        <p className="text-body-0 text-ink-soft measure mx-auto mt-4">
          Payment confirmed. Adaeze is reviewing your brief now.
        </p>
        <div className="mt-8 flex justify-center">
          <Button asChild size="lg">
            <Link href={`/calls/${order.publicToken}`}>Track your call</Link>
          </Button>
        </div>
      </div>
    );
  }

  // Fallback processing state
  return (
    <div className="mx-auto w-full max-w-2xl px-6 py-24 text-center">
      <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-bone">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-ember border-t-transparent" />
      </div>
      <h1 className="display-serif text-display-4 mt-6 text-ink">Confirming payment</h1>
      <p className="text-body-0 text-ink-soft measure mx-auto mt-4">
        We received your payment and are finalizing the details. Please wait a moment.
      </p>
    </div>
  );
}