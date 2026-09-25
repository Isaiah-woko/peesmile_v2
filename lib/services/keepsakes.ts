import { prisma } from "@/lib/prisma";
import { NotFoundError } from "@/lib/errors";
import type { KeepsakeVisibility } from "@prisma/client";

export interface RecordingUploadInput {
  orderId: string;
  audioUrl: string;
  durationMs: number;
  peaks: number[];
}

function generateKeepsakeSlug(): string {
  const random = crypto.randomUUID().replace(/-/g, "").slice(0, 10);
  return `k-${random}`;
}

export async function createKeepsakeFromUpload(input: RecordingUploadInput) {
  const order = await prisma.order.findUnique({
    where: { id: input.orderId },
    select: { id: true, status: true, package: { select: { includesKeepsake: true } } },
  });

  if (!order) {
    throw new NotFoundError("Order");
  }

  return prisma.$transaction(async (tx) => {
    const keepsake = await tx.keepsake.upsert({
      where: { orderId: input.orderId },
      create: {
        orderId: input.orderId,
        slug: generateKeepsakeSlug(),
        audioUrl: input.audioUrl,
        durationMs: input.durationMs,
        peaks: input.peaks,
        visibility: "link",
      },
      update: {
        audioUrl: input.audioUrl,
        durationMs: input.durationMs,
        peaks: input.peaks,
      },
    });

    await tx.order.update({
      where: { id: input.orderId },
      data: { status: "delivered" },
    });

    return keepsake;
  });
}

export async function getKeepsakeBySlug(slug: string) {
  const keepsake = await prisma.keepsake.findUnique({
    where: { slug },
    include: {
      order: {
        select: {
          scheduledStart: true,
          occasion: { select: { name: true } },
          recipient: { select: { city: true } },
          talent: { select: { displayName: true } },
          brief: { select: { keyMessage: true } },
        },
      },
    },
  });

  if (!keepsake) return null;

  if (keepsake.visibility === "private") {
    return null;
  }

  return keepsake;
}

export function incrementKeepsakeView(slug: string) {
  return prisma.keepsake.updateMany({
    where: { slug, visibility: { not: "private" } },
    data: { viewCount: { increment: 1 } },
  });
}

export function setKeepsakeVisibility(slug: string, visibility: KeepsakeVisibility) {
  return prisma.keepsake.update({
    where: { slug },
    data: { visibility },
  });
}