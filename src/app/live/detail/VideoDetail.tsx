"use client";
import { Bismillah, EndMark } from "@/components/PageHeader";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { useLang } from "@/components/LangProvider";
import { IconUser, IconArrowRight } from "@/components/icons";

type Video = any;
type Savant = any;

export default function VideoDetail() {
  const searchParams = useSearchParams();
  const id = searchParams.get("id") || "";
  const { lang } = useLang();
  const [video, setVideo] = useState<Video>(null);
  const [savant, setSavant] = useState<Savant>(null);
  const [loading, setLoading] = useState(true);
  const [otherVideos, setOtherVideos] = useState<any[]>([]);

  useEffect(() => {
    (async () => {
      try {
        const { data } = await supabase.from("videos").select("*").eq("id", id).single();
        if (data) {
          setVideo(data);
          if (data.savant_id) {
            const { data: s } = await supabase.from("savants").select("*").eq("id", data.savant_id).single();
            setSavant(s);

            const { data: others } = await supabase
              .from("videos").select("*").eq("savant_id", data.savant_id)
              .neq("id", id).limit(6);
            setOtherVideos(others || []);
          }
        }
      } catch (e) { console.error(e); }
      finally { setLoading(false); }
    })();
  }, [id]);

  if (loading) return <div className="min-h-screen flex items-center justify-center bg-cream"><p className="text-emerald">Chargement...</p></div>;

  if (!video) return (
    <main className="px-[6%] pt-32 pb-32 max-w-[1200px] mx-auto text-center">
      <Bismillah />
      <h1 className="font-amiri font-bold text-emerald-dark text-3xl mb-4">Vidéo introuvable</h1>
      <Link href="/live" className="text-emerald hover:underline font-semibold">← Retour aux vidéos</Link>
    </main>
  );

  const getNomSavant = () => {
    if (!savant) return "";
    return lang === "ar" ? savant.nom_ar || savant.nom_fr : savant.nom_fr;
  };

  return (
    <main className="px-[6%] pt-24 pb-40 max-w-[1200px] mx-auto">
      <Link href="/live" className="text-emerald text-sm font-semibold hover:underline inline-flex items-center gap-1">
        ← Retour aux vidéos
      </Link>

      {/* Lecteur YouTube */}
      <div className="mt-6 mb-6 bg-black rounded-3xl overflow-hidden
                      shadow-[0_30px_60px_rgba(0,0,0,0.3)]">
        <div className="relative" style={{ paddingBottom: "56.25%" }}>
          <iframe
            src={`https://www.youtube.com/embed/${video.youtube_video_id}?autoplay=1&rel=0`}
            title={video.titre}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="absolute inset-0 w-full h-full border-0"
          />
        </div>
      </div>

      {/* Infos */}
      <div className="mb-10">
        {video.categorie && (
          <div className="inline-block px-3 py-1 rounded-full bg-gold/15 text-gold
                          text-[0.7rem] font-bold uppercase tracking-wider mb-3">
            {video.categorie}
          </div>
        )}

        <h1 className="font-amiri font-bold text-emerald-dark text-2xl sm:text-3xl mb-3">
          {video.titre}
        </h1>

        {savant && (
          <Link href={`/audio/savants/detail?slug=${savant.slug}`}
            className="inline-flex items-center gap-2 text-emerald hover:text-gold
                       transition mb-4 text-sm font-semibold">
            <IconUser size={16} />
            {getNomSavant()}
            <IconArrowRight size={12} />
          </Link>
        )}

        {video.description && (
          <div className="bg-cream rounded-2xl p-5 border border-emerald/5">
            <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-line">
              {video.description}
            </p>
          </div>
        )}
      </div>

      {/* Autres vidéos du savant */}
      {otherVideos.length > 0 && (
        <>
          <h2 className="font-amiri font-bold text-emerald-dark text-xl mb-4">
            Autres vidéos de {getNomSavant()}
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {otherVideos.map((v) => (
              <Link key={v.id} href={`/live/detail?id=${v.id}`}
                className="group no-underline">
                <div className="relative aspect-video bg-black rounded-xl overflow-hidden
                                mb-2">
                  <img src={`https://img.youtube.com/vi/${v.youtube_video_id}/hqdefault.jpg`}
                    alt={v.titre}
                    className="w-full h-full object-cover group-hover:scale-105 transition" />
                </div>
                <div className="text-xs font-semibold text-emerald-dark line-clamp-2">
                  {v.titre}
                </div>
              </Link>
            ))}
          </div>
        </>
      )}
      <EndMark />
    </main>
  );
}
