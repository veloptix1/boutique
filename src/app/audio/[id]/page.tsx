"use client";
import { useEffect, useState, use } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { useLang } from "@/components/LangProvider";
import { playAudio } from "@/components/AudioPlayer";
import { IconSpeaker, IconPlay, IconUser } from "@/components/icons";

type Audio = {
  id: string;
  titre_fr: string;
  titre_ar: string | null;
  titre_en: string | null;
  description_fr: string | null;
  audio_url: string;
  duree: number | null;
  savant_id: string | null;
};

type Savant = { id: string; nom_fr: string; slug: string };

export default function AudioPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { lang } = useLang();
  const [audio, setAudio] = useState<Audio | null>(null);
  const [savant, setSavant] = useState<Savant | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const { data } = await supabase.from("audios").select("*").eq("id", id).single();
      setAudio(data);
      if (data?.savant_id) {
        const { data: s } = await supabase
          .from("savants").select("id, nom_fr, slug").eq("id", data.savant_id).single();
        setSavant(s);
      }
      setLoading(false);
    })();
  }, [id]);

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">
      <p className="text-emerald">Chargement...</p>
    </div>;
  }

  if (!audio) {
    return (
      <main className="px-[6%] pt-32 pb-32 max-w-[1200px] mx-auto text-center">
        <h1 className="font-amiri font-bold text-emerald-dark text-3xl mb-4">
          Audio introuvable
        </h1>
        <Link href="/audio" className="text-emerald hover:underline">
          ← Retour aux audios
        </Link>
      </main>
    );
  }

  const titre = lang === "ar" ? audio.titre_ar || audio.titre_fr
    : lang === "en" ? audio.titre_en || audio.titre_fr
    : audio.titre_fr;

  return (
    <main className="px-[6%] pt-24 pb-40 max-w-[900px] mx-auto">
      <Link href="/audio" className="text-emerald text-sm font-semibold hover:underline">
        ← Retour
      </Link>

      <div className="mt-8 mb-8">
        {savant && (
          <Link href={`/audio/savants/${savant.slug}`}
            className="text-xs font-bold text-gold uppercase tracking-widest
                       hover:underline inline-flex items-center gap-2 mb-3">
            <IconUser size={14} /> {savant.nom_fr}
          </Link>
        )}
        {audio.titre_ar && lang !== "ar" && (
          <div className="font-amiri text-gold text-lg mb-2" dir="rtl">
            {audio.titre_ar}
          </div>
        )}
        <h1 className="font-amiri font-bold text-emerald-dark text-3xl sm:text-4xl mb-4">
          {titre}
        </h1>
        {audio.duree && (
          <p className="text-sm text-gray-500">
            Durée : {Math.floor(audio.duree / 60)} min
          </p>
        )}
      </div>

      {/* Carte de lecture */}
      <div className="bg-white rounded-3xl p-8 border border-emerald/5
                      shadow-[0_20px_40px_rgba(13,92,74,0.08)]">
        <button
          onClick={() => playAudio({
            url: audio.audio_url,
            titre: titre,
            auteur: savant?.nom_fr || "AL BASIRAH",
          })}
          className="w-full py-5 rounded-2xl bg-emerald text-white font-semibold
                     hover:bg-emerald-dark transition inline-flex items-center
                     justify-center gap-3 shadow-[0_10px_25px_rgba(13,92,74,0.25)]">
          <IconPlay size={20} color="#fff" />
          Écouter cet audio
        </button>

        {audio.description_fr && (
          <div className="mt-6 pt-6 border-t border-emerald/10">
            <div className="text-xs font-bold text-gold uppercase tracking-wider mb-2">
              Description
            </div>
            <p className="text-sm text-gray-600 leading-relaxed whitespace-pre-line">
              {audio.description_fr}
            </p>
          </div>
        )}

        <div className="mt-6 pt-6 border-t border-emerald/10">
          <div className="text-xs font-bold text-gold uppercase tracking-wider mb-3">
            Écoute directe
          </div>
          <audio src={audio.audio_url} controls className="w-full" />
        </div>
      </div>
    </main>
  );
}