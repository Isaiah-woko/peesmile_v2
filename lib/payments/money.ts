import { CURRENCIES, type CurrencyCode } from "@/lib/currency";

export function getCurrencyDecimals(currency: string): number {
  const entry = CURRENCIES[currency as CurrencyCode];
  return entry ? entry.decimals : 2;
}

// Internal minor units to Bachs decimal string.
// Example: 3250000 kobo (NGN) becomes "32500.00".
export function minorToDecimalString(minorUnits: number, currency: string): string {
  const decimals = getCurrencyDecimals(currency);
  const safeAmount = Math.max(0, Math.floor(minorUnits));

  if (decimals === 0) {
    return String(safeAmount);
  }

  const factor = 10 ** decimals;
  const whole = Math.floor(safeAmount / factor);
  const fractional = safeAmount % factor;
  return `${whole}.${String(fractional).padStart(decimals, "0")}`;
}

// Bachs decimal string to internal minor units.
// Example: "32500.00" (NGN) becomes 3250000 kobo.
export function decimalStringToMinor(decimalString: string, currency: string): number {
  const decimals = getCurrencyDecimals(currency);

  if (decimals === 0) {
    const value = parseInt(decimalString, 10);
    return Number.isFinite(value) ? Math.max(0, value) : 0;
  }

  const factor = 10 ** decimals;
  const [rawWhole, rawFractional = ""] = decimalString.split(".");
  const whole = parseInt(rawWhole, 10);
  const safeWhole = Number.isFinite(whole) ? whole : 0;

  const normalizedFractional = rawFractional.padEnd(decimals, "0").slice(0, decimals);
  const fractional = parseInt(normalizedFractional, 10);
  const safeFractional = Number.isFinite(fractional) ? fractional : 0;

  return Math.max(0, safeWhole * factor + safeFractional);
}