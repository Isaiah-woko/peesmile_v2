import type { ReactNode } from "react";

interface LegalPageProps {
  title: string;
  lastUpdated: string;
  children: ReactNode;
}

export function LegalPage({ title, lastUpdated, children }: LegalPageProps) {
  return (
    <div className="mx-auto w-full max-w-3xl px-6 py-16">
      <p className="mono-label text-body-small text-ash">Legal</p>
      <h1 className="display-serif text-display-4 mt-3 text-ink">{title}</h1>
      <p className="mono-label text-body-small text-ash mt-2">Last updated {lastUpdated}</p>
      <div className="mt-10 space-y-10">{children}</div>
    </div>
  );
}