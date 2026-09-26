import type { Metadata } from "next";
import { LegalPage } from "@/components/legal/LegalPage";

export const metadata: Metadata = { title: "Recording Consent" };

// COPY: needs legal review before launch. Consent rules vary by jurisdiction.
export default function RecordingConsentPage() {
  return (
    <LegalPage title="Recording Consent" lastUpdated="September 2026">
      <section>
        <h2 className="display-serif text-title-2 text-ink">When we record</h2>
        <p className="text-body-0 text-ink-soft measure mt-3">
          Only Signature and Masterpiece packages include a Keepsake recording.
          Classic calls are live and never recorded. We only record where the law
          allows it.
        </p>
      </section>
      <section>
        <h2 className="display-serif text-title-2 text-ink">One-party and two-party regions</h2>
        <p className="text-body-0 text-ink-soft measure mt-3">
          Consent law differs by location. In one-party regions, the caller's
          consent is enough. In two-party regions, the recipient must also agree.
          We detect the recipient's region at booking and apply the stricter rule.
          Where we cannot record lawfully, the call still happens, but without a
          Keepsake, and we adjust the price.
        </p>
      </section>
      <section>
        <h2 className="display-serif text-title-2 text-ink">What you confirm</h2>
        <p className="text-body-0 text-ink-soft measure mt-3">
          At checkout you confirm that recording the call is lawful for the
          recipient's location, or that you accept the no-recording alternative.
          This attestation is logged with your booking.
        </p>
      </section>
      <section>
        <h2 className="display-serif text-title-2 text-ink">Who can access a recording</h2>
        <p className="text-body-0 text-ink-soft measure mt-3">
          A Keepsake is private by default and reachable only through its unique
          link. You control whether it stays private, becomes link-shareable, or
          is deleted.
        </p>
      </section>
    </LegalPage>
  );
}