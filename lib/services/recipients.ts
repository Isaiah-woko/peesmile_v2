import { prisma } from "@/lib/prisma";
import { DoNotCallError } from "@/lib/errors";
import type { DncSource } from "@prisma/client";

export async function isDoNotCall(phoneE164: string): Promise<boolean> {
  const entry = await prisma.doNotCall.findUnique({
    where: { phoneE164 },
    select: { id: true },
  });
  return entry !== null;
}

export interface RecipientInput {
  firstName: string;
  relationship?: string | null;
  phoneE164: string;
  phoneCountry: string;
  timezone: string;
  city?: string | null;
}

export async function createRecipient(input: RecipientInput) {
  const blocked = await isDoNotCall(input.phoneE164);
  if (blocked) {
    throw new DoNotCallError();
  }

  return prisma.recipient.upsert({
    where: { phoneE164: input.phoneE164 },
    create: {
      firstName: input.firstName,
      relationship: input.relationship ?? null,
      phoneE164: input.phoneE164,
      phoneCountry: input.phoneCountry,
      timezone: input.timezone,
      city: input.city ?? null,
    },
    update: {
      firstName: input.firstName,
      relationship: input.relationship ?? null,
      timezone: input.timezone,
      city: input.city ?? null,
    },
  });
}

export function addToDoNotCall(
  phoneE164: string,
  source: DncSource,
  reason?: string
) {
  return prisma.doNotCall.upsert({
    where: { phoneE164 },
    create: { phoneE164, source, reason: reason ?? null },
    update: { source, reason: reason ?? null },
  });
}

export function listDoNotCall() {
  return prisma.doNotCall.findMany({
    orderBy: { createdAt: "desc" },
  });
}

export function removeFromDoNotCall(phoneE164: string) {
  return prisma.doNotCall.deleteMany({ where: { phoneE164 } });
}