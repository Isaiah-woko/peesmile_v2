'use client'

import { ChatsIcon, EarIcon, ShieldCheckIcon, CompassIcon } from "@phosphor-icons/react";
import { Reveal } from "./Reveal";

const POINTS = [
  {
    icon: ChatsIcon,
    text: "No scripts. Every conversation is improvised from your brief.",
  },
  {
    icon: EarIcon,
    text: "Vetted for empathy, timing, and clarity.",
  },
  {
    icon: ShieldCheckIcon,
    text: "Strict adherence to reveal and safety protocols.",
  },
  {
    icon: CompassIcon,
    text: "If the vibe is wrong, she pivots. If the recipient is distressed, she ends the call.",
  },
];

export function CallerStandard() {
  return (
    <section className="bg-ink py-20">
      <div className="mx-auto w-full max-w-6xl px-6">
        <Reveal>
          <p className="mono-label text-body-small text-signal">The caller standard</p>
          <h2 className="display-serif text-display-4 mt-3 text-paper">
            A professional, not a gimmick.
          </h2>
        </Reveal>

        <div className="mt-10 grid gap-6 md:grid-cols-2">
          {POINTS.map((point) => (
            <Reveal key={point.text}>
              <div className="flex items-start gap-4 border-b border-ink-soft pb-6">
                <point.icon weight="regular" size={24} className="mt-1 shrink-0 text-signal" />
                <p className="text-body-0 text-bone">{point.text}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}