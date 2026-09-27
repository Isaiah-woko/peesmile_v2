"use client";

import type { ReactNode } from "react";
import { Button } from "@/components/primitives/Button";

interface StepShellProps {
  stepNumber: number;
  totalSteps: number;
  kicker: string;
  title: string;
  subtitle?: string;
  canContinue: boolean;
  isLast?: boolean;
  onBack: (() => void) | null;
  onContinue: () => void;
  continueLabel?: string;
  children: ReactNode;
}

export function StepShell({
  stepNumber,
  totalSteps,
  kicker,
  title,
  subtitle,
  canContinue,
  isLast = false,
  onBack,
  onContinue,
  continueLabel,
  children,
}: StepShellProps) {
  return (
    <div className="flex h-full flex-col">
      <div className="mono-label text-body-small text-ash">
        Step {stepNumber} of {totalSteps}
      </div>
      <p className="mono-label text-body-small text-ember mt-4">{kicker}</p>
      <h1 className="display-serif text-display-4 mt-2 text-ink">{title}</h1>
      {subtitle ? (
        <p className="text-body-0 text-ink-soft measure mt-3">{subtitle}</p>
      ) : null}

      <div className="mt-8 flex-1">{children}</div>

      <div className="mt-10 hidden items-center justify-between gap-3 border-t border-rule pt-6 lg:flex">
        {onBack ? (
          <Button variant="ghost" onClick={onBack}>
            Back
          </Button>
        ) : (
          <span />
        )}
        <Button onClick={onContinue} disabled={!canContinue}>
          {continueLabel ?? (isLast ? "Review the call" : "Continue")}
        </Button>
      </div>
    </div>
  );
}