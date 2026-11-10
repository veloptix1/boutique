"use client";
import { EndMark } from "@/components/PageHeader";
import { useEffect, useState } from "react";
import Link from "next/link";
import { ListSkeleton, PageHeader, SearchField } from "@/components/ui";
import { supabase } from "@/lib/supabase";
import { useLang } from "@/components/LangProvider";
import { IconLocation, IconCalendar, IconDiploma } from "@/components/icons";

type Oustaz = {
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
};

export default function OustazClient() {
  const { t, lang } = useLang();
  const [oustaz, setOustaz] = useState<Oustaz[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    (async () => {
      const { data } = await supabase
        .from("savants")
        .select("*")
        .eq("categorie", "oustaz")
        .order("ordre", { ascending: true })
        .order("nom_fr", { ascending: true });
      setOustaz(data || []);
      setLoading(false);
    })();
  }, []);

  const getName = (o: Oustaz) =>
    lang === "ar" ? o.nom_ar || o.nom_fr
      : lang === "en" ? o.nom_en || o.nom_fr
      : o.nom_fr;

  const getTitre = (o: Oustaz) =>
    lang === "ar" ? o.titre_ar || o.titre_fr
      : lang === "en" ? o.titre_en || o.titre_fr
      : o.titre_fr;

  const filtered = oustaz.filter((o) => {
    if (!search.trim()) return true;
    const q = search.toLowerCase();
    return (
      o.nom_fr?.toLowerCase().includes(q) ||
      o.nom_ar?.includes(search) ||
      o.titre_fr?.toLowerCase().includes(q) ||
      o.pays?.toLowerCase().includes(q)
    );
  });

  return (
    <main className="page">

      <PageHeader title="Par nos Oustaz" subtitle="Les enseignants et professeurs qui transmettent le savoir islamique." back="/audio" backLabel="{t.common.back}" />

      {/* Recherche */}
      {oustaz.length > 0 && (
        <SearchField value={search} onChange={setSearch} placeholder="Rechercher un oustaz..." />
      )}

      {search && (
        <p className="text-sm text-muted mb-5">
          {filtered.length} résultat{filtered.length > 1 ? "s" : ""} pour « {search} »
        </p>
      )}

      {loading ? (
        <ListSkeleton />
      ) : filtered.length === 0 ? (
        <div className="bg-white rounded-2xl p-8 text-center border border-line">
          <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-terracotta/10 flex items-center justify-center text-terracotta">
            <IconDiploma size={28} />
          </div>
          <p className="text-muted mb-2">
            {oustaz.length === 0 ? "Aucun oustaz pour le moment" : "Aucun résultat"}
          </p>
          {oustaz.length === 0 && (
            <Link href="/admin/savants"
              className="text-emerald text-sm font-semibold hover:underline">
              + Ajouter un oustaz (admin)
            </Link>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {filtered.map((o) => (
            <Link
              key={o.id}
              href={`/audio/oustaz/detail?slug=${o.slug}`}
              className="group bg-white rounded-2xl overflow-hidden
                         border border-line
                         hover:border-terracotta/30 transition-all no-underline
                         flex flex-col"
            >
              <div className="relative aspect-square bg-gradient-to-br from-terracotta/5 to-cream
                              flex items-center justify-center overflow-hidden">
                {o.photo_url ? (
                  <img loading="lazy" decoding="async" src={o.photo_url} alt={getName(o)}
                    className="w-full h-full object-cover transition-transform duration-500" />
                ) : (
                  <div className="w-20 h-20 rounded-full bg-gradient-to-br from-terracotta to-[#e07a56]
                                  flex items-center justify-center text-white">
                    <IconDiploma size={32} />
                  </div>
                )}
                <div className="absolute top-2 left-2 px-2 py-0.5 rounded-full
                                bg-terracotta/90 text-white
                                text-xs font-bold">
                  Oustaz
                </div>
              </div>

              <div className="p-3 flex flex-col flex-1">
                {o.nom_ar && (
                  <div className="font-amiri text-gold text-xs mb-0.5 leading-tight"
                       dir="rtl">
                    {o.nom_ar}
                  </div>
                )}
                <h3 className="font-bold text-emerald-dark text-sm leading-tight mb-1
                               line-clamp-2 min-h-[2.3em]">
                  {getName(o)}
                </h3>
                {getTitre(o) && (
                  <p className="text-xs text-muted mb-2 line-clamp-1">
                    {getTitre(o)}
                  </p>
                )}
                <div className="flex items-center gap-2 text-xs text-muted
                                mt-auto pt-2 border-t border-line">
                  {o.pays && (
                    <span className="inline-flex items-center gap-0.5 truncate">
                      <IconLocation size={10} /> {o.pays}
                    </span>
                  )}
                  {o.deces && (
                    <span className="inline-flex items-center gap-0.5 shrink-0">
                      <IconCalendar size={10} /> {o.deces}
                    </span>
                  )}
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
      <EndMark />
    </main>
  );
}
