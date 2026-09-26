import type { NextAuthConfig } from "next-auth";

export const authConfig = {
  trustHost: true,
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/admin/login",
    verifyRequest: "/admin/verify-request",
    error: "/admin/login",
  },
  providers: [],
} satisfies NextAuthConfig;