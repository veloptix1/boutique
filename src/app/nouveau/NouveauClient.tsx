"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { useLang } from "@/components/LangProvider";
import { Bismillah, EndMark } from "@/components/PageHeader";
import { IconSearch, IconArrowRight } from "@/components/icons";

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
    <main className="px-[6%] pt-24 pb-40 max-w-[1200px] mx-auto min-h-screen">

      <Link href="/dashboard" className="text-emerald text-sm font-semibold hover:underline">
        ← Retour
      </Link>

      <div className="mt-8">
        <Bismillah />
      </div>

      <div className="mb-10">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-12 h-12 rounded-2xl bg-gold/15 flex items-center justify-center text-gold">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none"
                 stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M4 22h16a2 2 0 002-2V4a2 2 0 00-2-2H8a2 2 0 00-2 2v16a2 2 0 01-4 0V4a2 2 0 012-2"/>
              <path d="M18 14h-8M15 18h-5M10 6h8v4h-8z"/>
            </svg>
          </div>
          <div className="text-xs font-bold text-gold uppercase tracking-[3px]">
            Actualités
          </div>
        </div>
        <h1 className="font-amiri font-bold text-emerald-dark text-4xl sm:text-5xl mb-3">
          Nouveau
        </h1>
        <p className="text-gray-500 max-w-2xl">
          Les dernières actualités et nouvelles islamiques — annonces, événements,
          publications et nouvelles des savants.
        </p>
      </div>

      {/* Recherche */}
      <div className="relative mb-6">
        <div className="absolute left-5 top-1/2 -translate-y-1/2 text-emerald/50 pointer-events-none">
          <IconSearch size={18} />
        </div>
        <input type="text" placeholder="Rechercher une actualité..."
          value={search} onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-14 pr-5 py-4 rounded-2xl border-2 border-emerald/10
                     focus:border-gold outline-none text-sm bg-white" />
        {search && (
          <button onClick={() => setSearch("")}
            className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-400
                       hover:text-terracotta text-xl leading-none">×</button>
        )}
      </div>

      {/* Filtres catégories */}
      {categories.length > 0 && (
        <div className="flex gap-2 mb-8 overflow-x-auto pb-2">
          <button onClick={() => setFilterCat("tous")}
            className={`px-5 py-2.5 rounded-full text-sm font-semibold whitespace-nowrap transition
              ${filterCat === "tous"
                ? "bg-emerald text-white shadow-[0_8px_20px_rgba(13,92,74,0.25)]"
                : "bg-white text-emerald-dark border border-emerald/10"}`}>
            Toutes
          </button>
          {categories.map((cat) => (
            <button key={cat} onClick={() => setFilterCat(cat)}
              className={`px-5 py-2.5 rounded-full text-sm font-semibold whitespace-nowrap transition
                ${filterCat === cat
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
          <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gold/15 flex items-center justify-center text-gold">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none"
                 stroke="currentColor" strokeWidth="2">
              <path d="M4 22h16a2 2 0 002-2V4a2 2 0 00-2-2H8a2 2 0 00-2 2v16"/>
            </svg>
          </div>
          <p className="text-gray-400 mb-2">Aucune actualité pour le moment</p>
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
                         border border-emerald/5 hover:-translate-y-1
                         hover:shadow-[0_20px_40px_rgba(13,92,74,0.15)]
                         hover:border-gold/30 transition-all no-underline
                         flex flex-col">

              {/* Image */}
              <div className="relative aspect-video bg-gradient-to-br from-emerald/10 to-cream
                              overflow-hidden">
                {a.image_url ? (
                  <img src={a.image_url} alt={a.titre}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
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
                                  bg-terracotta text-white text-[0.6rem] font-bold
                                  uppercase tracking-wider flex items-center gap-1">
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 2l3 8h8l-6.5 4.5L19 22l-7-4-7 4 2.5-7.5L1 10h8z"/>
                    </svg>
                    Épinglé
                  </div>
                )}

                {/* Catégorie */}
                {a.categorie && (
                  <div className="absolute bottom-2 left-2 px-2.5 py-1 rounded-full
                                  bg-white/95 text-emerald-dark text-[0.6rem] font-bold
                                  uppercase tracking-wider">
                    {a.categorie}
                  </div>
                )}
              </div>

              {/* Contenu */}
              <div className="p-5 flex-1 flex flex-col">
                <div className="flex items-center gap-2 text-xs text-gray-400 mb-2">
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
                  <p className="text-xs text-gray-500 line-clamp-3 mb-3">
                    {a.resume}
                  </p>
                )}

                <div className="flex items-center gap-1.5 text-xs font-semibold text-emerald
                                group-hover:gap-2.5 transition-all mt-auto pt-3
                                border-t border-emerald/5">
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
