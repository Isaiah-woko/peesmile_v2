import Link from "next/link";
import { Reveal } from "./Reveal";

const OCCASIONS = [
  { number: "01", name: "Birthdays", slug: "birthday", stat: "47 calls this week", tint: "bg-sunrise" },
  { number: "02", name: "Apologies", slug: "apology", stat: "12 calls this week", tint: "bg-clay" },
  { number: "03", name: "Long Distance", slug: "long-distance", stat: "31 calls this week", tint: "bg-honey" },
  { number: "04", name: "Congratulations", slug: "congratulations", stat: "26 calls this week", tint: "bg-sage" },
  { number: "05", name: "Pranks", slug: "prank", stat: "9 calls this week", tint: "bg-sunrise" },
];

export function OccasionIndex() {
  return (
    <section className="bg-bone py-20">
      <div className="mx-auto w-full max-w-6xl px-6">
        <Reveal>
          <p className="mono-label text-body-small text-ember">Occasions</p>
          <h2 className="display-serif text-display-4 mt-3 text-ink">
            Pick the moment. We carry the message.
          </h2>
        </Reveal>

        <div className="mt-10">
          {OCCASIONS.map((occasion) => (
            <Reveal key={occasion.slug}>
              <Link
                href={`/occasions/${occasion.slug}`}
                className="group relative flex items-center gap-6 border-b border-rule py-6"
              >
                <span className="mono-label text-body-small text-ash tabular-nums">
                  {occasion.number}
                </span>
                <span className="display-serif text-title-2 flex-1 text-ink transition-colors duration-120ms group-hover:text-ember">
                  {occasion.name}
                </span>
                <span className="mono-label text-body-small hidden text-ash md:block">
                  {occasion.stat}
                </span>
                {/* PHOTO: warm image revealed on hover */}
                <span
                  className={`pointer-events-none absolute right-0 top-1/2 h-16 w-24 -translate-y-1/2 rounded-md ${occasion.tint} opacity-0 transition-opacity duration-120ms group-hover:opacity-100`}
                  aria-hidden="true"
                />
              </Link>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}