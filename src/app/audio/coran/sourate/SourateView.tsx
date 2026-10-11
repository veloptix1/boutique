"use client";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { playAudio } from "@/components/AudioPlayer";
import { Bismillah, EndMark } from "@/components/PageHeader";
import { IconPlay, IconArrowRight } from "@/components/icons";

type Ayah = { numberInSurah: number; text: string; number: number };

const RECITATEURS = [
  { slug: "ar.alafasy",            nom: "Cheikh Mishary Al-Afasy",        pays: "Koweït" },
  { slug: "ar.husary",             nom: "Cheikh Mahmoud Khalil Al-Husary",pays: "Égypte" },
  { slug: "ar.husarymujawwad",     nom: "Cheikh Al-Husary (Mujawwad)",    pays: "Égypte" },
  { slug: "ar.abdulbasitmurattal", nom: "Cheikh Abdul-Basit (Murattal)",  pays: "Égypte" },
  { slug: "ar.abdurrahmaansudais", nom: "Cheikh Abdul-Rahman Al-Sudais",  pays: "Arabie Saoudite" },
  { slug: "ar.minshawi",           nom: "Cheikh Muhammad Al-Minshawi",    pays: "Égypte" },
  { slug: "ar.muhammadayyoub",     nom: "Cheikh Muhammad Ayyoub",         pays: "Arabie Saoudite" },
  { slug: "ar.hudhaify",           nom: "Cheikh Ali Al-Hudhaify",         pays: "Arabie Saoudite" },
  { slug: "ar.shaatree",           nom: "Cheikh Abu Bakr Ash-Shaatree",   pays: "Arabie Saoudite" },
  { slug: "ar.ahmedajamy",         nom: "Cheikh Ahmed Al-Ajamy",          pays: "Arabie Saoudite" },
  { slug: "ar.hanirifai",          nom: "Cheikh Hani Ar-Rifaï",           pays: "Arabie Saoudite" },
  { slug: "ar.mahermuaiqly",       nom: "Cheikh Maher Al-Muaiqly",        pays: "Arabie Saoudite" },
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
  const [dropdownOpen, setDropdownOpen] = useState(false);

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

  useEffect(() => {
    const closeDropdown = () => setDropdownOpen(false);
    if (dropdownOpen) {
      document.addEventListener("click", closeDropdown);
      return () => document.removeEventListener("click", closeDropdown);
    }
  }, [dropdownOpen]);

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

  const selectedRec = RECITATEURS.find((r) => r.slug === selectedRecitateur);

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
      <div className="bg-white rounded-3xl p-5 sm:p-6 border border-emerald/5 mb-10
                      shadow-[0_15px_35px_rgba(13,92,74,0.06)]">
        <div className="flex items-center gap-3 mb-5">
          <div className="w-10 h-10 rounded-2xl bg-gold/15 flex items-center justify-center text-gold">
            <IconPlay size={16} />
          </div>
          <div className="text-xs font-bold text-gold uppercase tracking-wider">
            Écouter la sourate
          </div>
        </div>

        {/* Sélecteur custom */}
        <div className="relative mb-4" onClick={(e) => e.stopPropagation()}>
          <button
            type="button"
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="w-full flex items-center gap-3 px-4 py-3.5 rounded-2xl
                       border-2 border-emerald/10 hover:border-emerald/20
                       bg-white transition text-left">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-emerald to-emerald-dark
                            flex items-center justify-center text-gold shrink-0">
              <IconPlay size={14} />
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-sm font-bold text-emerald-dark truncate">
                {selectedRec?.nom}
              </div>
              <div className="text-xs text-gray-500">{selectedRec?.pays}</div>
            </div>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
                 stroke="#0d5c4a" strokeWidth="2.5" strokeLinecap="round"
                 className={`transition-transform shrink-0 ${dropdownOpen ? "rotate-180" : ""}`}>
              <path d="M6 9l6 6 6-6"/>
            </svg>
          </button>

          {dropdownOpen && (
            <div className="absolute top-full left-0 right-0 mt-2 z-[100]
                            bg-white rounded-2xl border-2 border-emerald/10
                            shadow-[0_20px_50px_rgba(13,92,74,0.2)]
                            max-h-[300px] overflow-y-auto">
              {RECITATEURS.map((r, i) => {
                const isActive = r.slug === selectedRecitateur;
                return (
                  <button
                    key={r.slug}
                    type="button"
                    onClick={() => {
                      setSelectedRecitateur(r.slug);
                      setDropdownOpen(false);
                    }}
                    className={`w-full flex items-center gap-3 px-4 py-3 text-left
                                transition-all border-b border-emerald/5 last:border-b-0
                      ${isActive
                        ? "bg-emerald/8"
                        : "hover:bg-cream"}`}>
                    <div className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0
                      ${isActive
                        ? "bg-emerald text-gold"
                        : "bg-gold/15 text-gold"}`}>
                      <IconPlay size={12} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className={`text-sm font-semibold truncate
                        ${isActive ? "text-emerald" : "text-emerald-dark"}`}>
                        {r.nom}
                      </div>
                      <div className="text-xs text-gray-500">{r.pays}</div>
                    </div>
                    {isActive && (
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
                           stroke="#0d5c4a" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M20 6L9 17l-5-5"/>
                      </svg>
                    )}
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Bouton écouter */}
        <button
          onClick={playSourate}
          className="w-full py-3.5 rounded-2xl bg-emerald text-white font-semibold text-sm
                     hover:bg-emerald-dark transition shadow-[0_8px_20px_rgba(13,92,74,0.25)]
                     inline-flex items-center justify-center gap-2">
          <IconPlay size={16} color="#fff" />
          Écouter cette sourate
        </button>
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
