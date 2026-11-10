"use client";
import { EndMark } from "@/components/PageHeader";
import { useEffect, useState } from "react";
import Link from "next/link";
import { BackLink, ListSkeleton, PageHeader, SearchField } from "@/components/ui";
import { supabase } from "@/lib/supabase";
import { useLang } from "@/components/LangProvider";
import { IconParchemin, IconUser } from "@/components/icons";

type Hadith = {
  id: string;
  texte_ar: string;
  texte_fr: string | null;
  texte_en: string | null;
  source: string | null;
  rapporteur: string | null;
  authenticite: string;
  explication_fr: string | null;
  savant_id: string | null;
  categorie: string | null;
};

type Filter = "tous" | "sahih" | "hasan" | "daif";

export default function HadithsClient() {
  const { lang } = useLang();
  const [hadiths, setHadiths] = useState<Hadith[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<Filter>("tous");
  const [search, setSearch] = useState("");
  const [expanded, setExpanded] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const { data, error } = await supabase
          .from("hadiths")
          .select("*")
          .order("created_at", { ascending: false });
        if (error) console.error("Erreur hadiths:", error);
        setHadiths(data || []);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const getTexte = (h: Hadith) =>
    lang === "ar" ? h.texte_ar
      : lang === "en" ? h.texte_en || h.texte_fr
      : h.texte_fr;

  const filtered = hadiths
    .filter((h) => filter === "tous" || h.authenticite === filter)
    .filter((h) => {
      if (!search.trim()) return true;
      const q = search.toLowerCase();
      return (
        h.texte_ar?.includes(search) ||
        h.texte_fr?.toLowerCase().includes(q) ||
        h.source?.toLowerCase().includes(q) ||
        h.rapporteur?.toLowerCase().includes(q)
      );
    });

  const filters: { id: Filter; label: string }[] = [
    { id: "tous",  label: "Tous" },
    { id: "sahih", label: "Sahih" },
    { id: "hasan", label: "Hasan" },
    { id: "daif",  label: "Da'if" },
  ];

  const authBadge: Record<string, string> = {
    sahih: "bg-emerald/10 text-emerald",
    hasan: "bg-gold/15 text-gold-deep",
    daif:  "bg-terracotta/10 text-terracotta",
  };

  return (
    <main className="page">

      <BackLink href="/dashboard" label="Retour" />

      {/* En-tête */}

      <PageHeader title="Les Hadiths" subtitle="Les paroles du Prophète ﷺ authentiquement rapportées, avec traduction et explication." />

      {/* Recherche */}
      <SearchField value={search} onChange={setSearch} placeholder="Rechercher par texte, source ou rapporteur..." />

      {/* Filtres */}
      <div role="group" aria-label="Filtres" className="scrollbar-none -mx-4 mb-4 flex gap-2 overflow-x-auto px-4 sm:mx-0 sm:px-0">
        {filters.map(({ id, label }) => (
          <button key={id} onClick={() => setFilter(id)}
            aria-pressed={filter === id} className="chip">
            {label}
          </button>
        ))}
      </div>

      {/* Résultats */}
      {search && (
        <p className="text-sm text-muted mb-5">
          {filtered.length} résultat{filtered.length > 1 ? "s" : ""} pour « {search} »
        </p>
      )}

      {loading ? (
        <ListSkeleton />
      ) : filtered.length === 0 ? (
        <div className="bg-white rounded-2xl p-8 text-center border border-line">
          <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-emerald/10 flex items-center justify-center text-emerald">
            <IconParchemin size={28} />
          </div>
          <p className="text-muted mb-2">Aucun hadith</p>
          {(search || filter !== "tous") && (
            <button onClick={() => { setSearch(""); setFilter("tous"); }}
              className="text-emerald text-sm font-semibold hover:underline">
              Réinitialiser
            </button>
          )}
        </div>
      ) : (
        <div className="grid gap-5">
          {filtered.map((h) => {
            const isOpen = expanded === h.id;
            return (
              <div key={h.id}
                className="bg-white rounded-2xl p-6 sm:p-8 border border-line
                           hover:border-emerald/15 transition-all">
                {/* Bandeau */}
                <div className="flex items-center gap-3 mb-5 flex-wrap">
                  <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase
                    ${authBadge[h.authenticite] || authBadge.sahih}`}>
                    {h.authenticite}
                  </span>
                  {h.source && (
                    <span className="text-xs text-muted">{h.source}</span>
                  )}
                  {h.rapporteur && (
                    <span className="text-xs text-muted inline-flex items-center gap-1">
                      <IconUser size={12} /> {h.rapporteur}
                    </span>
                  )}
                  {h.categorie && (
                    <span className="text-xs text-gold font-semibold">
                      {h.categorie}
                    </span>
                  )}
                </div>

                {/* Texte arabe */}
                <div className="font-amiri text-emerald-dark text-xl sm:text-2xl leading-loose
                                mb-5 text-right" dir="rtl">
                  {h.texte_ar}
                </div>

                {/* Traduction */}
                {getTexte(h) && (
                  <p className="text-ink/80 leading-relaxed mb-4">
                    {getTexte(h)}
                  </p>
                )}

                {/* Explication dépliable */}
                {h.explication_fr && (
                  <>
                    <button onClick={() => setExpanded(isOpen ? null : h.id)}
                      className="text-sm font-semibold text-emerald hover:text-gold
                                 transition inline-flex items-center gap-1">
                      {isOpen ? "Masquer" : "Voir"} l'explication
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none"
                           stroke="currentColor" strokeWidth="2" strokeLinecap="round"
                           style={{ transform: isOpen ? "rotate(180deg)" : "none", transition: "transform 0.2s" }}>
                        <path d="M6 9l6 6 6-6"/>
                      </svg>
                    </button>
                    {isOpen && (
                      <div className="mt-4 p-5 rounded-2xl bg-emerald/5 border-l-4 border-gold">
                        <p className="text-sm text-ink/80 leading-relaxed whitespace-pre-line">
                          {h.explication_fr}
                        </p>
                      </div>
                    )}
                  </>
                )}
              </div>
            );
          })}
        </div>
      )}
      <EndMark />
    </main>
  );
}
