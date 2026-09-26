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