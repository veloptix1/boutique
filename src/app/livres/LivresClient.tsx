"use client";
import { EndMark } from "@/components/PageHeader";
import { useEffect, useState } from "react";
import Link from "next/link";
import { ListSkeleton, PageHeader, SearchField } from "@/components/ui";
import { supabase } from "@/lib/supabase";
import { useLang } from "@/components/LangProvider";
import { IconLivre, IconUser } from "@/components/icons";

type Livre = {
  id: string;
  slug: string;
  titre_fr: string;
  titre_ar: string | null;
  titre_en: string | null;
  auteur_fr: string | null;
  auteur_ar: string | null;
  auteur_en: string | null;
  couverture_url: string | null;
  pdf_url: string;
  pages: number | null;
  langue: string;
  categorie: string | null;
  annee: string | null;
};

export default function LivresClient() {
  const { lang } = useLang();
  const [livres, setLivres] = useState<Livre[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<string>("tous");

  useEffect(() => {
    (async () => {
      try {
        const { data, error } = await supabase
          .from("livres")
          .select("*")
          .order("ordre", { ascending: true });
        if (error) console.error("Erreur livres:", error);
        setLivres(data || []);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const getTitre = (l: Livre) =>
    lang === "ar" ? l.titre_ar || l.titre_fr
      : lang === "en" ? l.titre_en || l.titre_fr
      : l.titre_fr;

  const getAuteur = (l: Livre) =>
    lang === "ar" ? l.auteur_ar || l.auteur_fr
      : lang === "en" ? l.auteur_en || l.auteur_fr
      : l.auteur_fr;

  const categories = Array.from(
    new Set(livres.map((l) => l.categorie).filter(Boolean) as string[])
  );

  const filtered = livres
    .filter((l) => filter === "tous" || l.categorie === filter)
    .filter((l) => {
      if (!search.trim()) return true;
      const q = search.toLowerCase();
      return (
        l.titre_fr?.toLowerCase().includes(q) ||
        l.titre_ar?.includes(search) ||
        l.auteur_fr?.toLowerCase().includes(q)
      );
    });

  return (
    <main className="page">

      <PageHeader title="Nos Livres" subtitle="Découvrez, lisez en ligne ou téléchargez les livres islamiques de nos savants." back="/dashboard" />

      {/* Recherche */}
      <SearchField value={search} onChange={setSearch} placeholder="Rechercher un livre par titre ou auteur..." />

      {/* Filtres */}
      {categories.length > 0 && (
        <div role="group" aria-label="Filtres" className="scrollbar-none -mx-4 mb-4 flex gap-2 overflow-x-auto px-4 sm:mx-0 sm:px-0">
          <button onClick={() => setFilter("tous")}
            aria-pressed={filter === "tous"} className="chip">
            Tous
          </button>
          {categories.map((cat) => (
            <button key={cat} onClick={() => setFilter(cat)}
              aria-pressed={filter === cat} className="chip">
              {cat}
            </button>
          ))}
        </div>
      )}

      {search && (
        <p className="text-sm text-muted mb-5">
          {filtered.length} résultat{filtered.length > 1 ? "s" : ""} pour « {search} »
        </p>
      )}

      {loading ? (
        <ListSkeleton />
      ) : filtered.length === 0 ? (
        <div className="bg-surface rounded-2xl p-8 text-center border border-line">
          <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gold/15 flex items-center justify-center text-gold">
            <IconLivre size={28} />
          </div>
          <p className="text-muted mb-2">Aucun livre trouvé</p>
          {(search || filter !== "tous") && (
            <button onClick={() => { setSearch(""); setFilter("tous"); }}
              className="text-link text-sm font-semibold hover:underline">
              Réinitialiser
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {filtered.map((l) => (
            <Link
              key={l.id}
              href={`/livres/detail?slug=${l.slug}`}
              className="group bg-surface rounded-2xl overflow-hidden
                         border border-line
                         hover:border-gold/30 transition-all no-underline
                         flex flex-col"
            >
              <div className="relative aspect-[3/4] bg-gradient-to-br from-emerald to-emerald-dark
                              flex items-center justify-center overflow-hidden">
                {l.couverture_url ? (
                  <img loading="lazy" decoding="async" src={l.couverture_url} alt={getTitre(l)}
                    className="w-full h-full object-cover transition-transform duration-500" />
                ) : (
                  <div className="text-gold flex flex-col items-center gap-2 p-4">
                    <IconLivre size={36} />
                  </div>
                )}

                <div className="absolute top-2 right-2 px-2 py-0.5 rounded-full
                                bg-surface/95 text-heading
                                text-xs font-bold">
                  {l.langue?.toUpperCase() || "FR"}
                </div>

                {l.categorie && (
                  <div className="absolute top-2 left-2 px-2 py-0.5 rounded-full
                                  bg-gold/90 text-heading
                                  text-xs font-bold">
                    {l.categorie}
                  </div>
                )}
              </div>

              <div className="p-3 flex flex-col flex-1">
                {l.titre_ar && lang !== "ar" && (
                  <div className="font-amiri text-gold text-xs mb-0.5 leading-tight"
                       dir="rtl">
                    {l.titre_ar}
                  </div>
                )}

                <h3 className="font-bold text-heading text-sm leading-tight mb-1
                               line-clamp-2 min-h-[2.3em]">
                  {getTitre(l)}
                </h3>

                {getAuteur(l) && (
                  <div className="text-xs text-muted inline-flex items-center gap-1
                                  mt-auto pt-2 border-t border-line line-clamp-1">
                    <IconUser size={10} /> {getAuteur(l)}
                  </div>
                )}
              </div>
            </Link>
          ))}
        </div>
      )}
      <EndMark />
    </main>
  );
}
