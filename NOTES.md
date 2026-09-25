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