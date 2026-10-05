"use client";
import { Bismillah, EndMark } from "@/components/PageHeader";
import { useEffect, useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { useLang } from "@/components/LangProvider";
import { IconSearch, IconArrowRight, IconStar } from "@/components/icons";

type Sahaba = {
  id: string;
  slug: string;
  nom_fr: string;
  nom_ar: string | null;
  nom_en: string | null;
  titre_fr: string | null;
  titre_ar: string | null;
  ordre: number;
};

export default function SahabaClient() {
  const { lang } = useLang();
  const [sahaba, setSahaba] = useState<Sahaba[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    (async () => {
      try {
        const { data } = await supabase.from("sahaba").select("*").order("ordre");
        setSahaba(data || []);
      } catch (e) { console.error(e); }
      finally { setLoading(false); }
    })();
  }, []);

  const getName = (s: Sahaba) =>
    lang === "ar" ? s.nom_ar || s.nom_fr
      : lang === "en" ? s.nom_en || s.nom_fr
      : s.nom_fr;

  const getTitre = (s: Sahaba) =>
    lang === "ar" ? s.titre_ar || s.titre_fr : s.titre_fr;

  const filtered = sahaba.filter((s) => {
    if (!search.trim()) return true;
    const q = search.toLowerCase();
    return (
      s.nom_fr.toLowerCase().includes(q) ||
      s.nom_ar?.includes(search) ||
      s.titre_fr?.toLowerCase().includes(q)
    );
  });

  return (
    <main className="px-[6%] pt-24 pb-40 max-w-[1200px] mx-auto min-h-screen">

      <Link href="/dashboard" className="text-emerald text-sm font-semibold hover:underline">
        ← Retour
      </Link>

      <div className="mt-8"><Bismillah /></div>

      <div className="mb-10">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-12 h-12 rounded-2xl bg-emerald/10 flex items-center justify-center text-emerald">
            <IconStar size={24} />
          </div>
          <div className="text-xs font-bold text-emerald uppercase tracking-[3px]">
            Les Compagnons du Prophète ﷺ
          </div>
        </div>
        <h1 className="font-amiri font-bold text-emerald-dark text-4xl sm:text-5xl mb-3">
          Les Sahaba
        </h1>
        <p className="text-gray-500 max-w-2xl">
          Biographies des Compagnons du Prophète ﷺ — uniquement basées sur le Coran,
          les hadiths authentiques et les paroles des savants de la Salafiya.
        </p>
      </div>

      <div className="relative mb-8">
        <div className="absolute left-5 top-1/2 -translate-y-1/2 text-emerald/50 pointer-events-none">
          <IconSearch size={18} />
        </div>
        <input type="text" placeholder="Rechercher un Sahaba..."
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
          <p className="text-gray-400">Aucun Sahaba trouvé</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map((s) => (
            <Link key={s.id} href={`/sahaba/detail?slug=${s.slug}`}
              className="group bg-white rounded-2xl overflow-hidden
                         border border-emerald/5 hover:-translate-y-1
                         hover:shadow-[0_15px_35px_rgba(13,92,74,0.15)]
                         hover:border-emerald/30 transition-all no-underline
                         flex flex-col p-6">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald to-emerald-dark
                              flex items-center justify-center text-gold font-amiri font-bold text-xl
                              mb-4 group-hover:scale-110 transition">
                {s.ordre}
              </div>

              {s.nom_ar && lang !== "ar" && (
                <div className="font-amiri text-gold text-xl mb-1" dir="rtl">
                  {s.nom_ar}
                </div>
              )}

              <h3 className="font-bold text-emerald-dark text-lg leading-tight mb-2">
                {getName(s)}
              </h3>

              {getTitre(s) && (
                <p className="text-xs text-gray-500 line-clamp-2 mb-4">
                  {getTitre(s)}
                </p>
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
