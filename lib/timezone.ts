const COUNTRY_TIMEZONES: Record<string, string[]> = {
  NG: ["Africa/Lagos"],
  GH: ["Africa/Accra"],
  KE: ["Africa/Nairobi"],
  ZA: ["Africa/Johannesburg"],
  EG: ["Africa/Cairo"],
  US: ["America/New_York", "America/Chicago", "America/Denver", "America/Los_Angeles"],
  CA: ["America/Toronto", "America/Vancouver", "America/Edmonton"],
  GB: ["Europe/London"],
  IE: ["Europe/Dublin"],
  DE: ["Europe/Berlin"],
  FR: ["Europe/Paris"],
  ES: ["Europe/Madrid"],
  IT: ["Europe/Rome"],
  NL: ["Europe/Amsterdam"],
  BE: ["Europe/Brussels"],
  PT: ["Europe/Lisbon"],
  AU: ["Australia/Sydney", "Australia/Melbourne", "Australia/Perth"],
  NZ: ["Pacific/Auckland"],
  JP: ["Asia/Tokyo"],
  IN: ["Asia/Kolkata"],
  SG: ["Asia/Singapore"],
  AE: ["Asia/Dubai"],
  BR: ["America/Sao_Paulo"],
  MX: ["America/Mexico_City"],
};

export function getTimezonesForCountry(country: string | undefined | null): string[] {
  if (!country) return ["UTC"];
  const zones = COUNTRY_TIMEZONES[country.toUpperCase()];
  return zones && zones.length > 0 ? zones : ["UTC"];
}

export function getPrimaryTimezoneForCountry(country: string | undefined | null): string {
  return getTimezonesForCountry(country)[0];
}

export const COMMON_TIMEZONES: string[] = [
  "Africa/Lagos",
  "Africa/Accra",
  "Africa/Nairobi",
  "Africa/Johannesburg",
  "Europe/London",
  "Europe/Paris",
  "Europe/Berlin",
  "America/New_York",
  "America/Chicago",
  "America/Denver",
  "America/Los_Angeles",
  "America/Toronto",
  "Asia/Dubai",
  "Asia/Kolkata",
  "Asia/Tokyo",
  "Australia/Sydney",
  "UTC",
];

export function isValidTimezone(timezone: string): boolean {
  try {
    new Intl.DateTimeFormat("en", { timeZone: timezone });
    return true;
  } catch {
    return false;
  }
}

export function formatTimeInTimezone(date: Date, timezone: string): string {
  try {
    return new Intl.DateTimeFormat("en", {
      timeZone: timezone,
      hour: "2-digit",
      minute: "2-digit",
    }).format(date);
  } catch {
    return "";
  }
}

export function formatDayInTimezone(date: Date, timezone: string): string {
  try {
    return new Intl.DateTimeFormat("en", {
      timeZone: timezone,
      weekday: "short",
      month: "short",
      day: "numeric",
    }).format(date);
  } catch {
    return "";
  }
}