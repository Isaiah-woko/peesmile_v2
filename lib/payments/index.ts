import type { PaymentProvider } from "./provider";
import { bachsProvider } from "./bachs";

export function getPaymentProvider(): PaymentProvider {
  return bachsProvider;
}

export type { PaymentProvider } from "./provider";