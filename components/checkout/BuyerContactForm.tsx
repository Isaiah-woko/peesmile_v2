"use client";

import { Input } from "@/components/primitives/Input";
import { Field } from "@/components/primitives/Field";

interface BuyerContactFormProps {
  defaultName?: string;
  defaultEmail?: string;
  defaultWhatsapp?: string;
  defaultOptIn?: boolean;
}

export function BuyerContactForm({
  defaultName = "",
  defaultEmail = "",
  defaultWhatsapp = "",
  defaultOptIn = true,
}: BuyerContactFormProps) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="display-serif text-title-1 text-ink">Your details</h2>
        <p className="text-body-small text-ink-soft mt-2">
          We will send your receipt and the magic link to track the call here.
        </p>
      </div>

      <Field label="Your full name" required>
        <Input name="buyerName" defaultValue={defaultName} required placeholder="e.g. Adaobi Okafor" />
      </Field>

      <Field label="Email address" required>
        <Input name="buyerEmail" type="email" defaultValue={defaultEmail} required placeholder="you@example.com" />
      </Field>

      <Field label="WhatsApp number" required hint="We send call updates and the Keepsake link here.">
        <Input name="buyerWhatsapp" type="tel" defaultValue={defaultWhatsapp} required placeholder="+234 801 234 5678" />
      </Field>

      <label className="flex items-start gap-3 cursor-pointer">
        <input
          type="checkbox"
          name="whatsappOptIn"
          defaultChecked={defaultOptIn}
          className="mt-1 h-4 w-4 accent-ember rounded"
        />
        <span>
          <span className="text-body-0 text-ink block">Send me updates on WhatsApp</span>
          <span className="text-body-small text-ink-soft">
            24h reminder, 10m warning, and the Keepsake link when it's done.
          </span>
        </span>
      </label>
    </div>
  );
}