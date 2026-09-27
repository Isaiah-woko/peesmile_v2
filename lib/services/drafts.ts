import { randomBytes } from "crypto";
import type { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";

function generateDraftToken(): string {
  return randomBytes(16).toString("hex");
}

export async function saveDraft(token: string | null, state: unknown): Promise<string> {
  const draftToken = token && token.length > 0 ? token : generateDraftToken();
  const payload = state as Prisma.InputJsonValue;

  await prisma.draftOrder.upsert({
    where: { token: draftToken },
    create: { token: draftToken, state: payload },
    update: { state: payload },
  });

  return draftToken;
}

export async function loadDraft(token: string): Promise<unknown | null> {
  const draft = await prisma.draftOrder.findUnique({
    where: { token },
    select: { state: true },
  });
  return draft ? draft.state : null;
}