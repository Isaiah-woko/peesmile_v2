import { CheckIcon } from "@/components/icons"; import { formatAmount, type CurrencyCode } from "@/lib/currency";
import { formatTimeInTimezone } from "@/lib/timezone";
import type { Occasion, Package, PackagePrice } from "@prisma/client";

interface OrderSummaryProps {
  occasion: Occasion;
  pkg: Package & { prices: PackagePrice[] };
  recipientName: string;
  recipientTimezone: string;
  scheduledStart: Date;
  windowMinutes: number;
  currency: CurrencyCode;
}

function findPrice(prices: PackagePrice[], currency: CurrencyCode): PackagePrice | null {
  return (
    prices.find((p) => p.currency === currency) ??
    prices.find((p) => p.currency === "USD") ??
    null
  );
}

export function OrderSummary({
  occasion,
  pkg,
  recipientName,
  recipientTimezone,
  scheduledStart,
  windowMinutes,
  currency,
}: OrderSummaryProps) {
  const price = findPrice(pkg.prices, currency);
  const timeLabel = formatTimeInTimezone(scheduledStart, recipientTimezone);

  return (
    <div className="rounded-md border border-rule bg-bone p-6">
      <h2 className="display-serif text-title-1 text-ink">Order Summary</h2>

      <dl className="mt-6 space-y-4">
        <div className="flex justify-between">
          <dt className="text-body-small text-ink-soft">Occasion</dt>
          <dd className="text-body-0 font-medium text-ink">{occasion.name}</dd>
        </div>
        <div className="flex justify-between">
          <dt className="text-body-small text-ink-soft">For</dt>
          <dd className="text-body-0 font-medium text-ink">{recipientName}</dd>
        </div>
        <div className="flex justify-between">
          <dt className="text-body-small text-ink-soft">Time</dt>
          <dd className="text-body-0 font-medium text-ink text-right">
            {timeLabel} their time<br />
            <span className="text-body-small text-ash">({windowMinutes} min window)</span>
          </dd>
        </div>
        <div className="flex justify-between border-t border-rule pt-4 mt-4">
          <dt className="text-body-0 font-medium text-ink">Package</dt>
          <dd className="text-body-0 font-medium text-ink">{pkg.name}</dd>
        </div>
        {price ? (
          <div className="flex justify-between">
            <dt className="text-body-0 text-ink">Total</dt>
            <dd className="display-serif text-title-2 text-ink tabular-nums">
              {formatAmount(price.amount, currency)}
            </dd>
          </div>
        ) : null}
      </dl>

      <div className="mt-8 space-y-3 border-t border-rule pt-6">
        <div className="flex items-start gap-2">
          <CheckIcon className="mt-0.5 shrink-0 text-pine" size={16} weight="bold" />
          <p className="text-body-small text-ink-soft">
            If we can't reach them, you don't pay. We refund it before you have to ask.
          </p>
        </div>
        <div className="flex items-start gap-2">
          <CheckIcon className="mt-0.5 shrink-0 text-pine" size={16} weight="bold" />
          <p className="text-body-small text-ink-soft">
            One call. Not a campaign. We do not spam.
          </p>
        </div>
        <div className="flex items-start gap-2">
          <CheckIcon className="mt-0.5 shrink-0 text-pine" size={16} weight="bold" />
          <p className="text-body-small text-ink-soft">
            Permanent do-not-call list. Ask to be removed, and it's done in 60 seconds.
          </p>
        </div>
      </div>
    </div>
  );
}