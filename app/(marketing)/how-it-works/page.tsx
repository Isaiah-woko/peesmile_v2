import type { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/primitives/Button";
import { Rule } from "@/components/primitives/Rule";
import { Reveal } from "@/components/marketing/Reveal";

export const metadata: Metadata = {
  title: "How it works",
  description:
    "You give us the brief and the minute. A real human makes the call. You keep the recording.",
};

const STEPS = [
  {
    number: "01",
    title: "Tell us who, and what you want them to feel",
    body: "You write a short brief. Who they are, what they should know, the one thing to say, what to avoid. Not a script. Context.",
  },
  {
    number: "02",
    title: "Pick the exact minute, in their time",
    body: "You choose the moment in the recipient's local time zone. We show your clock and theirs side by side so nothing lands at a stupid hour.",
  },
  {
    number: "03",
    title: "A real human makes the call",
    body: "Adaeze reads your brief, then calls and has a genuine conversation. No script, no AI voice. She reads the room and adjusts as it goes.",
  },
  {
    number: "04",
    title: "You keep the proof",
    body: "On Signature and Masterpiece, the call is recorded with consent and delivered as a Keepsake you can replay and share.",
  },
];

export default function HowItWorksPage() {
  return (
    <div className="mx-auto w-full max-w-4xl px-6 py-20">
      <Reveal>
        <p className="mono-label text-body-small text-ember">How it works</p>
        <h1 className="display-serif text-display-5 mt-3 text-ink">
          Four minutes to book. One call they will not forget.
        </h1>
      </Reveal>

      <div className="mt-16 space-y-14">
        {STEPS.map((step) => (
          <Reveal key={step.number}>
            <div className="grid gap-4 md:grid-cols-[80px_1fr]">
              <span className="display-serif text-display-4 text-clay tabular-nums">
                {step.number}
              </span>
              <div>
                <h2 className="display-serif text-title-2 text-ink">{step.title}</h2>
                <p className="text-body-0 text-ink-soft measure mt-3">{step.body}</p>
              </div>
            </div>
          </Reveal>
        ))}
      </div>

      <Reveal>
        <div className="mt-20">
          <Rule label="The fine print, in plain words" align="center" />
          <div className="mt-10 grid gap-8 md:grid-cols-3">
            <div>
              <h3 className="text-body-0 font-medium text-ink">If they do not answer</h3>
              <p className="text-body-small text-ink-soft mt-2">
                We try once more. If we cannot reach them, you get a full refund
                without having to ask.
              </p>
            </div>
            <div>
              <h3 className="text-body-0 font-medium text-ink">For pranks</h3>
              <p className="text-body-small text-ink-soft mt-2">
                The caller always reveals PeeSmile and your name before the call
                ends. Nobody is left wondering.
              </p>
            </div>
            <div>
              <h3 className="text-body-0 font-medium text-ink">Recording consent</h3>
              <p className="text-body-small text-ink-soft mt-2">
                We only record where the law allows it and you have opted in. See
                the recording consent policy for the detail.
              </p>
            </div>
          </div>
        </div>
      </Reveal>

      <Reveal>
        <div className="mt-20 flex justify-center">
          <Button asChild size="lg">
            <Link href="/book">Book a call</Link>
          </Button>
        </div>
      </Reveal>
    </div>
  );
}