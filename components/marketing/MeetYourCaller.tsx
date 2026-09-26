import { SamplePlayer } from "@/components/audio/SamplePlayer";
import { synthesizePeaks } from "@/lib/peaks";
import { Reveal } from "./Reveal";

const SAMPLES = [
  { id: "caller-warm", title: "Warm", durationMs: 42000, seed: 11 },
  { id: "caller-playful", title: "Playful", durationMs: 38000, seed: 12 },
  { id: "caller-tender", title: "Tender", durationMs: 51000, seed: 13 },
  { id: "caller-deadpan", title: "Deadpan", durationMs: 35000, seed: 14 },
];

export function MeetYourCaller() {
  return (
    <section className="bg-paper py-20">
      <div className="mx-auto w-full max-w-6xl px-6">
        <div className="grid gap-10 md:grid-cols-[minmax(0,2fr)_minmax(0,3fr)]">
          <Reveal>
            {/* PHOTO: the only black-and-white image on the site. Caller portrait. */}
            <div className="aspect-4/5 w-full rounded-lg bg-ink-soft" />
          </Reveal>

          <div>
            <Reveal>
              <p className="mono-label text-body-small text-ember">Meet your caller</p>
              <h2 className="display-serif text-display-4 mt-3 text-ink">Adaeze</h2>
              <p className="text-body-0 text-ink-soft measure mt-4">
                I have spent years on the phone with strangers who became friends
                in three minutes. I do not read scripts. I listen, and I make the
                call feel like it was always meant to happen.
              </p>
              <p className="display-serif text-title-2 italic text-ink mt-6">
                “The best calls are the ones where I forget I am working.”
              </p>
            </Reveal>

            <Reveal delay={0.1}>
              <div className="mt-8 grid gap-3 sm:grid-cols-2">
                {SAMPLES.map((sample) => (
                  <SamplePlayer
                    key={sample.id}
                    id={sample.id}
                    src={`/audio/samples/${sample.id}.mp3`}
                    title={sample.title}
                    peaks={synthesizePeaks(sample.seed)}
                    durationMs={sample.durationMs}
                  />
                ))}
              </div>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}