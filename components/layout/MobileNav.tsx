"use client";

import { useState } from "react";
import Link from "next/link";
import * as Dialog from "@radix-ui/react-dialog";
import { ListIcon, XIcon } from "@phosphor-icons/react";import { Button } from "@/components/primitives/Button";
import { NAV_LINKS } from "@/lib/nav";

export function MobileNav() {
  const [open, setOpen] = useState(false);

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Trigger asChild>
        <button
          type="button"
          aria-label="Open menu"
          className="flex h-10 w-10 items-center justify-center rounded-md text-ink transition-colors duration-120ms hover:bg-bone md:hidden"
        >
          <ListIcon weight="regular" size={20} />
        </button>
      </Dialog.Trigger>

      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 bg-ink/40 animate-[overlay-fade-in_180ms_ease-out]" />
        <Dialog.Content className="fixed inset-y-0 right-0 z-50 flex w-72 flex-col bg-paper p-6 shadow-2 animate-[drawer-slide-in_180ms_ease-out]">
          <Dialog.Title className="sr-only">Site navigation</Dialog.Title>

          <div className="flex items-center justify-between">
            <span className="display-serif text-title-1 text-ink">PeeSmile</span>
            <Dialog.Close asChild>
              <button
                type="button"
                aria-label="Close menu"
                className="flex h-10 w-10 items-center justify-center rounded-md text-ink transition-colors duration-120ms hover:bg-bone"
              >
                <XIcon weight="regular" size={20} />
              </button>
            </Dialog.Close>
          </div>

          <nav className="mt-10 flex flex-col gap-1" aria-label="Mobile">
            {NAV_LINKS.map((link) => (
              <Dialog.Close asChild key={link.href}>
                <Link
                  href={link.href}
                  className="rounded-md px-3 py-2 text-body-0 text-ink transition-colors duration-120ms hover:bg-bone"
                >
                  {link.label}
                </Link>
              </Dialog.Close>
            ))}
          </nav>

          <div className="mt-auto">
            <Dialog.Close asChild>
              <Button asChild size="lg" className="w-full">
                <Link href="/book">Book a call</Link>
              </Button>
            </Dialog.Close>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}