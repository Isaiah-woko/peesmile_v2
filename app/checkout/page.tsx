import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { loadDraft } from "@/lib/services/drafts";
import { getOccasionBySlug } from "@/lib/services/occasions";
import { listActivePackages } from "@/lib/services/packages";
import { CURRENCY_COOKIE, isCurrencyCode, type CurrencyCode } from "@/lib/currency";
import { OrderSummary } from "@/components/checkout/OrderSummary";
import { BuyerContactForm } from "@/components/checkout/BuyerContactForm";
import { submitCheckout } from "./actions";
import { Button } from "@/components/primitives/Button";

export const dynamic = "force-dynamic";

export default async function CheckoutPage({
  searchParams,
}: {
  searchParams: Promise<{ draft?: string; cancelled?: string }>;
}) {
  const params = await searchParams;
  const draftToken = params.draft;

  if (!draftToken) {
    redirect("/book");
  }

  const rawDraft = await loadDraft(draftToken);
  if (!rawDraft) {
    redirect("/book");
  }

  // Parse draft safely (basic check, full validation in action)
  const draft = rawDraft as any;
  if (!draft.occasionSlug || !draft.packageSlug || !draft.recipient?.firstName) {
    redirect("/book");
  }

  const [occasion, packages, cookieStore] = await Promise.all([
    getOccasionBySlug(draft.occasionSlug),
    listActivePackages(),
    cookies(),
  ]);

  if (!occasion) redirect("/book");

  const pkg = packages.find((p) => p.slug === draft.packageSlug);
  if (!pkg) redirect("/book");

  const storedCurrency = cookieStore.get(CURRENCY_COOKIE)?.value;
  const currency: CurrencyCode =
    storedCurrency && isCurrencyCode(storedCurrency) ? storedCurrency : "USD";

  return (
    <div className="mx-auto w-full max-w-4xl px-6 py-12">
      <h1 className="display-serif text-display-4 text-ink">Checkout</h1>
      <p className="text-body-0 text-ink-soft mt-3">
        Review your call details and enter your contact info to proceed to payment.
      </p>

      {params.cancelled === "true" ? (
        <div className="mt-6 rounded-md border border-error/30 bg-error/5 p-4 text-body-small text-error">
          Payment was cancelled. Your draft is saved. You can try again when you are ready.
        </div>
      ) : null}

      <form action={submitCheckout} className="mt-10 grid gap-10 md:grid-cols-[1fr_320px]">
        <input type="hidden" name="draftToken" value={draftToken} />

        <div className="space-y-10">
          <BuyerContactForm />

          <div className="flex justify-end md:hidden">
            <Button type="submit" size="lg" className="w-full">
              Proceed to payment
            </Button>
          </div>
        </div>

        <div className="md:sticky md:top-24 md:self-start">
          <OrderSummary
            occasion={occasion}
            pkg={pkg}
            recipientName={draft.recipient.firstName}
            recipientTimezone={draft.recipient.timezone || "UTC"}
            scheduledStart={new Date(draft.moment?.scheduledStart || Date.now())}
            windowMinutes={draft.moment?.windowMinutes || 15}
            currency={currency}
          />

          <div className="mt-6 hidden md:block">
            <Button type="submit" size="lg" className="w-full">
              Proceed to payment
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
}