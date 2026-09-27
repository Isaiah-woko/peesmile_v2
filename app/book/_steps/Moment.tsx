"use client";

import { MomentPicker } from "@/components/booking/MomentPicker";
import { StepShell } from "@/components/booking/StepShell";
import type { WizardStepProps } from "@/components/booking/types";
import { useBooking } from "@/components/booking/BookingProvider";

export function MomentStep({ canContinue, onContinue, onBack }: WizardStepProps) {
  const { draft } = useBooking();
  const recipientTimezone = draft.recipient.timezone ?? "UTC";

  return (
    <StepShell
      stepNumber={5}
      totalSteps={6}
      kicker="The moment"
      title="Pick the minute that matters"
      subtitle="Shown in their local time. We will not call at a stupid hour."
      canContinue={canContinue}
      onBack={onBack}
      onContinue={onContinue}
    >
      <MomentPicker recipientTimezone={recipientTimezone} />
    </StepShell>
  );
}