import { cache } from "react";
import { prisma } from "@/lib/prisma";

export const listActiveOccasions = cache(async () => {
  return prisma.occasion.findMany({
    where: { isActive: true },
    orderBy: { sortOrder: "asc" },
  });
});

export const getOccasionBySlug = cache(async (slug: string) => {
  return prisma.occasion.findUnique({ where: { slug } });
});