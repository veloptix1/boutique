"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { useLang } from "@/components/LangProvider";
import {
  IconCrown, IconStarFull, IconLocation, IconCalendar,
  IconArrowRight, IconUser, IconSearch,
} from "@/components/icons";

type Savant = {
  id: string;
  slug: string;
  nom_fr: string;
  nom_ar: string | null;
  nom_en: string | null;
  titre_fr: string | null;
  titre_ar: string | null;
  titre_en: string | null;
  pays: string | null;
  naissance: string | null;
  deces: string | null;
  photo_url: string | null;
  categorie: string;
};

type Filter = "tous" | "classique" | "contemporain";

export default function SavantsClient() {
  const { t, lang } = useLang();
  const [savants, setSavants] = useState<Savant[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<Filter>("tous");
  const [search, setSearch] = useState("");

  useEffect(() => {
    (async () => {
      const { data } = await supabase
        .from("savants")
        .select("*")
        .neq("categorie", "oustaz")
        .order("ordre", { ascending: true })
        .order("nom_fr", { ascending: true });
      setSavants(data || []);
      setLoading(false);
    })();
  }, []);

  const getName = (s: Savant) =>
    lang === "ar" ? s.nom_ar || s.nom_fr
      : lang === "en" ? s.nom_en || s.nom_fr
      : s.nom_fr;

  const getTitre = (s: Savant) =>
    lang === "ar" ? s.titre_ar || s.titre_fr
      : lang === "en" ? s.titre_en || s.titre_fr
      : s.titre_fr;

  const filtered = savants
    .filter((s) => filter === "tous" || s.categorie === filter)
    .filter((s) => {
      if (!search.trim()) return true;
      const q = search.toLowerCase();
      return (
        s.nom_fr?.toLowerCase().includes(q) ||
        s.nom_ar?.includes(search) ||
        s.nom_en?.toLowerCase().includes(q) ||
        s.titre_fr?.toLowerCase().includes(q) ||
        s.pays?.toLowerCase().includes(q)
      );
    });

  const filters: { id: Filter; label: string; Icon: any }[] = [
    { id: "tous",         label: "Tous",          Icon: IconUser },
    { id: "classique",    label: "Classiques",    Icon: IconCrown },
    { id: "contemporain", label: "Contemporains", Icon: IconStarFull },
  ];

  return (
    <main className="px-[6%] pt-24 pb-40 max-w-[1200px] mx-auto">

      <Link href="/audio" className="text-emerald text-sm font-semibold hover:underline inline-flex items-center gap-1">
        ← {t.common.back}
      </Link>

      <div className="mt-6 mb-10">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-12 h-12 rounded-2xl bg-emerald/10 flex items-center justify-center text-emerald">
            <IconCrown size={24} />
          </div>
          <div className="text-xs font-bold text-gold uppercase tracking-[3px]">
            Salafiya
          </div>
        </div>
        <h1 className="font-amiri font-bold text-emerald-dark text-4xl sm:text-5xl mb-3">
          {t.audio.bySavants}
        </h1>
        <p className="text-gray-500 max-w-2xl">
          Les savants de la Salafiya bien guidée — des anciens aux contemporains.
        </p>
      </div>

      <div className="relative mb-6">
        <div className="absolute left-5 top-1/2 -translate-y-1/2 text-emerald/50 pointer-events-none">
          <IconSearch size={18} />
        </div>
        <input
          type="text"
          placeholder="Rechercher un savant par nom, titre ou pays..."
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

      <div className="flex gap-2 mb-8 overflow-x-auto pb-2">
        {filters.map(({ id, label, Icon }) => (
          <button key={id} onClick={() => setFilter(id)}
            className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-full
                        text-sm font-semibold whitespace-nowrap transition
              ${filter === id
                ? "bg-emerald text-white shadow-[0_8px_20px_rgba(13,92,74,0.25)]"
                : "bg-white text-emerald-dark border border-emerald/10"}`}>
            <Icon size={16} />
            {label}
          </button>
        ))}
      </div>

      {loading ? (
        <p className="text-gray-400">Chargement...</p>
      ) : filtered.length === 0 ? (
        <div className="bg-white rounded-3xl p-16 text-center border border-emerald/5">
          <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-emerald/10 flex items-center justify-center text-emerald">
            <IconSearch size={28} />
          </div>
          <p className="text-gray-400">Aucun savant trouvé</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {filtered.map((s) => (
            <Link
              key={s.id}
              href={`/audio/savants/detail?slug=${s.slug}`}
              className="group bg-white rounded-2xl overflow-hidden
                         border border-emerald/5 hover:-translate-y-1
                         hover:shadow-[0_15px_35px_rgba(13,92,74,0.15)]
                         hover:border-emerald/20 transition-all no-underline
                         flex flex-col"
            >
              <div className="relative aspect-square bg-gradient-to-br from-emerald/5 to-cream
                              flex items-center justify-center overflow-hidden">
                {s.photo_url ? (
                  <img src={s.photo_url} alt={getName(s)}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                ) : (
                  <div className="w-20 h-20 rounded-full bg-gradient-to-br from-emerald to-emerald-dark
                                  flex items-center justify-center text-gold">
                    <IconUser size={32} />
                  </div>
                )}
                <div className={`absolute top-2 left-2 px-2 py-0.5 rounded-full
                              text-[0.58rem] font-bold uppercase tracking-wider
                  ${s.categorie === "classique"
                    ? "bg-gold/90 text-emerald-dark"
                    : "bg-emerald/90 text-white"}`}>
                  {s.categorie === "classique" ? "Class." : "Contemp."}
                </div>
              </div>

              <div className="p-3 flex flex-col flex-1">
                {s.nom_ar && (
                  <div className="font-amiri text-gold text-[0.7rem] mb-0.5 leading-tight" dir="rtl">
                    {s.nom_ar}
                  </div>
                )}
                <h3 className="font-bold text-emerald-dark text-sm leading-tight mb-1
                               line-clamp-2 min-h-[2.3em]">
                  {getName(s)}
                </h3>
                {getTitre(s) && (
                  <p className="text-[0.68rem] text-gray-500 mb-2 line-clamp-1">{getTitre(s)}</p>
                )}
                <div className="flex items-center gap-2 text-[0.62rem] text-gray-400
                                mt-auto pt-2 border-t border-emerald/5">
                  {s.pays && (
                    <span className="inline-flex items-center gap-0.5 truncate">
                      <IconLocation size={10} /> {s.pays}
                    </span>
                  )}
                  {s.deces && (
                    <span className="inline-flex items-center gap-0.5 shrink-0">
                      <IconCalendar size={10} /> {s.deces}
                    </span>
                  )}
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </main>
  );
}
