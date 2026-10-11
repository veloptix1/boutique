"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { playAudio } from "@/components/AudioPlayerFull";
import { Bismillah, EndMark } from "@/components/PageHeader";
import { IconSearch, IconPlay, IconArrowRight } from "@/components/icons";

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
  { slug: "mishaari_raashid_al_3afaasee",           nom: "Cheikh Mishary Al-Afasy",          pays: "Koweït" },
  { slug: "abdurrahmaan_as-sudays",                 nom: "Cheikh Abdul-Rahman Al-Sudais",    pays: "Arabie Saoudite" },
  { slug: "mahmoud_khalil_al-husary",               nom: "Cheikh Mahmoud Khalil Al-Husary",  pays: "Égypte" },
  { slug: "mahmoud_khalil_al-husary_mujawwad",      nom: "Cheikh Al-Husary (Mujawwad)",      pays: "Égypte" },
  { slug: "abdul_basit_murattal",                   nom: "Cheikh Abdul-Basit (Murattal)",    pays: "Égypte" },
  { slug: "abdul_basit_mujawwad",                   nom: "Cheikh Abdul-Basit (Mujawwad)",    pays: "Égypte" },
  { slug: "muhammad_siddiq_al-minshawi",            nom: "Cheikh Muhammad Al-Minshawi",      pays: "Égypte" },
  { slug: "muhammad_siddiq_al-minshawi_mujawwad",   nom: "Cheikh Al-Minshawi (Mujawwad)",    pays: "Égypte" },
  { slug: "muhammad_ayyub",                         nom: "Cheikh Muhammad Ayyoub",           pays: "Arabie Saoudite" },
  { slug: "sa'ud_ash-shuraym",                      nom: "Cheikh Saud Ash-Shuraim",          pays: "Arabie Saoudite" },
  { slug: "ahmed_ibn_ali_al_ajamy",                 nom: "Cheikh Ahmed Al-Ajamy",            pays: "Arabie Saoudite" },
  { slug: "maher_al_muaiqly",                       nom: "Cheikh Maher Al-Muaiqly",          pays: "Arabie Saoudite" },
  { slug: "yasser_ad-dussary",                      nom: "Cheikh Yasser Al-Dosari",          pays: "Arabie Saoudite" },
  { slug: "nasser_al_qatami",                       nom: "Cheikh Nasser Al-Qatami",          pays: "Koweït" },
  { slug: "khalifa_altunaiji",                      nom: "Cheikh Khalifa Al-Tunaiji",        pays: "Émirats Arabes Unis" },
  { slug: "saad_al_ghamdi",                         nom: "Cheikh Saad Al-Ghamdi",            pays: "Arabie Saoudite" },
  { slug: "ali_jaber",                              nom: "Cheikh Ali Jaber",                 pays: "Arabie Saoudite" },
  { slug: "mahmoud_ali_al_banna",                   nom: "Cheikh Mahmoud Ali Al-Banna",      pays: "Égypte" },
  { slug: "abdullah_al-juhany",                     nom: "Cheikh Abdullah Al-Juhany",        pays: "Arabie Saoudite" },
  { slug: "ali_al_hudhaify",                        nom: "Cheikh Ali Al-Hudhaify",           pays: "Arabie Saoudite" },
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
  const [searchRec, setSearchRec] = useState("");

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
  const filteredRecitateurs = RECITATEURS.filter((r) =>
    r.nom.toLowerCase().includes(searchRec.toLowerCase()) ||
    r.pays.toLowerCase().includes(searchRec.toLowerCase())
  );

  return (
    <main className="px-[6%] pt-24 pb-40 max-w-[1200px] mx-auto min-h-screen">

      <Link href="/audio" className="text-emerald text-sm font-semibold hover:underline">
        ← Retour
      </Link>

      <div className="mt-8">
        <Bismillah />
      </div>

      <div className="mb-10">
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
          114 sourates — Écoutez, lisez et téléchargez avec {RECITATEURS.length} récitateurs.
        </p>
      </div>

      <div className="relative mb-4">
        <div className="absolute left-5 top-1/2 -translate-y-1/2 text-emerald/50 pointer-events-none">
          <IconSearch size={18} />
        </div>
        <input
          type="text"
          placeholder="Rechercher par numéro, nom français, arabe ou translittération..."
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

      <div className="flex flex-wrap gap-3 mb-6">
        <div className="flex gap-2 overflow-x-auto">
          {types.map((t) => (
            <button key={t} onClick={() => setFilterType(t)}
              className={`px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition
                ${filterType === t
                  ? "bg-emerald text-white shadow-[0_4px_12px_rgba(13,92,74,0.25)]"
                  : "bg-white text-emerald-dark border border-emerald/10"}`}>
              {t === "tous" ? "Toutes" : t}
            </button>
          ))}
        </div>

        <div className="relative ml-auto">
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value as SortOption)}
            className="px-4 py-2 rounded-full text-xs font-semibold bg-white
                       border border-emerald/10 text-emerald-dark outline-none
                       focus:border-gold cursor-pointer appearance-none pr-9">
            {sortOptions.map((o) => (
              <option key={o.id} value={o.id}>{o.label}</option>
            ))}
          </select>
          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-emerald pointer-events-none">
            ▼
          </span>
        </div>
      </div>

      <p className="text-sm text-gray-500 mb-5">
        {sorted.length} sourate{sorted.length > 1 ? "s" : ""}
        {search && ` pour « ${search} »`}
      </p>

      {loading ? (
        <p className="text-gray-400">Chargement...</p>
      ) : sorted.length === 0 ? (
        <div className="bg-white rounded-3xl p-16 text-center border border-emerald/5">
          <p className="text-gray-400">Aucune sourate trouvée</p>
        </div>
      ) : (
        <div className="grid gap-3">
          {sorted.map((s) => (
            <div key={s.numero}
              className="bg-white rounded-2xl border border-emerald/5
                         hover:border-emerald/15 transition-all">
              <div className="flex items-center gap-3 p-3 sm:p-4">

                <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-emerald/8
                                flex items-center justify-center text-emerald font-bold
                                text-xs sm:text-sm shrink-0">
                  {s.numero}
                </div>

                <Link href={`/audio/coran/sourate?numero=${s.numero}`}
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
                    <span className="hidden sm:inline">·</span>
                    <span className={`hidden sm:inline px-2 py-0.5 rounded-full text-[0.6rem] font-bold
                      ${s.type === "Mecquoise"
                        ? "bg-gold/15 text-gold"
                        : "bg-emerald/10 text-emerald"}`}>
                      {s.type}
                    </span>
                  </div>
                </Link>

                <button
                  onClick={() => { setOpenMenuFor(s.numero); setSearchRec(""); }}
                  aria-label="Voir les récitateurs"
                  className="relative w-10 h-10 sm:w-11 sm:h-11 rounded-xl
                              flex flex-col items-center justify-center gap-[3px]
                              transition shrink-0 border-2
                              bg-emerald border-emerald text-gold hover:bg-emerald-dark cursor-pointer">
                  <span className="w-4 h-[2px] bg-current rounded" />
                  <span className="w-4 h-[2px] bg-current rounded" />
                  <span className="w-2.5 h-[2px] bg-current rounded self-start ml-3" />
                  <span className="absolute -top-1.5 -right-1.5 min-w-[1.1rem] h-[1.1rem]
                                   px-1 rounded-full bg-gold text-emerald-dark
                                   text-[0.6rem] font-bold flex items-center justify-center
                                   border-2 border-white leading-none">
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
          className="fixed inset-0 z-[999] bg-black/60 backdrop-blur-sm
                     flex items-end sm:items-center justify-center"
          onClick={() => setOpenMenuFor(null)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full sm:max-w-md bg-white rounded-t-3xl sm:rounded-3xl
                       max-h-[80vh] overflow-hidden flex flex-col
                       shadow-[0_-20px_60px_rgba(0,0,0,0.3)]"
          >
            <div className="px-5 py-4 border-b border-emerald/10 flex items-center justify-between shrink-0">
              <div>
                <div className="text-xs font-bold text-gold uppercase tracking-wider">
                  {RECITATEURS.length} récitateurs disponibles
                </div>
                <div className="text-sm font-semibold text-emerald-dark mt-1">
                  Sourate {openMenuFor} — {sourates.find((s) => s.numero === openMenuFor)?.nom_translit}
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

            <div className="p-3 border-b border-emerald/10">
              <input
                type="text"
                placeholder="Rechercher un récitateur ou un pays..."
                value={searchRec}
                onChange={(e) => setSearchRec(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border-2 border-emerald/10
                           focus:border-gold outline-none text-sm" />
            </div>

            <div className="overflow-y-auto flex-1">
              {filteredRecitateurs.length === 0 ? (
                <div className="px-4 py-6 text-center text-sm text-gray-400">
                  Aucun récitateur trouvé
                </div>
              ) : (
                filteredRecitateurs.map((r) => (
                  <div key={r.slug} className="border-b border-emerald/5 last:border-0">
                    <button
                      onClick={() => {
                        playAudio({
                          url: getAudioUrl(r, openMenuFor),
                          titre: `Sourate ${openMenuFor} — ${sourates.find((s) => s.numero === openMenuFor)?.nom_translit}`,
                          auteur: r.nom,
                        });
                        setOpenMenuFor(null);
                        setSearchRec("");
                      }}
                      className="w-full px-5 py-4 flex items-center gap-3
                                 hover:bg-cream transition text-left">
                      <div className="w-10 h-10 rounded-full bg-gold
                                      flex items-center justify-center shrink-0">
                        <IconPlay size={12} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-bold text-emerald-dark leading-tight">
                          {r.nom}
                        </div>
                        <div className="text-xs text-gray-500 mt-0.5">{r.pays}</div>
                      </div>
                      <IconArrowRight size={14} />
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}

      <EndMark />
    </main>
  );
}
