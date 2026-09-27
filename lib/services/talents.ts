import { cache } from "react";
import type { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";

export const getActiveTalentWithSamples = cache(async () => {
  return prisma.voiceTalent.findFirst({
    where: { isActive: true },
    include: {
      samples: { orderBy: { sortOrder: "asc" } },
    },
  });
});

export type TalentWithSamples = Prisma.VoiceTalentGetPayload<{
  include: { samples: true };
}>;