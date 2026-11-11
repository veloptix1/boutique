"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { BackLink, ListSkeleton, PageHeader, SearchField } from "@/components/ui";
import { supabase } from "@/lib/supabase";
import { playAudio } from "@/components/AudioPlayerFull";
import { EndMark } from "@/components/PageHeader";
import { IconPlay, IconArrowRight } from "@/components/icons";

type Sourate = {
  numero: number;
  nom_ar: string;
  nom_fr: string;
  nom_translit: string;
  versets: number;
  type: string;
};

type Recitateur = {
  slug: string;
  nom: string;
  pays: string;
};

const RECITATEURS: Recitateur[] = [
  { slug: "mishaari_raashid_al_3afaasee", nom: "Cheikh Mishary Al-Afasy",       pays: "Koweït" },
  { slug: "abdurrahmaan_as-sudays",       nom: "Cheikh Abdul-Rahman Al-Sudais", pays: "Arabie Saoudite" },
  { slug: "abdul_basit_murattal",         nom: "Cheikh Abdul-Basit (Murattal)", pays: "Égypte" },
  { slug: "yasser_ad-dussary",            nom: "Cheikh Yasser Al-Dosari",       pays: "Arabie Saoudite" },
  { slug: "ali_jaber",                    nom: "Cheikh Ali Jaber",              pays: "Arabie Saoudite" },
];

const getAudioUrl = (recitateur: Recitateur, numero: number) => {
  const numeroPad = String(numero).padStart(3, "0");
  return `https://download.quranicaudio.com/quran/${recitateur.slug}/${numeroPad}.mp3`;
};

type SortOption = "num-asc" | "num-desc" | "nom-asc" | "versets-asc" | "versets-desc" | "type";

