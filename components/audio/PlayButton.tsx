"use client";

import { Pause, Play } from "@phosphor-icons/react";
import { useAudio } from "./AudioProvider";
import { cn } from "@/lib/utils";

interface PlayButtonProps {
  id: string;
  src: string;
  label: string;
  className?: string;
}

export function PlayButton({ id, src, label, className }: PlayButtonProps) {
  const { activeId, isPlaying, toggle } = useAudio();
  const playing = activeId === id && isPlaying;

  return (
    <button
      type="button"
      onClick={() => toggle(id, src)}
      aria-label={playing ? `Pause ${label}` : `Play ${label}`}
      className={cn(
        "flex h-10 w-10 shrink-0 items-center justify-center rounded-md border border-rule text-ink transition-colors duration-120ms hover:bg-bone",
        className
      )}
    >
      {playing ? (
        <Pause weight="regular" size={16} />
      ) : (
        <Play weight="regular" size={16} />
      )}
    </button>
  );
}