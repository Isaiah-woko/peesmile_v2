"use client";

import { PauseIcon, PlayIcon, PlayPauseIcon } from "@phosphor-icons/react";import { useAudio } from "./AudioProvider";
import { Waveform } from "./Waveform";
import { formatDuration } from "@/lib/format";
import { cn } from "@/lib/utils";

export interface SamplePlayerProps {
  id: string;
  src: string;
  title: string;
  caption?: string;
  peaks: number[];
  durationMs: number;
  className?: string;
}

export function SamplePlayer({
  id,
  src,
  title,
  caption,
  peaks,
  durationMs,
  className,
}: SamplePlayerProps) {
  const { activeId, isPlaying, toggle } = useAudio();
  const playing = activeId === id && isPlaying;
  const durationSec = durationMs / 1000;

  return (
    <div className={cn("rounded-md border border-rule bg-paper p-4", className)}>
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={() => toggle(id, src)}
          aria-label={playing ? `Pause ${title}` : `Play ${title}`}
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md border border-rule text-ink transition-colors duration-120ms hover:bg-bone"
        >
          {playing ? (
            <PauseIcon weight="regular" size={16} />
          ) : (
            <PlayIcon weight="regular" size={16} />
          )}
        </button>
        <div className="min-w-0 flex-1">
          <Waveform id={id} src={src} peaks={peaks} duration={durationSec} />
        </div>
      </div>

      <div className="mt-3 flex items-baseline justify-between gap-2">
        <p className="truncate text-body-small font-medium text-ink">{title}</p>
        <p className="mono-label text-body-small text-ash">
          {formatDuration(durationSec)}
        </p>
      </div>

      {caption ? (
        <p className="mt-1 text-body-small text-ash">{caption}</p>
      ) : null}
    </div>
  );
}