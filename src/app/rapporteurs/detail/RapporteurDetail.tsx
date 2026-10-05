"use client";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { useLang } from "@/components/LangProvider";
import { Bismillah, EndMark } from "@/components/PageHeader";

export default function RapporteurDetail() {
  const searchParams = useSearchParams();
  const slug = searchParams.get("slug") || "";
  const { lang } = useLang();
  const [rapporteur, setRapporteur] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const { data } = await supabase
          .from("rapporteurs").select("*").eq("slug", slug).limit(1);
        if (data && data.length > 0) setRapporteur(data[0]);
      } catch (e) { console.error(e); }
      finally { setLoading(false); }
    })();
  }, [slug]);

  if (loading) return <div className="min-h-screen flex items-center justify-center bg-cream"><p className="text-emerald">Chargement...</p></div>;
  if (!rapporteur) return (
    <main className="px-[6%] pt-32 pb-32 max-w-[1200px] mx-auto text-center">
      <h1 className="font-amiri font-bold text-emerald-dark text-3xl mb-4">Rapporteur introuvable</h1>
      <Link href="/rapporteurs" className="text-emerald hover:underline font-semibold">← Retour</Link>
    </main>
  );

  const getName = () =>
    lang === "ar" ? rapporteur.nom_ar || rapporteur.nom_fr
      : lang === "en" ? rapporteur.nom_en || rapporteur.nom_fr
      : rapporteur.nom_fr;

  const getTitre = () =>
    lang === "ar" ? rapporteur.titre_ar || rapporteur.titre_fr : rapporteur.titre_fr;

  const splitLines = (text: string | null) => {
    if (!text) return [];
    return text.split("—").map((s) => s.trim()).filter(Boolean);
  };

  const sections = [
    { title: "Où trouver ses hadiths", icon: "📚", color: "emerald", lines: splitLines(rapporteur.livres) },
    { title: "Avis des savants sur lui", icon: "🕌", color: "gold", lines: splitLines(rapporteur.savants_avis) },
  ];

  const colorMap: Record<string, { bg: string; text: string; border: string }> = {
    emerald: { bg: "bg-emerald/10", text: "text-emerald", border: "border-emerald/20" },
    gold: { bg: "bg-gold/15", text: "text-gold", border: "border-gold/30" },
  };

  return (
    <main className="px-[6%] pt-24 pb-40 max-w-[900px] mx-auto min-h-screen">

      <Link href="/rapporteurs" className="text-emerald text-sm font-semibold hover:underline">
        ← Retour aux rapporteurs
      </Link>

      <div className="mt-8">
        <Bismillah />
      </div>

      <div className="mb-10 text-center">
        <div className="w-24 h-24 mx-auto rounded-full bg-gradient-to-br from-emerald to-emerald-dark
                        flex items-center justify-center text-gold font-amiri font-bold text-4xl
                        shadow-[0_15px_35px_rgba(13,92,74,0.3)] mb-5">
          {rapporteur.ordre}
        </div>

        {rapporteur.nom_ar && lang !== "ar" && (
          <div className="font-amiri text-gold text-3xl mb-2" dir="rtl">
            {rapporteur.nom_ar}
          </div>
        )}

        <h1 className="font-amiri font-bold text-emerald-dark text-4xl sm:text-5xl mb-3">
          {getName()}
        </h1>

        {rapporteur.kunya && (
          <div className="text-sm text-gray-500 mb-3">{rapporteur.kunya}</div>
        )}

        {getTitre() && (
          <div className="inline-block px-4 py-1.5 rounded-full bg-emerald/10 text-emerald
                          text-sm font-bold uppercase tracking-wider">
            {getTitre()}
          </div>
        )}
      </div>

      {/* Infos */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        {rapporteur.epoque && (
          <div className="bg-white rounded-2xl p-4 border border-emerald/5 text-center">
            <div className="text-xs font-bold text-gold uppercase tracking-wider mb-1">Époque</div>
            <div className="text-sm text-emerald-dark font-semibold">{rapporteur.epoque}</div>
          </div>
        )}
        {rapporteur.lieu && (
          <div className="bg-white rounded-2xl p-4 border border-emerald/5 text-center">
            <div className="text-xs font-bold text-gold uppercase tracking-wider mb-1">Lieu</div>
            <div className="text-sm text-emerald-dark font-semibold">{rapporteur.lieu}</div>
          </div>
        )}
        {rapporteur.nombre_hadiths && (
          <div className="bg-white rounded-2xl p-4 border border-emerald/5 text-center">
            <div className="text-xs font-bold text-gold uppercase tracking-wider mb-1">Hadiths rapportés</div>
            <div className="text-sm text-emerald-dark font-semibold">{rapporteur.nombre_hadiths}</div>
          </div>
        )}
      </div>

      {/* Biographie */}
      {rapporteur.biographie_fr && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border-2 border-emerald/10 mb-6">
          <div className="flex items-center gap-3 mb-5">
            <div className="w-11 h-11 rounded-2xl bg-emerald/10 flex items-center justify-center text-2xl">
              📖
            </div>
            <h2 className="font-amiri font-bold text-emerald-dark text-xl">Sa biographie</h2>
          </div>
          <p className="text-gray-700 leading-relaxed whitespace-pre-line text-sm sm:text-base">
            {rapporteur.biographie_fr}
          </p>
        </div>
      )}

      {/* Sources */}
      <div className="space-y-6">
        {sections.map((section, i) => {
          if (section.lines.length === 0) return null;
          const c = colorMap[section.color];
          return (
            <div key={i} className={`bg-white rounded-3xl p-6 sm:p-8 border-2 ${c.border}`}>
              <div className="flex items-center gap-3 mb-5">
                <div className={`w-11 h-11 rounded-2xl flex items-center justify-center text-2xl ${c.bg}`}>
                  {section.icon}
                </div>
                <h2 className={`font-amiri font-bold text-xl ${c.text}`}>{section.title}</h2>
              </div>
              <ul className="space-y-3">
                {section.lines.map((line, j) => (
                  <li key={j} className="flex items-start gap-3 text-sm text-gray-700 leading-relaxed">
                    <span className={`mt-1.5 shrink-0 w-2 h-2 rounded-full ${c.text.replace("text-", "bg-")}`} />
                    <span>{line}</span>
                  </li>
                ))}
              </ul>
            </div>
          );
        })}
      </div>

      <EndMark />
    </main>
  );
}
