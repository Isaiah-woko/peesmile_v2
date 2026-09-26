import type { Metadata } from "next";
import { LegalPage } from "@/components/legal/LegalPage";

export const metadata: Metadata = { title: "Terms of Service" };

// COPY: needs legal review before launch.
export default function TermsPage() {
  return (
    <LegalPage title="Terms of Service" lastUpdated="September 2026">
      <section>
        <h2 className="display-serif text-title-2 text-ink">What PeeSmile is</h2>
        <p className="text-body-0 text-ink-soft measure mt-3">
          PeeSmile arranges a live telephone call, made by a real human, to a
          recipient you choose, at a time you choose. You are buying the call and,
          on eligible packages, a recording of it called a Keepsake.
        </p>
      </section>
      <section>
        <h2 className="display-serif text-title-2 text-ink">What you agree to</h2>
        <p className="text-body-0 text-ink-soft measure mt-3">
          You confirm the recipient is an adult, that you have a legitimate reason
          to contact them, and that your brief contains nothing prohibited. You
          must not use the service to impersonate, threaten, harass, coerce, or
          deceive anyone.
        </p>
      </section>
      <section>
        <h2 className="display-serif text-title-2 text-ink">Payment and refunds</h2>
        <p className="text-body-0 text-ink-soft measure mt-3">
          Payment is taken at booking. If we cannot reach the recipient after one
          retry, you receive a full refund. Refunds are processed to the original
          payment method.
        </p>
      </section>
      <section>
        <h2 className="display-serif text-title-2 text-ink">Our limits</h2>
        <p className="text-body-0 text-ink-soft measure mt-3">
          We are not liable for how a recipient reacts to a call, provided we
          followed our safety protocols. We may refuse or cancel any booking that
          breaks these terms, with a refund where appropriate.
        </p>
      </section>
    </LegalPage>
  );
}