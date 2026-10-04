"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { useLang } from "@/components/LangProvider";
import {
  IconUser, IconLocation, IconCalendar, IconSpeaker, IconPlay,
  IconStar, IconDiploma, IconBook,
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
  bio_fr: string | null;
  bio_ar: string | null;
  bio_en: string | null;
  photo_url: string | null;
  naissance: string | null;
  deces: string | null;
  pays: string | null;
};

type Audio = {
  id: string;
  titre_fr: string;
  titre_ar: string | null;
  titre_en: string | null;
  audio_url: string;
  duree: number | null;
};

export default function OustazDetailClient({ slug }: { slug: string }) {
  const { lang } = useLang();
  const [oustaz, setOustaz] = useState<Oustaz | null>(null);
  const [audios, setAudios] = useState<Audio[]>([]);
  const [loading, setLoading] = useState(true);
  const [playingId, setPlayingId] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const { data, error } = await supabase
          .from("savants").select("*").eq("slug", slug).limit(1);
        if (error || !data || data.length === 0) {
          setLoading(false);
          return;
        }
        const o = data[0];
        setOustaz(o);

        const { data: a } = await supabase
          .from("audios").select("*").eq("savant_id", o.id)
          .order("created_at", { ascending: false });
        setAudios(a || []);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    })();
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-cream">
        <p className="text-emerald">Chargement...</p>
      </div>
    );
  }

  if (!oustaz) {
    return (
      <main className="px-[6%] pt-32 pb-32 max-w-[1200px] mx-auto text-center">
        <h1 className="font-amiri font-bold text-emerald-dark text-3xl mb-4">
          Oustaz introuvable
        </h1>
        <Link href="/audio/oustaz" className="text-emerald hover:underline font-semibold">
          ← Retour aux oustaz
        </Link>
      </main>
    );
  }

  const getName = () =>
    lang === "ar" ? oustaz.nom_ar || oustaz.nom_fr
      : lang === "en" ? oustaz.nom_en || oustaz.nom_fr
      : oustaz.nom_fr;

  const getTitre = () =>
    lang === "ar" ? oustaz.titre_ar || oustaz.titre_fr
      : lang === "en" ? oustaz.titre_en || oustaz.titre_fr
      : oustaz.titre_fr;

  const getBio = () =>
    lang === "ar" ? oustaz.bio_ar || oustaz.bio_fr
      : lang === "en" ? oustaz.bio_en || oustaz.bio_fr
      : oustaz.bio_fr;

  const getAudioTitle = (a: Audio) =>
    lang === "ar" ? a.titre_ar || a.titre_fr
      : lang === "en" ? a.titre_en || a.titre_fr
      : a.titre_fr;

  return (
    <main className="px-[6%] pt-24 pb-40 max-w-[1200px] mx-auto">

      <Link href="/audio/oustaz"
        className="text-emerald text-sm font-semibold hover:underline inline-flex items-center gap-1">
        ← Retour aux oustaz
      </Link>

      {/* Carte Héro */}
      <div className="mt-6 mb-12 bg-white rounded-[32px] overflow-hidden
                      border border-emerald/5
                      shadow-[0_25px_60px_rgba(193,80,46,0.12)]">
        <div className="relative">

          {/* Bandeau terracotta */}
          <div className="h-32 sm:h-40 bg-gradient-to-br from-terracotta via-[#d56a45] to-[#e07a56]">
            <div className="absolute inset-0 opacity-10"
                 style={{
                   backgroundImage: `url("data:image/svg+xml,%3Csvg width='80' height='80' viewBox='0 0 80 80' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M40 0 L80 40 L40 80 L0 40 Z' fill='none' stroke='%23ffffff' stroke-width='1.5'/%3E%3C/svg%3E")`
                 }} />
          </div>

          <div className="px-6 sm:px-10 pb-8 -mt-16 relative z-10">
            <div className="flex flex-col sm:flex-row gap-6 items-center sm:items-end">

              <div className="w-32 h-32 rounded-3xl shrink-0 overflow-hidden
                              border-4 border-white bg-terracotta
                              shadow-[0_15px_35px_rgba(193,80,46,0.2)]
                              flex items-center justify-center">
                {oustaz.photo_url ? (
                  <img src={oustaz.photo_url} alt={getName()}
                    className="w-full h-full object-cover" />
                ) : (
                  <span className="text-white"><IconDiploma size={48} /></span>
                )}
              </div>

              <div className="flex-1 text-center sm:text-left pb-2">
                {oustaz.nom_ar && lang !== "ar" && (
                  <div className="font-amiri text-gold text-xl mb-1" dir="rtl">
                    {oustaz.nom_ar}
                  </div>
                )}
                <h1 className="font-amiri font-bold text-emerald-dark text-3xl sm:text-4xl mb-2">
                  {getName()}
                </h1>
                {getTitre() && (
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full
                                  bg-terracotta/10 text-terracotta
                                  text-xs font-bold uppercase tracking-wider">
                    <IconDiploma size={12} />
                    {getTitre()}
                  </div>
                )}
              </div>
            </div>

            <div className="flex flex-wrap gap-4 sm:gap-6 text-sm text-gray-500 mt-6 pt-6
                            border-t border-emerald/5 justify-center sm:justify-start">
              {oustaz.pays && (
                <span className="inline-flex items-center gap-1.5">
                  <span className="text-terracotta"><IconLocation size={14} /></span>
                  {oustaz.pays}
                </span>
              )}
              {(oustaz.naissance || oustaz.deces) && (
                <span className="inline-flex items-center gap-1.5">
                  <span className="text-terracotta"><IconCalendar size={14} /></span>
                  {oustaz.naissance}
                  {oustaz.deces && ` — ${oustaz.deces}`}
                </span>
              )}
            </div>
          </div>
        </div>

        {getBio() && (
          <div className="px-6 sm:px-10 pb-10 pt-2">
            <div className="bg-cream rounded-3xl p-6 sm:p-8 border border-emerald/5">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 rounded-xl bg-terracotta/10 flex items-center justify-center text-terracotta">
                  <IconBook size={16} />
                </div>
                <div className="text-xs font-bold text-terracotta uppercase tracking-wider">
                  Biographie
                </div>
              </div>
              <p className="text-gray-600 text-sm leading-relaxed whitespace-pre-line">
                {getBio()}
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Audios */}
      <div className="mb-6 flex items-center gap-3">
        <div className="w-11 h-11 rounded-2xl bg-terracotta/10 flex items-center justify-center text-terracotta">
          <IconSpeaker size={22} />
        </div>
        <div>
          <h2 className="font-amiri font-bold text-emerald-dark text-2xl">
            Ses audios
          </h2>
          <p className="text-gray-500 text-sm">
            {audios.length} audio{audios.length > 1 ? "s" : ""} disponible{audios.length > 1 ? "s" : ""}
          </p>
        </div>
      </div>

      {audios.length === 0 ? (
        <div className="bg-white rounded-3xl p-16 text-center border border-emerald/5">
          <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-terracotta/10 flex items-center justify-center text-terracotta">
            <IconSpeaker size={28} />
          </div>
          <p className="text-gray-400">Aucun audio pour le moment</p>
        </div>
      ) : (
        <div className="grid gap-3">
          {audios.map((a) => (
            <div key={a.id}
              className="bg-white rounded-2xl p-4 border border-emerald/5
                         hover:border-terracotta/20
                         hover:shadow-[0_10px_30px_rgba(193,80,46,0.08)]
                         transition">
              <div className="flex items-center gap-4">
                <button
                  onClick={() => setPlayingId(playingId === a.id ? null : a.id)}
                  className="w-12 h-12 rounded-full bg-terracotta flex items-center justify-center
                              shadow-[0_4px_14px_rgba(193,80,46,0.35)] shrink-0
                              hover:scale-110 transition">
                  <IconPlay size={14} color="#fff" />
                </button>
                <div className="flex-1 min-w-0">
                  <div className="font-semibold text-emerald-dark text-sm truncate">
                    {getAudioTitle(a)}
                  </div>
                  {a.duree && (
                    <div className="text-xs text-gray-500">
                      {Math.floor(a.duree / 60)} min {a.duree % 60}s
                    </div>
                  )}
                </div>
                <IconStar size={14} color="#c1502e" />
              </div>

              {playingId === a.id && (
                <div className="mt-3 pt-3 border-t border-emerald/10">
                  <audio src={a.audio_url} controls autoPlay className="w-full" />
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </main>
  );
}