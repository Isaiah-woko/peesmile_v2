-- CreateEnum
CREATE TYPE "OrderStatus" AS ENUM ('draft', 'pending_payment', 'paid', 'caller_assigned', 'brief_reviewed', 'in_window', 'dialing', 'connected', 'delivered', 'failed', 'refunded', 'cancelled');

-- CreateEnum
CREATE TYPE "CallOutcome" AS ENUM ('answered', 'no_answer', 'busy', 'invalid', 'blocked');

-- CreateEnum
CREATE TYPE "KeepsakeVisibility" AS ENUM ('private', 'link', 'public');

-- CreateEnum
CREATE TYPE "ToneLevel" AS ENUM ('tender', 'warm', 'playful', 'bold', 'unhinged');

-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('admin', 'ops');

-- CreateEnum
CREATE TYPE "DncSource" AS ENUM ('recipient_request', 'abuse', 'legal');

-- CreateEnum
CREATE TYPE "AbuseStatus" AS ENUM ('open', 'investigating', 'resolved', 'dismissed');

-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "name" TEXT,
    "email" TEXT,
    "emailVerified" TIMESTAMP(3),
    "image" TEXT,
    "role" "UserRole" NOT NULL DEFAULT 'admin',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "accounts" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "provider" TEXT NOT NULL,
    "provider_account_id" TEXT NOT NULL,
    "refresh_token" TEXT,
    "access_token" TEXT,
    "expires_at" INTEGER,
    "token_type" TEXT,
    "scope" TEXT,
    "id_token" TEXT,
    "session_state" TEXT,

    CONSTRAINT "accounts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "sessions" (
    "id" TEXT NOT NULL,
    "session_token" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "expires" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "sessions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "verification_tokens" (
    "identifier" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "expires" TIMESTAMP(3) NOT NULL
);

-- CreateTable
CREATE TABLE "occasions" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "kicker" TEXT,
    "description" TEXT,
    "hero_image_url" TEXT,
    "sort_order" INTEGER NOT NULL DEFAULT 0,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "requires_reveal" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "occasions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "packages" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "tagline" TEXT,
    "max_duration_sec" INTEGER NOT NULL,
    "includes" JSONB NOT NULL DEFAULT '[]',
    "includes_keepsake" BOOLEAN NOT NULL DEFAULT false,
    "sort_order" INTEGER NOT NULL DEFAULT 0,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "packages_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "package_occasions" (
    "package_id" TEXT NOT NULL,
    "occasion_id" TEXT NOT NULL,

    CONSTRAINT "package_occasions_pkey" PRIMARY KEY ("package_id","occasion_id")
);

-- CreateTable
CREATE TABLE "package_prices" (
    "id" TEXT NOT NULL,
    "package_id" TEXT NOT NULL,
    "currency" TEXT NOT NULL,
    "amount" INTEGER NOT NULL,
    "stripe_price_id" TEXT,

    CONSTRAINT "package_prices_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "voice_talents" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "display_name" TEXT NOT NULL,
    "headline" TEXT,
    "bio" TEXT,
    "portrait_url" TEXT,
    "accent" TEXT,
    "languages" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "vibeTags" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "voice_gender" TEXT,
    "calls_delivered" INTEGER NOT NULL DEFAULT 0,
    "rating" DECIMAL(3,2),
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "user_id" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "voice_talents_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "voice_samples" (
    "id" TEXT NOT NULL,
    "talent_id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "occasion_id" TEXT,
    "tone" "ToneLevel" NOT NULL DEFAULT 'warm',
    "audio_url" TEXT NOT NULL,
    "duration_ms" INTEGER NOT NULL,
    "peaks" JSONB NOT NULL,
    "sort_order" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "voice_samples_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "recipients" (
    "id" TEXT NOT NULL,
    "first_name" TEXT NOT NULL,
    "relationship" TEXT,
    "phone_e164" TEXT NOT NULL,
    "phone_country" TEXT NOT NULL,
    "timezone" TEXT NOT NULL,
    "city" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "recipients_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "orders" (
    "id" TEXT NOT NULL,
    "public_token" TEXT NOT NULL,
    "buyer_name" TEXT NOT NULL,
    "buyer_email" TEXT NOT NULL,
    "buyer_whatsapp" TEXT,
    "whatsapp_opt_in" BOOLEAN NOT NULL DEFAULT false,
    "recipient_id" TEXT NOT NULL,
    "occasion_id" TEXT NOT NULL,
    "package_id" TEXT NOT NULL,
    "talent_id" TEXT,
    "status" "OrderStatus" NOT NULL DEFAULT 'draft',
    "currency" TEXT NOT NULL,
    "subtotal" INTEGER NOT NULL,
    "addons_total" INTEGER NOT NULL DEFAULT 0,
    "total" INTEGER NOT NULL,
    "scheduled_start" TIMESTAMP(3) NOT NULL,
    "window_minutes" INTEGER NOT NULL DEFAULT 15,
    "backup_start" TIMESTAMP(3),
    "recording_consent" BOOLEAN NOT NULL DEFAULT false,
    "buyer_attestation" BOOLEAN NOT NULL DEFAULT false,
    "payment_provider" TEXT,
    "payment_intent_id" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "orders_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "call_briefs" (
    "order_id" TEXT NOT NULL,
    "tone" "ToneLevel" NOT NULL DEFAULT 'warm',
    "key_message" TEXT NOT NULL,
    "context" TEXT,
    "inside_jokes" TEXT,
    "avoid" TEXT,
    "language" TEXT NOT NULL DEFAULT 'en',
    "reviewed_by" TEXT,
    "reviewed_at" TIMESTAMP(3),

    CONSTRAINT "call_briefs_pkey" PRIMARY KEY ("order_id")
);

