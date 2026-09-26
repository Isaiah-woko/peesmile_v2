import Link from "next/link";
import { CurrencySwitcher } from "./CurrencySwitcher";
import { FOOTER_EXPLORE, FOOTER_LEGAL } from "@/lib/nav";

export function Footer() {
  return (
    <footer className="border-t border-rule bg-bone">
      <div className="mx-auto w-full max-w-6xl px-6 py-16">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-4">
          <div className="md:col-span-2">
            <p className="display-serif text-title-2 text-ink">PeeSmile</p>
            <p className="text-body-small text-ink-soft measure mt-3">
              A real human calls the person you love, at the exact minute that
              matters, and says the thing you cannot quite get out.
            </p>
            <a
              href="mailto:hello@peesmile.com"
              className="text-body-small text-ember mt-4 inline-block hover:text-ember-deep"
            >
              hello@peesmile.com
            </a>
          </div>

          <div>
            <p className="mono-label text-body-small text-ash">Explore</p>
            <ul className="mt-4 flex flex-col gap-3">
              {FOOTER_EXPLORE.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-body-small text-ink-soft transition-colors duration-120ms hover:text-ink"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="mono-label text-body-small text-ash">Legal</p>
            <ul className="mt-4 flex flex-col gap-3">
              {FOOTER_LEGAL.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-body-small text-ink-soft transition-colors duration-120ms hover:text-ink"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-col gap-4 border-t border-rule pt-6 md:flex-row md:items-center md:justify-between">
          <p className="mono-label text-body-small text-ash">
            © 2026 PeeSmile. Every call is human.
          </p>
          <CurrencySwitcher />
        </div>
      </div>
    </footer>
  );
}