"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import type { Occasion, Package, PackagePrice } from "@prisma/client";
import { track } from "@/lib/analytics";
import { formatAmount, type CurrencyCode } from "@/lib/currency";
import {
  briefSchema,
  momentSchema,
  recipientSchema,
} from "@/lib/validation/schemas";
import type { TalentWithSamples } from "@/lib/services/talents";
import {
  BookingProvider,
  TOTAL_STEPS,
  useBooking,
  type BookingDraft,
} from "./BookingProvider";
import { CallSheet } from "./CallSheet";
import { OccasionStep } from "@/app/book/_steps/Occasion";
import { RecipientStep } from "@/app/book/_steps/Recipient";
import { CallerStep } from "@/app/book/_steps/Caller";
import { BriefStep } from "@/app/book/_steps/Brief";
import { MomentStep } from "@/app/book/_steps/Moment";
import { ReviewStep } from "@/app/book/_steps/Review";

type PackageWithPrices = Package & { prices: PackagePrice[] };

const DRAFT_TOKEN_KEY = "peesmile_draft_token";
const SAVE_DEBOUNCE_MS = 1000;

function hasMeaningfulContent(draft: BookingDraft): boolean {
  return Boolean(
    draft.occasionSlug ||
      draft.recipient.firstName ||
      draft.recipient.phoneE164 ||
      draft.brief.keyMessage ||
      draft.moment ||
      draft.packageSlug
  );
}

export interface BookingWizardProps {
  occasions: Occasion[];
  packages: PackageWithPrices[];
  currency: CurrencyCode;
  talent: TalentWithSamples | null;
}

function WizardShell({ occasions, packages, currency, talent }: BookingWizardProps) {
  const router = useRouter();
  const { step, setStep, draft, hydrated, goNext, goBack, restoreDraft } = useBooking();

  const [restoreSettled, setRestoreSettled] = useState(false);
  const draftRef = useRef(draft);

  useEffect(() => {
    draftRef.current = draft;
  }, [draft]);

  // One-time URL recovery: preselect occasion and restore step.
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

  // Restore a server-side draft when a token is present in the URL.
  useEffect(() => {
    if (!hydrated) return;
    const params = new URLSearchParams(window.location.search);
    const draftToken = params.get("draft");

    if (!draftToken) {
      setRestoreSettled(true);
      return;
    }

    const encodedDraftToken = encodeURIComponent(draftToken);

    // Pin the token immediately so later saves target the same draft.
    try {
      window.localStorage.setItem(DRAFT_TOKEN_KEY, draftToken);
    } catch {
      // Ignore.
    }

    let cancelled = false;
    async function load() {
      try {
        const res = await fetch(`/api/drafts?token=${encodedDraftToken}`);
        if (!res.ok) {
          if (!cancelled) setRestoreSettled(true);
          return;
        }
        const data = await res.json();
        if (!cancelled) {
          if (data.state) {
            restoreDraft(data.state);
          }
          setRestoreSettled(true);
        }
      } catch {
        if (!cancelled) setRestoreSettled(true);
      }
    }
    load();

    return () => {
      cancelled = true;
    };
  }, [hydrated, restoreDraft]);

  const saveDraftToServer = useCallback(async () => {
    const currentDraft = draftRef.current;
    if (!hasMeaningfulContent(currentDraft)) return;

    try {
      let token: string | null = null;
      try {
        token = window.localStorage.getItem(DRAFT_TOKEN_KEY);
      } catch {
        // Ignore.
      }

      const res = await fetch("/api/drafts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, state: currentDraft }),
      });
      if (!res.ok) return;

      const data = await res.json();
      if (data.token) {
        try {
          window.localStorage.setItem(DRAFT_TOKEN_KEY, data.token);
        } catch {
          // Ignore.
        }
      }
    } catch {
      // Non-fatal. The localStorage draft still works.
    }
  }, []);

  // Debounced server save as the draft changes, once any restore has settled.
  useEffect(() => {
    if (!hydrated || !restoreSettled) return;
    if (!hasMeaningfulContent(draft)) return;
    const timeoutId = setTimeout(() => {
      void saveDraftToServer();
    }, SAVE_DEBOUNCE_MS);
    return () => clearTimeout(timeoutId);
  }, [draft, hydrated, restoreSettled, saveDraftToServer]);

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

  const handleContinue = useCallback(async () => {
    if (!canContinue) return;
    track("wizard_step_complete", { step: step + 1 });

    if (step === TOTAL_STEPS - 1) {
      await saveDraftToServer();
      router.push("/checkout");
      return;
    }

    void saveDraftToServer();
    goNext();
  }, [canContinue, step, goNext, router, saveDraftToServer]);

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
          <MomentStep canContinue={canContinue} onContinue={handleContinue} onBack={goBack} />
        ) : null}
        {step === 5 ? (
          <ReviewStep
            packages={packages}
            currency={currency}
            canContinue={canContinue}
            onContinue={handleContinue}
            onBack={goBack}
          />
        ) : null}
      </div>

      <CallSheet occasions={occasions} packages={packages} currency={currency} />

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
            {step === TOTAL_STEPS - 1 ? "Continue to checkout" : "Continue"}
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