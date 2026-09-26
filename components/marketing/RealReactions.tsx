import { Reveal } from "./Reveal";

const STORIES = [
  {
    quote:
      "My brother and I had not spoken in two years. The caller got him to laugh in the first 30 seconds.",
    attribution: "M., London",
    tint: "bg-sunrise",
  },
  {
    quote:
      "I could not say it myself. She said it like she meant it, and my mom finally heard it.",
    attribution: "T., Lagos",
    tint: "bg-honey",
  },
  {
    quote:
      "He replayed the keepsake four times at dinner. We did not tell him it was coming.",
    attribution: "R., Toronto",
    tint: "bg-sage",
  },
];

export function RealReactions() {
  return (
    <section className="bg-paper py-20">
      <div className="mx-auto w-full max-w-6xl px-6">
        <Reveal>
          <p className="mono-label text-body-small text-ember">Real reactions</p>
          <h2 className="display-serif text-display-4 mt-3 text-ink">
            The moment they pick up.
          </h2>
        </Reveal>

        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {STORIES.map((story) => (
            <Reveal key={story.attribution}>
              <figure className="flex h-full flex-col rounded-md border border-rule bg-paper">
                {/* PHOTO: candid reaction shot, with permission */}
                <div className={`aspect-4/3 w-full rounded-t-md ${story.tint}`} />
                <blockquote className="flex flex-1 flex-col p-5">
                  <p className="display-serif text-title-1 italic leading-snug text-ink">
                    “{story.quote}”
                  </p>
                  <figcaption className="mono-label text-body-small text-ash mt-4">
                    {story.attribution}
                  </figcaption>
                </blockquote>
              </figure>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}