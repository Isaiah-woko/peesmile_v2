export interface WizardStepProps {
  canContinue: boolean;
  onContinue: () => void;
  onBack: (() => void) | null;
}