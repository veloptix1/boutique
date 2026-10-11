"use client";
import { useEffect, useRef, useState, useCallback } from "react";
import { IconPlay, IconArrowRight } from "./icons";

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

export default function AudioPlayerFull() {
  const [player, setPlayer] = useState<Player | null>(null);
  const [playing, setPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [expanded, setExpanded] = useState(false);
  const [playbackRate, setPlaybackRate] = useState(1);
  const [loop, setLoop] = useState(false);
  const [showOptions, setShowOptions] = useState(false);
  const [loading, setLoading] = useState(false);

  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    globalSetPlayer = setPlayer;
    return () => { globalSetPlayer = null; };
  }, []);

  useEffect(() => {
    if (!player || !audioRef.current) return;
    setLoading(true);
    audioRef.current.src = player.url;
    audioRef.current.playbackRate = playbackRate;
    audioRef.current.loop = loop;
    audioRef.current
      .play()
      .then(() => { setPlaying(true); setLoading(false); })
      .catch(() => { setLoading(false); });
  }, [player]);

  useEffect(() => {
    if (audioRef.current) audioRef.current.playbackRate = playbackRate;
  }, [playbackRate]);

  useEffect(() => {
    if (audioRef.current) audioRef.current.loop = loop;
  }, [loop]);

  const togglePlay = useCallback(() => {
    if (!audioRef.current) return;
    if (playing) audioRef.current.pause();
    else audioRef.current.play();
    setPlaying(!playing);
  }, [playing]);

  const seek = (newTime: number) => {
    if (!audioRef.current) return;
    audioRef.current.currentTime = newTime;
    setProgress(newTime);
  };

  const skip = (seconds: number) => {
    if (!audioRef.current) return;
    const newTime = Math.max(0, Math.min(duration, audioRef.current.currentTime + seconds));
    audioRef.current.currentTime = newTime;
    setProgress(newTime);
  };

  const close = () => {
    audioRef.current?.pause();
    setPlayer(null);
    setPlaying(false);
    setProgress(0);
    setDuration(0);
    setExpanded(false);
    setShowOptions(false);
  };

  const formatTime = (s: number) => {
    if (!s || isNaN(s)) return "0:00";
    const m = Math.floor(s / 60);
    const sec = Math.floor(s % 60);
    return `${m}:${sec < 10 ? "0" : ""}${sec}`;
  };

  const progressPercent = duration ? (progress / duration) * 100 : 0;

  if (!player) return null;

  // ═══════════════════════════════════════
  // VUE MINI (barre compacte)
  // ═══════════════════════════════════════
  if (!expanded) {
    return (
      <div
        className="fixed left-0 right-0 z-[940] px-3 pointer-events-none"
        style={{ bottom: "calc(90px + env(safe-area-inset-bottom))" }}
      >
        <div
          className="max-w-[600px] mx-auto bg-gradient-to-r from-emerald-dark to-emerald
                     rounded-2xl shadow-[0_20px_40px_rgba(0,0,0,0.3)]
                     overflow-hidden pointer-events-auto cursor-pointer"
          onClick={() => setExpanded(true)}
        >
          {/* Barre de progression */}
          <div className="h-1 bg-white/10">
            <div
              className="h-full bg-gold transition-all"
              style={{ width: `${progressPercent}%` }}
            />
          </div>

          <div className="flex items-center gap-3 p-3">
            {/* Pochette */}
            <div className="w-11 h-11 rounded-full bg-gold flex items-center justify-center
                            shrink-0 shadow-md">
              {loading ? (
                <div className="w-4 h-4 rounded-full border-2 border-emerald-dark/30 border-t-emerald-dark animate-spin" />
              ) : playing ? (
                <div className="flex items-end gap-[2px] h-3">
                  <span className="w-[2px] h-full bg-emerald-dark animate-pulse" />
                  <span className="w-[2px] h-2/3 bg-emerald-dark animate-pulse" style={{ animationDelay: "0.2s" }} />
                  <span className="w-[2px] h-full bg-emerald-dark animate-pulse" style={{ animationDelay: "0.4s" }} />
                </div>
              ) : (
                <IconPlay size={14} />
              )}
            </div>

            {/* Titre + auteur */}
            <div className="flex-1 min-w-0">
              <div className="font-semibold text-white text-xs sm:text-sm truncate">
                {player.titre}
              </div>
              <div className="text-[0.68rem] text-gold truncate">
                {player.auteur}
              </div>
            </div>

            {/* Boutons rapides */}
            <button
              onClick={(e) => { e.stopPropagation(); togglePlay(); }}
              className="w-10 h-10 rounded-full bg-white/15 hover:bg-white/25
                         flex items-center justify-center transition shrink-0"
            >
              {playing ? (
                <svg width="14" height="14" viewBox="0 0 24 24" fill="#fff">
                  <path d="M6 4h4v16H6zM14 4h4v16h-4z"/>
                </svg>
              ) : (
                <IconPlay size={14} color="#fff" />
              )}
            </button>

            <button
              onClick={(e) => { e.stopPropagation(); close(); }}
              className="w-8 h-8 rounded-full bg-white/10 text-white/70
                         hover:bg-terracotta hover:text-white transition shrink-0
                         flex items-center justify-center text-lg leading-none"
            >
              ×
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ═══════════════════════════════════════
  // VUE PLEIN ÉCRAN
  // ═══════════════════════════════════════
  return (
    <div className="fixed inset-0 z-[999] bg-gradient-to-b from-emerald-dark via-emerald to-[#0a4a3c]
                    flex flex-col">

      {/* Motif islamique */}
      <div
        className="absolute inset-0 opacity-[0.06] pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='80' height='80' viewBox='0 0 80 80' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M40 0 L80 40 L40 80 L0 40 Z' fill='none' stroke='%23d4af37' stroke-width='1'/%3E%3C/svg%3E")`,
        }}
      />

      {/* En-tête */}
      <div className="relative z-10 px-5 pt-6 pb-4 flex items-center justify-between shrink-0">
        <button
          onClick={() => setExpanded(false)}
          className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20
                     flex items-center justify-center text-white transition"
          aria-label="Réduire"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none"
               stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
            <path d="M6 9l6 6 6-6"/>
          </svg>
        </button>

        <div className="text-center flex-1 mx-3">
          <div className="text-[0.65rem] font-bold text-gold uppercase tracking-widest">
            En cours de lecture
          </div>
        </div>

        <button
          onClick={close}
          className="w-10 h-10 rounded-full bg-white/10 hover:bg-terracotta
                     flex items-center justify-center text-white transition text-xl leading-none"
          aria-label="Fermer"
        >
          ×
        </button>
      </div>

      {/* Pochette centrale */}
      <div className="relative z-10 flex-1 flex flex-col items-center justify-center px-8 py-4 min-h-0">
        <div className="relative w-full max-w-[280px] aspect-square mb-8">
          {/* Cercle extérieur doré */}
          <div className="absolute inset-0 rounded-[32px] bg-gradient-to-br from-gold/30 to-gold/5
                          blur-2xl" />

          {/* Pochette */}
          <div className="relative w-full h-full rounded-[32px] overflow-hidden
                          shadow-[0_30px_60px_rgba(0,0,0,0.4)]
                          border-4 border-gold/30
                          bg-gradient-to-br from-gold to-gold-light
                          flex items-center justify-center">
            {/* Logo AL BASIRAH */}
            <div className="flex flex-col items-center gap-4">
              <img
                src="/logo.png"
                alt="AL BASIRAH"
                className="w-32 h-32 object-contain"
                onError={(e) => {
                  e.currentTarget.style.display = "none";
                }}
              />
              <div className="font-amiri text-emerald-dark text-2xl font-bold">
                ﷽
              </div>
            </div>

            {/* Animation quand ça joue */}
            {playing && (
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2
                              flex items-end gap-1 h-6">
                {[0, 1, 2, 3, 4].map((i) => (
                  <span
                    key={i}
                    className="w-1 bg-emerald-dark rounded-full animate-pulse"
                    style={{
                      height: `${8 + (i % 3) * 6}px`,
                      animationDelay: `${i * 0.15}s`,
                    }}
                  />
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Titre + auteur */}
        <div className="w-full max-w-[400px] text-center mb-6">
          <h2 className="font-amiri font-bold text-white text-xl sm:text-2xl leading-tight mb-2
                         line-clamp-2">
            {player.titre}
          </h2>
          <p className="text-gold text-sm">{player.auteur}</p>
        </div>

        {/* Barre de progression */}
        <div className="w-full max-w-[400px]">
          <input
            type="range"
            min={0}
            max={duration || 0}
            value={progress}
            onChange={(e) => seek(Number(e.target.value))}
            className="w-full h-1 appearance-none bg-white/15 rounded-full
                       cursor-pointer accent-gold
                       [&::-webkit-slider-thumb]:appearance-none
                       [&::-webkit-slider-thumb]:w-3.5
                       [&::-webkit-slider-thumb]:h-3.5
                       [&::-webkit-slider-thumb]:rounded-full
                       [&::-webkit-slider-thumb]:bg-gold
                       [&::-webkit-slider-thumb]:cursor-pointer
                       [&::-webkit-slider-thumb]:shadow-md"
            style={{
              background: `linear-gradient(to right, #d4af37 ${progressPercent}%, rgba(255,255,255,0.15) ${progressPercent}%)`,
            }}
          />
          <div className="flex justify-between text-xs text-white/60 mt-2">
            <span>{formatTime(progress)}</span>
            <span>{formatTime(duration)}</span>
          </div>
        </div>
      </div>

      {/* Contrôles principaux */}
      <div className="relative z-10 px-6 pb-6 shrink-0">

        {/* Boutons secondaires */}
        <div className="flex items-center justify-center gap-4 mb-5">
          {/* Vitesse */}
          <button
            onClick={() => setPlaybackRate((r) => (r === 1 ? 1.25 : r === 1.25 ? 1.5 : r === 1.5 ? 2 : r === 2 ? 0.75 : 1))}
            className="px-3 py-1.5 rounded-full bg-white/10 hover:bg-white/20
                       text-white text-xs font-bold transition min-w-[56px]"
          >
            {playbackRate}×
          </button>

          {/* Loop */}
          <button
            onClick={() => setLoop(!loop)}
            className={`w-10 h-10 rounded-full flex items-center justify-center transition
              ${loop ? "bg-gold text-emerald-dark" : "bg-white/10 text-white hover:bg-white/20"}`}
            aria-label="Répéter"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
                 stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M17 1l4 4-4 4"/>
              <path d="M3 11V9a4 4 0 014-4h14"/>
              <path d="M7 23l-4-4 4-4"/>
              <path d="M21 13v2a4 4 0 01-4 4H3"/>
            </svg>
          </button>
        </div>

        {/* Contrôles de lecture */}
        <div className="flex items-center justify-center gap-5">
          {/* -10s */}
          <button
            onClick={() => skip(-10)}
            className="w-12 h-12 rounded-full bg-white/10 hover:bg-white/20
                       flex items-center justify-center text-white transition relative"
            aria-label="Reculer de 10 secondes"
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none"
                 stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M11 17l-5-5 5-5"/>
              <path d="M18 17l-5-5 5-5"/>
            </svg>
          </button>

          {/* Play/Pause principal */}
          <button
            onClick={togglePlay}
            className="w-20 h-20 rounded-full bg-gold hover:bg-gold-light
                       flex items-center justify-center shadow-[0_15px_40px_rgba(212,175,55,0.5)]
                       transition hover:scale-105 active:scale-95"
            aria-label={playing ? "Pause" : "Play"}
          >
            {loading ? (
              <div className="w-8 h-8 rounded-full border-4 border-emerald-dark/30
                              border-t-emerald-dark animate-spin" />
            ) : playing ? (
              <svg width="28" height="28" viewBox="0 0 24 24" fill="#083d31">
                <path d="M6 4h4v16H6zM14 4h4v16h-4z"/>
              </svg>
            ) : (
              <svg width="28" height="28" viewBox="0 0 24 24" fill="#083d31">
                <path d="M8 5v14l11-7z"/>
              </svg>
            )}
          </button>

          {/* +10s */}
          <button
            onClick={() => skip(10)}
            className="w-12 h-12 rounded-full bg-white/10 hover:bg-white/20
                       flex items-center justify-center text-white transition relative"
            aria-label="Avancer de 10 secondes"
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none"
                 stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M13 17l5-5-5-5"/>
              <path d="M6 17l5-5-5-5"/>
            </svg>
          </button>
        </div>
      </div>

      {/* Audio HTML caché */}
      <audio
        ref={audioRef}
        src={player.url}
        src={player.url}
        onTimeUpdate={(e) => setProgress(e.currentTarget.currentTime)}
        onLoadedMetadata={(e) => setDuration(e.currentTarget.duration)}
        onEnded={() => setPlaying(false)}
      />
    </div>
  );
}
