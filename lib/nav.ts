export interface NavLink {
  label: string;
  href: string;
}

export const NAV_LINKS: NavLink[] = [
  { label: "How it works", href: "/how-it-works" },
  { label: "Occasions", href: "/occasions" },
  { label: "Pricing", href: "/pricing" },
  { label: "Trust", href: "/trust" },
  { label: "FAQ", href: "/faq" },
];

export const FOOTER_EXPLORE: NavLink[] = [
  { label: "How it works", href: "/how-it-works" },
  { label: "Occasions", href: "/occasions" },
  { label: "Pricing", href: "/pricing" },
  { label: "FAQ", href: "/faq" },
];

export const FOOTER_LEGAL: NavLink[] = [
  { label: "Trust and Safety", href: "/trust" },
  { label: "Recording Consent", href: "/legal/recording-consent" },
  { label: "Terms of Service", href: "/legal/terms" },
  { label: "Privacy Policy", href: "/legal/privacy" },
];