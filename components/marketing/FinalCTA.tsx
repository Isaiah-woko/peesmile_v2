import Link from "next/link";
import { Button } from "@/components/primitives/Button";
import { LiveClock } from "./LiveClock";
import { Reveal } from "./Reveal";

export function FinalCTA() {
  return (
    <section className="bg-paper py-24">
      <div className="mx-auto w-full max-w-3xl px-6 text-center">
        <Reveal>
          <h2 className="display-serif text-display-5 text-ink">Who came to mind?</h2>
          <p className="text-body-0 text-ink-soft measure mx-auto mt-6">
            You do not need a perfect reason. You just need to know it is the
            right time.
          </p>
          <div className="mt-8 flex justify-center">
            <Button asChild size="lg">
              <Link href="/book">Book a call</Link>
            </Button>
          </div>
          <p className="text-body-small text-ash mt-6">
            It takes 4 minutes to book. We handle the rest.
          </p>
          <div className="mt-4">
            <LiveClock />
          </div>
        </Reveal>
      </div>
    </section>
  );
}