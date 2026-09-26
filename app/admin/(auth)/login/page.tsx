import { Button } from "@/components/primitives/Button";
import { Field } from "@/components/primitives/Field";
import { Input } from "@/components/primitives/Input";
import { sendMagicLink } from "./actions";

export const metadata = { title: "Sign in" };

export default function AdminLoginPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-paper px-6">
      <div className="w-full max-w-sm">
        <p className="mono-label text-body-small text-ash">PeeSmile Admin</p>
        <h1 className="display-serif text-display-4 mt-3">Sign in</h1>
        <p className="text-body-0 text-ink-soft measure mt-3">
          Enter the owner email. We will send a one-time link.
        </p>

        <form action={sendMagicLink} className="mt-8 flex flex-col gap-4">
          <input type="hidden" name="callbackUrl" value="/admin" />
          <Field label="Email" required>
            <Input
              type="email"
              name="email"
              autoComplete="email"
              placeholder="owner@peesmile.com"
              required
            />
          </Field>
          <Button type="submit" size="lg">
            Send magic link
          </Button>
        </form>
      </div>
    </main>
  );
}