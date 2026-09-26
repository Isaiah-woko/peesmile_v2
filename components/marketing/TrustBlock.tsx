'use client'
import { CheckIcon } from "@phosphor-icons/react";
import { Reveal } from "./Reveal";

const PROMISES = [
  "If we cannot reach them, you do not pay. We refund it before you have to ask.",
  "One call. Not a campaign. We do not spam.",
  "Permanent do-not-call list. Ask to be removed, and it is done in 60 seconds.",
];

export function TrustBlock() {
  return (
    <section className="bg-bone py-20">
      <div className="mx-auto w-full max-w-6xl px-6">
        <Reveal>
          <p className="mono-label text-body-small text-ember">Trust</p>
          <h2 className="display-serif text-display-4 mt-3 text-ink">
            The part most sites hide.
          </h2>
        </Reveal>

        <div className="mt-10 grid gap-8 md:grid-cols-[minmax(0,3fr)_minmax(0,2fr)]">
          <Reveal>
            <ul className="space-y-5">
              {PROMISES.map((promise) => (
                <li key={promise} className="flex items-start gap-3">
                  <CheckIcon weight="regular" size={20} className="mt-1 shrink-0 text-pine" />
                  <p className="text-body-0 text-ink-soft">{promise}</p>
                </li>
              ))}
            </ul>
          </Reveal>

          <Reveal delay={0.1}>
            <div className="rounded-md border border-rule bg-paper p-6">
              <p className="mono-label text-body-small text-ash">Who runs this</p>
              <p className="text-body-0 text-ink mt-3">
                PeeSmile is one person, not a call center. Adaeze takes every
                call herself.
              </p>
              <p className="text-body-small text-ash mt-4">
                Questions before you book? Write to hello@peesmile.com.
              </p>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}