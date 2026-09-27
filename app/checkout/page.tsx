import type { Metadata } from "next";

export const metadata: Metadata = { title: "Checkout" };

export default function CheckoutPage() {
  return (
    <div className="mx-auto w-full max-w-3xl px-6 py-24 text-center">
      <p className="mono-label text-body-small text-ember">Checkout</p>
      <h1 className="display-serif text-display-4 mt-3 text-ink">
        Almost there.
      </h1>
      <p className="text-body-0 text-ink-soft measure mx-auto mt-4">
        Payment lands in Phase 4. Your call brief is safe, and nothing is
        charged yet.
      </p>
    </div>
  );
}