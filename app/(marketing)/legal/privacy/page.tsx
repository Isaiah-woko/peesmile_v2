import type { Metadata } from "next";
import { LegalPage } from "@/components/legal/LegalPage";

export const metadata: Metadata = { title: "Privacy Policy" };

// COPY: needs legal review before launch.
export default function PrivacyPage() {
  return (
    <LegalPage title="Privacy Policy" lastUpdated="September 2026">
      <section>
        <h2 className="display-serif text-title-2 text-ink">What we collect</h2>
        <p className="text-body-0 text-ink-soft measure mt-3">
          We collect your name, email, and WhatsApp number to run your booking. We
          collect the recipient's first name and phone number only to make the
          call. We do not sell this data.
        </p>
      </section>
      <section>
        <h2 className="display-serif text-title-2 text-ink">How we use it</h2>
        <p className="text-body-0 text-ink-soft measure mt-3">
          We use your details to schedule the call, send you updates, and deliver
          your Keepsake. We contact the recipient only for the one call you
          booked, plus one retry if needed.
        </p>
      </section>
      <section>
        <h2 className="display-serif text-title-2 text-ink">Do-not-call</h2>
        <p className="text-body-0 text-ink-soft measure mt-3">
          Any recipient can join our permanent do-not-call list at any time. Once
          added, that number can never be booked again.
        </p>
      </section>
      <section>
        <h2 className="display-serif text-title-2 text-ink">Your rights</h2>
        <p className="text-body-0 text-ink-soft measure mt-3">
          You can ask us what we hold about you, correct it, or delete it. Write
          to privacy@peesmile.com and we will respond within 30 days.
        </p>
      </section>
    </LegalPage>
  );
}