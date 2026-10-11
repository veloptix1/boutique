"use client";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { playAudio } from "@/components/AudioPlayer";
import { Bismillah, EndMark } from "@/components/PageHeader";
import { IconPlay } from "@/components/icons";

type Ayah = { numberInSurah: number; text: string; number: number };

const RECITATEURS = [
  { slug: "ar.alafasy",            nom: "Cheikh Mishary Al-Afasy" },
  { slug: "ar.husary",             nom: "Cheikh Mahmoud Khalil Al-Husary" },
  { slug: "ar.abdulbasitmurattal", nom: "Cheikh Abdul-Basit (Murattal)" },
  { slug: "ar.abdurrahmaansudais", nom: "Cheikh Abdul-Rahman Al-Sudais" },
  { slug: "ar.minshawi",           nom: "Cheikh Muhammad Al-Minshawi" },
  { slug: "ar.muhammadayyoub",     nom: "Cheikh Muhammad Ayyoub" },
  { slug: "ar.hudhaify",           nom: "Cheikh Ali Al-Hudhaify" },
  { slug: "ar.shaatree",           nom: "Cheikh Abu Bakr Ash-Shaatree" },
  { slug: "ar.ahmedajamy",         nom: "Cheikh Ahmed Al-Ajamy" },
  { slug: "ar.hanirifai",          nom: "Cheikh Hani Ar-Rifaï" },
  { slug: "ar.mahermuaiqly",       nom: "Cheikh Maher Al-Muaiqly" },
];

const getAudioUrl = (recitateurSlug: string, numero: number) => {
  return `https://cdn.islamic.network/quran/audio-surah/128/${recitateurSlug}/${numero}.mp3`;
};

export default function SourateView() {
  const searchParams = useSearchParams();
  const numero = searchParams.get("numero") || "";
  const [ayahsAr, setAyahsAr] = useState<Ayah[]>([]);
  const [ayahsFr, setAyahsFr] = useState<Ayah[]>([]);
  const [info, setInfo] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedRecitateur, setSelectedRecitateur] = useState(RECITATEURS[0].slug);

  useEffect(() => {
    (async () => {
      try {
        const { data: infoData, error: infoErr } = await supabase
          .from("sourates").select("*").eq("numero", Number(numero)).single();
        if (infoErr || !infoData) { setError("Sourate introuvable."); setLoading(false); return; }
        setInfo(infoData);

        const [resAr, resFr] = await Promise.all([
          fetch(`https://api.alquran.cloud/v1/surah/${numero}/quran-uthmani`),
          fetch(`https://api.alquran.cloud/v1/surah/${numero}/fr.hamidullah`),
        ]);
        const dataAr = await resAr.json();
        const dataFr = await resFr.json();
        setAyahsAr(dataAr.data?.ayahs || []);
        setAyahsFr(dataFr.data?.ayahs || []);
      } catch (e: any) { setError("Erreur : " + (e?.message || String(e))); }
      finally { setLoading(false); }
    })();
  }, [numero]);

  const playSourate = () => {
    if (!info) return;
    const recitateur = RECITATEURS.find((r) => r.slug === selectedRecitateur);
    playAudio({
      url: getAudioUrl(selectedRecitateur, info.numero),
      titre: `Sourate ${info.numero} — ${info.nom_translit}`,
      auteur: recitateur?.nom || "Coran",
    });
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center bg-cream"><p className="text-emerald">Chargement...</p></div>;
  if (error || !info) return (
    <div className="px-[6%] pt-32 pb-32 max-w-[900px] mx-auto text-center min-h-screen">
      <div className="bg-white rounded-3xl p-10 border border-emerald/5">
        <h1 className="text-2xl font-bold text-terracotta mb-4">Erreur</h1>
        <p className="text-gray-600 mb-6">{error}</p>
        <Link href="/audio/coran" className="text-emerald font-semibold hover:underline">← Retour au Coran</Link>
      </div>
    </div>
  );

  return (
    <main className="px-[6%] pt-24 pb-40 max-w-[900px] mx-auto min-h-screen">
      <Link href="/audio/coran" className="text-emerald text-sm font-semibold hover:underline">
        ← Retour au Coran
      </Link>

      <div className="mt-8">
        <Bismillah />
      </div>

      <div className="mb-8 text-center">
        <div className="font-amiri text-gold text-4xl mb-3" dir="rtl">سورة {info.nom_ar}</div>
        <h1 className="font-amiri font-bold text-emerald-dark text-3xl sm:text-4xl mb-3">
          {info.nom_translit} — {info.nom_fr}
        </h1>
        <div className="flex items-center justify-center gap-3 text-sm text-gray-500 flex-wrap">
          <span className="px-3 py-1 rounded-full bg-emerald/8 text-emerald font-semibold">Sourate {info.numero}</span>
          <span>{info.versets} versets</span>
          <span>·</span>
          <span>{info.type}</span>
        </div>
      </div>

      {/* Lecteur audio */}
      <div className="bg-white rounded-3xl p-5 border border-emerald/5 mb-10">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-2xl bg-gold/15 flex items-center justify-center text-gold">
            <IconPlay size={16} />
          </div>
          <div className="text-xs font-bold text-gold uppercase tracking-wider">
            Écouter la sourate
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <select
            value={selectedRecitateur}
            onChange={(e) => setSelectedRecitateur(e.target.value)}
            className="flex-1 px-4 py-3 rounded-2xl border-2 border-emerald/10
                       focus:border-gold outline-none text-sm bg-white
                       text-emerald-dark font-semibold cursor-pointer">
            {RECITATEURS.map((r) => (
              <option key={r.slug} value={r.slug}>{r.nom}</option>
            ))}
          </select>

          <button
            onClick={playSourate}
            className="px-6 py-3 rounded-2xl bg-emerald text-white font-semibold text-sm
                       hover:bg-emerald-dark transition shadow-[0_8px_20px_rgba(13,92,74,0.25)]
                       inline-flex items-center justify-center gap-2">
            <IconPlay size={16} color="#fff" />
            Écouter
          </button>
        </div>
      </div>

      {info.numero !== 1 && info.numero !== 9 && (
        <div className="text-center mb-12 py-6 border-y border-emerald/10">
          <div className="font-amiri text-emerald-dark text-2xl mb-3" dir="rtl">
            بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
          </div>
          <div className="text-sm text-gray-500">Au nom d''Allah, le Tout Miséricordieux, le Très Miséricordieux.</div>
        </div>
      )}

      <div className="space-y-6">
        {ayahsAr.map((ayah, i) => {
          const fr = ayahsFr[i];
          return (
            <div key={ayah.numberInSurah} className="bg-white rounded-3xl p-6 sm:p-8 border border-emerald/5">
              <div className="flex items-center justify-center mb-5">
                <div className="w-9 h-9 rounded-full bg-gold/15 text-gold flex items-center justify-center font-bold text-sm">
                  {ayah.numberInSurah}
                </div>
              </div>
              <div className="font-amiri text-emerald-dark text-2xl sm:text-3xl leading-loose text-right mb-6" dir="rtl">
                {ayah.text}
              </div>
              {fr && (
                <div className="pt-5 border-t border-emerald/10">
                  <div className="text-xs font-bold text-gold uppercase tracking-wider mb-2">Traduction</div>
                  <p className="text-gray-600 leading-relaxed">{fr.text}</p>
                </div>
              )}
            </div>
          );
        })}
      </div>

      <EndMark />
    </main>
  );
}
