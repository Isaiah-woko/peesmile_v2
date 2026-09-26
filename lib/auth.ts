import NextAuth from "next-auth";
import Resend from "next-auth/providers/resend";
import { PrismaAdapter } from "@auth/prisma-adapter";
import type { Adapter } from "next-auth/adapters";
import { prisma } from "@/lib/prisma";
import { authConfig } from "@/lib/auth.config";

const EMAIL_FROM = process.env.EMAIL_FROM ?? "PeeSmile <hello@peesmile.com>";

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma) as Adapter,
  ...authConfig,
  providers: [
    Resend({
      from: EMAIL_FROM,
      async sendVerificationRequest({ identifier: email, url }) {
        const knownUser = await prisma.user.findFirst({
          where: { email: { equals: email, mode: "insensitive" } },
          select: { id: true },
        });

        // Only a seeded user can receive a magic link.
        // Returning silently avoids revealing whether an email exists.
        if (!knownUser) {
          return;
        }

        const apiKey = process.env.RESEND_API_KEY;
        if (!apiKey) {
          throw new Error("RESEND_API_KEY is not set. Add it to .env.local.");
        }

        const response = await fetch("https://api.resend.com/emails", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${apiKey}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            from: EMAIL_FROM,
            to: email,
            subject: "Sign in to PeeSmile",
            html: [
              "<p>Someone requested a sign-in link for the PeeSmile dashboard.</p>",
              `<p><a href="${url}">Click here to sign in.</a></p>`,
              "<p>If you did not request this, you can ignore this email.</p>",
            ].join(""),
            text: `Sign in to PeeSmile: ${url}`,
          }),
        });

        if (!response.ok) {
          throw new Error("Could not send the verification email.");
        }
      },
    }),
  ],
});