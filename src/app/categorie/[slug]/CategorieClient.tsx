"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { useLang } from "@/components/LangProvider";
import {
  IconAqida, IconSalat, IconLivre, IconParchemin,
  IconProphetes, IconSahaba, IconBio, IconTafsir,
  IconSpeaker, IconArrowRight, IconBook,
} from "@/components/icons";

const iconMap: Record<string, any> = {
  croyance:    IconAqida,
  priere:      IconSalat,
  livre:       IconLivre,
  rapporteurs: IconParchemin,
  prophetes:   IconProphetes,
  saaba:       IconSahaba,
  biographie:  IconBio,
  tafsir:      IconTafsir,
};

type Audio = {
  id: string;
  titre_fr: string;
  titre_ar: string | null;
  titre_en: string | null;
  audio_url: string;
  duree: number | null;
};

export default function CategorieClient({ slug }: { slug: string }) {
  const { lang, t } = useLang();
  const [audios, setAudios] = useState<Audio[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const { data } = await supabase
          .from("audios")
          .select("*")
          .order("created_at", { ascending: false })
          .limit(20);
        setAudios(data || []);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const label = (t.categories as any)?.[slug] || slug;
  const Icon = iconMap[slug] || IconBook;

  const getTitre = (a: Audio) =>
    lang === "ar" ? a.titre_ar || a.titre_fr
      : lang === "en" ? a.titre_en || a.titre_fr
      : a.titre_fr;

  return (
    <main className="px-[6%] pt-24 pb-40 max-w-[1200px] mx-auto min-h-screen">

      <Link href="/dashboard" className="text-emerald text-sm font-semibold hover:underline">
        ← Retour
      </Link>

      <div className="mt-8 mb-12 flex items-start gap-4">
        <div className="w-16 h-16 rounded-2xl bg-emerald/10 flex items-center justify-center text-emerald shrink-0">
          <Icon size={30} />
        </div>
        <div>
          <h1 className="font-amiri font-bold text-emerald-dark text-4xl sm:text-5xl mb-2">
            {label}
          </h1>
          <div className="w-24 h-1 bg-gold rounded-full" />
        </div>
      </div>

      {loading ? (
        <p className="text-gray-400">Chargement...</p>
      ) : audios.length === 0 ? (
        <div className="bg-white rounded-3xl p-16 text-center border border-emerald/5">
          <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-emerald/10 flex items-center justify-center text-emerald">
            <IconSpeaker size={28} />
          </div>
          <h2 className="font-bold text-emerald-dark text-xl mb-2">
            Bientôt disponible
          </h2>
          <p className="text-gray-500 text-sm max-w-md mx-auto">
            Cette section sera bientôt remplie par l'administration.
          </p>
        </div>
      ) : (
        <div className="grid gap-3">
          {audios.map((a) => (
            <div key={a.id}
              className="bg-white rounded-2xl p-4 border border-emerald/5
                         hover:border-emerald/15
                         hover:shadow-[0_10px_30px_rgba(13,92,74,0.08)]
                         transition">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-gold flex items-center justify-center
                                shadow-[0_4px_14px_rgba(212,175,55,0.35)] shrink-0">
                  <IconSpeaker size={16} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-semibold text-emerald-dark text-sm truncate">
                    {getTitre(a)}
                  </div>
                  {a.duree && (
                    <div className="text-xs text-gray-500">
                      {Math.floor(a.duree / 60)} min
                    </div>
                  )}
                </div>
                <IconArrowRight size={16} />
              </div>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}