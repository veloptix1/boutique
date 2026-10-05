"use client";
import { Bismillah, EndMark } from "@/components/PageHeader";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { supabase } from "@/lib/supabase";

type Ayah = { numberInSurah: number; text: string; number: number };
type SourateInfo = any;

export default function SourateView() {
  const searchParams = useSearchParams();
  const numero = searchParams.get("numero") || "";
  const [ayahsAr, setAyahsAr] = useState<Ayah[]>([]);
  const [ayahsFr, setAyahsFr] = useState<Ayah[]>([]);
  const [info, setInfo] = useState<SourateInfo>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

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
      <Bismillah />
      <Link href="/audio/coran" className="text-emerald text-sm font-semibold hover:underline">← Retour au Coran</Link>
      <div className="mt-8 mb-12 text-center">
        <div className="font-amiri text-gold text-4xl mb-3" dir="rtl">سورة {info.nom_ar}</div>
        <h1 className="font-amiri font-bold text-emerald-dark text-3xl sm:text-4xl mb-3">{info.nom_translit} — {info.nom_fr}</h1>
        <div className="flex items-center justify-center gap-3 text-sm text-gray-500 flex-wrap">
          <span className="px-3 py-1 rounded-full bg-emerald/8 text-emerald font-semibold">Sourate {info.numero}</span>
          <span>{info.versets} versets</span>
          <span>·</span>
          <span>{info.type}</span>
        </div>
      </div>
      {info.numero !== 1 && info.numero !== 9 && (
        <div className="text-center mb-12 py-6 border-y border-emerald/10">
          <div className="font-amiri text-emerald-dark text-2xl mb-3" dir="rtl">بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ</div>
          <div className="text-sm text-gray-500">Au nom d'Allah, le Tout Miséricordieux, le Très Miséricordieux.</div>
        </div>
      )}
      <div className="space-y-6">
        {ayahsAr.map((ayah, i) => {
          const fr = ayahsFr[i];
          return (
            <div key={ayah.numberInSurah} className="bg-white rounded-3xl p-6 sm:p-8 border border-emerald/5">
              <div className="flex items-center justify-center mb-5">
                <div className="w-9 h-9 rounded-full bg-gold/15 text-gold flex items-center justify-center font-bold text-sm">{ayah.numberInSurah}</div>
              </div>
              <div className="font-amiri text-emerald-dark text-2xl sm:text-3xl leading-loose text-right mb-6" dir="rtl">{ayah.text}</div>
              {fr && <div className="pt-5 border-t border-emerald/10">
                <div className="text-xs font-bold text-gold uppercase tracking-wider mb-2">Traduction</div>
                <p className="text-gray-600 leading-relaxed">{fr.text}</p>
              </div>}
            </div>
          );
        })}
      </div>
      <div className="mt-12 text-center">
        <Link href="/audio/coran" className="text-emerald font-semibold hover:underline">← Retour au Coran</Link>
      </div>
      <EndMark />
    </main>
  );
}
