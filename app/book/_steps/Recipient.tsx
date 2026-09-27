"use client";

import { useCallback, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useBooking } from "@/components/booking/BookingProvider";
import { StepShell } from "@/components/booking/StepShell";
import { RecipientPhoneField, type PhoneParseResult } from "@/components/booking/RecipientPhoneField";
import type { WizardStepProps } from "@/components/booking/types";
import { Field } from "@/components/primitives/Field";
import { Input } from "@/components/primitives/Input";
import { recipientSchema } from "@/lib/validation/schemas";

const recipientTextSchema = recipientSchema.pick({
  firstName: true,
  relationship: true,
  city: true,
});

type RecipientText = z.infer<typeof recipientTextSchema>;

export function RecipientStep({ canContinue, onContinue, onBack }: WizardStepProps) {
  const { draft, setRecipient } = useBooking();

  const form = useForm<RecipientText>({
    resolver: zodResolver(recipientTextSchema),
    defaultValues: {
      firstName: draft.recipient.firstName ?? "",
      relationship: draft.recipient.relationship ?? "",
      city: draft.recipient.city ?? "",
    },
    mode: "onChange",
  });

  const values = form.watch();
  const serialized = JSON.stringify(values);

  useEffect(() => {
    setRecipient({
      firstName: values.firstName ?? "",
      relationship: values.relationship ?? "",
      city: values.city ?? "",
    });
    // Sync only when the values actually change.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [serialized]);

  const handlePhoneResult = useCallback(
    (result: PhoneParseResult) => {
      setRecipient({
        phoneE164: result.phoneE164,
        phoneCountry: result.phoneCountry,
        timezone: result.timezone,
      });
    },
    [setRecipient]
  );

  return (
    <StepShell
      stepNumber={2}
      totalSteps={6}
      kicker="Who is it for"
      title="Who came to mind?"
      subtitle="Just enough to reach them. We treat their number with care."
      canContinue={canContinue}
      onBack={onBack}
      onContinue={onContinue}
    >
      <form className="space-y-6">
        <Field label="Their first name" required>
          <Input {...form.register("firstName")} placeholder="e.g. Daniel" />
        </Field>

        <Field label="Relationship" optional>
          <Input {...form.register("relationship")} placeholder="e.g. brother, best friend" />
        </Field>

        <Field
          label="Their phone number"
          required
          hint="One call, one retry, never a campaign."
        >
          <RecipientPhoneField
            initialPhoneE164={draft.recipient.phoneE164}
            initialCountry={draft.recipient.phoneCountry}
            onResult={handlePhoneResult}
          />
        </Field>

        {draft.recipient.timezone ? (
          <p className="text-body-small text-ash">
            We think they are in {draft.recipient.timezone}. You can adjust this when you pick
            the moment.
          </p>
        ) : null}

        <Field label="Their city" optional>
          <Input {...form.register("city")} placeholder="e.g. Lagos" />
        </Field>
      </form>
    </StepShell>
  );
}