"use client";

import { useCallback, useEffect, useMemo } from "react";
import type { Occasion, Package, PackagePrice } from "@prisma/client";
import { track } from "@/lib/analytics";
import { formatAmount, type CurrencyCode } from "@/lib/currency";
import {
  briefSchema,
  momentSchema,
  recipientSchema,
} from "@/lib/validation/schemas";
import type { TalentWithSamples } from "@/lib/services/talents";
import { BookingProvider, TOTAL_STEPS, useBooking } from "./BookingProvider";
import { CallSheet } from "./CallSheet";
import { OccasionStep } from "@/app/book/_steps/Occasion";
import { RecipientStep } from "@/app/book/_steps/Recipient";
import { CallerStep } from "@/app/book/_steps/Caller";
import { BriefStep } from "@/app/book/_steps/Brief";

type PackageWithPrices = Package & { prices: PackagePrice[] };

export interface BookingWizardProps {
  occasions: Occasion[];
  packages: PackageWithPrices[];
  currency: CurrencyCode;
  talent: TalentWithSamples | null;
}

function WizardShell({ occasions, packages, currency, talent }: BookingWizardProps) {
  const { step, setStep, draft, hydrated, goNext, goBack } = useBooking();

  useEffect(() => {
    if (!hydrated) return;
    const params = new URLSearchParams(window.location.search);

    const occasionParam = params.get("occasion");
    if (occasionParam && occasions.some((item) => item.slug === occasionParam)) {
      if (draft.occasionSlug !== occasionParam) {
        setStep(1);
      }
    }

    const stepParam = Number(params.get("step"));
    if (Number.isInteger(stepParam) && stepParam >= 1 && stepParam <= TOTAL_STEPS) {
      setStep(stepParam - 1);
    }
    // Recovery runs once per mount.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hydrated]);

  useEffect(() => {
    if (!hydrated) return;
    track("wizard_start");
  }, [hydrated]);

  const canContinue = useMemo((): boolean => {
    switch (step) {
      case 0:
        return Boolean(draft.occasionSlug);
      case 1:
        return recipientSchema.safeParse(draft.recipient).success;
      case 2:
        return true;
      case 3:
        return briefSchema.safeParse(draft.brief).success;
      case 4:
        return momentSchema.safeParse(draft.moment).success;
      case 5:
        return Boolean(draft.packageSlug) && draft.consent.buyerAttestation;
      default:
        return false;
    }
  }, [step, draft]);

  const handleContinue = useCallback(() => {
    if (!canContinue) return;
    track("wizard_step_complete", { step: step + 1 });
    goNext();
  }, [canContinue, step, goNext]);

  const selectedPackage = packages.find((item) => item.slug === draft.packageSlug);
  const selectedPrice = selectedPackage
    ? selectedPackage.prices.find((price) => price.currency === currency) ??
      selectedPackage.prices.find((price) => price.currency === "USD") ??
      null
    : null;

  if (!hydrated) {
    return (
      <div className="mx-auto w-full max-w-6xl px-6 py-20">
        <div className="h-8 w-64 rounded-sm bg-bone" />
        <div className="mt-6 h-4 w-96 max-w-full rounded-sm bg-bone" />
      </div>
    );
  }

  return (
    <div className="mx-auto grid w-full max-w-6xl gap-10 px-6 py-12 pb-28 lg:grid-cols-[minmax(0,1fr)_320px] lg:pb-12">
      <div>
        {step === 0 ? (
          <OccasionStep occasions={occasions} canContinue={canContinue} onContinue={handleContinue} />
        ) : null}
        {step === 1 ? (
          <RecipientStep canContinue={canContinue} onContinue={handleContinue} onBack={goBack} />
        ) : null}
        {step === 2 ? (
          <CallerStep talent={talent} canContinue={canContinue} onContinue={handleContinue} onBack={goBack} />
        ) : null}
        {step === 3 ? (
          <BriefStep canContinue={canContinue} onContinue={handleContinue} onBack={goBack} />
        ) : null}
        {step === 4 ? (
          <div className="rounded-md border border-rule bg-paper p-6 text-body-0 text-ink-soft">
            Moment step lands in Part 4.
          </div>
        ) : null}
        {step === 5 ? (
          <div className="rounded-md border border-rule bg-paper p-6 text-body-0 text-ink-soft">
            Review step lands in Part 4.
          </div>
        ) : null}
      </div>

      <CallSheet occasions={occasions} packages={packages} currency={currency} />

      {/* Mobile sticky navigation bar */}
      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-rule bg-paper shadow-2 lg:hidden">
        <div className="mx-auto flex w-full max-w-6xl items-center justify-between gap-3 px-6 py-3">
          <div className="flex items-center gap-4">
            {step > 0 ? (
              <button
                type="button"
                onClick={goBack}
                className="text-body-small text-ink-soft transition-colors duration-120ms hover:text-ink"
              >
                Back
              </button>
            ) : null}
            <div>
              <p className="mono-label text-body-small text-ash">
                Step {step + 1} of {TOTAL_STEPS}
              </p>
              {selectedPrice ? (
                <p className="text-body-0 text-ink tabular-nums">
                  {formatAmount(selectedPrice.amount, selectedPrice.currency as CurrencyCode)}
                </p>
              ) : null}
            </div>
          </div>
          <button
            type="button"
            onClick={handleContinue}
            disabled={!canContinue}
            className="rounded-md bg-ember px-5 py-2.5 text-body-0 font-medium text-paper transition-colors duration-120ms hover:bg-ember-deep disabled:pointer-events-none disabled:opacity-50"
          >
            {step === TOTAL_STEPS - 1 ? "Review the call" : "Continue"}
          </button>
        </div>
      </div>
    </div>
  );
}

export function BookingWizard(props: BookingWizardProps) {
  return (
    <BookingProvider>
      <WizardShell {...props} />
    </BookingProvider>
  );
}