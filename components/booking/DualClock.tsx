"use client";

import { useEffect, useState } from "react";

interface ClockTime {
  hours: number;
  minutes: number;
  seconds: number;
}

function getTimeInTimezone(date: Date, timezone: string): ClockTime {
  try {
    const parts = new Intl.DateTimeFormat("en-GB", {
      timeZone: timezone,
      hour: "numeric",
      minute: "numeric",
      second: "numeric",
      hour12: false,
    }).formatToParts(date);
    const get = (type: string) =>
      Number(parts.find((part) => part.type === type)?.value ?? 0);
    return { hours: get("hour") % 24, minutes: get("minute"), seconds: get("second") };
  } catch {
    return { hours: 0, minutes: 0, seconds: 0 };
  }
}

interface ClockFaceProps {
  label: string;
  timezoneLabel: string;
  time: ClockTime;
  showSecondHand: boolean;
}

function ClockFace({ label, timezoneLabel, time, showSecondHand }: ClockFaceProps) {
  const hourAngle = ((time.hours % 12) + time.minutes / 60) * 30;
  const minuteAngle = (time.minutes + time.seconds / 60) * 6;
  const secondAngle = time.seconds * 6;

  return (
    <div className="flex flex-col items-center gap-2">
      <svg viewBox="0 0 100 100" className="h-24 w-24" aria-hidden="true">
        <circle cx="50" cy="50" r="46" fill="none" stroke="var(--color-rule)" strokeWidth="2" />
        {Array.from({ length: 12 }).map((_, index) => {
          const angle = (index * 30 * Math.PI) / 180;
          const x1 = 50 + 40 * Math.sin(angle);
          const y1 = 50 - 40 * Math.cos(angle);
          const x2 = 50 + 44 * Math.sin(angle);
          const y2 = 50 - 44 * Math.cos(angle);
          return (
            <line
              key={index}
              x1={x1}
              y1={y1}
              x2={x2}
              y2={y2}
              stroke="var(--color-ash)"
              strokeWidth="1.5"
            />
          );
        })}
        <line
          x1="50" y1="50" x2="50" y2="28"
          stroke="var(--color-ink)" strokeWidth="3" strokeLinecap="round"
          transform={`rotate(${hourAngle} 50 50)`}
        />
        <line
          x1="50" y1="50" x2="50" y2="18"
          stroke="var(--color-ink)" strokeWidth="2" strokeLinecap="round"
          transform={`rotate(${minuteAngle} 50 50)`}
        />
        {showSecondHand ? (
          <line
            x1="50" y1="50" x2="50" y2="14"
            stroke="var(--color-ember)" strokeWidth="1" strokeLinecap="round"
            transform={`rotate(${secondAngle} 50 50)`}
          />
        ) : null}
        <circle cx="50" cy="50" r="2.5" fill="var(--color-ember)" />
      </svg>
      <p className="mono-label text-body-small text-ink">{label}</p>
      <p className="mono-label text-body-small text-ash">{timezoneLabel}</p>
    </div>
  );
}

interface DualClockProps {
  recipientTimezone: string;
}

export function DualClock({ recipientTimezone }: DualClockProps) {
  const [now, setNow] = useState<Date | null>(null);
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    setNow(new Date());
    const intervalId = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(intervalId);
  }, []);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReducedMotion(mediaQuery.matches);
    const handler = (event: MediaQueryListEvent) => setReducedMotion(event.matches);
    mediaQuery.addEventListener("change", handler);
    return () => mediaQuery.removeEventListener("change", handler);
  }, []);

  if (!now) {
    return (
      <div className="flex items-center justify-center gap-10">
        <div className="h-24 w-24 rounded-full bg-bone" />
        <div className="h-24 w-24 rounded-full bg-bone" />
      </div>
    );
  }

  const buyerTime: ClockTime = {
    hours: now.getHours(),
    minutes: now.getMinutes(),
    seconds: now.getSeconds(),
  };
  const recipientTime = getTimeInTimezone(now, recipientTimezone);

  let buyerTimezone = "your time";
  try {
    buyerTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  } catch {
    // Keep the fallback label.
  }

  return (
    <div className="flex items-center justify-center gap-10">
      <ClockFace
        label="You"
        timezoneLabel={buyerTimezone}
        time={buyerTime}
        showSecondHand={!reducedMotion}
      />
      <ClockFace
        label="Them"
        timezoneLabel={recipientTimezone}
        time={recipientTime}
        showSecondHand={!reducedMotion}
      />
    </div>
  );
}