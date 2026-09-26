import { Reveal } from "./Reveal";

const STATS = [
  { value: "1,247", label: "calls delivered" },
  { value: "38", label: "countries reached" },
  { value: "100%", label: "human" },
  { value: "4.9", label: "average rating" },
];

export function ProofStrip() {
  return (
    <section className="border-y border-rule bg-bone">
      <Reveal>
        <div className="mx-auto w-full max-w-6xl px-6 py-8">
          <div className="grid grid-cols-2 gap-6 md:grid-cols-4">
            {STATS.map((stat) => (
              <div key={stat.label}>
                <p className="display-serif text-display-4 text-ink tabular-nums">
                  {stat.value}
                </p>
                <p className="mono-label text-body-small text-ash mt-1">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
          <p className="text-body-small text-ash mt-6">Updated this morning.</p>
        </div>
      </Reveal>
    </section>
  );
}