export default function CoranClient() {
  const [sourates, setSourates] = useState<Sourate[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filterType, setFilterType] = useState("tous");
  const [sort, setSort] = useState<SortOption>("num-asc");
  const [openMenuFor, setOpenMenuFor] = useState<number | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const { data } = await supabase.from("sourates").select("*");
        setSourates(data || []);
      } catch (e) { console.error(e); }
      finally { setLoading(false); }
    })();
  }, []);

  useEffect(() => {
    document.body.style.overflow = openMenuFor !== null ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [openMenuFor]);

  const filtered = sourates.filter((s) => {
    if (filterType !== "tous" && s.type !== filterType) return false;
    if (!search.trim()) return true;
    const q = search.toLowerCase();
    return (
      String(s.numero) === search.trim() ||
      s.nom_fr.toLowerCase().includes(q) ||
      s.nom_translit.toLowerCase().includes(q) ||
      s.nom_ar.includes(search)
    );
  });

  const sorted = [...filtered].sort((a, b) => {
    switch (sort) {
      case "num-asc":      return a.numero - b.numero;
      case "num-desc":     return b.numero - a.numero;
      case "nom-asc":      return a.nom_translit.localeCompare(b.nom_translit);
      case "versets-asc":  return a.versets - b.versets;
      case "versets-desc": return b.versets - a.versets;
      case "type":         return a.type.localeCompare(b.type) || a.numero - b.numero;
      default:             return a.numero - b.numero;
    }
  });

  const sortOptions: { id: SortOption; label: string }[] = [
    { id: "num-asc",      label: "N° croissant" },
    { id: "num-desc",     label: "N° décroissant" },
    { id: "nom-asc",      label: "Nom (A-Z)" },
    { id: "versets-desc", label: "Plus longue" },
    { id: "versets-asc",  label: "Plus courte" },
    { id: "type",         label: "Mecquoise/Médinoise" },
  ];

  const types = ["tous", "Mecquoise", "Médinoise"];

  return (
    <main className="page">

      <PageHeader
        title="Coran"
        subtitle={`114 sourates — écoutez, lisez et téléchargez avec ${RECITATEURS.length} récitateurs.`}
        back="/audio"
      />

      <SearchField value={search} onChange={setSearch} placeholder="Rechercher par numéro, nom français, arabe ou translittération..." />

      <div className="flex flex-wrap gap-3 mb-6">
        <div className="flex gap-2 overflow-x-auto">
          {types.map((t) => (
            <button key={t} onClick={() => setFilterType(t)}
              aria-pressed={filterType === t} className="chip">
              {t === "tous" ? "Toutes" : t}
            </button>
          ))}
        </div>

        <div className="relative ml-auto">
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value as SortOption)}
            aria-label="Trier"
            className="field w-auto appearance-none pr-9">
            {sortOptions.map((o) => (
              <option key={o.id} value={o.id}>{o.label}</option>
            ))}
          </select>
          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-link pointer-events-none">
            ▼
          </span>
        </div>
      </div>

      <p className="text-sm text-muted mb-5">
        {sorted.length} sourate{sorted.length > 1 ? "s" : ""}
        {search && ` pour « ${search} »`}
      </p>

      {loading ? (
        <ListSkeleton />
      ) : sorted.length === 0 ? (
        <div className="bg-surface rounded-2xl p-8 text-center border border-line">
          <p className="text-muted">Aucune sourate trouvée</p>
        </div>
      ) : (
        <div className="grid gap-3">
          {sorted.map((s) => (
            <div key={s.numero}
              className="bg-surface rounded-2xl border border-line
                         hover:border-emerald/15 transition-all">
              <div className="flex items-center gap-3 p-3 sm:p-4">

                <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-emerald/8
                                flex items-center justify-center text-link font-bold
                                text-xs sm:text-sm shrink-0">
                  {s.numero}
                </div>

                <Link href={`/audio/coran/sourate?numero=${s.numero}`}
                  className="flex-1 min-w-0 no-underline group">
                  <div className="font-semibold text-heading text-xs sm:text-sm
                                  truncate group-hover:text-link transition">
                    {s.nom_translit} — {s.nom_fr}
                  </div>
                  <div className="flex items-center gap-1.5 sm:gap-2 text-xs sm:text-xs
                                  text-muted mt-0.5">
                    <span className="font-amiri" dir="rtl">{s.nom_ar}</span>
                    <span className="hidden sm:inline">·</span>
                    <span className="hidden sm:inline">{s.versets} versets</span>
                    <span className="hidden sm:inline">·</span>
                    <span aria-pressed={s.type === "Mecquoise"} className="chip">
                      {s.type}
                    </span>
                  </div>
                </Link>

                <button
                  onClick={() => setOpenMenuFor(s.numero)}
                  aria-label="Voir les récitateurs"
                  className="relative w-10 h-10 sm:w-11 sm:h-11 rounded-xl
                              flex flex-col items-center justify-center gap-[3px]
                              transition shrink-0 border
                              bg-emerald border-emerald text-gold hover:bg-emerald-dark cursor-pointer">
                  <span className="w-4 h-[2px] bg-current rounded" />
                  <span className="w-4 h-[2px] bg-current rounded" />
                  <span className="w-2.5 h-[2px] bg-current rounded self-start ml-3" />
                  <span className="absolute -top-1.5 -right-1.5 min-w-[1.1rem] h-[1.1rem]
                                   px-1 rounded-full bg-gold text-emerald-dark
                                   text-xs font-bold flex items-center justify-center
                                   border border-surface leading-none">
                    {RECITATEURS.length}
                  </span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {openMenuFor !== null && (
        <div
          role="dialog" aria-modal="true" aria-label="Récitateurs disponibles"
          className="fixed inset-0 z-[999] bg-black/60
                     flex items-end sm:items-center justify-center"
          onClick={() => setOpenMenuFor(null)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full sm:max-w-md bg-surface rounded-t-3xl sm:rounded-2xl
                       max-h-[80vh] overflow-hidden flex flex-col"
          >
            <div className="px-5 py-4 border-b border-line flex items-center justify-between shrink-0">
              <div>
                <div className="text-xs font-bold text-gold">
                  Récitateurs disponibles
                </div>
                <div className="text-sm font-semibold text-heading mt-1">
                  Sourate {openMenuFor} — {sourates.find((s) => s.numero === openMenuFor)?.nom_translit}
                </div>
              </div>
              <button
                onClick={() => setOpenMenuFor(null)}
                className="w-9 h-9 rounded-full bg-emerald/8 text-link
                           hover:bg-emerald/15 flex items-center justify-center
                           text-xl leading-none shrink-0">
                ×
              </button>
            </div>

            <div className="overflow-y-auto flex-1">
              {RECITATEURS.map((r) => (
                <div key={r.slug} className="border-b border-line last:border-0">
                  <button
                    onClick={() => {
                      playAudio({
                        url: getAudioUrl(r, openMenuFor),
                        titre: `Sourate ${openMenuFor} — ${sourates.find((s) => s.numero === openMenuFor)?.nom_translit}`,
                        auteur: r.nom,
                      });
                      setOpenMenuFor(null);
                    }}
                    className="w-full px-5 py-4 flex items-center gap-3
                               hover:bg-cream transition text-left">
                    <div className="w-10 h-10 rounded-full bg-gold
                                    flex items-center justify-center shrink-0">
                      <IconPlay size={12} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-bold text-heading leading-tight">
                        {r.nom}
                      </div>
                      <div className="text-xs text-muted mt-0.5">{r.pays}</div>
                    </div>
                    <IconArrowRight size={14} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      <EndMark />
    </main>
  );
}
