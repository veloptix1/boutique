"use client";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { playAudio } from "@/components/AudioPlayer";
import { useLang } from "@/components/LangProvider";
import {
  IconUser, IconLocation, IconCalendar, IconSpeaker, IconPlay,
  IconStar, IconCrown, IconStarFull, IconBook,
} from "@/components/icons";

export default function OustazDetail() {
  const searchParams = useSearchParams();
  const slug = searchParams.get("slug") || "";
  const { lang } = useLang();
  const [savant, setSavant] = useState<any>(null);
  const [audios, setAudios] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const { data } = await supabase
          .from("savants").select("*").eq("slug", slug).limit(1);
        if (data && data.length > 0) {
          setSavant(data[0]);
          const { data: a } = await supabase
            .from("audios").select("*").eq("savant_id", data[0].id)
            .order("created_at", { ascending: false });
          setAudios(a || []);
        }
      } catch (e) { console.error(e); }
      finally { setLoading(false); }
    })();
  }, [slug]);

  if (loading) return <div className="min-h-screen flex items-center justify-center bg-cream"><p className="text-emerald">Chargement...</p></div>;

  if (!savant) return (
    <main className="px-[6%] pt-32 pb-32 max-w-[1200px] mx-auto text-center">
      <h1 className="font-amiri font-bold text-emerald-dark text-3xl mb-4">Savant introuvable</h1>
      <Link href="/audio/oustaz" className="text-emerald hover:underline font-semibold">← Retour aux oustaz</Link>
    </main>
  );

  const getName = () => lang === "ar" ? savant.nom_ar || savant.nom_fr : lang === "en" ? savant.nom_en || savant.nom_fr : savant.nom_fr;
  const getTitre = () => lang === "ar" ? savant.titre_ar || savant.titre_fr : lang === "en" ? savant.titre_en || savant.titre_fr : savant.titre_fr;
  const getBio = () => lang === "ar" ? savant.bio_ar || savant.bio_fr : lang === "en" ? savant.bio_en || savant.bio_fr : savant.bio_fr;
  const getAudioTitle = (a: any) => lang === "ar" ? a.titre_ar || a.titre_fr : lang === "en" ? a.titre_en || a.titre_fr : a.titre_fr;
  const isClassique = savant.categorie === "classique";

  return (
    <main className="px-[6%] pt-24 pb-40 max-w-[1200px] mx-auto">
      <Link href="/audio/oustaz" className="text-emerald text-sm font-semibold hover:underline inline-flex items-center gap-1">← Retour aux oustaz</Link>

      <div className="mt-6 mb-12 bg-white rounded-[32px] overflow-hidden border border-emerald/5 shadow-[0_25px_60px_rgba(13,92,74,0.12)]">
        <div className="relative">
          <div className={`h-32 sm:h-40 bg-gradient-to-br ${isClassique ? "from-gold via-gold-light to-gold" : "from-emerald-dark via-emerald to-emerald-light"}`} />
          <div className="px-6 sm:px-10 pb-8 -mt-16 relative z-10">
            <div className="flex flex-col sm:flex-row gap-6 items-center sm:items-end">
              <div className={`w-32 h-32 rounded-3xl shrink-0 overflow-hidden border-4 border-white shadow-[0_15px_35px_rgba(13,92,74,0.2)] flex items-center justify-center ${isClassique ? "bg-gold" : "bg-gradient-to-br from-emerald to-emerald-dark"}`}>
                {savant.photo_url ? <img src={savant.photo_url} alt={getName()} className="w-full h-full object-cover" /> : <span className={isClassique ? "text-emerald-dark" : "text-gold"}><IconUser size={48} /></span>}
              </div>
              <div className="flex-1 text-center sm:text-left pb-2">
                {savant.nom_ar && lang !== "ar" && <div className="font-amiri text-gold text-xl mb-1" dir="rtl">{savant.nom_ar}</div>}
                <h1 className="font-amiri font-bold text-emerald-dark text-3xl sm:text-4xl mb-2">{getName()}</h1>
                {getTitre() && <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${isClassique ? "bg-gold/15 text-gold" : "bg-emerald/10 text-emerald"}`}>
                  {isClassique ? <IconCrown size={12} /> : <IconStarFull size={12} />}
                  {getTitre()}
                </div>}
              </div>
            </div>
            <div className="flex flex-wrap gap-4 sm:gap-6 text-sm text-gray-500 mt-6 pt-6 border-t border-emerald/5 justify-center sm:justify-start">
              {savant.pays && <span className="inline-flex items-center gap-1.5"><span className="text-emerald"><IconLocation size={14} /></span>{savant.pays}</span>}
              {(savant.naissance || savant.deces) && <span className="inline-flex items-center gap-1.5"><span className="text-emerald"><IconCalendar size={14} /></span>{savant.naissance}{savant.deces && ` — ${savant.deces}`}</span>}
            </div>
          </div>
        </div>
        {getBio() && <div className="px-6 sm:px-10 pb-10 pt-2">
          <div className="bg-cream rounded-3xl p-6 sm:p-8 border border-emerald/5">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-xl bg-gold/15 flex items-center justify-center text-gold"><IconBook size={16} /></div>
              <div className="text-xs font-bold text-gold uppercase tracking-wider">Biographie</div>
            </div>
            <p className="text-gray-600 text-sm leading-relaxed whitespace-pre-line">{getBio()}</p>
          </div>
        </div>}
      </div>

      <div className="mb-6 flex items-center gap-3">
        <div className="w-11 h-11 rounded-2xl bg-gold/15 flex items-center justify-center text-gold"><IconSpeaker size={22} /></div>
        <div>
          <h2 className="font-amiri font-bold text-emerald-dark text-2xl">Ses audios</h2>
          <p className="text-gray-500 text-sm">{audios.length} audio{audios.length > 1 ? "s" : ""}</p>
        </div>
      </div>

      {audios.length === 0 ? (
        <div className="bg-white rounded-3xl p-16 text-center border border-emerald/5">
          <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-emerald/10 flex items-center justify-center text-emerald"><IconSpeaker size={28} /></div>
          <p className="text-gray-400">Aucun audio pour le moment</p>
        </div>
      ) : (
        <div className="grid gap-3">
          {audios.map((a: any) => (
            <button
              key={a.id}
              onClick={() => playAudio({
                url: a.audio_url,
                titre: getAudioTitle(a),
                auteur: getName(),
              })}
              className="bg-white rounded-2xl p-4 border border-emerald/5
                         hover:border-emerald/15
                         hover:shadow-[0_10px_30px_rgba(13,92,74,0.08)]
                         transition text-left w-full flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-gold flex items-center justify-center
                              shadow-[0_4px_14px_rgba(212,175,55,0.35)] shrink-0">
                <IconPlay size={14} />
              </div>
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
              <IconStar size={14} color="#d4af37" />
            </button>
          ))}
        </div>
      )}
    </main>
  );
}
