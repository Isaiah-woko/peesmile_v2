"use client";

import { PlayButton } from "@/components/audio/PlayButton";
import { Waveform } from "@/components/audio/Waveform";
import { synthesizePeaks } from "@/lib/peaks";
import { Reveal } from "./Reveal";

interface ShowcaseItem {
  id: string;
  src: string;
  instruction: string;
  caption: string;
  duration: number;
  peaks: number[];
}

const ITEMS: ShowcaseItem[] = [
  {
    id: "showcase-1",
    src: "/audio/keepsakes/sample-1.mp3",
    instruction: "Tell my dad I finally forgave him.",
    caption: "3m 12s. He laughed at the 40-second mark.",
    duration: 192,
    peaks: synthesizePeaks(1),
  },
  {
    id: "showcase-2",
    src: "/audio/keepsakes/sample-2.mp3",
    instruction: "Surprise her on her 30th. Make it loud.",
    caption: "4m 05s. She screamed. In a good way.",
    duration: 245,
    peaks: synthesizePeaks(2),
  },
  {
    id: "showcase-3",
    src: "/audio/keepsakes/sample-3.mp3",
    instruction: "Congratulate him. He never brags, so you should.",
    caption: "2m 48s. He went quiet, then said thank you twice.",
    duration: 168,
    peaks: synthesizePeaks(3),
  },
  {
    id: "showcase-4",
    src: "/audio/keepsakes/sample-4.mp3",
    instruction: "Apologize for missing the wedding. Mean it.",
    caption: "3m 41s. She picked up on the second ring.",
    duration: 221,
    peaks: synthesizePeaks(4),
  },
  {
    id: "showcase-5",
    src: "/audio/keepsakes/sample-5.mp3",
    instruction: "Prank my brother. Reveal it before he panics.",
    caption: "2m 19s. He fell for it. Reveal at 1m 50s.",
    duration: 139,
    peaks: synthesizePeaks(5),
  },
  {
    id: "showcase-6",
    src: "/audio/keepsakes/sample-6.mp3",
    instruction: "Tell grandma the baby is named after her.",
    caption: "3m 03s. She cried. Then she laughed.",
    duration: 183,
    peaks: synthesizePeaks(6),
  },
];

export function KeepsakeShowcase() {
  return (
    <section id="hear" className="bg-paper py-20">
      <div className="mx-auto w-full max-w-6xl px-6">
        <Reveal>
          <p className="mono-label text-body-small text-ember">Hear the difference</p>
          <h2 className="display-serif text-display-4 mt-3 text-ink">
            These are real moments. Press play.
          </h2>
        </Reveal>

        <Reveal delay={0.1}>
          <div className="mt-10 flex snap-x snap-mandatory gap-4 overflow-x-auto pb-4">
            {ITEMS.map((item) => (
              <article
                key={item.id}
                className="w-72 shrink-0 snap-start rounded-md border border-rule bg-paper p-5"
              >
                <p className="display-serif text-title-1 italic leading-snug text-ink">
                  “{item.instruction}”
                </p>
                <div className="mt-5 flex items-center gap-3">
                  <PlayButton id={item.id} src={item.src} label={item.instruction} />
                  <div className="min-w-0 flex-1">
                    <Waveform
                      id={item.id}
                      src={item.src}
                      peaks={item.peaks}
                      duration={item.duration}
                    />
                  </div>
                </div>
                <p className="mono-label text-body-small text-ash mt-4">{item.caption}</p>
              </article>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}