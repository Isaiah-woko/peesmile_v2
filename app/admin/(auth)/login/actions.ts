"use server";

import { signIn } from "@/lib/auth";
import { AuthError } from "next-auth";
import { redirect } from "next/navigation";

export async function sendMagicLink(formData: FormData): Promise<void> {
  try {
    await signIn("resend", formData);
  } catch (error) {
    if (error instanceof AuthError) {
      redirect("/admin/login?error=send_failed");
    }
    // Redirect errors are rethrown so Next.js performs the navigation.
    throw error;
  }
}