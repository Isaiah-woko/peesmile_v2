import { prisma } from "@/lib/prisma";
import type { CurrencyCode } from "@/lib/currency";

export interface PriceQuote {
  packageSlug: string;
  currency: CurrencyCode;
  subtotal: number;
  addonsTotal: number;
  total: number;
}

export async function resolvePrice(
  packageSlug: string,
  currency: CurrencyCode,
  addonsTotal = 0
): Promise<PriceQuote | null> {
  let price = await prisma.packagePrice.findFirst({
    where: { package: { slug: packageSlug }, currency },
  });

  if (!price && currency !== "USD") {
    price = await prisma.packagePrice.findFirst({
      where: { package: { slug: packageSlug }, currency: "USD" },
    });
  }

  if (!price) return null;

  const subtotal = price.amount;
  const total = subtotal + addonsTotal;

  return {
    packageSlug,
    currency: price.currency as CurrencyCode,
    subtotal,
    addonsTotal,
    total,
  };
}