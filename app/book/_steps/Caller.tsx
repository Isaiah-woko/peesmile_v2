"use client";

import { SamplePlayer } from "@/components/audio/SamplePlayer";
import { StepShell } from "@/components/booking/StepShell";
import type { WizardStepProps } from "@/components/booking/types";
import type { TalentWithSamples } from "@/lib/services/talents";

interface CallerStepProps extends WizardStepProps {
  talent: TalentWithSamples | null;
}

function toNumberArray(value: unknown): number[] {
  if (!Array.isArray(value)) return [];
  return value.filter((item): item is number => typeof item === "number");
}

export function CallerStep({ talent, canContinue, onContinue, onBack }: CallerStepProps) {
  return (
    <StepShell
      stepNumber={3}
      totalSteps={6}
      kicker="The caller"
      title="Meet the person who will call"
      subtitle="No casting. No menu of voices. One caller, and she is very good at this."
      canContinue={canContinue}
      onBack={onBack}
      onContinue={onContinue}
    >
      {talent ? (
        <div className="grid gap-8 md:grid-cols-[minmax(0,2fr)_minmax(0,3fr)]">
          <div>
            {/* PHOTO: black-and-white caller portrait, the only one in the app */}
            <div className="aspect-4/5 w-full rounded-lg bg-ink-soft" />
            <div className="mt-4">
              <p className="display-serif text-title-2 text-ink">{talent.displayName}</p>
              {talent.headline ? (
                <p className="text-body-small text-ink-soft mt-1">{talent.headline}</p>
              ) : null}
              {talent.vibeTags.length > 0 ? (
                <p className="mono-label text-body-small text-ash mt-2">
                  {talent.vibeTags.join(" · ")}
                </p>
              ) : null}
            </div>
          </div>

          <div>
            {talent.bio ? (
              <p className="text-body-0 text-ink-soft measure">{talent.bio}</p>
            ) : null}
            <div className="mt-6 space-y-3">
              {talent.samples.map((sample) => (
                <SamplePlayer
                  key={sample.id}
                  id={sample.id}
                  src={sample.audioUrl}
                  title={sample.title}
                  peaks={toNumberArray(sample.peaks)}
                  durationMs={sample.durationMs}
                />
              ))}
            </div>
          </div>
        </div>
      ) : (
        <p className="text-body-0 text-ink-soft">
          The caller profile is being set up. Check back shortly.
        </p>
      )}
    </StepShell>
  );
}