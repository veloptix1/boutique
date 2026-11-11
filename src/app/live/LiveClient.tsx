"use client";
import { EndMark } from "@/components/PageHeader";
import { useEffect, useState } from "react";
import Link from "next/link";
import { BackLink, ListSkeleton, PageHeader, SearchField } from "@/components/ui";
import { supabase } from "@/lib/supabase";
import { useLang } from "@/components/LangProvider";
import { IconUser, IconPlay, IconArrowRight } from "@/components/icons";

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
    <main className="page max-w-[1400px]">

      <BackLink href="/dashboard" label="Retour" />


      <PageHeader title="Nos vidéos" subtitle="Les conférences, cours et rappels des savants sur différents sujets." />

      <SearchField value={search} onChange={setSearch} placeholder="Rechercher une vidéo..." />

      {categories.length > 0 && (
        <div role="group" aria-label="Filtres" className="scrollbar-none -mx-4 mb-4 flex gap-2 overflow-x-auto px-4 sm:mx-0 sm:px-0">
          <button onClick={() => setFilterCategorie("tous")}
            aria-pressed={filterCategorie === "tous"} className="chip">
            Tous
          </button>
          {categories.map((cat) => (
            <button key={cat} onClick={() => setFilterCategorie(cat)}
              aria-pressed={filterCategorie === cat} className="chip">
              {cat}
            </button>
          ))}
        </div>
      )}

      {loading ? (
        <ListSkeleton />
      ) : filtered.length === 0 ? (
        <div className="bg-surface rounded-2xl p-8 text-center border border-line">
          <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-emerald/10 flex items-center justify-center text-link">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none"
                 stroke="currentColor" strokeWidth="2">
              <rect x="2" y="4" width="20" height="16" rx="3"/>
            </svg>
          </div>
          <p className="text-muted mb-2">Aucune vidéo pour le moment</p>
          <Link href="/admin/live"
            className="text-link text-sm font-semibold hover:underline">
            + Ajouter une vidéo (admin)
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map((v) => {
            const savant = getSavant(v.savant_id);
            return (
              <Link key={v.id} href={`/live/detail?id=${v.id}`}
                className="group bg-surface rounded-2xl overflow-hidden
                           border border-line
                           transition-all no-underline flex flex-col">

                <div className="relative aspect-video bg-black overflow-hidden">
                  <img loading="lazy" decoding="async"
                    src={`https://img.youtube.com/vi/${v.youtube_video_id}/maxresdefault.jpg`}
                    alt={v.titre}
                    className="w-full h-full object-cover transition-transform duration-500"
                    onError={(e) => {
                      e.currentTarget.src = `https://img.youtube.com/vi/${v.youtube_video_id}/hqdefault.jpg`;
                    }}
                  />
                  <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40
                                  transition flex items-center justify-center">
                    <div className="w-14 h-14 rounded-full bg-surface/95 flex items-center justify-center
                                    shadow-lg transition">
                      <IconPlay size={20} color="#0d5c4a" />
                    </div>
                  </div>
                  {v.duree && (
                    <div className="absolute bottom-2 right-2 px-2 py-0.5 rounded
                                    bg-black/80 text-white text-xs font-semibold">
                      {formatDuree(v.duree)}
                    </div>
                  )}
                  {v.categorie && (
                    <div className="absolute top-2 left-2 px-2 py-0.5 rounded-full
                                    bg-gold text-emerald-dark text-xs font-bold">
                      {v.categorie}
                    </div>
                  )}
                </div>

                <div className="p-5 flex-1 flex flex-col">
                  <h3 className="font-bold text-heading text-base leading-tight mb-2 line-clamp-2">
                    {v.titre}
                  </h3>
                  {savant && (
                    <div className="flex items-center gap-1.5 text-xs text-gold font-semibold mb-2">
                      <IconUser size={12} />
                      {getNomSavant(v.savant_id)}
                    </div>
                  )}
                  {v.description && (
                    <p className="text-xs text-muted line-clamp-2 mb-3">{v.description}</p>
                  )}
                  <div className="flex items-center gap-1.5 text-xs font-semibold text-link
                                  group-hover:gap-2.5 transition-all mt-auto pt-3
                                  border-t border-line">
                    Regarder la vidéo
                    <IconArrowRight size={12} />
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      )}
      <EndMark />
    </main>
  );
}
