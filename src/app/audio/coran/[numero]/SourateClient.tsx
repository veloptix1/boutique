"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { playAudio } from "@/components/AudioPlayer";

type Ayah = {
  numberInSurah: number;
  text: string;
  number: number;
};

type SourateInfo = {
  numero: number;
  nom_ar: string;
  nom_fr: string;
  nom_translit: string;
  versets: number;
  type: string;
};

export default function SourateClient({ numero }: { numero: string }) {
  const [ayahsAr, setAyahsAr] = useState<Ayah[]>([]);
  const [ayahsFr, setAyahsFr] = useState<Ayah[]>([]);
  const [tafsirs, setTafsirs] = useState<string[]>([]);
  const [info, setInfo] = useState<SourateInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [openTafsir, setOpenTafsir] = useState<number | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const { data: infoData, error: infoErr } = await supabase
          .from("sourates").select("*").eq("numero", Number(numero)).single();

        if (infoErr || !infoData) {
          setError("Sourate " + numero + " introuvable.");
          setLoading(false);
          return;
        }
        setInfo(infoData);

        const [resAr, resFr, resTafsir] = await Promise.all([
          fetch(`https://api.alquran.cloud/v1/surah/${numero}/quran-uthmani`),
          fetch(`https://api.alquran.cloud/v1/surah/${numero}/fr.hamidullah`),
          fetch(`https://api.alquran.cloud/v1/surah/${numero}/fr.montada`).catch(() => null),
        ]);

        const dataAr = await resAr.json();
        const dataFr = await resFr.json();
        setAyahsAr(dataAr.data?.ayahs || []);
        setAyahsFr(dataFr.data?.ayahs || []);

        if (resTafsir && resTafsir.ok) {
          const tafsirData = await resTafsir.json();
          setTafsirs((tafsirData.data?.ayahs || []).map((a: any) => a.text));
        }
      } catch (e: any) {
        setError("Erreur : " + (e?.message || String(e)));
      } finally {
        setLoading(false);
      }
    })();
  }, [numero]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-cream">
        <div className="text-center">
          <div className="w-12 h-12 mx-auto mb-4 rounded-full border-4 border-emerald/20
                          border-t-emerald animate-spin" />
          <p className="text-emerald text-sm">Chargement...</p>
        </div>
      </div>
    );
  }

  if (error || !info) {
    return (
      <div className="px-[6%] pt-32 pb-32 max-w-[900px] mx-auto text-center min-h-screen">
        <div className="bg-white rounded-3xl p-10 border border-emerald/5">
          <h1 className="text-2xl font-bold text-terracotta mb-4">Erreur</h1>
          <p className="text-gray-600 mb-6">{error}</p>
          <Link href="/audio/coran" className="text-emerald font-semibold hover:underline">
            ← Retour au Coran
          </Link>
        </div>
      </div>
    );
  }

  return (
    <main className="px-[6%] pt-24 pb-40 max-w-[900px] mx-auto min-h-screen">
      <Link href="/audio/coran" className="text-emerald text-sm font-semibold hover:underline">
        ← Retour au Coran
      </Link>

      <div className="mt-8 mb-12 text-center">
        <div className="font-amiri text-gold text-4xl mb-3" dir="rtl">سورة {info.nom_ar}</div>
        <h1 className="font-amiri font-bold text-emerald-dark text-3xl sm:text-4xl mb-3">
          {info.nom_translit} — {info.nom_fr}
        </h1>
        <div className="flex items-center justify-center gap-3 text-sm text-gray-500 flex-wrap">
          <span className="px-3 py-1 rounded-full bg-emerald/8 text-emerald font-semibold">
            Sourate {info.numero}
          </span>
          <span>{info.versets} versets</span>
          <span>·</span>
          <span>{info.type}</span>
        </div>
      </div>

      {info.numero !== 1 && info.numero !== 9 && (
        <div className="text-center mb-12 py-6 border-y border-emerald/10">
          <div className="font-amiri text-emerald-dark text-2xl mb-3" dir="rtl">
            بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
          </div>
          <div className="text-sm text-gray-500">
            Au nom d'Allah, le Tout Miséricordieux, le Très Miséricordieux.
          </div>
        </div>
      )}

      <div className="space-y-6">
        {ayahsAr.map((ayah, i) => {
          const fr = ayahsFr[i];
          const tafsir = tafsirs[i];
          const isOpen = openTafsir === ayah.numberInSurah;

          return (
            <div key={ayah.numberInSurah}
              className="bg-white rounded-3xl p-6 sm:p-8 border border-emerald/5">

              <div className="flex items-center justify-center mb-5">
                <div className="w-9 h-9 rounded-full bg-gold/15 text-gold
                                flex items-center justify-center font-bold text-sm">
                  {ayah.numberInSurah}
                </div>
              </div>

              <div className="font-amiri text-emerald-dark text-2xl sm:text-3xl
                              leading-loose text-right mb-6" dir="rtl">
                {ayah.text}
              </div>

              {fr && (
                <div className="pt-5 border-t border-emerald/10">
                  <div className="text-xs font-bold text-gold uppercase tracking-wider mb-2">
                    Traduction
                  </div>
                  <p className="text-gray-600 leading-relaxed">{fr.text}</p>
                </div>
              )}

              {tafsir && (
                <>
                  <button
                    onClick={() => setOpenTafsir(isOpen ? null : ayah.numberInSurah)}
                    className="mt-4 inline-flex items-center gap-2 text-sm font-semibold
                               text-emerald hover:text-gold transition">
                    {isOpen ? "Masquer" : "Voir"} le tafsir
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none"
                         stroke="currentColor" strokeWidth="2" strokeLinecap="round"
                         style={{ transform: isOpen ? "rotate(180deg)" : "none", transition: "transform 0.2s" }}>
                      <path d="M6 9l6 6 6-6"/>
                    </svg>
                  </button>

                  {isOpen && (
                    <div className="mt-4 p-5 rounded-2xl bg-emerald/5 border-l-4 border-gold">
                      <div className="text-xs font-bold text-gold uppercase tracking-wider mb-2">
                        Tafsir
                      </div>
                      <p className="text-sm text-gray-600 leading-relaxed whitespace-pre-line">
                        {tafsir}
                      </p>
                    </div>
                  )}
                </>
              )}
            </div>
          );
        })}
      </div>

      <div className="mt-12 text-center">
        <Link href="/audio/coran" className="text-emerald font-semibold hover:underline">
          ← Retour au Coran
        </Link>
      </div>
    </main>
  );
}