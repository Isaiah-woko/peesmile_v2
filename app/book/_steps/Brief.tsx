"use client";

import { BriefForm } from "@/components/booking/BriefForm";
import { StepShell } from "@/components/booking/StepShell";
import type { WizardStepProps } from "@/components/booking/types";

export function BriefStep({ canContinue, onContinue, onBack }: WizardStepProps) {
  return (
    <StepShell
      stepNumber={4}
      totalSteps={6}
      kicker="The brief"
      title="Give her context, not a script"
      subtitle="She improvises. The more real you are here, the more real the call feels."
      canContinue={canContinue}
      onBack={onBack}
      onContinue={onContinue}
    >
      <BriefForm />
    </StepShell>
  );
}