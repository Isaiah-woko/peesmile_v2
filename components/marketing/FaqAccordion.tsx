"use client";

import * as Accordion from "@radix-ui/react-accordion";
import { CaretDownIcon } from "@phosphor-icons/react";

export interface FaqItem {
  question: string;
  answer: string;
}

export function FaqAccordion({ items }: { items: FaqItem[] }) {
  return (
    <Accordion.Root
      type="single"
      collapsible
      className="divide-y divide-rule border-y border-rule"
    >
      {items.map((item, index) => (
        <Accordion.Item key={index} value={`item-${index}`}>
          <Accordion.Header>
            <Accordion.Trigger className="group flex w-full items-center justify-between gap-4 py-5 text-left text-body-0 font-medium text-ink transition-colors duration-120ms hover:text-ember">
              {item.question}
              <CaretDownIcon
                weight="regular"
                size={16}
                className="shrink-0 text-ash transition-transform duration-120ms group-data-[state=open]:rotate-180"
              />
            </Accordion.Trigger>
          </Accordion.Header>
          <Accordion.Content className="overflow-hidden pb-5 text-body-0 text-ink-soft data-[state=open]:animate-[accordion-open_180ms_ease-out]">
            {item.answer}
          </Accordion.Content>
        </Accordion.Item>
      ))}
    </Accordion.Root>
  );
}