# PeeSmile build notes

Decisions are recorded as they are made. The most recent decision wins where documents conflict.

## Stack decisions
- Database is PostgreSQL with Prisma ORM. Local Postgres in development, Neon or Supabase in production. Only DATABASE_URL changes between environments.
- Authentication is Auth.js v5 with a Resend magic link. This replaces Supabase Auth. There is exactly one login on the site, for the owner.
- File storage is Cloudflare R2, accessed through the S3 compatible API. This replaces Supabase Storage.
- Live tracker updates use React Query polling. This replaces Supabase Realtime.
- Stripe and Paystack are stubbed. Checkout is mocked until Phase 4 wiring is requested.

## Product decisions, from spec v2.0
- Single caller. There is no voice gallery. The owner is the only talent.
- Calls are improvised from a brief. There is no script studio and no rendered script.
- Dialing is manual. There is no Twilio and no automated recording. The owner dials from her own phone and uploads the recording.
- There are no background jobs. There is no Inngest. All workflow is manual through the admin dashboard.
- Buyers have no accounts. Orders live behind a permanent magic link.
- WhatsApp is the primary notification channel, email is the backup.
- The visual direction is warm and in color. Black and white is reserved for the caller portrait.

## Implementation notes
- Film grain is currently an inline SVG turbulence tile so the build needs no binary asset. It can be swapped for a real grain.png later without changing markup.
- Fonts are self hosted with next/font/local. The woff2 files must exist in app/fonts before the app will build.

- Gambetta italic was omitted because the RegularItalic cut was not available at download time. Display text set to italic will synthesize an oblique from the regular cut. Revisit when building the Keepsake page, and substitute the true italic from the Fontshare variable package if it is found.

- Added Order.whatsappOptIn to the schema so the single checkout checkbox is persisted. Required by the WhatsApp first decision.
- Added a PackageOccasion join table so package availability can vary per occasion later without a migration.
- markBriefReviewed updates the status inside the same transaction as the review stamp. This is the one place that bypasses transitionOrder, and it does so because the two writes must be atomic. Revisit if stricter auditing is needed.
- Public token generation uses two concatenated UUID fragments for a 42 character token. Longer than the 22 character minimum in the spec.
- Voice sample audio URLs point at /audio/samples placeholders. Real files must be uploaded to public/audio/samples or to R2 before Phase 2 marketing pages use them.

- Auth uses the JWT session strategy so the middleware can read sessions on the Edge runtime without loading Prisma.
- Auth config is split. auth.config.ts is Edge safe and holds pages, session strategy, and trustHost. auth.ts adds the Prisma adapter and the Resend provider.
- Magic links are only sent to emails that already exist in the users table. This restricts sign-in to the seeded owner and prevents strangers from creating accounts. Unknown emails receive nothing, which also blocks email enumeration.
- R2 storage initializes the S3 client lazily. No environment variable is read at import time, so a missing key cannot crash the app on boot.
- Session augmentation with user id and role is deferred to Phase 5, when the admin dashboard needs it for audit fields such as call_briefs.reviewedBy.
- Login and verify-request pages live in the app/admin/(auth) route group so they do not inherit the dashboard chrome from app/admin/(dashboard)/layout.tsx.
- Booking add-ons appear in the spec (Review step and orders.addonsTotal) but no addon catalog exists in the schema. Pricing computes addonsTotal as 0 for now. Flagging this as a gap to resolve before Phase 4.

- The wizard_abandon event is deferred to Part 4. It needs the server-side draft row so abandon can be recorded against a real draft id.
- The mobile sticky bar duplicates the StepShell continue control on small screens. StepShell's own bar should be hidden under lg in Part 3 once the remaining steps land.

- The country picker is a curated list of 23 countries covering the core markets. A full searchable country picker is a future enhancement.
- The brief language options are fixed to English and Nigerian Pidgin, matching the single caller's languages. Expand when more languages are supported.
- Navigation now lives in the wizard, not the steps. Steps receive canContinue, onContinue, and onBack as props, which keeps gating and analytics in one place.

- The Moment step converts the buyer's chosen recipient-local time to a UTC instant via zonedTimeToUtc, with a two-pass offset check for DST edges.
- Quiet hours (22:00 to 08:00 recipient time) are shaded on the DayRibbon but not blocked.
- The Moment step ships with sensible defaults (tomorrow at 2pm, 15 minute window), so it validates immediately and the buyer adjusts from there.
- /checkout is a placeholder until Phase 4.

- Server-side draft persistence is live. The wizard saves to /api/drafts with a 1 second debounce on change and again on every continue, and restores from a ?draft= token. The token lives in localStorage under peesmile_draft_token.
- Saves are gated until any pending restore settles, and empty drafts are never written.
- Rate limiting on /api/drafts is deferred to Phase 5 with the Upstash setup. Required before production.
- The draft_orders.email column stays null until checkout collects the buyer's email in Phase 4.

## Bachs.io integration status
Verified against Bachs documentation:
- Base URLs: https://api.bachs.io/v1 live, https://sandbox-api.bachs.io/v1 sandbox.
- Checkout endpoint is POST /v1/checkout-sessions. Refunds are POST /v1/refunds via charge_id.
- Amounts are positive decimal strings such as "32500.00", never minor units. lib/payments/money.ts handles the conversion to and from our internal integer minor units using integer math only.
- Webhook signature is HMAC-SHA256 of "{timestamp}.{raw_body}" with headers X-Bachs-Timestamp and X-Bachs-Signature, plus a 300 second replay window.
- Event types are collection.succeeded, collection.failed, collection.underpaid, checkout.expired, refund.created, refund.paid, refund.failed.
- Checkout response uses id and url. Webhook data carries charge_id, status, amount, currency, and metadata at data.metadata.
- Success redirect appends checkout_id only.
- Idempotency-Key header is the dedup mechanism.

Confirm with a sandbox smoke test before go-live:
- The exact request field names success_url and cancel_url on checkout creation.
- That metadata sent at checkout creation arrives intact at data.metadata in the webhook.

## Payments decisions
- collection.underpaid and checkout.expired are recorded in webhook_events but treated as non-confirming. Only collection.succeeded moves an order to paid.
- confirmPayment is idempotent. Duplicate or late webhooks for an order already past payment are recorded but not re-applied.
- The webhook route marks an event processed only after the work succeeds, so retries are safe and never double-charge.