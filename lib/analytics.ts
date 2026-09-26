import posthog from "posthog-js";

export type AnalyticsEvent =
  | "hero_cta_click"
  | "keepsake_sample_play"
  | "wizard_start"
  | "wizard_step_complete"
  | "voice_preview_play"
  | "tone_dial_change"
  | "moment_preset_click"
  | "wizard_abandon"
  | "checkout_view"
  | "payment_method_select"
  | "purchase"
  | "tracker_view"
  | "keepsake_view"
  | "keepsake_share"
  | "rebook_click";

export function track(
  event: AnalyticsEvent,
  properties?: Record<string, unknown>
): void {
  if (typeof window === "undefined") return;
  if (!process.env.NEXT_PUBLIC_POSTHOG_KEY) return;
  posthog.capture(event, properties);
}