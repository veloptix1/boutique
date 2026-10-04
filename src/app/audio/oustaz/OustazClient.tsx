"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { useLang } from "@/components/LangProvider";
import {
  IconUser, IconLocation, IconCalendar, IconSearch,
  IconArrowRight, IconDiploma,
} from "@/components/icons";

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
    <main className="px-[6%] pt-24 pb-40 max-w-[1200px] mx-auto">

      <Link href="/audio" className="text-emerald text-sm font-semibold hover:underline">
        ← {t.common.back}
      </Link>

      <div className="mt-6 mb-10">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-12 h-12 rounded-2xl bg-terracotta/10 flex items-center justify-center text-terracotta">
            <IconDiploma size={24} />
          </div>
          <div className="text-xs font-bold text-terracotta uppercase tracking-[3px]">
            Enseignants
          </div>
        </div>
        <h1 className="font-amiri font-bold text-emerald-dark text-4xl sm:text-5xl mb-3">
          Par nos Oustaz
        </h1>
        <p className="text-gray-500 max-w-2xl">
          Les enseignants et professeurs qui transmettent le savoir islamique.
        </p>
      </div>

      {/* Recherche */}
      {oustaz.length > 0 && (
        <div className="relative mb-8">
          <div className="absolute left-5 top-1/2 -translate-y-1/2 text-emerald/50 pointer-events-none">
            <IconSearch size={18} />
          </div>
          <input
            type="text"
            placeholder="Rechercher un oustaz..."
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
      )}

      {search && (
        <p className="text-sm text-gray-500 mb-5">
          {filtered.length} résultat{filtered.length > 1 ? "s" : ""} pour « {search} »
        </p>
      )}

      {loading ? (
        <p className="text-gray-400">Chargement...</p>
      ) : filtered.length === 0 ? (
        <div className="bg-white rounded-3xl p-16 text-center border border-emerald/5">
          <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-terracotta/10 flex items-center justify-center text-terracotta">
            <IconDiploma size={28} />
          </div>
          <p className="text-gray-400 mb-2">
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
              href={`/audio/oustaz/${o.slug}`}
              className="group bg-white rounded-2xl overflow-hidden
                         border border-emerald/5 hover:-translate-y-1
                         hover:shadow-[0_15px_35px_rgba(193,80,46,0.15)]
                         hover:border-terracotta/30 transition-all no-underline
                         flex flex-col"
            >
              <div className="relative aspect-square bg-gradient-to-br from-terracotta/5 to-cream
                              flex items-center justify-center overflow-hidden">
                {o.photo_url ? (
                  <img src={o.photo_url} alt={getName(o)}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                ) : (
                  <div className="w-20 h-20 rounded-full bg-gradient-to-br from-terracotta to-[#e07a56]
                                  flex items-center justify-center text-white">
                    <IconDiploma size={32} />
                  </div>
                )}
                <div className="absolute top-2 left-2 px-2 py-0.5 rounded-full
                                bg-terracotta/90 text-white
                                text-[0.58rem] font-bold uppercase tracking-wider">
                  Oustaz
                </div>
              </div>

              <div className="p-3 flex flex-col flex-1">
                {o.nom_ar && (
                  <div className="font-amiri text-gold text-[0.7rem] mb-0.5 leading-tight"
                       dir="rtl">
                    {o.nom_ar}
                  </div>
                )}
                <h3 className="font-bold text-emerald-dark text-sm leading-tight mb-1
                               line-clamp-2 min-h-[2.3em]">
                  {getName(o)}
                </h3>
                {getTitre(o) && (
                  <p className="text-[0.68rem] text-gray-500 mb-2 line-clamp-1">
                    {getTitre(o)}
                  </p>
                )}
                <div className="flex items-center gap-2 text-[0.62rem] text-gray-400
                                mt-auto pt-2 border-t border-emerald/5">
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
    </main>
  );
}