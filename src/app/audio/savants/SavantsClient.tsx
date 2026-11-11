"use client";
import { ListSkeleton, PageHeader, SearchField } from "@/components/ui";
import { EndMark } from "@/components/PageHeader";
import { useEffect, useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { useLang } from "@/components/LangProvider";
import { IconCrown, IconStarFull, IconLocation, IconCalendar, IconUser, IconSearch } from "@/components/icons";

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
    <main className="page">

      <PageHeader title={t.audio.bySavants} subtitle="Les savants de la Salafiya bien guidée — des anciens aux contemporains." back="/audio" backLabel={t.common.back} />

      <SearchField value={search} onChange={setSearch} placeholder="Rechercher un savant par nom, titre ou pays..." />

      <div role="group" aria-label="Filtres" className="scrollbar-none -mx-4 mb-4 flex gap-2 overflow-x-auto px-4 sm:mx-0 sm:px-0">
        {filters.map(({ id, label, Icon }) => (
          <button key={id} onClick={() => setFilter(id)}
            aria-pressed={filter === id} className="chip">
            <Icon size={16} />
            {label}
          </button>
        ))}
      </div>

      {loading ? (
        <ListSkeleton />
      ) : filtered.length === 0 ? (
        <div className="bg-surface rounded-2xl p-8 text-center border border-line">
          <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-emerald/10 flex items-center justify-center text-link">
            <IconSearch size={28} />
          </div>
          <p className="text-muted">Aucun savant trouvé</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {filtered.map((s) => (
            <Link
              key={s.id}
              href={`/audio/savants/detail?slug=${s.slug}`}
              className="group bg-surface rounded-2xl overflow-hidden
                         border border-line
                         hover:border-emerald/20 transition-all no-underline
                         flex flex-col"
            >
              <div className="relative aspect-square bg-gradient-to-br from-emerald/5 to-cream
                              flex items-center justify-center overflow-hidden">
                {s.photo_url ? (
                  <img loading="lazy" decoding="async" src={s.photo_url} alt={getName(s)}
                    className="w-full h-full object-cover transition-transform duration-500" />
                ) : (
                  <div className="w-20 h-20 rounded-full bg-gradient-to-br from-emerald to-emerald-dark
                                  flex items-center justify-center text-gold">
                    <IconUser size={32} />
                  </div>
                )}
                <div aria-pressed={s.categorie === "classique"} className="chip">
                  {s.categorie === "classique" ? "Class." : "Contemp."}
                </div>
              </div>

              <div className="p-3 flex flex-col flex-1">
                {s.nom_ar && (
                  <div className="font-amiri text-gold text-xs mb-0.5 leading-tight" dir="rtl">
                    {s.nom_ar}
                  </div>
                )}
                <h3 className="font-bold text-heading text-sm leading-tight mb-1
                               line-clamp-2 min-h-[2.3em]">
                  {getName(s)}
                </h3>
                {getTitre(s) && (
                  <p className="text-xs text-muted mb-2 line-clamp-1">{getTitre(s)}</p>
                )}
                <div className="flex items-center gap-2 text-xs text-muted
                                mt-auto pt-2 border-t border-line">
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
      <EndMark />
    </main>
  );
}
