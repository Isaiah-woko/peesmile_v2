"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";

interface AudioProviderValue {
  activeId: string | null;
  isPlaying: boolean;
  play: (id: string, src: string, startTime?: number) => void;
  pause: () => void;
  toggle: (id: string, src: string) => void;
  seek: (time: number) => void;
  getTime: () => number;
}

const AudioContext = createContext<AudioProviderValue | null>(null);

export function useAudio(): AudioProviderValue {
  const ctx = useContext(AudioContext);
  if (!ctx) {
    throw new Error("useAudio must be used inside an AudioProvider.");
  }
  return ctx;
}

export function AudioProvider({ children }: { children: ReactNode }) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const loadedSrcRef = useRef<string | null>(null);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const getAudio = useCallback((): HTMLAudioElement => {
    if (!audioRef.current) {
      const el = new Audio();
      el.preload = "none";
      audioRef.current = el;
    }
    return audioRef.current;
  }, []);

  const pause = useCallback(() => {
    audioRef.current?.pause();
    setIsPlaying(false);
  }, []);

  const play = useCallback(
    (id: string, src: string, startTime = 0) => {
      const audio = getAudio();

      if (loadedSrcRef.current !== src) {
        audio.src = src;
        loadedSrcRef.current = src;
        audio.load();
      }

      setActiveId(id);

      const begin = () => {
        if (startTime > 0) {
          audio.currentTime = startTime;
        }
        audio
          .play()
          .then(() => setIsPlaying(true))
          .catch(() => setIsPlaying(false));
      };

      if (startTime > 0 && audio.readyState < 1) {
        audio.addEventListener("loadedmetadata", begin, { once: true });
      } else {
        begin();
      }
    },
    [getAudio]
  );

  const toggle = useCallback(
    (id: string, src: string) => {
      if (activeId === id && isPlaying) {
        pause();
      } else {
        play(id, src, 0);
      }
    },
    [activeId, isPlaying, pause, play]
  );

  const seek = useCallback((time: number) => {
    const audio = audioRef.current;
    if (!audio) return;
    if (audio.readyState >= 1) {
      audio.currentTime = time;
    }
  }, []);

  const getTime = useCallback((): number => {
    return audioRef.current?.currentTime ?? 0;
  }, []);

  useEffect(() => {
    const audio = getAudio();

    const onPlay = () => setIsPlaying(true);
    const onPause = () => setIsPlaying(false);
    const onEnded = () => {
      setIsPlaying(false);
      setActiveId(null);
      audio.currentTime = 0;
    };

    audio.addEventListener("play", onPlay);
    audio.addEventListener("pause", onPause);
    audio.addEventListener("ended", onEnded);

    return () => {
      audio.removeEventListener("play", onPlay);
      audio.removeEventListener("pause", onPause);
      audio.removeEventListener("ended", onEnded);
    };
  }, [getAudio]);

  const value = useMemo<AudioProviderValue>(
    () => ({ activeId, isPlaying, play, pause, toggle, seek, getTime }),
    [activeId, isPlaying, play, pause, toggle, seek, getTime]
  );

  return <AudioContext.Provider value={value}>{children}</AudioContext.Provider>;
}