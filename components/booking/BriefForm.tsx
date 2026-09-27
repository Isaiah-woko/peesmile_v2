"use client";

import { useEffect } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useBooking } from "@/components/booking/BookingProvider";
import { Field } from "@/components/primitives/Field";
import { Input } from "@/components/primitives/Input";
import { Textarea } from "@/components/primitives/Textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/primitives/Select";
import { briefSchema, TONE_LEVELS, type Brief } from "@/lib/validation/schemas";
import { cn } from "@/lib/utils";

const TONE_DESCRIPTIONS: Record<string, string> = {
  tender: "Soft, careful, kind",
  warm: "Friendly, easy, genuine",
  playful: "Light, fun, a little cheeky",
  bold: "Direct, confident, big energy",
  unhinged: "Chaotic good. Fully committed."
};

export function BriefForm() {
  const { draft, setBrief } = useBooking();

  const form = useForm<z.input<typeof briefSchema>, unknown, Brief>({
    resolver: zodResolver(briefSchema),
    defaultValues: {
      tone: draft.brief.tone ?? "warm",
      keyMessage: draft.brief.keyMessage ?? "",
      context: draft.brief.context ?? "",
      insideJokes: draft.brief.insideJokes ?? "",
      avoid: draft.brief.avoid ?? "",
      language: draft.brief.language ?? "en"
    },
    mode: "onChange"
  });

  const values = form.watch();
  const serialized = JSON.stringify(values);

  useEffect(() => {
    setBrief({
      tone: values.tone,
      keyMessage: values.keyMessage ?? "",
      context: values.context ?? "",
      insideJokes: values.insideJokes ?? "",
      avoid: values.avoid ?? "",
      language: values.language ?? "en"
    });
    // Sync only when the values actually change.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [serialized]);

  const tone = form.watch("tone");
  const language = form.watch("language");

  return (
    <form className="space-y-8">
      <div>
        <p className="text-body-small font-medium text-ink">Tone</p>
        <div
          role="radiogroup"
          aria-label="Tone"
          className="mt-3 grid gap-2 sm:grid-cols-2"
        >
          {TONE_LEVELS.map((level) => (
            <button
              key={level}
              type="button"
              role="radio"
              aria-checked={tone === level}
              onClick={() =>
                form.setValue("tone", level, { shouldValidate: true })
              }
              className={cn(
                "rounded-md border p-3 text-left transition-colors duration-120ms",
                tone === level
                  ? "border-ember bg-bone"
                  : "border-rule bg-paper hover:bg-bone"
              )}
            >
              <span className="text-body-0 font-medium text-ink capitalize">
                {level}
              </span>
              <span className="text-body-small text-ink-soft mt-0.5 block">
                {TONE_DESCRIPTIONS[level]}
              </span>
            </button>
          ))}
        </div>
      </div>

      <Field
        label="The one thing to say"
        required
        hint="If she only gets one sentence across, what should it be? Minimum 20 characters."
        error={form.formState.errors.keyMessage?.message}
      >
        <Textarea
          {...form.register("keyMessage")}
          rows={3}
          placeholder="Write it like you'd say it if you were braver."
        />
      </Field>

      <Field
        label="What should she know?"
        optional
        hint="Background, the story, why this matters."
      >
        <Textarea
          {...form.register("context")}
          rows={4}
          placeholder="Context helps her read the room."
        />
      </Field>

      <Field label="Inside jokes or references" optional>
        <Input
          {...form.register("insideJokes")}
          placeholder="Nicknames, shared memories, the Paris story"
        />
      </Field>

      <Field
        label="Things to avoid"
        optional
        hint="Topics, names, or words she should steer clear of."
      >
        <Input
          {...form.register("avoid")}
          placeholder="e.g. Do not mention the move"
        />
      </Field>

      <Field label="Language" optional>
        <Select
          value={language}
          onValueChange={(value) => form.setValue("language", value)}
        >
          <SelectTrigger className="w-56">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="en">English</SelectItem>
            <SelectItem value="pcm">Nigerian Pidgin</SelectItem>
          </SelectContent>
        </Select>
      </Field>
    </form>
  );
}
