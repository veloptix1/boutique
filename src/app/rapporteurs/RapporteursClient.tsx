"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { BackLink, ListSkeleton, PageHeader, SearchField } from "@/components/ui";
import { supabase } from "@/lib/supabase";
import { useLang } from "@/components/LangProvider";
import { EndMark } from "@/components/PageHeader";
import { IconArrowRight } from "@/components/icons";

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
    <main className="page">

      <BackLink href="/dashboard" label="Retour" />


      <PageHeader title="Rapporteurs de Hadiths" subtitle="Les grands rapporteurs (rawî) des hadiths authentiques du Prophète ﷺ, avec leurs biographies, leurs apports et les avis des savants." />

      <SearchField value={search} onChange={setSearch} placeholder="Rechercher un rapporteur..." />

      {loading ? (
        <ListSkeleton />
      ) : filtered.length === 0 ? (
        <div className="bg-white rounded-2xl p-8 text-center border border-line">
          <p className="text-muted">Aucun rapporteur trouvé</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map((r) => (
            <Link key={r.id} href={`/rapporteurs/detail?slug=${r.slug}`}
              className="group bg-white rounded-2xl overflow-hidden
                         border border-line
                         hover:border-emerald/30 transition-all no-underline
                         flex flex-col p-6">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald to-emerald-dark
                              flex items-center justify-center text-gold font-amiri font-bold text-xl
                              mb-4 transition">
                {r.ordre}
              </div>

              {r.nom_ar && lang !== "ar" && (
                <div className="font-amiri text-gold text-xl mb-1" dir="rtl">{r.nom_ar}</div>
              )}

              <h3 className="font-bold text-emerald-dark text-lg leading-tight mb-2">
                {getName(r)}
              </h3>

              {getTitre(r) && (
                <p className="text-xs text-muted line-clamp-2 mb-3">{getTitre(r)}</p>
              )}

              {r.nombre_hadiths && (
                <div className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full
                                bg-gold/15 text-gold-deep text-xs font-bold mb-3 w-fit">
                  {r.nombre_hadiths}
                </div>
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
