export const metadata = { title: "Check your email" };

export default function VerifyRequestPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-paper px-6">
      <div className="w-full max-w-sm">
        <p className="mono-label text-body-small text-ash">PeeSmile Admin</p>
        <h1 className="display-serif text-display-4 mt-3">Check your email</h1>
        <p className="text-body-0 text-ink-soft measure mt-3">
          We sent a one-time sign-in link to your inbox. Click it to open the
          dashboard. The link expires after a short window.
        </p>
      </div>
    </main>
  );
}