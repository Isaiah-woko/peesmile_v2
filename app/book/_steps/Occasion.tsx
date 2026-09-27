"use client";

import type { Occasion } from "@prisma/client";
import { useBooking } from "@/components/booking/BookingProvider";
import { StepShell } from "@/components/booking/StepShell";
import type { WizardStepProps } from "@/components/booking/types";
import { cn } from "@/lib/utils";

interface OccasionStepProps extends Omit<WizardStepProps, "onBack"> {
  occasions: Occasion[];
}

export function OccasionStep({
  occasions,
  canContinue,
  onContinue
}: OccasionStepProps) {
  const { draft, setOccasion } = useBooking();

  return (
    <StepShell
      stepNumber={1}
      totalSteps={6}
      kicker="The occasion"
      title="Why are we calling?"
      subtitle="Pick the closest match. You can tell us the real story in the brief."
      canContinue={canContinue}
      onBack={null}
      onContinue={onContinue}
    >
      <div
        role="radiogroup"
        aria-label="Occasion"
        className="grid gap-3 sm:grid-cols-2"
      >
        {occasions.map((occasion) => {
          const selected = draft.occasionSlug === occasion.slug;
          return (
            <button
              key={occasion.slug}
              type="button"
              role="radio"
              aria-checked={selected}
              onClick={() => setOccasion(occasion.slug)}
              className={cn(
                "rounded-md border p-5 text-left transition-colors duration-[120ms]",
                selected
                  ? "border-ember bg-bone"
                  : "border-rule bg-paper hover:bg-bone"
              )}
            >
              <span className="display-serif text-title-1 block text-ink">
                {occasion.name}
              </span>
              {occasion.kicker ? (
                <span className="text-body-small text-ink-soft mt-1 block">
                  {occasion.kicker}
                </span>
              ) : null}
            </button>
          );
        })}
      </div>
    </StepShell>
  );
}
