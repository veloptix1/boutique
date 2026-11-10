"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { BackLink, ListSkeleton, PageHeader, SearchField } from "@/components/ui";
import { supabase } from "@/lib/supabase";
import { useLang } from "@/components/LangProvider";
import { EndMark } from "@/components/PageHeader";
import { IconArrowRight } from "@/components/icons";

type Actu = {
  id: string;
  titre: string;
  slug: string;
  resume: string | null;
  image_url: string | null;
  categorie: string | null;
  auteur: string | null;
  epingle: boolean;
  created_at: string;
};

export default function NouveauClient() {
  const { lang } = useLang();
  const [actus, setActus] = useState<Actu[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filterCat, setFilterCat] = useState("tous");

  useEffect(() => {
    (async () => {
      try {
        const { data } = await supabase
          .from("actualites")
          .select("*")
          .eq("publie", true)
          .order("epingle", { ascending: false })
          .order("created_at", { ascending: false });
        setActus(data || []);
      } catch (e) { console.error(e); }
      finally { setLoading(false); }
    })();
  }, []);

  const categories = Array.from(
    new Set(actus.map((a) => a.categorie).filter(Boolean) as string[])
  );

  const filtered = actus
    .filter((a) => filterCat === "tous" || a.categorie === filterCat)
    .filter((a) => {
      if (!search.trim()) return true;
      const q = search.toLowerCase();
      return (
        a.titre.toLowerCase().includes(q) ||
        a.resume?.toLowerCase().includes(q) ||
        a.auteur?.toLowerCase().includes(q)
      );
    });

  const formatDate = (date: string) => {
    const d = new Date(date);
    const now = new Date();
    const diffMs = now.getTime() - d.getTime();
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffHours < 1) return "À l''instant";
    if (diffHours < 24) return `Il y a ${diffHours}h`;
    if (diffDays < 7) return `Il y a ${diffDays}j`;
    return d.toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" });
  };

  return (
    <main className="page">

      <BackLink href="/dashboard" label="Retour" />


      <PageHeader title="Nouveau" subtitle="Les dernières actualités et nouvelles islamiques — annonces, événements, publications et nouvelles des savants." />

      {/* Recherche */}
      <SearchField value={search} onChange={setSearch} placeholder="Rechercher une actualité..." />

      {/* Filtres catégories */}
      {categories.length > 0 && (
        <div role="group" aria-label="Filtres" className="scrollbar-none -mx-4 mb-4 flex gap-2 overflow-x-auto px-4 sm:mx-0 sm:px-0">
          <button onClick={() => setFilterCat("tous")}
            aria-pressed={filterCat === "tous"} className="chip">
            Toutes
          </button>
          {categories.map((cat) => (
            <button key={cat} onClick={() => setFilterCat(cat)}
              aria-pressed={filterCat === cat} className="chip">
              {cat}
            </button>
          ))}
        </div>
      )}

      {loading ? (
        <ListSkeleton />
      ) : filtered.length === 0 ? (
        <div className="bg-white rounded-2xl p-8 text-center border border-line">
          <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gold/15 flex items-center justify-center text-gold">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none"
                 stroke="currentColor" strokeWidth="2">
              <path d="M4 22h16a2 2 0 002-2V4a2 2 0 00-2-2H8a2 2 0 00-2 2v16"/>
            </svg>
          </div>
          <p className="text-muted mb-2">Aucune actualité pour le moment</p>
          <Link href="/admin/actualites"
            className="text-emerald text-sm font-semibold hover:underline">
            + Ajouter une actualité (admin)
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map((a) => (
            <Link key={a.id} href={`/nouveau/detail?slug=${a.slug}`}
              className="group bg-white rounded-2xl overflow-hidden
                         border border-line
                         hover:border-gold/30 transition-all no-underline
                         flex flex-col">

              {/* Image */}
              <div className="relative aspect-video bg-gradient-to-br from-emerald/10 to-cream
                              overflow-hidden">
                {a.image_url ? (
                  <img loading="lazy" decoding="async" src={a.image_url} alt={a.titre}
                    className="w-full h-full object-cover transition-transform duration-500" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-emerald/30">
                    <svg width="48" height="48" viewBox="0 0 24 24" fill="none"
                         stroke="currentColor" strokeWidth="1.5">
                      <rect x="3" y="3" width="18" height="18" rx="3"/>
                      <circle cx="9" cy="9" r="2"/>
                      <path d="M21 15l-5-5L5 21"/>
                    </svg>
                  </div>
                )}

                {/* Badge épinglé */}
                {a.epingle && (
                  <div className="absolute top-2 left-2 px-2.5 py-1 rounded-full
                                  bg-terracotta text-white text-xs font-bold flex items-center gap-1">
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 2l3 8h8l-6.5 4.5L19 22l-7-4-7 4 2.5-7.5L1 10h8z"/>
                    </svg>
                    Épinglé
                  </div>
                )}

                {/* Catégorie */}
                {a.categorie && (
                  <div className="absolute bottom-2 left-2 px-2.5 py-1 rounded-full
                                  bg-white/95 text-emerald-dark text-xs font-bold">
                    {a.categorie}
                  </div>
                )}
              </div>

              {/* Contenu */}
              <div className="p-5 flex-1 flex flex-col">
                <div className="flex items-center gap-2 text-xs text-muted mb-2">
                  <span>{formatDate(a.created_at)}</span>
                  {a.auteur && (
                    <>
                      <span>·</span>
                      <span className="truncate">{a.auteur}</span>
                    </>
                  )}
                </div>

                <h3 className="font-bold text-emerald-dark text-base leading-tight mb-2
                               line-clamp-2">
                  {a.titre}
                </h3>

                {a.resume && (
                  <p className="text-xs text-muted line-clamp-3 mb-3">
                    {a.resume}
                  </p>
                )}

                <div className="flex items-center gap-1.5 text-xs font-semibold text-emerald
                                group-hover:gap-2.5 transition-all mt-auto pt-3
                                border-t border-line">
                  Lire la suite
                  <IconArrowRight size={12} />
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}

      <EndMark />
    </main>
  );
}
