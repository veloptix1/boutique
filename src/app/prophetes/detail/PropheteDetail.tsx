"use client";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { useLang } from "@/components/LangProvider";

export default function PropheteDetail() {
  const searchParams = useSearchParams();
  const slug = searchParams.get("slug") || "";
  const { lang } = useLang();
  const [prophete, setProphete] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const { data } = await supabase
          .from("prophetes").select("*").eq("slug", slug).limit(1);
        if (data && data.length > 0) setProphete(data[0]);
      } catch (e) { console.error(e); }
      finally { setLoading(false); }
    })();
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-cream">
        <p className="text-emerald">Chargement...</p>
      </div>
    );
  }

  if (!prophete) {
    return (
      <main className="px-[6%] pt-32 pb-32 max-w-[1200px] mx-auto text-center">
        <h1 className="font-amiri font-bold text-emerald-dark text-3xl mb-4">
          Prophète introuvable
        </h1>
        <Link href="/prophetes" className="text-emerald hover:underline font-semibold">
          ← Retour aux prophètes
        </Link>
      </main>
    );
  }

  const getName = () =>
    lang === "ar" ? prophete.nom_ar || prophete.nom_fr
      : lang === "en" ? prophete.nom_en || prophete.nom_fr
      : prophete.nom_fr;

  const getSurnom = () =>
    lang === "ar" ? prophete.surnom_ar || prophete.surnom_fr : prophete.surnom_fr;

  // Découpe le texte en lignes (séparées par —)
  const splitLines = (text: string | null) => {
    if (!text) return [];
    return text.split("—").map((s) => s.trim()).filter(Boolean);
  };

  const sections = [
    {
      title: "Passages dans le Coran",
      icon: "📖",
      color: "emerald",
      lines: splitLines(prophete.passages_coran),
    },
    {
      title: "Hadiths authentiques",
      icon: "📜",
      color: "gold",
      lines: splitLines(prophete.hadiths),
    },
    {
      title: "Paroles des Sahaba et des savants",
      icon: "🕌",
      color: "terracotta",
      lines: splitLines(prophete.paroles_savants),
    },
  ];

  const colorMap: Record<string, { bg: string; text: string; border: string }> = {
    emerald: { bg: "bg-emerald/10", text: "text-emerald", border: "border-emerald/20" },
    gold: { bg: "bg-gold/15", text: "text-gold", border: "border-gold/30" },
    terracotta: { bg: "bg-terracotta/10", text: "text-terracotta", border: "border-terracotta/20" },
  };

  return (
    <main className="px-[6%] pt-24 pb-40 max-w-[900px] mx-auto min-h-screen">

      <Link href="/prophetes" className="text-emerald text-sm font-semibold hover:underline">
        ← Retour aux prophètes
      </Link>

      {/* En-tête */}
      <div className="mt-8 mb-10 text-center">
        <div className="w-24 h-24 mx-auto rounded-full bg-gradient-to-br from-gold to-gold-light
                        flex items-center justify-center text-emerald-dark font-amiri font-bold text-4xl
                        shadow-[0_15px_35px_rgba(212,175,55,0.3)] mb-5">
          {prophete.ordre}
        </div>

        {prophete.nom_ar && lang !== "ar" && (
          <div className="font-amiri text-gold text-3xl mb-2" dir="rtl">
            {prophete.nom_ar}
          </div>
        )}

        <h1 className="font-amiri font-bold text-emerald-dark text-4xl sm:text-5xl mb-3">
          {getName()}
        </h1>

        {getSurnom() && (
          <div className="inline-block px-4 py-1.5 rounded-full bg-gold/15 text-gold
                          text-sm font-bold uppercase tracking-wider">
            {getSurnom()}
          </div>
        )}
      </div>

      {/* Infos */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
        {prophete.epoque && (
          <div className="bg-white rounded-2xl p-4 border border-emerald/5 text-center">
            <div className="text-xs font-bold text-gold uppercase tracking-wider mb-2">
              Époque
            </div>
            <div className="text-sm text-emerald-dark font-semibold">{prophete.epoque}</div>
          </div>
        )}
        {prophete.lieu && (
          <div className="bg-white rounded-2xl p-4 border border-emerald/5 text-center">
            <div className="text-xs font-bold text-gold uppercase tracking-wider mb-2">
              Lieu
            </div>
            <div className="text-sm text-emerald-dark font-semibold">{prophete.lieu}</div>
          </div>
        )}
        {prophete.peuple && (
          <div className="bg-white rounded-2xl p-4 border border-emerald/5 text-center">
            <div className="text-xs font-bold text-gold uppercase tracking-wider mb-2">
              Peuple
            </div>
            <div className="text-sm text-emerald-dark font-semibold">{prophete.peuple}</div>
          </div>
        )}
      </div>

      {/* Sections */}
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
                <h2 className={`font-amiri font-bold text-xl ${c.text}`}>
                  {section.title}
                </h2>
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

      <div className="mt-12 text-center">
        <Link href="/prophetes" className="text-emerald font-semibold hover:underline">
          ← Retour aux prophètes
        </Link>
      </div>
    </main>
  );
}
