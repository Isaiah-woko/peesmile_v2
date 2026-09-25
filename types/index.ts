import type {
  Order,
  OrderStatus,
  CallBrief,
  CallAttempt,
  Keepsake,
  KeepsakeVisibility,
  Recipient,
  Occasion,
  Package,
  PackagePrice,
  VoiceTalent,
  VoiceSample,
  ToneLevel,
  CallOutcome,
} from "@prisma/client";

export type {
  Order,
  OrderStatus,
  CallBrief,
  CallAttempt,
  Keepsake,
  KeepsakeVisibility,
  Recipient,
  Occasion,
  Package,
  PackagePrice,
  VoiceTalent,
  VoiceSample,
  ToneLevel,
  CallOutcome,
};

// Integer minor units only. No floats touch a price.
declare const minorUnitBrand: unique symbol;
export type Money = number & { readonly [minorUnitBrand]: "minor-units" };

export function toMinorUnits(amount: number, decimals: 2 | 0): Money {
  const factor = decimals === 0 ? 1 : 100;
  return Math.round(amount * factor) as Money;
}

export function addMoney(a: Money, b: Money): Money {
  return (a + b) as Money;
}

export function multiplyMoney(amount: Money, quantity: number): Money {
  return Math.round(amount * quantity) as Money;
}

export function formatMinorUnits(amount: number, currency: string): string {
  return new Intl.NumberFormat("en", { style: "currency", currency }).format(
    amount / 100
  );
}