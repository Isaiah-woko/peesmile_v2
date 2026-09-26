
import type { Metadata } from "next";
import { CheckIcon, ShieldWarningIcon, PhoneDisconnectIcon, HandHeartIcon } from "@/components/icons";
import { Rule } from "@/components/primitives/Rule";
import { Reveal } from "@/components/marketing/Reveal";

export const metadata: Metadata = {
  title: "Trust and Safety",
  description: "What we will never do, how we protect recipients, and how to opt out.",
};

const PROHIBITED = [
  "Impersonating a real, named person",
  "Threats, intimidation, sexual content, or slurs",
  "Calls to minors",
  "Coercion, blackmail, or stalking",
];

const CONTROLS = [
  "Every number is checked against a permanent do-not-call list before booking",
  "Consent is logged with the booking, including IP and device",
  "Pranks always end with a reveal of PeeSmile and the buyer's name",
  "If a recipient sounds distressed, the caller reveals and ends the call",
];

export default function TrustPage() {
  return (
    <div className="mx-auto w-full max-w-3xl px-6 py-20">
      <Reveal>
        <p className="mono-label text-body-small text-ember">Trust and safety</p>
        <h1 className="display-serif text-display-5 mt-3 text-ink">
          The line we will not cross.
        </h1>
        <p className="text-body-0 text-ink-soft measure mt-6">
          A surprise call only works if it is safe for the person receiving it.
          These are not guidelines. They are hard rules.
        </p>
      </Reveal>

      <Reveal>
        <div className="mt-14">
          <div className="flex items-start gap-3">
            <ShieldWarningIcon weight="regular" size={24} className="mt-1 shrink-0 text-error" />
            <h2 className="display-serif text-title-2 text-ink">We will never book</h2>
          </div>
          <ul className="mt-5 space-y-3">
            {PROHIBITED.map((item) => (
              <li key={item} className="text-body-0 text-ink-soft">
                {item}
              </li>
            ))}
          </ul>
        </div>
      </Reveal>

      <Reveal>
        <div className="mt-14">
          <div className="flex items-start gap-3">
            <HandHeartIcon weight="regular" size={24} className="mt-1 shrink-0 text-pine" />
            <h2 className="display-serif text-title-2 text-ink">How we protect recipients</h2>
          </div>
          <ul className="mt-5 space-y-3">
            {CONTROLS.map((item) => (
              <li key={item} className="flex items-start gap-3 text-body-0 text-ink-soft">
                <CheckIcon weight="regular" size={18} className="mt-1 shrink-0 text-pine" />
                {item}
              </li>
            ))}
          </ul>
        </div>
      </Reveal>

      <Reveal>
        <div className="mt-14" id="optout">
          <Rule label="If you received a call and want out" />
          <div className="flex items-start gap-3 mt-6">
            <PhoneDisconnectIcon weight="regular" size={24} className="mt-1 shrink-0 text-ink" />
            <div>
              <h2 className="display-serif text-title-2 text-ink">Do-not-call, permanently</h2>
              <p className="text-body-0 text-ink-soft measure mt-3">
                If you received a PeeSmile call and never want another, tell us
                and your number goes on the permanent do-not-call list within 60
                seconds. You do not need to explain why.
              </p>
              <p className="text-body-small text-ash mt-4">
                To be removed, reply to the call confirmation or write to
                optout@peesmile.com with the number that was called.
              </p>
            </div>
          </div>
        </div>
      </Reveal>
    </div>
  );
}