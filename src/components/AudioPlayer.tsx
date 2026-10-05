"use client";
import { useEffect, useRef, useState } from "react";
import { IconPlay } from "./icons";

type Player = {
  url: string;
  titre: string;
  auteur: string;
};

let globalSetPlayer: ((p: Player | null) => void) | null = null;

export function playAudio(player: Player) {
  globalSetPlayer?.(player);
}

export function stopAudio() {
  globalSetPlayer?.(null);
}

export default function AudioPlayer() {
  const [player, setPlayer] = useState<Player | null>(null);
  const [playing, setPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    globalSetPlayer = setPlayer;
    return () => { globalSetPlayer = null; };
  }, []);

  useEffect(() => {
    if (!player || !audioRef.current) return;
    audioRef.current.src = player.url;
    audioRef.current.play().then(() => setPlaying(true)).catch(() => {});
  }, [player]);

  if (!player) return null;

  const togglePlay = () => {
    if (!audioRef.current) return;
    if (playing) audioRef.current.pause();
    else audioRef.current.play();
    setPlaying(!playing);
  };

  const close = () => {
    audioRef.current?.pause();
    setPlayer(null);
    setPlaying(false);
    setProgress(0);
    setDuration(0);
  };

  const formatTime = (s: number) => {
    if (!s || isNaN(s)) return "0:00";
    const m = Math.floor(s / 60);
    const sec = Math.floor(s % 60);
    return `${m}:${sec < 10 ? "0" : ""}${sec}`;
  };

  return (
    <div className="fixed left-0 right-0 z-[940] px-3 pointer-events-none"
         style={{ bottom: "calc(90px + env(safe-area-inset-bottom))" }}>
      <div className="max-w-[600px] mx-auto bg-emerald-dark rounded-3xl
                      shadow-[0_20px_40px_rgba(0,0,0,0.3)]
                      overflow-hidden pointer-events-auto">
        <div className="h-1 bg-white/10">
          <div className="h-full bg-gold transition-all"
               style={{ width: `${duration ? (progress / duration) * 100 : 0}%` }} />
        </div>
        <div className="flex items-center gap-3 p-3">
          <button onClick={togglePlay}
            className="w-11 h-11 rounded-full bg-gold flex items-center justify-center
                       hover:scale-105 transition shrink-0">
            {playing ? (
              <svg width="14" height="14" viewBox="0 0 24 24" fill="#083d31">
                <path d="M6 4h4v16H6zM14 4h4v16h-4z"/>
              </svg>
            ) : (
              <IconPlay size={14} />
            )}
          </button>
          <div className="flex-1 min-w-0">
            <div className="font-semibold text-white text-xs sm:text-sm truncate">
              {player.titre}
            </div>
            <div className="text-[0.65rem] sm:text-xs text-gold truncate">
              {player.auteur}
            </div>
          </div>
          <div className="text-[0.65rem] text-white/60 hidden sm:block shrink-0">
            {formatTime(progress)} / {formatTime(duration)}
          </div>
          <button onClick={close}
            className="w-8 h-8 rounded-full bg-white/10 text-white/60
                       hover:bg-terracotta hover:text-white transition shrink-0
                       flex items-center justify-center text-lg leading-none">
            ×
          </button>
        </div>
        <audio
          ref={audioRef}
          onTimeUpdate={(e) => setProgress(e.currentTarget.currentTime)}
          onLoadedMetadata={(e) => setDuration(e.currentTarget.duration)}
          onEnded={() => setPlaying(false)}
        />
      </div>
    </div>
  );
}
