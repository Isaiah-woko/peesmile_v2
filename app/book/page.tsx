import type { Metadata } from "next";
import { cookies, headers } from "next/headers";
import { BookingWizard } from "@/components/booking/BookingWizard";
import {
  CURRENCY_COOKIE,
  detectCurrencyFromHeaders,
  isCurrencyCode,
  type CurrencyCode,
} from "@/lib/currency";
import { listActiveOccasions } from "@/lib/services/occasions";
import { listActivePackages } from "@/lib/services/packages";
import { getActiveTalentWithSamples } from "@/lib/services/talents";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Book a call",
  description: "Six steps. Four minutes. One call they will retell for years.",
};

export default async function BookPage() {
  const [occasions, packages, talent, cookieStore, headerStore] = await Promise.all([
    listActiveOccasions(),
    listActivePackages(),
    getActiveTalentWithSamples(),
    cookies(),
    headers(),
  ]);

  const stored = cookieStore.get(CURRENCY_COOKIE)?.value;
  const currency: CurrencyCode =
    stored && isCurrencyCode(stored)
      ? stored
      : detectCurrencyFromHeaders(headerStore);

  return (
    <BookingWizard
      occasions={occasions}
      packages={packages}
      currency={currency}
      talent={talent}
    />
  );
}