"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/primitives/Select";
import {
  CURRENCIES,
  getCurrencyCookie,
  setCurrencyCookie,
  type CurrencyCode,
} from "@/lib/currency";

const codes = Object.keys(CURRENCIES) as CurrencyCode[];

export function CurrencySwitcher() {
  const router = useRouter();
  const [value, setValue] = useState<CurrencyCode>("USD");

  useEffect(() => {
    const stored = getCurrencyCookie();
    if (stored) setValue(stored);
  }, []);

  const handleChange = (next: string) => {
    const code = next as CurrencyCode;
    setValue(code);
    setCurrencyCookie(code);
    router.refresh();
  };

  return (
    <div className="flex items-center gap-2">
      <span className="mono-label text-body-small text-ash">Currency</span>
      <Select value={value} onValueChange={handleChange}>
        <SelectTrigger className="h-9 w-24" aria-label="Select currency">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {codes.map((code) => (
            <SelectItem key={code} value={code}>
              {code}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}