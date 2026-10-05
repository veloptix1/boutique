"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { useLang } from "@/components/LangProvider";
import { IconUser, IconSearch, IconPlay, IconArrowRight } from "@/components/icons";

type Video = {
  id: string;
  titre: string;
  description: string | null;
  youtube_url: string;
  youtube_video_id: string;
  savant_id: string | null;
  categorie: string | null;
  duree: number | null;
};

type Savant = { id: string; nom_fr: string; nom_ar: string | null; slug: string };

export default function LiveClient() {
  const { lang } = useLang();
  const [videos, setVideos] = useState<Video[]>([]);
  const [savants, setSavants] = useState<Savant[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filterCategorie, setFilterCategorie] = useState("tous");

  useEffect(() => {
    (async () => {
      try {
        const [v, s] = await Promise.all([
          supabase.from("videos").select("*").order("ordre").order("created_at", { ascending: false }),
          supabase.from("savants").select("id, nom_fr, nom_ar, slug"),
        ]);
        setVideos(v.data || []);
        setSavants(s.data || []);
      } catch (e) { console.error(e); }
      finally { setLoading(false); }
    })();
  }, []);

  const getSavant = (id: string | null) => savants.find((s) => s.id === id);
  const getNomSavant = (id: string | null) => {
    const s = getSavant(id);
    if (!s) return "";
    return lang === "ar" ? s.nom_ar || s.nom_fr : s.nom_fr;
  };

  const categories = Array.from(
    new Set(videos.map((v) => v.categorie).filter(Boolean) as string[])
  );

  const filtered = videos
    .filter((v) => filterCategorie === "tous" || v.categorie === filterCategorie)
    .filter((v) => {
      if (!search.trim()) return true;
      const q = search.toLowerCase();
      return (
        v.titre.toLowerCase().includes(q) ||
        v.description?.toLowerCase().includes(q) ||
        getNomSavant(v.savant_id).toLowerCase().includes(q)
      );
    });

  const formatDuree = (s: number | null) => {
    if (!s) return "";
    return `${Math.floor(s / 60)} min`;
  };

  return (
    <main className="px-[6%] pt-24 pb-40 max-w-[1400px] mx-auto min-h-screen">

      <Link href="/dashboard" className="text-emerald text-sm font-semibold hover:underline">
        ← Retour
      </Link>

      <div className="mt-6 mb-10">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-12 h-12 rounded-2xl bg-terracotta/10 flex items-center justify-center text-terracotta">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none"
                 stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="2" y="4" width="20" height="16" rx="3"/>
              <path d="M10 9l5 3-5 3z" fill="currentColor"/>
            </svg>
          </div>
          <div className="text-xs font-bold text-terracotta uppercase tracking-[3px]">
            Vidéos
          </div>
        </div>
        <h1 className="font-amiri font-bold text-emerald-dark text-4xl sm:text-5xl mb-3">
          Nos vidéos
        </h1>
        <p className="text-gray-500 max-w-2xl">
          Les conférences, cours et rappels des savants sur différents sujets.
        </p>
      </div>

      <div className="relative mb-6">
        <div className="absolute left-5 top-1/2 -translate-y-1/2 text-emerald/50 pointer-events-none">
          <IconSearch size={18} />
        </div>
        <input
          type="text"
          placeholder="Rechercher une vidéo..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-14 pr-5 py-4 rounded-2xl border-2 border-emerald/10
                     focus:border-gold outline-none text-sm bg-white"
        />
        {search && (
          <button onClick={() => setSearch("")}
            className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-400
                       hover:text-terracotta text-xl leading-none">×</button>
        )}
      </div>

      {categories.length > 0 && (
        <div className="flex gap-2 mb-8 overflow-x-auto pb-2">
          <button onClick={() => setFilterCategorie("tous")}
            className={`px-5 py-2.5 rounded-full text-sm font-semibold whitespace-nowrap transition
              ${filterCategorie === "tous"
                ? "bg-emerald text-white shadow-[0_8px_20px_rgba(13,92,74,0.25)]"
                : "bg-white text-emerald-dark border border-emerald/10"}`}>
            Tous
          </button>
          {categories.map((cat) => (
            <button key={cat} onClick={() => setFilterCategorie(cat)}
              className={`px-5 py-2.5 rounded-full text-sm font-semibold whitespace-nowrap transition
                ${filterCategorie === cat
                  ? "bg-emerald text-white shadow-[0_8px_20px_rgba(13,92,74,0.25)]"
                  : "bg-white text-emerald-dark border border-emerald/10"}`}>
              {cat}
            </button>
          ))}
        </div>
      )}

      {loading ? (
        <p className="text-gray-400">Chargement...</p>
      ) : filtered.length === 0 ? (
        <div className="bg-white rounded-3xl p-16 text-center border border-emerald/5">
          <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-emerald/10 flex items-center justify-center text-emerald">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none"
                 stroke="currentColor" strokeWidth="2">
              <rect x="2" y="4" width="20" height="16" rx="3"/>
            </svg>
          </div>
          <p className="text-gray-400 mb-2">Aucune vidéo pour le moment</p>
          <Link href="/admin/live"
            className="text-emerald text-sm font-semibold hover:underline">
            + Ajouter une vidéo (admin)
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map((v) => {
            const savant = getSavant(v.savant_id);
            return (
              <Link key={v.id} href={`/live/detail?id=${v.id}`}
                className="group bg-white rounded-3xl overflow-hidden
                           border border-emerald/5 hover:-translate-y-1
                           hover:shadow-[0_25px_50px_rgba(13,92,74,0.15)]
                           transition-all no-underline flex flex-col">

                <div className="relative aspect-video bg-black overflow-hidden">
                  <img
                    src={`https://img.youtube.com/vi/${v.youtube_video_id}/maxresdefault.jpg`}
                    alt={v.titre}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    onError={(e) => {
                      e.currentTarget.src = `https://img.youtube.com/vi/${v.youtube_video_id}/hqdefault.jpg`;
                    }}
                  />
                  <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40
                                  transition flex items-center justify-center">
                    <div className="w-14 h-14 rounded-full bg-white/95 flex items-center justify-center
                                    shadow-lg group-hover:scale-110 transition">
                      <IconPlay size={20} color="#0d5c4a" />
                    </div>
                  </div>
                  {v.duree && (
                    <div className="absolute bottom-2 right-2 px-2 py-0.5 rounded
                                    bg-black/80 text-white text-[0.65rem] font-semibold">
                      {formatDuree(v.duree)}
                    </div>
                  )}
                  {v.categorie && (
                    <div className="absolute top-2 left-2 px-2 py-0.5 rounded-full
                                    bg-gold text-emerald-dark text-[0.6rem] font-bold
                                    uppercase tracking-wider">
                      {v.categorie}
                    </div>
                  )}
                </div>

                <div className="p-5 flex-1 flex flex-col">
                  <h3 className="font-bold text-emerald-dark text-base leading-tight mb-2 line-clamp-2">
                    {v.titre}
                  </h3>
                  {savant && (
                    <div className="flex items-center gap-1.5 text-xs text-gold font-semibold mb-2">
                      <IconUser size={12} />
                      {getNomSavant(v.savant_id)}
                    </div>
                  )}
                  {v.description && (
                    <p className="text-xs text-gray-500 line-clamp-2 mb-3">{v.description}</p>
                  )}
                  <div className="flex items-center gap-1.5 text-xs font-semibold text-emerald
                                  group-hover:gap-2.5 transition-all mt-auto pt-3
                                  border-t border-emerald/5">
                    Regarder la vidéo
                    <IconArrowRight size={12} />
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </main>
  );
}
