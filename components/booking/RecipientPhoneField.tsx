"use client";

import { useEffect, useState } from "react";
import {
  getCountryCallingCode,
  parsePhoneNumberFromString,
  type CountryCode,
} from "libphonenumber-js";
import { Input } from "@/components/primitives/Input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/primitives/Select";
import { getPrimaryTimezoneForCountry } from "@/lib/timezone";

const CURATED_COUNTRIES: CountryCode[] = [
  "NG", "GH", "KE", "ZA", "EG",
  "US", "CA", "GB", "IE", "DE", "FR", "ES", "IT", "NL", "PT",
  "AU", "NZ", "JP", "IN", "SG", "AE", "BR", "MX",
];

const regionNames =
  typeof Intl !== "undefined" && "DisplayNames" in Intl
    ? new Intl.DisplayNames(["en"], { type: "region" })
    : null;

export interface PhoneParseResult {
  phoneE164: string;
  phoneCountry: string;
  timezone: string;
  isValid: boolean;
}

interface RecipientPhoneFieldProps {
  initialPhoneE164?: string;
  initialCountry?: string;
  onResult: (result: PhoneParseResult) => void;
}

export function RecipientPhoneField({
  initialPhoneE164,
  initialCountry = "NG",
  onResult,
}: RecipientPhoneFieldProps) {
  const [country, setCountry] = useState<CountryCode>((initialCountry || "NG") as CountryCode);
  const [phoneInput, setPhoneInput] = useState(() => {
    if (!initialPhoneE164) return "";
    const parsed = parsePhoneNumberFromString(initialPhoneE164);
    return parsed ? parsed.formatNational() : initialPhoneE164;
  });

  useEffect(() => {
    const parsed = parsePhoneNumberFromString(phoneInput, country);
    const isValid = Boolean(parsed && parsed.isValid());
    onResult({
      phoneE164: isValid && parsed ? parsed.number : "",
      phoneCountry: country,
      timezone: getPrimaryTimezoneForCountry(country),
      isValid,
    });
  }, [phoneInput, country, onResult]);

  return (
    <div className="flex gap-2">
      <Select value={country} onValueChange={(value) => setCountry(value as CountryCode)}>
        <SelectTrigger className="w-36 shrink-0" aria-label="Country code">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {CURATED_COUNTRIES.map((code) => (
            <SelectItem key={code} value={code}>
              {regionNames?.of(code) ?? code} +{getCountryCallingCode(code)}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Input
        type="tel"
        inputMode="tel"
        autoComplete="tel-national"
        placeholder="Phone number"
        value={phoneInput}
        onChange={(event) => setPhoneInput(event.target.value)}
      />
    </div>
  );
}