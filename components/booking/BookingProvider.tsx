"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { Brief, Consent, Moment, Recipient } from "@/lib/validation/schemas";

export interface BookingDraft {
  occasionSlug: string | null;
  recipient: Partial<Recipient>;
  brief: Partial<Brief>;
  moment: Moment | null;
  packageSlug: string | null;
  consent: Consent;
}

export const TOTAL_STEPS = 6;
const STORAGE_KEY = "peesmile_booking_draft";

const EMPTY_DRAFT: BookingDraft = {
  occasionSlug: null,
  recipient: {},
  brief: {},
  moment: null,
  packageSlug: null,
  consent: {
    recordingConsent: false,
    buyerAttestation: false,
    whatsappOptIn: false,
  },
};

interface BookingContextValue {
  step: number;
  totalSteps: number;
  draft: BookingDraft;
  hydrated: boolean;
  setStep: (step: number) => void;
  goNext: () => void;
  goBack: () => void;
  setOccasion: (slug: string | null) => void;
  setRecipient: (recipient: Partial<Recipient>) => void;
  setBrief: (brief: Partial<Brief>) => void;
  setMoment: (moment: Moment | null) => void;
  setPackage: (slug: string | null) => void;
  setConsent: (consent: Consent) => void;
  resetDraft: () => void;
}

const BookingContext = createContext<BookingContextValue | null>(null);

export function useBooking(): BookingContextValue {
  const ctx = useContext(BookingContext);
  if (!ctx) {
    throw new Error("useBooking must be used inside a BookingProvider.");
  }
  return ctx;
}

export function BookingProvider({ children }: { children: ReactNode }) {
  const [step, setStep] = useState(0);
  const [draft, setDraft] = useState<BookingDraft>(EMPTY_DRAFT);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as Partial<BookingDraft>;
        setDraft((prev) => ({
          ...prev,
          ...parsed,
          recipient: { ...prev.recipient, ...parsed.recipient },
          brief: { ...prev.brief, ...parsed.brief },
          consent: { ...prev.consent, ...parsed.consent },
        }));
      }
    } catch {
      // Corrupt or unavailable draft. Start fresh.
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(draft));
    } catch {
      // Storage unavailable. Non-fatal.
    }
  }, [draft, hydrated]);

  const setOccasion = useCallback((slug: string | null) => {
    setDraft((prev) => ({ ...prev, occasionSlug: slug }));
  }, []);

  const setRecipient = useCallback((recipient: Partial<Recipient>) => {
    setDraft((prev) => ({ ...prev, recipient: { ...prev.recipient, ...recipient } }));
  }, []);

  const setBrief = useCallback((brief: Partial<Brief>) => {
    setDraft((prev) => ({ ...prev, brief: { ...prev.brief, ...brief } }));
  }, []);

  const setMoment = useCallback((moment: Moment | null) => {
    setDraft((prev) => ({ ...prev, moment }));
  }, []);

  const setPackage = useCallback((slug: string | null) => {
    setDraft((prev) => ({ ...prev, packageSlug: slug }));
  }, []);

  const setConsent = useCallback((consent: Consent) => {
    setDraft((prev) => ({ ...prev, consent }));
  }, []);

  const goNext = useCallback(() => {
    setStep((current) => Math.min(current + 1, TOTAL_STEPS - 1));
  }, []);

  const goBack = useCallback(() => {
    setStep((current) => Math.max(current - 1, 0));
  }, []);

  const resetDraft = useCallback(() => {
    setDraft(EMPTY_DRAFT);
    setStep(0);
    try {
      window.localStorage.removeItem(STORAGE_KEY);
    } catch {
      // Ignore.
    }
  }, []);

  const value = useMemo<BookingContextValue>(
    () => ({
      step,
      totalSteps: TOTAL_STEPS,
      draft,
      hydrated,
      setStep,
      goNext,
      goBack,
      setOccasion,
      setRecipient,
      setBrief,
      setMoment,
      setPackage,
      setConsent,
      resetDraft,
    }),
    [
      step,
      draft,
      hydrated,
      goNext,
      goBack,
      setOccasion,
      setRecipient,
      setBrief,
      setMoment,
      setPackage,
      setConsent,
      resetDraft,
    ]
  );

  return <BookingContext.Provider value={value}>{children}</BookingContext.Provider>;
}