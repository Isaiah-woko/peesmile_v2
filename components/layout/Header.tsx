import Link from "next/link";
import { Button } from "@/components/primitives/Button";
import { NAV_LINKS } from "@/lib/nav";
import { MobileNav } from "./MobileNav";

export function Header() {
  return (
    <header className="sticky top-0 z-40 border-b border-rule bg-paper">
      <div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between px-6">
        <Link href="/" className="display-serif text-title-1 text-ink">
          PeeSmile
        </Link>

        <nav className="hidden items-center gap-8 md:flex" aria-label="Primary">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-body-small text-ink-soft transition-colors duration-[120ms] hover:text-ink"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <Button asChild size="sm" className="hidden md:inline-flex">
            <Link href="/book">Book a call</Link>
          </Button>
          <MobileNav />
        </div>
      </div>
    </header>
  );
}