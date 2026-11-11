"use client";
import { EndMark } from "@/components/PageHeader";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { BackLink } from "@/components/ui";
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
      <div className="min-h-dvh flex items-center justify-center bg-cream">
        <p className="text-link">Chargement...</p>
      </div>
    );
  }

  if (!prophete) {
    return (
      <main className="page text-center">
        <h1 className="font-amiri font-bold text-heading text-3xl mb-4">
          Prophète introuvable
        </h1>
        <BackLink href="/prophetes" label="Retour aux prophètes" />
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
    emerald: { bg: "bg-emerald/10", text: "text-link", border: "border-emerald/20" },
    gold: { bg: "bg-gold/15", text: "text-gold", border: "border-gold/30" },
    terracotta: { bg: "bg-terracotta/10", text: "text-terracotta", border: "border-terracotta/20" },
  };

  return (
    <main className="page max-w-[900px]">

      <BackLink href="/prophetes" label="Retour aux prophètes" />

      {/* En-tête */}
      <div className="mt-8 mb-10 text-center">
        <div className="w-24 h-24 mx-auto rounded-full bg-gradient-to-br from-gold to-gold-light
                        flex items-center justify-center text-heading font-amiri font-bold text-4xl mb-5">
          {prophete.ordre}
        </div>

        {prophete.nom_ar && lang !== "ar" && (
          <div className="font-amiri text-gold text-3xl mb-2" dir="rtl">
            {prophete.nom_ar}
          </div>
        )}

        <h1 className="font-amiri font-bold text-heading text-[1.75rem] leading-tight sm:text-4xl mb-3">
          {getName()}
        </h1>

        {getSurnom() && (
          <div className="inline-block px-4 py-1.5 rounded-full bg-gold/15 text-gold-deep
                          text-sm font-bold">
            {getSurnom()}
          </div>
        )}
      </div>

      {/* Infos */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
        {prophete.epoque && (
          <div className="bg-surface rounded-2xl p-4 border border-line text-center">
            <div className="text-xs font-bold text-gold mb-2">
              Époque
            </div>
            <div className="text-sm text-heading font-semibold">{prophete.epoque}</div>
          </div>
        )}
        {prophete.lieu && (
          <div className="bg-surface rounded-2xl p-4 border border-line text-center">
            <div className="text-xs font-bold text-gold mb-2">
              Lieu
            </div>
            <div className="text-sm text-heading font-semibold">{prophete.lieu}</div>
          </div>
        )}
        {prophete.peuple && (
          <div className="bg-surface rounded-2xl p-4 border border-line text-center">
            <div className="text-xs font-bold text-gold mb-2">
              Peuple
            </div>
            <div className="text-sm text-heading font-semibold">{prophete.peuple}</div>
          </div>
        )}
      </div>

      {/* Sections */}
      <div className="space-y-6">
        {sections.map((section, i) => {
          if (section.lines.length === 0) return null;
          const c = colorMap[section.color];
          return (
            <div key={i} className={`bg-surface rounded-2xl p-6 sm:p-8 border ${c.border}`}>
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
                  <li key={j} className="flex items-start gap-3 text-sm text-ink leading-relaxed">
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
        <BackLink href="/prophetes" label="Retour aux prophètes" />
      </div>
      <EndMark />
    </main>
  );
}
