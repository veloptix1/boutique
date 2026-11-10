"use client";
import { EndMark } from "@/components/PageHeader";
import { useEffect, useState } from "react";
import Link from "next/link";
import { ListSkeleton, PageHeader, SearchField } from "@/components/ui";
import { supabase } from "@/lib/supabase";
import { useLang } from "@/components/LangProvider";
import { IconUser } from "@/components/icons";

type Mise = {
  id: string;
  savant_id: string;
  cible_nom: string;
  cible_photo_url: string | null;
  cible_description: string | null;
  raison_fr: string | null;
  raison_ar: string | null;
  raison_en: string | null;
  sources: string | null;
  categorie: string | null;
};

type Savant = { id: string; nom_fr: string; nom_ar: string | null; slug: string; categorie: string };

export default function MiseEnGardeClient() {
  const { lang } = useLang();
  const [mises, setMises] = useState<Mise[]>([]);
  const [savants, setSavants] = useState<Savant[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filterSavant, setFilterSavant] = useState<string>("tous");

  useEffect(() => {
    (async () => {
      try {
        const [m, s] = await Promise.all([
          supabase.from("mises_en_garde").select("*").order("created_at", { ascending: false }),
          supabase.from("savants").select("id, nom_fr, nom_ar, slug, categorie"),
        ]);
        setMises(m.data || []);
        setSavants(s.data || []);
      } catch (e) { console.error(e); }
      finally { setLoading(false); }
    })();
  }, []);

  const getSavant = (id: string) => savants.find((s) => s.id === id);

  const getNomSavant = (id: string) => {
    const s = getSavant(id);
    if (!s) return "Savant inconnu";
    return lang === "ar" ? s.nom_ar || s.nom_fr : s.nom_fr;
  };

  const getRaison = (m: Mise) =>
    lang === "ar" ? m.raison_ar || m.raison_fr
      : lang === "en" ? m.raison_en || m.raison_fr
      : m.raison_fr;

  const filtered = mises
    .filter((m) => filterSavant === "tous" || m.savant_id === filterSavant)
    .filter((m) => {
      if (!search.trim()) return true;
      const q = search.toLowerCase();
      return (
        m.cible_nom?.toLowerCase().includes(q) ||
        m.raison_fr?.toLowerCase().includes(q) ||
        getNomSavant(m.savant_id).toLowerCase().includes(q)
      );
    });

  const savantsAvecMises = Array.from(new Set(mises.map((m) => m.savant_id)));

  return (
    <main className="page">

      <PageHeader title="Mise en garde" subtitle="Les mises en garde des savants de la Salafiya contre les personnes, groupes et sectes déviantes — avec preuves et sources." back="/dashboard" />

      {/* Recherche */}
      <SearchField value={search} onChange={setSearch} placeholder="Rechercher par nom, savant ou raison..." />

      {/* Filtres par savant */}
      {savantsAvecMises.length > 0 && (
        <div role="group" aria-label="Filtres" className="scrollbar-none -mx-4 mb-4 flex gap-2 overflow-x-auto px-4 sm:mx-0 sm:px-0">
          <button onClick={() => setFilterSavant("tous")}
            aria-pressed={filterSavant === "tous"} className="chip">
            Tous ({mises.length})
          </button>
          {savantsAvecMises.map((sid) => {
            const s = getSavant(sid);
            if (!s) return null;
            return (
              <button key={sid} onClick={() => setFilterSavant(sid)}
                aria-pressed={filterSavant === sid} className="chip">
                {s.nom_fr}
              </button>
            );
          })}
        </div>
      )}

      {loading ? (
        <ListSkeleton />
      ) : filtered.length === 0 ? (
        <div className="bg-white rounded-2xl p-8 text-center border border-line">
          <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-terracotta/10 flex items-center justify-center text-terracotta">
            <IconUser size={28} />
          </div>
          <p className="text-muted mb-2">Aucune mise en garde pour le moment</p>
          <Link href="/admin/mises"
            className="text-emerald text-sm font-semibold hover:underline">
            + Ajouter une mise en garde (admin)
          </Link>
        </div>
      ) : (
        <div className="grid gap-5">
          {filtered.map((m) => {
            const savant = getSavant(m.savant_id);
            return (
              <div key={m.id}
                className="bg-white rounded-2xl overflow-hidden border border-line
                           hover:border-terracotta/20
                           transition-all">
                <div className="grid md:grid-cols-[200px_1fr]">

                  {/* Photo cible */}
                  <div className="relative aspect-square bg-gradient-to-br from-terracotta/10 to-cream
                                  flex items-center justify-center overflow-hidden">
                    {m.cible_photo_url ? (
                      <img loading="lazy" decoding="async" src={m.cible_photo_url} alt={m.cible_nom}
                        className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-20 h-20 rounded-full bg-terracotta/20 flex items-center justify-center text-terracotta">
                        <IconUser size={32} />
                      </div>
                    )}
                    <div className="absolute top-3 left-3 px-2 py-0.5 rounded-full
                                    bg-terracotta text-white text-xs font-bold">
                      Mise en garde
                    </div>
                  </div>

                  {/* Contenu */}
                  <div className="p-6 flex flex-col">

                    {savant && (
                      <Link href={`/audio/savants/detail?slug=${savant.slug}`}
                        className="inline-flex items-center gap-2 text-xs font-bold
                                   text-gold mb-3
                                   hover:underline w-fit">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
                             stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                          <path d="M10.3 3.9a2 2 0 013.4 0l8 13.8A2 2 0 0120 21H4a2 2 0 01-1.7-3.3z"/>
                        </svg>
                        Par {getNomSavant(m.savant_id)}
                      </Link>
                    )}

                    <h2 className="font-amiri font-bold text-emerald-dark text-2xl mb-2">
                      {m.cible_nom}
                    </h2>

                    {m.cible_description && (
                      <p className="text-sm text-muted mb-4">
                        {m.cible_description}
                      </p>
                    )}

                    {getRaison(m) && (
                      <div className="bg-cream rounded-2xl p-4 mb-4 border-l-4 border-terracotta">
                        <div className="text-xs font-bold text-terracotta mb-2">
                          Raison
                        </div>
                        <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-line">
                          {getRaison(m)}
                        </p>
                      </div>
                    )}

                    <div className="flex flex-wrap items-center gap-3 text-xs text-muted mt-auto pt-3 border-t border-line">
                      {m.categorie && (
                        <span className="px-3 py-1 rounded-full bg-terracotta/10 text-terracotta font-bold">
                          {m.categorie}
                        </span>
                      )}
                      {m.sources && (
                        <span className="truncate">
                          📚 Sources : {m.sources}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
      <EndMark />
    </main>
  );
}
