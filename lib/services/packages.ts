import { cache } from "react";
import { prisma } from "@/lib/prisma";

export const listActivePackages = cache(async () => {
  return prisma.package.findMany({
    where: { isActive: true },
    orderBy: { sortOrder: "asc" },
    include: { prices: true },
  });
});