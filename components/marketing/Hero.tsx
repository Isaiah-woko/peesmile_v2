import Link from "next/link";
import { Button } from "@/components/primitives/Button";
import { Reveal } from "./Reveal";

export function Hero() {
  return (
    <section className="overflow-hidden bg-paper">
      <div className="mx-auto grid w-full max-w-6xl gap-10 px-6 pb-20 pt-16 md:grid-cols-2 md:items-center">
        <Reveal>
          <p className="mono-label text-body-small text-ember">
            A real human. A real call. No scripts.
          </p>
          <h1 className="display-serif text-display-5 mt-4 text-ink">
            Some things should not be a text.
          </h1>
          <p className="text-body-0 text-ink-soft measure mt-6">
            We call the people you love, at the exact minute that matters, and
            have the conversation you cannot quite start.
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-3">
            <Button asChild size="lg">
              <Link href="/book">Book a call</Link>
            </Button>
            <Button asChild size="lg" variant="ghost">
              <a href="#hear">Hear a real one</a>
            </Button>
          </div>
        </Reveal>

        <Reveal delay={0.12}>
          {/* PHOTO: golden-hour shot of a person mid-laugh, phone to ear */}
          <div className="aspect-4/5 w-full rounded-lg bg-linear-to-br from-sunrise to-honey" />
        </Reveal>
      </div>
    </section>
  );
}