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

export function getTimezoneOffsetMinutes(date: Date, timezone: string): number {
  try {
    const dtf = new Intl.DateTimeFormat("en-US", {
      timeZone: timezone,
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false,
    });
    const parts = dtf.formatToParts(date);
    const map: Record<string, string> = {};
    for (const part of parts) {
      map[part.type] = part.value;
    }
    const asUtc = Date.UTC(
      Number(map.year),
      Number(map.month) - 1,
      Number(map.day),
      Number(map.hour) % 24,
      Number(map.minute),
      Number(map.second)
    );
    return Math.round((asUtc - date.getTime()) / 60000);
  } catch {
    return 0;
  }
}

export function zonedTimeToUtc(
  year: number,
  monthIndex: number,
  day: number,
  hour: number,
  minute: number,
  timezone: string
): Date {
  const asUtc = Date.UTC(year, monthIndex, day, hour, minute);
  const offset = getTimezoneOffsetMinutes(new Date(asUtc), timezone);
  let result = asUtc - offset * 60000;
  const secondPass = getTimezoneOffsetMinutes(new Date(result), timezone);
  if (secondPass !== offset) {
    result = asUtc - secondPass * 60000;
  }
  return new Date(result);
}

export function getDatePartsInTimezone(
  date: Date,
  timezone: string
): { year: number; month: number; day: number } {
  try {
    const parts = new Intl.DateTimeFormat("en-US", {
      timeZone: timezone,
      year: "numeric",
      month: "numeric",
      day: "numeric",
    }).formatToParts(date);
    const get = (type: string) =>
      Number(parts.find((part) => part.type === type)?.value ?? 0);
    return { year: get("year"), month: get("month"), day: get("day") };
  } catch {
    return {
      year: date.getUTCFullYear(),
      month: date.getUTCMonth() + 1,
      day: date.getUTCDate(),
    };
  }
}

export interface DayOption {
  year: number;
  monthIndex: number;
  day: number;
  label: string;
}

export function getUpcomingDays(timezone: string, count: number): DayOption[] {
  const base = getDatePartsInTimezone(new Date(), timezone);
  const options: DayOption[] = [];
  for (let offset = 0; offset < count; offset++) {
    const target = new Date(Date.UTC(base.year, base.month - 1, base.day + offset, 12));
    const year = target.getUTCFullYear();
    const monthIndex = target.getUTCMonth();
    const day = target.getUTCDate();
    let label: string;
    try {
      label = new Intl.DateTimeFormat("en", {
        timeZone: timezone,
        weekday: "short",
        month: "short",
        day: "numeric",
      }).format(target);
    } catch {
      label = `${year}-${monthIndex + 1}-${day}`;
    }
    options.push({ year, monthIndex, day, label });
  }
  return options;
}