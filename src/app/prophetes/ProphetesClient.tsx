"use client";
import { EndMark } from "@/components/PageHeader";
import { useEffect, useState } from "react";
import Link from "next/link";
import { BackLink, ListSkeleton, PageHeader, SearchField } from "@/components/ui";
import { supabase } from "@/lib/supabase";
import { useLang } from "@/components/LangProvider";
import { IconArrowRight } from "@/components/icons";

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
    <main className="page">

      <BackLink href="/dashboard" label="Retour" />


      <PageHeader title="Les Prophètes" subtitle="Les 25 prophètes mentionnés dans le Coran — avec leurs passages coraniques, les hadiths authentiques et les paroles des savants." />

      <SearchField value={search} onChange={setSearch} placeholder="Rechercher un prophète..." />

      {loading ? (
        <ListSkeleton />
      ) : filtered.length === 0 ? (
        <div className="bg-surface rounded-2xl p-8 text-center border border-line">
          <p className="text-muted">Aucun prophète trouvé</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {filtered.map((p) => (
            <Link key={p.id} href={`/prophetes/detail?slug=${p.slug}`}
              className="group bg-surface rounded-2xl overflow-hidden
                         border border-line
                         hover:border-gold/30 transition-all no-underline
                         flex flex-col p-5">
              <div className="text-center mb-3">
                <div className="w-16 h-16 mx-auto rounded-full bg-gradient-to-br from-gold/20 to-gold/5
                                flex items-center justify-center text-gold font-amiri font-bold text-2xl transition">
                  {p.ordre}
                </div>
              </div>
              {p.nom_ar && lang !== "ar" && (
                <div className="font-amiri text-gold text-lg text-center mb-1" dir="rtl">
                  {p.nom_ar}
                </div>
              )}
              <h3 className="font-bold text-heading text-base text-center leading-tight mb-1">
                {getName(p)}
              </h3>
              {getSurnom(p) && (
                <p className="text-xs text-muted text-center line-clamp-2 mb-3">
                  {getSurnom(p)}
                </p>
              )}
              <div className="flex items-center justify-center gap-1 text-xs font-semibold text-gold
                              group-hover:gap-2 transition-all mt-auto pt-3 border-t border-line">
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
