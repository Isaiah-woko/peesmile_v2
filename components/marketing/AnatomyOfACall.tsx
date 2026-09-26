import { Rule } from "@/components/primitives/Rule";
import { Reveal } from "./Reveal";

export function AnatomyOfACall() {
  return (
    <section className="bg-bone py-20">
      <div className="mx-auto w-full max-w-6xl px-6">
        <Reveal>
          <p className="mono-label text-body-small text-ember">The anatomy of a call</p>
          <h2 className="display-serif text-display-4 mt-3 text-ink">
            We do not use scripts. We use context.
          </h2>
        </Reveal>

        <div className="mt-10 grid gap-6 md:grid-cols-2">
          <Reveal>
            <div className="h-full rounded-md border border-rule bg-paper p-6">
              <Rule label="What you gave us" />
              <div className="mt-4 space-y-3 text-body-0 text-ink-soft">
                <p>
                  <span className="mono-label text-body-small text-ash">Who</span>
                  <br />
                  My brother Daniel. Turning 40.
                </p>
                <p>
                  <span className="mono-label text-body-small text-ash">The one thing to say</span>
                  <br />
                  I am proud of the dad he has become.
                </p>
                <p>
                  <span className="mono-label text-body-small text-ash">Avoid</span>
                  <br />
                  Do not mention the move. Sore subject.
                </p>
              </div>
            </div>
          </Reveal>

          <Reveal delay={0.1}>
            <div className="h-full rounded-md border border-rule bg-paper p-6">
              <Rule label="How the caller reads it" />
              <div className="mono-label text-body-small mt-4 space-y-3 text-ink-soft">
                <p>Open light. Reference the 40th, not the move.</p>
                <p>Land the proud line in the middle, not the end.</p>
                <p>If he brings up the move, steer warm, do not dig.</p>
                <p>End on the kids. That is the soft landing.</p>
              </div>
            </div>
          </Reveal>
        </div>

        <Reveal delay={0.15}>
          <p className="text-body-0 text-ink-soft measure mt-8">
            You give us the brief. Our caller knows how to read a room and make
            it feel real. That is the whole trick, and there is no trick.
          </p>
        </Reveal>
      </div>
    </section>
  );
}