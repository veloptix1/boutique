"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { useLang } from "@/components/LangProvider";
import {
  IconUser, IconSearch, IconArrowRight,
} from "@/components/icons";

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
    <main className="px-[6%] pt-24 pb-40 max-w-[1200px] mx-auto min-h-screen">

      <Link href="/dashboard" className="text-emerald text-sm font-semibold hover:underline">
        ← Retour
      </Link>

      <div className="mt-6 mb-10">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-12 h-12 rounded-2xl bg-terracotta/10 flex items-center justify-center text-terracotta">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none"
                 stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M10.3 3.9a2 2 0 013.4 0l8 13.8A2 2 0 0120 21H4a2 2 0 01-1.7-3.3z"/>
              <path d="M12 9v4M12 17h.01"/>
            </svg>
          </div>
          <div className="text-xs font-bold text-terracotta uppercase tracking-[3px]">
            Salafiya
          </div>
        </div>
        <h1 className="font-amiri font-bold text-emerald-dark text-4xl sm:text-5xl mb-3">
          Mise en garde
        </h1>
        <p className="text-gray-500 max-w-2xl">
          Les mises en garde des savants de la Salafiya contre les personnes,
          groupes et sectes déviantes — avec preuves et sources.
        </p>
      </div>

      {/* Recherche */}
      <div className="relative mb-6">
        <div className="absolute left-5 top-1/2 -translate-y-1/2 text-emerald/50 pointer-events-none">
          <IconSearch size={18} />
        </div>
        <input
          type="text"
          placeholder="Rechercher par nom, savant ou raison..."
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

      {/* Filtres par savant */}
      {savantsAvecMises.length > 0 && (
        <div className="flex gap-2 mb-8 overflow-x-auto pb-2">
          <button onClick={() => setFilterSavant("tous")}
            className={`px-5 py-2.5 rounded-full text-sm font-semibold whitespace-nowrap
                        transition
              ${filterSavant === "tous"
                ? "bg-terracotta text-white shadow-[0_8px_20px_rgba(193,80,46,0.25)]"
                : "bg-white text-emerald-dark border border-emerald/10"}`}>
            Tous ({mises.length})
          </button>
          {savantsAvecMises.map((sid) => {
            const s = getSavant(sid);
            if (!s) return null;
            return (
              <button key={sid} onClick={() => setFilterSavant(sid)}
                className={`px-5 py-2.5 rounded-full text-sm font-semibold whitespace-nowrap
                            transition
                  ${filterSavant === sid
                    ? "bg-terracotta text-white shadow-[0_8px_20px_rgba(193,80,46,0.25)]"
                    : "bg-white text-emerald-dark border border-emerald/10"}`}>
                {s.nom_fr}
              </button>
            );
          })}
        </div>
      )}

      {loading ? (
        <p className="text-gray-400">Chargement...</p>
      ) : filtered.length === 0 ? (
        <div className="bg-white rounded-3xl p-16 text-center border border-emerald/5">
          <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-terracotta/10 flex items-center justify-center text-terracotta">
            <IconUser size={28} />
          </div>
          <p className="text-gray-400 mb-2">Aucune mise en garde pour le moment</p>
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
                className="bg-white rounded-3xl overflow-hidden border border-emerald/5
                           hover:border-terracotta/20
                           hover:shadow-[0_20px_50px_rgba(193,80,46,0.1)]
                           transition-all">
                <div className="grid md:grid-cols-[200px_1fr]">

                  {/* Photo cible */}
                  <div className="relative aspect-square bg-gradient-to-br from-terracotta/10 to-cream
                                  flex items-center justify-center overflow-hidden">
                    {m.cible_photo_url ? (
                      <img src={m.cible_photo_url} alt={m.cible_nom}
                        className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-20 h-20 rounded-full bg-terracotta/20 flex items-center justify-center text-terracotta">
                        <IconUser size={32} />
                      </div>
                    )}
                    <div className="absolute top-3 left-3 px-2 py-0.5 rounded-full
                                    bg-terracotta text-white text-[0.6rem] font-bold
                                    uppercase tracking-wider">
                      Mise en garde
                    </div>
                  </div>

                  {/* Contenu */}
                  <div className="p-6 flex flex-col">

                    {savant && (
                      <Link href={`/audio/savants/detail?slug=${savant.slug}`}
                        className="inline-flex items-center gap-2 text-xs font-bold
                                   text-gold uppercase tracking-wider mb-3
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
                      <p className="text-sm text-gray-500 mb-4">
                        {m.cible_description}
                      </p>
                    )}

                    {getRaison(m) && (
                      <div className="bg-cream rounded-2xl p-4 mb-4 border-l-4 border-terracotta">
                        <div className="text-xs font-bold text-terracotta uppercase tracking-wider mb-2">
                          Raison
                        </div>
                        <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-line">
                          {getRaison(m)}
                        </p>
                      </div>
                    )}

                    <div className="flex flex-wrap items-center gap-3 text-xs text-gray-400 mt-auto pt-3 border-t border-emerald/5">
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
    </main>
  );
}
