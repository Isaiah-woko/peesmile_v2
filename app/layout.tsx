import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/react";
import { gambetta, switzer, jetbrainsMono } from "./fonts";
import { AudioProvider } from "@/components/audio/AudioProvider";
import { PostHogProvider } from "@/components/providers/PostHogProvider";
import "./globals.css";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "PeeSmile",
    template: "%s · PeeSmile",
  },
  description:
    "A real human calls the person you love, at the exact minute that matters, and says the thing you cannot quite get out.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={`${gambetta.variable} ${switzer.variable} ${jetbrainsMono.variable}`}
    >
      <body>
        <PostHogProvider>
          <AudioProvider>{children}</AudioProvider>
        </PostHogProvider>
        <Analytics />
      </body>
    </html>
  );
}