-- CreateTable
CREATE TABLE "call_attempts" (
    "id" TEXT NOT NULL,
    "order_id" TEXT NOT NULL,
    "attempt_number" INTEGER NOT NULL DEFAULT 1,
    "started_at" TIMESTAMP(3),
    "ended_at" TIMESTAMP(3),
    "duration_sec" INTEGER,
    "outcome" "CallOutcome",
    "recording_url" TEXT,
    "error_detail" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "call_attempts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "keepsakes" (
    "id" TEXT NOT NULL,
    "order_id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "audio_url" TEXT NOT NULL,
    "duration_ms" INTEGER NOT NULL,
    "peaks" JSONB NOT NULL,
    "visibility" "KeepsakeVisibility" NOT NULL DEFAULT 'link',
    "view_count" INTEGER NOT NULL DEFAULT 0,
    "is_featured" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "keepsakes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "do_not_call" (
    "id" TEXT NOT NULL,
    "phone_e164" TEXT NOT NULL,
    "reason" TEXT,
    "source" "DncSource" NOT NULL DEFAULT 'recipient_request',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "do_not_call_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "consent_records" (
    "id" TEXT NOT NULL,
    "order_id" TEXT NOT NULL,
    "kind" TEXT NOT NULL,
    "value" BOOLEAN NOT NULL,
    "ip" TEXT,
    "user_agent" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "consent_records_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "abuse_reports" (
    "id" TEXT NOT NULL,
    "phone_e164" TEXT,
    "email" TEXT,
    "reason" TEXT NOT NULL,
    "detail" TEXT,
    "status" "AbuseStatus" NOT NULL DEFAULT 'open',
    "assigned_to" TEXT,
    "resolved_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "abuse_reports_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "webhook_events" (
    "id" TEXT NOT NULL,
    "provider" TEXT NOT NULL,
    "event_type" TEXT NOT NULL,
    "payload" JSONB NOT NULL,
    "processed" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "webhook_events_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "draft_orders" (
    "id" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "email" TEXT,
    "state" JSONB NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "draft_orders_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE INDEX "accounts_user_id_idx" ON "accounts"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "accounts_provider_provider_account_id_key" ON "accounts"("provider", "provider_account_id");

-- CreateIndex
CREATE UNIQUE INDEX "sessions_session_token_key" ON "sessions"("session_token");

-- CreateIndex
CREATE INDEX "sessions_user_id_idx" ON "sessions"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "verification_tokens_token_key" ON "verification_tokens"("token");

-- CreateIndex
CREATE UNIQUE INDEX "verification_tokens_identifier_token_key" ON "verification_tokens"("identifier", "token");

-- CreateIndex
CREATE UNIQUE INDEX "occasions_slug_key" ON "occasions"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "packages_slug_key" ON "packages"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "package_prices_package_id_currency_key" ON "package_prices"("package_id", "currency");

-- CreateIndex
CREATE UNIQUE INDEX "voice_talents_slug_key" ON "voice_talents"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "voice_talents_user_id_key" ON "voice_talents"("user_id");

-- CreateIndex
CREATE INDEX "voice_samples_talent_id_idx" ON "voice_samples"("talent_id");

-- CreateIndex
CREATE UNIQUE INDEX "recipients_phone_e164_key" ON "recipients"("phone_e164");

-- CreateIndex
CREATE UNIQUE INDEX "orders_public_token_key" ON "orders"("public_token");

-- CreateIndex
CREATE UNIQUE INDEX "orders_payment_intent_id_key" ON "orders"("payment_intent_id");

-- CreateIndex
CREATE INDEX "orders_status_scheduled_start_idx" ON "orders"("status", "scheduled_start");

-- CreateIndex
CREATE INDEX "orders_buyer_email_idx" ON "orders"("buyer_email");

-- CreateIndex
CREATE INDEX "call_attempts_order_id_idx" ON "call_attempts"("order_id");

-- CreateIndex
CREATE UNIQUE INDEX "keepsakes_order_id_key" ON "keepsakes"("order_id");

-- CreateIndex
CREATE UNIQUE INDEX "keepsakes_slug_key" ON "keepsakes"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "do_not_call_phone_e164_key" ON "do_not_call"("phone_e164");

-- CreateIndex
CREATE INDEX "consent_records_order_id_idx" ON "consent_records"("order_id");

-- CreateIndex
CREATE INDEX "abuse_reports_status_idx" ON "abuse_reports"("status");

-- CreateIndex
CREATE UNIQUE INDEX "webhook_events_provider_id_key" ON "webhook_events"("provider", "id");

-- CreateIndex
CREATE UNIQUE INDEX "draft_orders_token_key" ON "draft_orders"("token");

-- CreateIndex
CREATE INDEX "draft_orders_email_idx" ON "draft_orders"("email");

-- AddForeignKey
ALTER TABLE "accounts" ADD CONSTRAINT "accounts_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sessions" ADD CONSTRAINT "sessions_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "package_occasions" ADD CONSTRAINT "package_occasions_package_id_fkey" FOREIGN KEY ("package_id") REFERENCES "packages"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "package_occasions" ADD CONSTRAINT "package_occasions_occasion_id_fkey" FOREIGN KEY ("occasion_id") REFERENCES "occasions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "package_prices" ADD CONSTRAINT "package_prices_package_id_fkey" FOREIGN KEY ("package_id") REFERENCES "packages"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "voice_talents" ADD CONSTRAINT "voice_talents_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "voice_samples" ADD CONSTRAINT "voice_samples_talent_id_fkey" FOREIGN KEY ("talent_id") REFERENCES "voice_talents"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "voice_samples" ADD CONSTRAINT "voice_samples_occasion_id_fkey" FOREIGN KEY ("occasion_id") REFERENCES "occasions"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "orders" ADD CONSTRAINT "orders_recipient_id_fkey" FOREIGN KEY ("recipient_id") REFERENCES "recipients"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "orders" ADD CONSTRAINT "orders_occasion_id_fkey" FOREIGN KEY ("occasion_id") REFERENCES "occasions"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "orders" ADD CONSTRAINT "orders_package_id_fkey" FOREIGN KEY ("package_id") REFERENCES "packages"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "orders" ADD CONSTRAINT "orders_talent_id_fkey" FOREIGN KEY ("talent_id") REFERENCES "voice_talents"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "call_briefs" ADD CONSTRAINT "call_briefs_order_id_fkey" FOREIGN KEY ("order_id") REFERENCES "orders"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "call_briefs" ADD CONSTRAINT "call_briefs_reviewed_by_fkey" FOREIGN KEY ("reviewed_by") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "call_attempts" ADD CONSTRAINT "call_attempts_order_id_fkey" FOREIGN KEY ("order_id") REFERENCES "orders"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "keepsakes" ADD CONSTRAINT "keepsakes_order_id_fkey" FOREIGN KEY ("order_id") REFERENCES "orders"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "consent_records" ADD CONSTRAINT "consent_records_order_id_fkey" FOREIGN KEY ("order_id") REFERENCES "orders"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "abuse_reports" ADD CONSTRAINT "abuse_reports_assigned_to_fkey" FOREIGN KEY ("assigned_to") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
