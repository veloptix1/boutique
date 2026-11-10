"use client";
import { EndMark } from "@/components/PageHeader";
import { useEffect, useState } from "react";
import Link from "next/link";
import { BackLink, ListSkeleton, PageHeader, SearchField } from "@/components/ui";
import { supabase } from "@/lib/supabase";
import { useLang } from "@/components/LangProvider";
import { IconArrowRight } from "@/components/icons";

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
    <main className="page">

      <BackLink href="/dashboard" label="Retour" />


      <PageHeader title="Les Sahaba" subtitle="Biographies des Compagnons du Prophète ﷺ — uniquement basées sur le Coran, les hadiths authentiques et les paroles des savants de la Salafiya." />

      <SearchField value={search} onChange={setSearch} placeholder="Rechercher un Sahaba..." />

      {loading ? (
        <ListSkeleton />
      ) : filtered.length === 0 ? (
        <div className="bg-white rounded-2xl p-8 text-center border border-line">
          <p className="text-muted">Aucun Sahaba trouvé</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map((s) => (
            <Link key={s.id} href={`/sahaba/detail?slug=${s.slug}`}
              className="group bg-white rounded-2xl overflow-hidden
                         border border-line
                         hover:border-emerald/30 transition-all no-underline
                         flex flex-col p-6">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald to-emerald-dark
                              flex items-center justify-center text-gold font-amiri font-bold text-xl
                              mb-4 transition">
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
                <p className="text-xs text-muted line-clamp-2 mb-4">
                  {getTitre(s)}
                </p>
              )}

              <div className="flex items-center gap-1.5 text-xs font-semibold text-emerald
                              group-hover:gap-2.5 transition-all mt-auto pt-3 border-t border-line">
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
