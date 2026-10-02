import { z } from "zod";
import { isValidE164 } from "@/lib/phone";

export const TONE_LEVELS = ["tender", "warm", "playful", "bold", "unhinged"] as const;
export const toneSchema = z.enum(TONE_LEVELS);
export type ToneLevel = z.infer<typeof toneSchema>;

const isoDate = z.string().refine((value) => !Number.isNaN(Date.parse(value)), {
  message: "Enter a valid date.",
});

export const recipientSchema = z.object({
  firstName: z.string().trim().min(1, "Add their first name.").max(50),
  relationship: z.string().trim().max(50).optional(),
  phoneE164: z.string().refine(isValidE164, { message: "Enter a valid phone number." }),
  phoneCountry: z.string().length(2),
  timezone: z.string().min(1, "Pick a time zone."),
  city: z.string().trim().max(80).optional(),
});
export type Recipient = z.infer<typeof recipientSchema>;

export const briefSchema = z.object({
  tone: toneSchema,
  keyMessage: z
    .string()
    .trim()
    .min(20, "Give her at least a sentence to work with.")
    .max(500),
  context: z.string().trim().max(1000).optional(),
  insideJokes: z.string().trim().max(500).optional(),
  avoid: z.string().trim().max(500).optional(),
  language: z.string().min(2).default("en"),
});
export type Brief = z.infer<typeof briefSchema>;

export const momentSchema = z.object({
  scheduledStart: isoDate,
  windowMinutes: z.number().int().min(5).max(60),
  backupStart: isoDate.nullable(),
});
export type Moment = z.infer<typeof momentSchema>;

export const consentSchema = z.object({
  recordingConsent: z.boolean(),
  buyerAttestation: z.boolean(),
  whatsappOptIn: z.boolean(),
});
export type Consent = z.infer<typeof consentSchema>;

export const bookingSchema = z.object({
  occasionSlug: z.string().min(1),
  recipient: recipientSchema,
  brief: briefSchema,
  moment: momentSchema,
  packageSlug: z.string().min(1),
  consent: consentSchema,
});
export type Booking = z.infer<typeof bookingSchema>;

// Add to the existing schemas file
export const buyerSchema = z.object({
  buyerName: z.string().trim().min(2, "Enter your name.").max(100),
  buyerEmail: z.string().email("Enter a valid email address.").max(255),
  buyerWhatsapp: z.string().trim().min(5, "Enter a valid WhatsApp number.").max(20).optional(),
  whatsappOptIn: z.boolean().default(false),
});
export type BuyerContact = z.infer<typeof buyerSchema>;