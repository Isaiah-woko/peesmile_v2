import type { Metadata } from "next";
import { FaqAccordion, type FaqItem } from "@/components/marketing/FaqAccordion";
import { Reveal } from "@/components/marketing/Reveal";

export const metadata: Metadata = {
  title: "FAQ",
  description: "The questions people ask before they book a PeeSmile call.",
};

const FAQ_ITEMS: FaqItem[] = [
  {
    question: "Is this a bot or an AI voice?",
    answer:
      "No. A real human makes every call. That is the whole point. You can hear her voice samples before you book, so you know exactly what you are getting.",
  },
  {
    question: "What actually happens on the call?",
    answer:
      "She reads the brief you wrote, calls at the minute you chose, and has a genuine conversation. There is no script. She listens, adjusts, and makes it feel real.",
  },
  {
    question: "What if they do not pick up?",
    answer:
      "We try once more. If we still cannot reach them, you get a full refund automatically. You do not have to chase us for it.",
  },
  {
    question: "Will they know it is from me?",
    answer:
      "The caller does not pretend to be you. She is a warm stranger delivering your message. For pranks, she always reveals PeeSmile and your name before the call ends.",
  },
  {
    question: "Is the call recorded?",
    answer:
      "Only on Signature and Masterpiece, only where the law allows it, and only with the consent handled in our recording policy. Classic is live only.",
  },
  {
    question: "Do you spam them or sell the number?",
    answer:
      "Never. One call, one retry, nothing else. Any number can be added to a permanent do-not-call list at any time.",
  },
  {
    question: "How do you get the timing right?",
    answer:
      "You pick the exact minute in the recipient's local time zone. We show your clock and theirs side by side during booking so it lands when you mean it to.",
  },
  {
    question: "What if the vibe goes wrong?",
    answer:
      "The caller is trained to pivot. If the recipient sounds confused or distressed, she reveals what this is and ends the call gently.",
  },
];

export default function FaqPage() {
  return (
    <div className="mx-auto w-full max-w-3xl px-6 py-20">
      <Reveal>
        <p className="mono-label text-body-small text-ember">FAQ</p>
        <h1 className="display-serif text-display-5 mt-3 text-ink">
          Asked before every booking.
        </h1>
      </Reveal>
      <Reveal delay={0.1}>
        <div className="mt-12">
          <FaqAccordion items={FAQ_ITEMS} />
        </div>
      </Reveal>
    </div>
  );
}