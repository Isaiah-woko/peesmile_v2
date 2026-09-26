export const CURRENCIES = {
  NGN: { symbol: "₦", decimals: 2, label: "Nigerian Naira" },
  USD: { symbol: "$", decimals: 2, label: "US Dollar" },
  GBP: { symbol: "£", decimals: 2, label: "British Pound" },
  EUR: { symbol: "€", decimals: 2, label: "Euro" },
  CAD: { symbol: "CA$", decimals: 2, label: "Canadian Dollar" },
  AUD: { symbol: "A$", decimals: 2, label: "Australian Dollar" },
  ZAR: { symbol: "R", decimals: 2, label: "South African Rand" },
  KES: { symbol: "KSh", decimals: 2, label: "Kenyan Shilling" },
  GHS: { symbol: "₵", decimals: 2, label: "Ghanaian Cedi" },
  JPY: { symbol: "¥", decimals: 0, label: "Japanese Yen" },
} as const;

export type CurrencyCode = keyof typeof CURRENCIES;

export const CURRENCY_COOKIE = "ps_currency";

const COUNTRY_TO_CURRENCY: Record<string, CurrencyCode> = {
  NG: "NGN",
  US: "USD",
  GB: "GBP",
  DE: "EUR",
  FR: "EUR",
  IT: "EUR",
  ES: "EUR",
  NL: "EUR",
  BE: "EUR",
  AT: "EUR",
  IE: "EUR",
  PT: "EUR",
  FI: "EUR",
  GR: "EUR",
  CA: "CAD",
  AU: "AUD",
  ZA: "ZAR",
  KE: "KES",
  GH: "GHS",
  JP: "JPY",
};

export function getDefaultCurrencyForCountry(
  country: string | undefined | null
): CurrencyCode {
  if (!country) return "USD";
  return COUNTRY_TO_CURRENCY[country.toUpperCase()] ?? "USD";
}

export function detectCurrencyFromHeaders(headers: Headers): CurrencyCode {
  const country = headers.get("x-vercel-ip-country");
  return getDefaultCurrencyForCountry(country);
}

export function isCurrencyCode(value: string): value is CurrencyCode {
  return value in CURRENCIES;
}

export function formatAmount(minorUnits: number, currency: CurrencyCode): string {
  const { symbol, decimals } = CURRENCIES[currency];
  const value = decimals === 0 ? minorUnits : minorUnits / 100;
  const formatted = new Intl.NumberFormat("en", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(value);
  return `${symbol}${formatted}`;
}

export function setCurrencyCookie(code: CurrencyCode): void {
  if (typeof document === "undefined") return;
  const oneYear = 60 * 60 * 24 * 365;
  document.cookie = `${CURRENCY_COOKIE}=${code}; path=/; max-age=${oneYear}; samesite=lax`;
}

export function getCurrencyCookie(): CurrencyCode | null {
  if (typeof document === "undefined") return null;
  const match = document.cookie.match(new RegExp(`(?:^|; )${CURRENCY_COOKIE}=([^;]*)`));
  if (!match) return null;
  const code = decodeURIComponent(match[1]);
  return isCurrencyCode(code) ? code : null;
}