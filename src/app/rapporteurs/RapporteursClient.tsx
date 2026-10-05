"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { useLang } from "@/components/LangProvider";
import { Bismillah, EndMark } from "@/components/PageHeader";
import { IconSearch, IconArrowRight, IconParchemin } from "@/components/icons";

type Rapporteur = {
  id: string;
  slug: string;
  nom_fr: string;
  nom_ar: string | null;
  nom_en: string | null;
  titre_fr: string | null;
  titre_ar: string | null;
  epoque: string | null;
  nombre_hadiths: string | null;
  ordre: number;
};

export default function RapporteursClient() {
  const { lang } = useLang();
  const [list, setList] = useState<Rapporteur[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    (async () => {
      try {
        const { data } = await supabase.from("rapporteurs").select("*").order("ordre");
        setList(data || []);
      } catch (e) { console.error(e); }
      finally { setLoading(false); }
    })();
  }, []);

  const getName = (r: Rapporteur) =>
    lang === "ar" ? r.nom_ar || r.nom_fr
      : lang === "en" ? r.nom_en || r.nom_fr
      : r.nom_fr;

  const getTitre = (r: Rapporteur) =>
    lang === "ar" ? r.titre_ar || r.titre_fr : r.titre_fr;

  const filtered = list.filter((r) => {
    if (!search.trim()) return true;
    const q = search.toLowerCase();
    return (
      r.nom_fr.toLowerCase().includes(q) ||
      r.nom_ar?.includes(search) ||
      r.titre_fr?.toLowerCase().includes(q)
    );
  });

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
          <div className="w-12 h-12 rounded-2xl bg-emerald/10 flex items-center justify-center text-emerald">
            <IconParchemin size={24} />
          </div>
          <div className="text-xs font-bold text-emerald uppercase tracking-[3px]">
            Science du Hadith
          </div>
        </div>
        <h1 className="font-amiri font-bold text-emerald-dark text-4xl sm:text-5xl mb-3">
          Rapporteurs de Hadiths
        </h1>
        <p className="text-gray-500 max-w-2xl">
          Les grands rapporteurs (rawî) des hadiths authentiques du Prophète ﷺ,
          avec leurs biographies, leurs apports et les avis des savants.
        </p>
      </div>

      <div className="relative mb-8">
        <div className="absolute left-5 top-1/2 -translate-y-1/2 text-emerald/50 pointer-events-none">
          <IconSearch size={18} />
        </div>
        <input type="text" placeholder="Rechercher un rapporteur..."
          value={search} onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-14 pr-5 py-4 rounded-2xl border-2 border-emerald/10
                     focus:border-gold outline-none text-sm bg-white" />
        {search && (
          <button onClick={() => setSearch("")}
            className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-400
                       hover:text-terracotta text-xl leading-none">×</button>
        )}
      </div>

      {loading ? (
        <p className="text-gray-400">Chargement...</p>
      ) : filtered.length === 0 ? (
        <div className="bg-white rounded-3xl p-16 text-center border border-emerald/5">
          <p className="text-gray-400">Aucun rapporteur trouvé</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map((r) => (
            <Link key={r.id} href={`/rapporteurs/detail?slug=${r.slug}`}
              className="group bg-white rounded-2xl overflow-hidden
                         border border-emerald/5 hover:-translate-y-1
                         hover:shadow-[0_15px_35px_rgba(13,92,74,0.15)]
                         hover:border-emerald/30 transition-all no-underline
                         flex flex-col p-6">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald to-emerald-dark
                              flex items-center justify-center text-gold font-amiri font-bold text-xl
                              mb-4 group-hover:scale-110 transition">
                {r.ordre}
              </div>

              {r.nom_ar && lang !== "ar" && (
                <div className="font-amiri text-gold text-xl mb-1" dir="rtl">{r.nom_ar}</div>
              )}

              <h3 className="font-bold text-emerald-dark text-lg leading-tight mb-2">
                {getName(r)}
              </h3>

              {getTitre(r) && (
                <p className="text-xs text-gray-500 line-clamp-2 mb-3">{getTitre(r)}</p>
              )}

              {r.nombre_hadiths && (
                <div className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full
                                bg-gold/15 text-gold text-[0.65rem] font-bold mb-3 w-fit">
                  {r.nombre_hadiths}
                </div>
              )}

              <div className="flex items-center gap-1.5 text-xs font-semibold text-emerald
                              group-hover:gap-2.5 transition-all mt-auto pt-3 border-t border-emerald/5">
                Voir sa biographie
                <IconArrowRight size={12} />
              </div>
            </Link>
          ))}
        </div>
      )}

      <EndMark />
    </main>
  );
}
