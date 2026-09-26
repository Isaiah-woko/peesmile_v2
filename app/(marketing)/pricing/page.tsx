import type { Metadata } from "next";
import Link from "next/link";
import { cookies } from "next/headers";
import { Button } from "@/components/primitives/Button";
import { Rule } from "@/components/primitives/Rule";
import { Reveal } from "@/components/marketing/Reveal";
import { listActivePackages } from "@/lib/services/packages";
import {
  CURRENCY_COOKIE,
  formatAmount,
  isCurrencyCode,
  type CurrencyCode,
} from "@/lib/currency";
import type { PackagePrice } from "@prisma/client";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Pricing",
  description: "Three ways to make the call. Prices shown in your currency.",
};

function priceFor(prices: PackagePrice[], currency: CurrencyCode): PackagePrice | null {
  return (
    prices.find((p) => p.currency === currency) ??
    prices.find((p) => p.currency === "USD") ??
    null
  );
}

export default async function PricingPage() {
  const cookieStore = await cookies();
  const stored = cookieStore.get(CURRENCY_COOKIE)?.value;
  const currency: CurrencyCode = stored && isCurrencyCode(stored) ? stored : "USD";
  const packages = await listActivePackages();

  return (
    <div className="mx-auto w-full max-w-6xl px-6 py-20">
      <Reveal>
        <p className="mono-label text-body-small text-ember">Pricing</p>
        <h1 className="display-serif text-display-5 mt-3 text-ink">
          Three ways to make the call.
        </h1>
        <p className="text-body-0 text-ink-soft measure mt-4">
          Prices are shown in {currency}. Change your currency any time in the
          footer. If we cannot reach them, you get a full refund.
        </p>
      </Reveal>

      <div className="mt-14 grid gap-6 md:grid-cols-3">
        {packages.map((pkg, index) => {
          const price = priceFor(pkg.prices, currency);
          const includes = Array.isArray(pkg.includes) ? (pkg.includes as string[]) : [];
          const featured = pkg.slug === "signature";

          return (
            <Reveal key={pkg.id} delay={index * 0.08}>
              <div
                className={`flex h-full flex-col rounded-md border p-6 ${
                  featured ? "border-ember bg-paper shadow-1" : "border-rule bg-paper"
                }`}
              >
                {featured ? (
                  <span className="mono-label text-body-small text-ember">Most chosen</span>
                ) : null}
                <h2 className="display-serif text-title-2 text-ink mt-2">{pkg.name}</h2>
                {pkg.tagline ? (
                  <p className="text-body-small text-ink-soft mt-2">{pkg.tagline}</p>
                ) : null}

                <p className="display-serif text-display-4 text-ink mt-6 tabular-nums">
                  {price ? formatAmount(price.amount, currency) : "—"}
                </p>

                <div className="mt-6 flex-1">
                  <Rule />
                  <ul className="mt-4 space-y-2">
                    {includes.map((line) => (
                      <li key={line} className="text-body-small text-ink-soft">
                        {line}
                      </li>
                    ))}
                  </ul>
                </div>

                <Button asChild size="md" variant={featured ? "primary" : "outline"} className="mt-8">
                  <Link href={`/book?package=${pkg.slug}`}>Choose {pkg.name}</Link>
                </Button>
              </div>
            </Reveal>
          );
        })}
      </div>
    </div>
  );
}