"use client";

import type { Package, PackagePrice } from "@prisma/client";
import { useBooking } from "@/components/booking/BookingProvider";
import { StepShell } from "@/components/booking/StepShell";
import type { WizardStepProps } from "@/components/booking/types";
import { TicketEdge } from "@/components/primitives/TicketEdge";
import { formatAmount, type CurrencyCode } from "@/lib/currency";
import { formatTimeInTimezone } from "@/lib/timezone";
import { cn } from "@/lib/utils";

type PackageWithPrices = Package & { prices: PackagePrice[] };

interface ReviewStepProps extends WizardStepProps {
  packages: PackageWithPrices[];
  currency: CurrencyCode;
}

function findPrice(prices: PackagePrice[], currency: CurrencyCode): PackagePrice | null {
  return (
    prices.find((price) => price.currency === currency) ??
    prices.find((price) => price.currency === "USD") ??
    null
  );
}

export function ReviewStep({
  packages,
  currency,
  canContinue,
  onContinue,
  onBack,
}: ReviewStepProps) {
  const { draft, setPackage, setConsent } = useBooking();

  const handleConsentChange = (
    field: "recordingConsent" | "buyerAttestation",
    value: boolean
  ) => {
    setConsent({ ...draft.consent, [field]: value });
  };

  return (
    <StepShell
      stepNumber={6}
      totalSteps={6}
      kicker="Review"
      title="Read it back before we dial"
      subtitle="This is the brief she will carry into the call."
      canContinue={canContinue}
      isLast
      onBack={onBack}
      onContinue={onContinue}
      continueLabel="Continue to checkout"
    >
      <div className="space-y-8">
        <div className="rounded-md border border-rule bg-paper">
          <TicketEdge className="px-2 pt-2" />
          <div className="px-6 pb-6">
            <p className="mono-label text-body-small text-ash mt-4">Call brief</p>
            <dl className="mt-4 space-y-4">
              <div>
                <dt className="mono-label text-body-small text-ash">For</dt>
                <dd className="text-body-0 text-ink mt-1">
                  {draft.recipient.firstName || "Not set"}
                  {draft.recipient.relationship ? ` · ${draft.recipient.relationship}` : ""}
                </dd>
              </div>
              <div>
                <dt className="mono-label text-body-small text-ash">Tone</dt>
                <dd className="text-body-0 text-ink mt-1 capitalize">
                  {draft.brief.tone ?? "Not set"}
                </dd>
              </div>
              <div>
                <dt className="mono-label text-body-small text-ash">The one thing to say</dt>
                <dd className="display-serif text-body-0 italic text-ink mt-1">
                  {draft.brief.keyMessage ? `“${draft.brief.keyMessage}”` : "Not set"}
                </dd>
              </div>
              <div>
                <dt className="mono-label text-body-small text-ash">The moment</dt>
                <dd className="text-body-0 text-ink mt-1">
                  {draft.moment
                    ? `${formatTimeInTimezone(
                        new Date(draft.moment.scheduledStart),
                        draft.recipient.timezone ?? "UTC"
                      )} their time · ${draft.moment.windowMinutes} minute window`
                    : "Not set"}
                </dd>
              </div>
            </dl>
          </div>
        </div>

        <div>
          <p className="text-body-small font-medium text-ink">Choose the package</p>
          <div role="radiogroup" aria-label="Package" className="mt-3 grid gap-3 md:grid-cols-3">
            {packages.map((pkg) => {
              const price = findPrice(pkg.prices, currency);
              const selected = draft.packageSlug === pkg.slug;
              return (
                <button
                  key={pkg.slug}
                  type="button"
                  role="radio"
                  aria-checked={selected}
                  onClick={() => setPackage(pkg.slug)}
                  className={cn(
                    "rounded-md border p-4 text-left transition-colors duration-[120ms]",
                    selected ? "border-ember bg-bone" : "border-rule bg-paper hover:bg-bone"
                  )}
                >
                  <span className="text-body-0 font-medium text-ink block">{pkg.name}</span>
                  {pkg.tagline ? (
                    <span className="text-body-small text-ink-soft mt-1 block">{pkg.tagline}</span>
                  ) : null}
                  <span className="display-serif text-title-1 text-ink mt-2 block tabular-nums">
                    {price ? formatAmount(price.amount, price.currency as CurrencyCode) : "—"}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        <div className="space-y-4">
          <label className="flex items-start gap-3">
            <input
              type="checkbox"
              checked={draft.consent.recordingConsent}
              onChange={(event) => handleConsentChange("recordingConsent", event.target.checked)}
              className="mt-1 h-4 w-4 accent-[var(--color-ember)]"
            />
            <span>
              <span className="text-body-0 text-ink block">Record this call for the Keepsake</span>
              <span className="text-body-small text-ink-soft">
                Applies only if your package includes a Keepsake and consent allows it.
              </span>
            </span>
          </label>

          <label className="flex items-start gap-3">
            <input
              type="checkbox"
              checked={draft.consent.buyerAttestation}
              onChange={(event) => handleConsentChange("buyerAttestation", event.target.checked)}
              className="mt-1 h-4 w-4 accent-ember"
            />
            <span>
              <span className="text-body-0 text-ink block">
                I confirm this call is welcome and lawful
              </span>
              <span className="text-body-small text-ink-soft">
                Required. You confirm the recipient is an adult and this is not harassment.
              </span>
            </span>
          </label>
        </div>
      </div>
    </StepShell>
  );
}