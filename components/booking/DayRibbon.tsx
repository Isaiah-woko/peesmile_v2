"use client";

import { useCallback, useRef, type KeyboardEvent, type PointerEvent } from "react";

interface DayRibbonProps {
  valueMinutes: number;
  onChange: (minutes: number) => void;
  quietStartHour?: number;
  quietEndHour?: number;
}

export function DayRibbon({
  valueMinutes,
  onChange,
  quietStartHour = 22,
  quietEndHour = 8,
}: DayRibbonProps) {
  const trackRef = useRef<HTMLDivElement>(null);
  const draggingRef = useRef(false);

  const minutesFromClientX = useCallback(
    (clientX: number): number => {
      const el = trackRef.current;
      if (!el) return valueMinutes;
      const rect = el.getBoundingClientRect();
      if (rect.width === 0) return valueMinutes;
      const fraction = Math.min(Math.max((clientX - rect.left) / rect.width, 0), 1);
      return Math.round(fraction * 1439);
    },
    [valueMinutes]
  );

  const handlePointerDown = useCallback(
    (event: PointerEvent<HTMLDivElement>) => {
      event.currentTarget.setPointerCapture(event.pointerId);
      draggingRef.current = true;
      onChange(minutesFromClientX(event.clientX));
    },
    [minutesFromClientX, onChange]
  );

  const handlePointerMove = useCallback(
    (event: PointerEvent<HTMLDivElement>) => {
      if (!draggingRef.current) return;
      onChange(minutesFromClientX(event.clientX));
    },
    [minutesFromClientX, onChange]
  );

  const endDrag = useCallback(() => {
    draggingRef.current = false;
  }, []);

  const handleKeyDown = useCallback(
    (event: KeyboardEvent<HTMLDivElement>) => {
      let delta = 0;
      if (event.key === "ArrowRight") delta = 15;
      else if (event.key === "ArrowLeft") delta = -15;
      else if (event.key === "ArrowUp") delta = 60;
      else if (event.key === "ArrowDown") delta = -60;
      else return;
      event.preventDefault();
      onChange(Math.min(Math.max(valueMinutes + delta, 0), 1439));
    },
    [valueMinutes, onChange]
  );

  const markerLeft = (valueMinutes / 1439) * 100;
  const quietStartPct = (quietStartHour / 24) * 100;
  const quietEndPct = (quietEndHour / 24) * 100;

  return (
    <div>
      <div
        ref={trackRef}
        role="slider"
        tabIndex={0}
        aria-label="Time of day in their time zone"
        aria-valuemin={0}
        aria-valuemax={1439}
        aria-valuenow={valueMinutes}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={endDrag}
        onPointerCancel={endDrag}
        onKeyDown={handleKeyDown}
        className="relative h-10 w-full cursor-pointer touch-none select-none rounded-sm border border-rule bg-paper"
      >
        <div
          className="absolute inset-y-0 bg-bone"
          style={{ left: `${quietStartPct}%`, right: 0 }}
        />
        <div
          className="absolute inset-y-0 bg-bone"
          style={{ left: 0, width: `${quietEndPct}%` }}
        />
        {Array.from({ length: 25 }).map((_, index) => (
          <div
            key={index}
            className="absolute inset-y-0 w-px bg-rule"
            style={{ left: `${(index / 24) * 100}%` }}
          />
        ))}
        <div
          className="absolute inset-y-0 w-0.5 bg-ember"
          style={{ left: `${markerLeft}%` }}
        />
      </div>
      <div className="mt-2 flex justify-between">
        <span className="mono-label text-body-small text-ash">12am</span>
        <span className="mono-label text-body-small text-ash">6am</span>
        <span className="mono-label text-body-small text-ash">12pm</span>
        <span className="mono-label text-body-small text-ash">6pm</span>
        <span className="mono-label text-body-small text-ash">12am</span>
      </div>
    </div>
  );
}