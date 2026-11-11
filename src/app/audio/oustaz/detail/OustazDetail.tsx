"use client";
import { EndMark } from "@/components/PageHeader";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { BackLink } from "@/components/ui";
import { supabase } from "@/lib/supabase";
import { playAudio } from "@/components/AudioPlayerFull";
import { useLang } from "@/components/LangProvider";
import { IconUser, IconLocation, IconCalendar, IconSpeaker, IconPlay, IconStar, IconCrown, IconStarFull, IconBook } from "@/components/icons";

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

  if (loading) return <div className="min-h-dvh flex items-center justify-center bg-cream"><p className="text-link">Chargement...</p></div>;

  if (!savant) return (
    <main className="page text-center">
      <h1 className="font-amiri font-bold text-heading text-3xl mb-4">Savant introuvable</h1>
      <BackLink href="/audio/oustaz" label="Retour aux oustaz" />
    </main>
  );

  const getName = () => lang === "ar" ? savant.nom_ar || savant.nom_fr : lang === "en" ? savant.nom_en || savant.nom_fr : savant.nom_fr;
  const getTitre = () => lang === "ar" ? savant.titre_ar || savant.titre_fr : lang === "en" ? savant.titre_en || savant.titre_fr : savant.titre_fr;
  const getBio = () => lang === "ar" ? savant.bio_ar || savant.bio_fr : lang === "en" ? savant.bio_en || savant.bio_fr : savant.bio_fr;
  const getAudioTitle = (a: any) => lang === "ar" ? a.titre_ar || a.titre_fr : lang === "en" ? a.titre_en || a.titre_fr : a.titre_fr;
  const isClassique = savant.categorie === "classique";

  return (
    <main className="page">
      <BackLink href="/audio/oustaz" label="Retour aux oustaz" />

      <div className="mt-6 mb-12 bg-surface rounded-2xl overflow-hidden border border-line">
        <div className="relative">
          <div className={`h-32 sm:h-40 bg-gradient-to-br ${isClassique ? "from-gold via-gold-light to-gold" : "from-emerald-dark via-emerald to-emerald-light"}`} />
          <div className="px-6 sm:px-10 pb-8 -mt-16 relative z-10">
            <div className="flex flex-col sm:flex-row gap-6 items-center sm:items-end">
              <div className={`w-32 h-32 rounded-2xl shrink-0 overflow-hidden border-4 border-surface flex items-center justify-center ${isClassique ? "bg-gold" : "bg-gradient-to-br from-emerald to-emerald-dark"}`}>
                {savant.photo_url ? <img loading="lazy" decoding="async" src={savant.photo_url} alt={getName()} className="w-full h-full object-cover" /> : <span className={isClassique ? "text-heading" : "text-gold"}><IconUser size={48} /></span>}
              </div>
              <div className="flex-1 text-center sm:text-left pb-2">
                {savant.nom_ar && lang !== "ar" && <div className="font-amiri text-gold text-xl mb-1" dir="rtl">{savant.nom_ar}</div>}
                <h1 className="font-amiri font-bold text-heading text-3xl sm:text-4xl mb-2">{getName()}</h1>
                {getTitre() && <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold ${isClassique ? "bg-gold/15 text-gold-deep" : "bg-emerald/10 text-link"}`}>
                  {isClassique ? <IconCrown size={12} /> : <IconStarFull size={12} />}
                  {getTitre()}
                </div>}
              </div>
            </div>
            <div className="flex flex-wrap gap-4 sm:gap-6 text-sm text-muted mt-6 pt-6 border-t border-line justify-center sm:justify-start">
              {savant.pays && <span className="inline-flex items-center gap-1.5"><span className="text-link"><IconLocation size={14} /></span>{savant.pays}</span>}
              {(savant.naissance || savant.deces) && <span className="inline-flex items-center gap-1.5"><span className="text-link"><IconCalendar size={14} /></span>{savant.naissance}{savant.deces && ` — ${savant.deces}`}</span>}
            </div>
          </div>
        </div>
        {getBio() && <div className="px-6 sm:px-10 pb-10 pt-2">
          <div className="bg-cream rounded-2xl p-6 sm:p-8 border border-line">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-xl bg-gold/15 flex items-center justify-center text-gold"><IconBook size={16} /></div>
              <div className="text-xs font-bold text-gold">Biographie</div>
            </div>
            <p className="text-ink/80 text-sm leading-relaxed whitespace-pre-line">{getBio()}</p>
          </div>
        </div>}
      </div>

      <div className="mb-6 flex items-center gap-3">
        <div className="w-11 h-11 rounded-2xl bg-gold/15 flex items-center justify-center text-gold"><IconSpeaker size={22} /></div>
        <div>
          <h2 className="font-amiri font-bold text-heading text-2xl">Ses audios</h2>
          <p className="text-muted text-sm">{audios.length} audio{audios.length > 1 ? "s" : ""}</p>
        </div>
      </div>

      {audios.length === 0 ? (
        <div className="bg-surface rounded-2xl p-16 text-center border border-line">
          <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-emerald/10 flex items-center justify-center text-link"><IconSpeaker size={28} /></div>
          <p className="text-muted">Aucun audio pour le moment</p>
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
              className="bg-surface rounded-2xl p-4 border border-line
                         hover:border-emerald/15
                         transition text-left w-full flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-gold flex items-center justify-center shrink-0">
                <IconPlay size={14} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-semibold text-heading text-sm truncate">
                  {getAudioTitle(a)}
                </div>
                {a.duree && (
                  <div className="text-xs text-muted">
                    {Math.floor(a.duree / 60)} min {a.duree % 60}s
                  </div>
                )}
              </div>
              <IconStar size={14} color="#d4af37" />
            </button>
          ))}
        </div>
      )}
      <EndMark />
    </main>
  );
}
