"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { useLang } from "@/components/LangProvider";
import {
  IconSpeaker, IconBook, IconUser, IconPlay, IconArrowRight, IconSearch,
} from "@/components/icons";

type Audio = {
  id: string;
  titre_fr: string;
  titre_ar: string | null;
  titre_en: string | null;
  audio_url: string;
  duree: number | null;
  savant_id: string | null;
  langue: string;
};

type Savant = { id: string; nom_fr: string; slug: string; categorie: string };

export default function AudioClient() {
  const { t, lang } = useLang();
  const [audios, setAudios] = useState<Audio[]>([]);
  const [savants, setSavants] = useState<Savant[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [playingId, setPlayingId] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const [a, s] = await Promise.all([
          supabase.from("audios").select("*").order("created_at", { ascending: false }).limit(50),
          supabase.from("savants").select("id, nom_fr, slug, categorie"),
        ]);
        setAudios(a.data || []);
        setSavants(s.data || []);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const getTitre = (a: Audio) =>
    lang === "ar" ? a.titre_ar || a.titre_fr
      : lang === "en" ? a.titre_en || a.titre_fr
      : a.titre_fr;

  const getSavant = (id: string | null) =>
    savants.find((s) => s.id === id);

  const formatDuree = (s: number | null) => {
    if (!s) return "—";
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${m}:${sec < 10 ? "0" : ""}${sec}`;
  };

  const filtered = audios.filter((a) => {
    if (!search.trim()) return true;
    const q = search.toLowerCase();
    const savant = getSavant(a.savant_id);
    return (
      a.titre_fr?.toLowerCase().includes(q) ||
      a.titre_ar?.includes(search) ||
      savant?.nom_fr?.toLowerCase().includes(q)
    );
  });

  const categories = [
    { id: "savants", title: "Par nos Savants", Icon: IconBook, color: "emerald", href: "/audio/savants" },
    { id: "oustaz",  title: "Par nos Oustaz",  Icon: IconUser, color: "terracotta", href: "/audio/oustaz" },
    { id: "coran",   title: "Coran",           Icon: IconSpeaker, color: "gold", href: "/audio/coran" },
  ] as const;

  const colorMap: Record<string, { bg: string; text: string }> = {
    emerald:    { bg: "bg-emerald/10",    text: "text-emerald" },
    gold:       { bg: "bg-gold/15",       text: "text-gold" },
    terracotta: { bg: "bg-terracotta/10", text: "text-terracotta" },
  };

  return (
    <main className="px-[6%] pt-24 pb-40 max-w-[1200px] mx-auto">

      <Link href="/dashboard" className="text-emerald text-sm font-semibold hover:underline">
        ← Retour
      </Link>

      {/* En-tête */}
      <div className="mt-6 mb-12">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-12 h-12 rounded-2xl bg-gold/15 flex items-center justify-center text-gold">
            <IconSpeaker size={24} />
          </div>
          <div className="text-xs font-bold text-gold uppercase tracking-[3px]">
            Bibliothèque
          </div>
        </div>
        <h1 className="font-amiri font-bold text-emerald-dark text-4xl sm:text-5xl mb-3">
          {t.audio.title}
        </h1>
        <p className="text-gray-500 max-w-2xl">{t.audio.subtitle}</p>
      </div>

      {/* Catégories principales */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-12">
        {categories.map(({ id, title, Icon, color, href }) => {
          const c = colorMap[color];
          return (
            <Link key={id} href={href}
              className="bg-white rounded-3xl p-6 flex items-center gap-4
                         border border-emerald/5 hover:-translate-y-1
                         hover:shadow-[0_20px_40px_rgba(13,92,74,0.1)]
                         transition-all no-underline group">
              <div className={`w-14 h-14 rounded-2xl flex items-center justify-center
                              ${c.bg} ${c.text} group-hover:scale-110 transition`}>
                <Icon size={26} />
              </div>
              <div className="flex-1">
                <div className="font-bold text-emerald-dark text-base">{title}</div>
                <div className="text-xs text-gray-500 mt-0.5">
                  {savants.filter(s => s.categorie === id).length} contenu(s)
                </div>
              </div>
              <span className="text-gray-300 group-hover:text-emerald transition">
                <IconArrowRight size={18} />
              </span>
            </Link>
          );
        })}
      </div>

      {/* Titre section audios */}
      <div className="flex items-center justify-between flex-wrap gap-3 mb-6">
        <div>
          <h2 className="font-amiri font-bold text-emerald-dark text-2xl">
            Tous les audios
          </h2>
          <p className="text-gray-500 text-sm">
            {filtered.length} audio{filtered.length > 1 ? "s" : ""}
          </p>
        </div>
      </div>

      {/* Recherche */}
      <div className="relative mb-6">
        <div className="absolute left-5 top-1/2 -translate-y-1/2 text-emerald/50 pointer-events-none">
          <IconSearch size={18} />
        </div>
        <input
          type="text"
          placeholder="Rechercher un audio ou un savant..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-14 pr-5 py-4 rounded-2xl border-2 border-emerald/10
                     focus:border-gold outline-none text-sm bg-white
                     shadow-[0_4px_14px_rgba(13,92,74,0.05)]"
        />
        {search && (
          <button onClick={() => setSearch("")}
            className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-400
                       hover:text-terracotta transition text-xl leading-none">
            ×
          </button>
        )}
      </div>

      {/* Liste des audios */}
      {loading ? (
        <p className="text-gray-400">Chargement...</p>
      ) : filtered.length === 0 ? (
        <div className="bg-white rounded-3xl p-16 text-center border border-emerald/5">
          <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-emerald/10 flex items-center justify-center text-emerald">
            <IconSpeaker size={28} />
          </div>
          <p className="text-gray-400 mb-2">Aucun audio pour le moment</p>
          <Link href="/admin/audios"
            className="text-emerald text-sm font-semibold hover:underline">
            + Ajouter un audio (admin)
          </Link>
        </div>
      ) : (
        <div className="grid gap-3">
          {filtered.map((a) => {
            const savant = getSavant(a.savant_id);
            return (
              <div key={a.id}
                className="bg-white rounded-2xl border border-emerald/5
                           hover:border-emerald/15
                           hover:shadow-[0_10px_30px_rgba(13,92,74,0.08)]
                           transition overflow-hidden">
                <div className="flex items-center gap-4 p-4">
                  <button
                    onClick={() => setPlayingId(playingId === a.id ? null : a.id)}
                    className="w-12 h-12 rounded-full bg-gold flex items-center justify-center
                                shadow-[0_4px_14px_rgba(212,175,55,0.35)] shrink-0
                                hover:scale-110 transition">
                    {playingId === a.id ? (
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="#083d31">
                        <path d="M6 4h4v16H6zM14 4h4v16h-4z"/>
                      </svg>
                    ) : (
                      <IconPlay size={14} />
                    )}
                  </button>

                  <div className="flex-1 min-w-0">
                    <div className="font-semibold text-emerald-dark text-sm truncate">
                      {getTitre(a)}
                    </div>
                    {savant && (
                      <Link href={`/audio/savants/detail?slug=${savant.slug}`}
                        className="text-xs text-gold hover:underline truncate block">
                        {savant.nom_fr}
                      </Link>
                    )}
                  </div>

                  <div className="text-xs text-gray-400 shrink-0 hidden sm:block">
                    {formatDuree(a.duree)}
                  </div>

                  {savant && (
                    <Link href={`/audio/savants/detail?slug=${savant.slug}`}
                      className="text-gray-300 hover:text-emerald transition shrink-0 hidden sm:block">
                      <IconArrowRight size={16} />
                    </Link>
                  )}
                </div>

                {playingId === a.id && (
                  <div className="px-4 pb-4 border-t border-emerald/10 pt-3">
                    <audio src={a.audio_url} controls autoPlay className="w-full" />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </main>
  );
}