"use client";

import {
  memo,
  useCallback,
  useEffect,
  useRef,
  useState,
  type KeyboardEvent,
  type PointerEvent,
} from "react";
import { useAudio } from "./AudioProvider";
import { formatDuration } from "@/lib/format";
import { cn } from "@/lib/utils";

const Bars = memo(function Bars({
  peaks,
  barClassName,
}: {
  peaks: number[];
  barClassName: string;
}) {
  return (
    <div className="flex h-full w-full items-center gap-0.5">
      {peaks.map((peak, index) => (
        <div
          key={index}
          className={cn("flex-1 rounded-[1px]", barClassName)}
          style={{ height: `${Math.max(peak * 100, 6)}%` }}
        />
      ))}
    </div>
  );
});

export interface WaveformProps {
  id: string;
  src: string;
  peaks: number[];
  duration: number;
  className?: string;
}

export function Waveform({ id, src, peaks, duration, className }: WaveformProps) {
  const { activeId, isPlaying, play, pause, seek, getTime } = useAudio();
  const isActive = activeId === id;
  const playing = isActive && isPlaying;
  const [progress, setProgress] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const scrubbingRef = useRef(false);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    if (!playing) return;

    const tick = () => {
      const time = getTime();
      setProgress(duration > 0 ? Math.min(time / duration, 1) : 0);
      rafRef.current = requestAnimationFrame(tick);
    };

    rafRef.current = requestAnimationFrame(tick);
    return () => {
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
    };
  }, [playing, duration, getTime]);

  useEffect(() => {
    if (!isActive) setProgress(0);
  }, [isActive]);

  const fractionFromClientX = useCallback((clientX: number): number => {
    const el = containerRef.current;
    if (!el) return 0;
    const rect = el.getBoundingClientRect();
    if (rect.width === 0) return 0;
    return Math.min(Math.max((clientX - rect.left) / rect.width, 0), 1);
  }, []);

  const scrubTo = useCallback(
    (clientX: number) => {
      const time = fractionFromClientX(clientX) * duration;
      seek(time);
    },
    [fractionFromClientX, duration, seek]
  );

  const handlePointerDown = useCallback(
    (event: PointerEvent<HTMLDivElement>) => {
      event.currentTarget.setPointerCapture(event.pointerId);
      scrubbingRef.current = true;
      const time = fractionFromClientX(event.clientX) * duration;
      play(id, src, time);
    },
    [fractionFromClientX, duration, play, id, src]
  );

  const handlePointerMove = useCallback(
    (event: PointerEvent<HTMLDivElement>) => {
      if (!scrubbingRef.current) return;
      scrubTo(event.clientX);
    },
    [scrubTo]
  );

  const endScrub = useCallback(() => {
    scrubbingRef.current = false;
  }, []);

  const handleKeyDown = useCallback(
    (event: KeyboardEvent<HTMLDivElement>) => {
      const base = isActive ? getTime() : 0;

      if (event.key === " ") {
        event.preventDefault();
        if (playing) {
          pause();
        } else {
          play(id, src, base);
        }
      } else if (event.key === "ArrowRight") {
        event.preventDefault();
        play(id, src, Math.min(base + 5, duration));
      } else if (event.key === "ArrowLeft") {
        event.preventDefault();
        play(id, src, Math.max(base - 5, 0));
      }
    },
    [isActive, getTime, playing, pause, play, id, src, duration]
  );

  const currentTime = progress * duration;

  return (
    <div
      ref={containerRef}
      role="slider"
      tabIndex={0}
      aria-label="Audio position"
      aria-valuemin={0}
      aria-valuemax={Math.round(duration)}
      aria-valuenow={Math.round(currentTime)}
      aria-valuetext={formatDuration(currentTime)}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={endScrub}
      onPointerCancel={endScrub}
      onKeyDown={handleKeyDown}
      className={cn(
        "relative h-12 w-full cursor-pointer select-none touch-none",
        className
      )}
    >
      <Bars peaks={peaks} barClassName="bg-rule" />
      <div
        className="absolute inset-0 overflow-hidden"
        style={{ width: `${progress * 100}%` }}
      >
        <Bars peaks={peaks} barClassName="bg-ember" />
      </div>
    </div>
  );
}