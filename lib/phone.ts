import { parsePhoneNumberFromString, type CountryCode } from "libphonenumber-js";

export function isValidE164(value: string): boolean {
  try {
    const parsed = parsePhoneNumberFromString(value);
    return parsed ? parsed.isValid() : false;
  } catch {
    return false;
  }
}

export function toE164(value: string, country?: string): string | null {
  try {
    const parsed = parsePhoneNumberFromString(value, country as CountryCode | undefined);
    return parsed && parsed.isValid() ? parsed.number : null;
  } catch {
    return null;
  }
}

export function getCountryForPhone(value: string): string | null {
  try {
    const parsed = parsePhoneNumberFromString(value);
    return parsed?.country ?? null;
  } catch {
    return null;
  }
}

export function formatPhoneForDisplay(value: string): string {
  try {
    const parsed = parsePhoneNumberFromString(value);
    return parsed ? parsed.formatInternational() : value;
  } catch {
    return value;
  }
}