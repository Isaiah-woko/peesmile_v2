"use client";

import type { Occasion, Package, PackagePrice } from "@prisma/client";
import { TicketEdge } from "@/components/primitives/TicketEdge";
import { formatTimeInTimezone } from "@/lib/timezone";
import { formatAmount, type CurrencyCode } from "@/lib/currency";
import { useBooking } from "./BookingProvider";

interface CallSheetProps {
  occasions: Occasion[];
  packages: (Package & { prices: PackagePrice[] })[];
  currency: CurrencyCode;
}

function findPrice(
  prices: PackagePrice[],
  currency: CurrencyCode
): PackagePrice | null {
  return (
    prices.find((price) => price.currency === currency) ??
    prices.find((price) => price.currency === "USD") ??
    null
  );
}

export function CallSheet({ occasions, packages, currency }: CallSheetProps) {
  const { draft, hydrated } = useBooking();

  if (!hydrated) {
    return (
      <aside className="hidden rounded-md border border-rule bg-paper p-6 lg:block">
        <div className="mono-label text-body-small text-ash">Call sheet</div>
        <div className="mt-4 space-y-3">
          <div className="h-4 w-2/3 rounded-sm bg-bone" />
          <div className="h-4 w-1/2 rounded-sm bg-bone" />
          <div className="h-4 w-3/4 rounded-sm bg-bone" />
        </div>
      </aside>
    );
  }

  const occasion = occasions.find((item) => item.slug === draft.occasionSlug);
  const pkg = packages.find((item) => item.slug === draft.packageSlug);
  const price = pkg ? findPrice(pkg.prices, currency) : null;
  const { recipient, brief, moment } = draft;
  const hasRecipientName = Boolean(recipient.firstName);
  const hasMoment = Boolean(moment?.scheduledStart);

  const recipientLocalTime =
    hasMoment && recipient.timezone
      ? formatTimeInTimezone(new Date(moment!.scheduledStart), recipient.timezone!)
      : recipient.timezone
        ? formatTimeInTimezone(new Date(), recipient.timezone)
        : null;

  return (
    <aside className="hidden lg:block">
      <div className="rounded-md border border-rule bg-paper">
        <TicketEdge className="px-2 pt-2" />

        <div className="px-6 pb-6">
          <p className="mono-label text-body-small text-ash mt-4">Call sheet</p>

          <dl className="mt-6 space-y-5">
            <div>
              <dt className="mono-label text-body-small text-ash">Occasion</dt>
              <dd className="display-serif text-title-1 text-ink mt-1">
                {occasion?.name ?? "Not chosen yet"}
              </dd>
            </div>

            <div>
              <dt className="mono-label text-body-small text-ash">For</dt>
              <dd className="text-body-0 text-ink mt-1">
                {hasRecipientName ? recipient.firstName : "Who came to mind?"}
                {recipient.relationship ? (
                  <span className="text-ink-soft"> · {recipient.relationship}</span>
                ) : null}
              </dd>
              {recipientLocalTime ? (
                <dd className="mono-label text-body-small text-ash mt-1 tabular-nums">
                  It is {recipientLocalTime} for them right now
                </dd>
              ) : null}
            </div>

            <div>
              <dt className="mono-label text-body-small text-ash">Tone</dt>
              <dd className="text-body-0 text-ink mt-1 capitalize">
                {brief.tone ?? "Not set"}
              </dd>
            </div>

            <div>
              <dt className="mono-label text-body-small text-ash">The one thing to say</dt>
              <dd className="display-serif text-body-0 italic text-ink mt-1">
                {brief.keyMessage ? `“${brief.keyMessage}”` : "Write it like you'd say it if you were braver."}
              </dd>
            </div>

            <div>
              <dt className="mono-label text-body-small text-ash">The moment</dt>
              <dd className="text-body-0 text-ink mt-1">
                {hasMoment
                  ? `${formatTimeInTimezone(new Date(moment!.scheduledStart), recipient.timezone ?? "UTC")} their time · ${moment!.windowMinutes} minute window`
                  : "Pick the minute that matters"}
              </dd>
            </div>

            <div>
              <dt className="mono-label text-body-small text-ash">Package</dt>
              <dd className="text-body-0 text-ink mt-1">
                {pkg ? pkg.name : "Chosen at the review step"}
              </dd>
              {pkg && price ? (
                <dd className="display-serif text-title-1 text-ink mt-1 tabular-nums">
                  {formatAmount(price.amount, price.currency as CurrencyCode)}
                </dd>
              ) : null}
            </div>
          </dl>

          <TicketEdge className="mt-6" />
          <p className="mono-label text-body-small text-ash mt-3">
            PeeSmile · one call, not a campaign
          </p>
        </div>
      </div>
    </aside>
  );
}