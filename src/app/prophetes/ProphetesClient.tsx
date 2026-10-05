"use client";
import { Bismillah, EndMark } from "@/components/PageHeader";
import { useEffect, useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { useLang } from "@/components/LangProvider";
import { IconSearch, IconArrowRight, IconStar } from "@/components/icons";
import { Bismillah, EndMark } from "@/components/PageHeader";

type Prophete = {
  id: string;
  slug: string;
  nom_fr: string;
  nom_ar: string | null;
  nom_en: string | null;
  surnom_fr: string | null;
  surnom_ar: string | null;
  epoque: string | null;
  lieu: string | null;
  ordre: number;
};

export default function ProphetesClient() {
  const { lang } = useLang();
  const [prophetes, setProphetes] = useState<Prophete[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    (async () => {
      try {
        const { data } = await supabase.from("prophetes").select("*").order("ordre");
        setProphetes(data || []);
      } catch (e) { console.error(e); }
      finally { setLoading(false); }
    })();
  }, []);

  const getName = (p: Prophete) =>
    lang === "ar" ? p.nom_ar || p.nom_fr
      : lang === "en" ? p.nom_en || p.nom_fr
      : p.nom_fr;

  const getSurnom = (p: Prophete) =>
    lang === "ar" ? p.surnom_ar || p.surnom_fr : p.surnom_fr;

  const filtered = prophetes.filter((p) => {
    if (!search.trim()) return true;
    const q = search.toLowerCase();
    return (
      p.nom_fr.toLowerCase().includes(q) ||
      p.nom_ar?.includes(search) ||
      p.surnom_fr?.toLowerCase().includes(q)
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
          <div className="w-12 h-12 rounded-2xl bg-gold/15 flex items-center justify-center text-gold">
            <IconStar size={24} />
          </div>
          <div className="text-xs font-bold text-gold uppercase tracking-[3px]">
            Les Messagers d''Allah
          </div>
        </div>
        <h1 className="font-amiri font-bold text-emerald-dark text-4xl sm:text-5xl mb-3">
          Les Prophètes
        </h1>
        <p className="text-gray-500 max-w-2xl">
          Les 25 prophètes mentionnés dans le Coran — avec leurs passages coraniques,
          les hadiths authentiques et les paroles des savants.
        </p>
      </div>

      <div className="relative mb-8">
        <div className="absolute left-5 top-1/2 -translate-y-1/2 text-emerald/50 pointer-events-none">
          <IconSearch size={18} />
        </div>
        <input type="text" placeholder="Rechercher un prophète..."
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
          <p className="text-gray-400">Aucun prophète trouvé</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {filtered.map((p) => (
            <Link key={p.id} href={`/prophetes/detail?slug=${p.slug}`}
              className="group bg-white rounded-2xl overflow-hidden
                         border border-emerald/5 hover:-translate-y-1
                         hover:shadow-[0_15px_35px_rgba(212,175,55,0.15)]
                         hover:border-gold/30 transition-all no-underline
                         flex flex-col p-5">
              <div className="text-center mb-3">
                <div className="w-16 h-16 mx-auto rounded-full bg-gradient-to-br from-gold/20 to-gold/5
                                flex items-center justify-center text-gold font-amiri font-bold text-2xl
                                group-hover:scale-110 transition">
                  {p.ordre}
                </div>
              </div>
              {p.nom_ar && lang !== "ar" && (
                <div className="font-amiri text-gold text-lg text-center mb-1" dir="rtl">
                  {p.nom_ar}
                </div>
              )}
              <h3 className="font-bold text-emerald-dark text-base text-center leading-tight mb-1">
                {getName(p)}
              </h3>
              {getSurnom(p) && (
                <p className="text-[0.7rem] text-gray-500 text-center line-clamp-2 mb-3">
                  {getSurnom(p)}
                </p>
              )}
              <div className="flex items-center justify-center gap-1 text-xs font-semibold text-gold
                              group-hover:gap-2 transition-all mt-auto pt-3 border-t border-emerald/5">
                Voir les sources
                <IconArrowRight size={10} />
              </div>
            </Link>
          ))}
        </div>
      )}
      <EndMark />
    </main>
  );
}
