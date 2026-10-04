"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { IconSearch, IconPlay, IconDownload } from "@/components/icons";

type Sourate = {
  numero: number;
  nom_ar: string;
  nom_fr: string;
  nom_translit: string;
  versets: number;
  type: string;
};

type CoranAudio = {
  id: string;
  sourate_numero: number;
  recitateur_slug: string;
  recitateur_nom: string;
  audio_url: string;
  duree: number | null;
};

export default function CoranClient() {
  const [sourates, setSourates] = useState<Sourate[]>([]);
  const [audios, setAudios] = useState<CoranAudio[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [openMenuFor, setOpenMenuFor] = useState<number | null>(null);
  const [playingId, setPlayingId] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const [s, a] = await Promise.all([
          supabase.from("sourates").select("*").order("numero"),
          supabase.from("coran_audios").select("*"),
        ]);
        setSourates(s.data || []);
        setAudios(a.data || []);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  useEffect(() => {
    document.body.style.overflow = openMenuFor !== null ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [openMenuFor]);

  const filtered = sourates.filter((s) => {
    if (!search.trim()) return true;
    const q = search.toLowerCase();
    return (
      s.nom_fr.toLowerCase().includes(q) ||
      s.nom_translit.toLowerCase().includes(q) ||
      s.nom_ar.includes(search) ||
      String(s.numero) === search
    );
  });

  const getAudiosFor = (numero: number) =>
    audios.filter((a) => a.sourate_numero === numero);

  return (
    <main className="px-[6%] pt-24 pb-40 max-w-[1200px] mx-auto min-h-screen">

      <Link href="/audio" className="text-emerald text-sm font-semibold hover:underline">
        ← Retour
      </Link>

      <div className="mt-6 mb-10">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-12 h-12 rounded-2xl bg-gold/15 flex items-center justify-center text-gold text-2xl font-amiri">
            ﷽
          </div>
          <div className="text-xs font-bold text-gold uppercase tracking-[3px]">
            Le Noble Coran
          </div>
        </div>
        <h1 className="font-amiri font-bold text-emerald-dark text-4xl sm:text-5xl mb-3">
          Coran
        </h1>
        <p className="text-gray-500 max-w-2xl">
          114 sourates — Écoutez, lisez et téléchargez.
        </p>
      </div>

      {/* Recherche */}
      <div className="relative mb-8">
        <div className="absolute left-5 top-1/2 -translate-y-1/2 text-emerald/50 pointer-events-none">
          <IconSearch size={18} />
        </div>
        <input
          type="text"
          placeholder="Rechercher une sourate..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-14 pr-5 py-4 rounded-2xl border-2 border-emerald/10
                     focus:border-gold outline-none text-sm bg-white"
        />
        {search && (
          <button onClick={() => setSearch("")}
            className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-400
                       hover:text-terracotta text-xl leading-none">
            ×
          </button>
        )}
      </div>

      {loading ? (
        <p className="text-gray-400">Chargement...</p>
      ) : (
        <div className="grid gap-3">
          {filtered.map((s) => {
            const audiosSourate = getAudiosFor(s.numero);
            const hasAudio = audiosSourate.length > 0;

            return (
              <div key={s.numero}
                className="bg-white rounded-2xl border border-emerald/5
                           hover:border-emerald/15 transition-all">
                <div className="flex items-center gap-2 sm:gap-4 p-3 sm:p-4">

                  {/* Numéro */}
                  <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-emerald/8
                                  flex items-center justify-center text-emerald font-bold
                                  text-xs sm:text-sm shrink-0">
                    {s.numero}
                  </div>

                  {/* Nom */}
                  <Link href={`/audio/coran/${s.numero}`}
                    className="flex-1 min-w-0 no-underline group">
                    <div className="font-semibold text-emerald-dark text-xs sm:text-sm
                                    truncate group-hover:text-emerald transition">
                      {s.nom_translit} — {s.nom_fr}
                    </div>
                    <div className="flex items-center gap-1.5 sm:gap-2 text-[0.65rem] sm:text-xs
                                    text-gray-500 mt-0.5">
                      <span className="font-amiri" dir="rtl">{s.nom_ar}</span>
                      <span className="hidden sm:inline">·</span>
                      <span className="hidden sm:inline">{s.versets} versets</span>
                    </div>
                  </Link>

                  {/* Menu burger - VISIBLE et STYLÉ */}
                  <button
                    onClick={() => hasAudio && setOpenMenuFor(s.numero)}
                    aria-label={hasAudio ? "Voir les récitateurs" : "Aucun audio"}
                    className={`relative w-10 h-10 sm:w-11 sm:h-11 rounded-xl
                                flex flex-col items-center justify-center gap-[3px]
                                transition shrink-0
                      ${hasAudio
                        ? "bg-emerald text-gold hover:bg-emerald-dark cursor-pointer shadow-md"
                        : "bg-gray-200 text-gray-400 cursor-not-allowed"}`}
                  >
                    <span className="w-4 h-[2px] bg-current rounded" />
                    <span className="w-4 h-[2px] bg-current rounded" />
                    <span className="w-2.5 h-[2px] bg-current rounded self-start ml-3" />

                    {/* Badge nombre de récitateurs */}
                    {hasAudio && (
                      <span className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full
                                       bg-gold text-emerald-dark text-[0.6rem] font-bold
                                       flex items-center justify-center
                                       border-2 border-white">
                        {audiosSourate.length}
                      </span>
                    )}
                  </button>

                  {/* Bouton télécharger */}
                  {hasAudio && (
                    <a
                      href={audiosSourate[0].audio_url}
                      download
                      target="_blank"
                      rel="noopener noreferrer"
                      title="Télécharger"
                      className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-gold/15
                                 hover:bg-gold/25 flex items-center justify-center
                                 text-gold transition shrink-0">
                      <IconDownload size={14} />
                    </a>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Modal récitateurs */}
      {openMenuFor !== null && (
        <div
          className="fixed inset-0 z-[999] bg-black/60 backdrop-blur-sm
                     flex items-end sm:items-center justify-center p-0 sm:p-4"
          onClick={() => setOpenMenuFor(null)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full sm:max-w-md bg-white rounded-t-3xl sm:rounded-3xl
                       max-h-[80vh] overflow-hidden flex flex-col"
          >
            <div className="px-5 py-4 border-b border-emerald/10 flex items-center justify-between shrink-0">
              <div>
                <div className="text-xs font-bold text-gold uppercase tracking-wider">
                  Récitateurs
                </div>
                <div className="text-sm font-semibold text-emerald-dark mt-1">
                  Sourate {openMenuFor}
                </div>
              </div>
              <button
                onClick={() => setOpenMenuFor(null)}
                className="w-9 h-9 rounded-full bg-emerald/8 text-emerald
                           hover:bg-emerald/15 flex items-center justify-center
                           text-xl leading-none shrink-0">
                ×
              </button>
            </div>

            <div className="overflow-y-auto flex-1">
              {getAudiosFor(openMenuFor).map((a) => (
                <div key={a.id} className="border-b border-emerald/5 last:border-0">
                  <button
                    onClick={() => setPlayingId(playingId === a.id ? null : a.id)}
                    className="w-full px-5 py-4 flex items-center gap-3
                               hover:bg-cream transition text-left">
                    <div className="w-10 h-10 rounded-full bg-gold
                                    flex items-center justify-center shrink-0">
                      <IconPlay size={12} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-semibold text-emerald-dark truncate">
                        {a.recitateur_nom}
                      </div>
                      {a.duree && (
                        <div className="text-xs text-gray-500">
                          {Math.floor(a.duree / 60)} min
                        </div>
                      )}
                    </div>
                  </button>

                  {playingId === a.id && (
                    <div className="px-5 pb-4">
                      <audio src={a.audio_url} controls autoPlay className="w-full" />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </main>
  );
}