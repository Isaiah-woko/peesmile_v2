import type { Metadata } from "next";
import Link from "next/link";
import { listActiveOccasions } from "@/lib/services/occasions";
import { Reveal } from "@/components/marketing/Reveal";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Occasions",
  description: "Birthdays, apologies, congratulations, pranks, and the moments in between.",
};

export default async function OccasionsPage() {
  const occasions = await listActiveOccasions();

  return (
    <div className="mx-auto w-full max-w-4xl px-6 py-20">
      <Reveal>
        <p className="mono-label text-body-small text-ember">Occasions</p>
        <h1 className="display-serif text-display-5 mt-3 text-ink">
          Every reason is a good one.
        </h1>
      </Reveal>

      {occasions.length === 0 ? (
        <p className="text-body-0 text-ink-soft mt-12">
          No occasions are live right now. Check back soon.
        </p>
      ) : (
        <div className="mt-14">
          {occasions.map((occasion, index) => (
            <Reveal key={occasion.id}>
              <Link
                href={`/occasions/${occasion.slug}`}
                className="group flex items-baseline gap-6 border-b border-rule py-7"
              >
                <span className="mono-label text-body-small text-ash tabular-nums">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <span className="flex-1">
                  <span className="display-serif text-title-2 block text-ink transition-colors duration-120ms group-hover:text-ember">
                    {occasion.name}
                  </span>
                  {occasion.kicker ? (
                    <span className="text-body-small text-ink-soft mt-1 block">
                      {occasion.kicker}
                    </span>
                  ) : null}
                </span>
                <span className="mono-label text-body-small text-ash">View</span>
              </Link>
            </Reveal>
          ))}
        </div>
      )}
    </div>
  );
}