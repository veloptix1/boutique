"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { useLang } from "@/components/LangProvider";
import { IconLivre, IconUser, IconDownload, IconBook } from "@/components/icons";

type Livre = {
  id: string;
  slug: string;
  titre_fr: string;
  titre_ar: string | null;
  titre_en: string | null;
  auteur_fr: string | null;
  auteur_ar: string | null;
  auteur_en: string | null;
  description_fr: string | null;
  description_ar: string | null;
  description_en: string | null;
  couverture_url: string | null;
  pdf_url: string;
  pages: number | null;
  langue: string;
  categorie: string | null;
  annee: string | null;
};

export default function LivreClient({ slug }: { slug: string }) {
  const { lang } = useLang();
  const [livre, setLivre] = useState<Livre | null>(null);
  const [loading, setLoading] = useState(true);
  const [showReader, setShowReader] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const { data, error } = await supabase
          .from("livres")
          .select("*")
          .eq("slug", slug)
          .limit(1);
        if (error) console.error("Erreur livre:", error);
        setLivre(data && data.length > 0 ? data[0] : null);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    })();
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-cream">
        <p className="text-emerald">Chargement...</p>
      </div>
    );
  }

  if (!livre) {
    return (
      <main className="px-[6%] pt-32 pb-32 max-w-[1200px] mx-auto text-center">
        <h1 className="font-amiri font-bold text-emerald-dark text-3xl mb-4">
          Livre introuvable
        </h1>
        <p className="text-gray-500 text-sm mb-6">
          Le livre « {slug} » n'existe pas dans notre bibliothèque.
        </p>
        <Link href="/livres" className="text-emerald hover:underline font-semibold">
          ← Retour aux livres
        </Link>
      </main>
    );
  }

  const getTitre = () =>
    lang === "ar" ? livre.titre_ar || livre.titre_fr
      : lang === "en" ? livre.titre_en || livre.titre_fr
      : livre.titre_fr;

  const getAuteur = () =>
    lang === "ar" ? livre.auteur_ar || livre.auteur_fr
      : lang === "en" ? livre.auteur_en || livre.auteur_fr
      : livre.auteur_fr;

  const getDesc = () =>
    lang === "ar" ? livre.description_ar || livre.description_fr
      : lang === "en" ? livre.description_en || livre.description_fr
      : livre.description_fr;

  return (
    <main className="px-[6%] pt-24 pb-40 max-w-[1200px] mx-auto">

      <Link href="/livres"
        className="text-emerald text-sm font-semibold hover:underline inline-flex items-center gap-1">
        ← Retour aux livres
      </Link>

      <div className="mt-6 mb-10 grid md:grid-cols-[280px_1fr] gap-8">
        <div className="bg-gradient-to-br from-emerald to-emerald-dark rounded-[28px]
                        aspect-[3/4] flex items-center justify-center
                        overflow-hidden shadow-[0_30px_60px_rgba(13,92,74,0.2)]">
          {livre.couverture_url ? (
            <img src={livre.couverture_url} alt={getTitre()}
              className="w-full h-full object-cover" />
          ) : (
            <div className="text-gold flex flex-col items-center gap-4">
              <IconLivre size={64} />
              <div className="text-xs font-semibold uppercase tracking-widest opacity-70">
                {livre.langue?.toUpperCase()}
              </div>
            </div>
          )}
        </div>

        <div className="flex flex-col">
          {livre.categorie && (
            <div className="inline-block self-start px-3 py-1 rounded-full
                            bg-emerald/8 text-emerald text-[0.7rem] font-bold
                            uppercase tracking-wider mb-3">
              {livre.categorie}
            </div>
          )}

          {livre.titre_ar && lang !== "ar" && (
            <div className="font-amiri text-gold text-lg mb-2" dir="rtl">
              {livre.titre_ar}
            </div>
          )}

          <h1 className="font-amiri font-bold text-emerald-dark text-3xl sm:text-4xl leading-tight mb-4">
            {getTitre()}
          </h1>

          {getAuteur() && (
            <div className="flex items-center gap-2 text-gray-600 mb-6">
              <IconUser size={18} />
              <span className="font-semibold">{getAuteur()}</span>
            </div>
          )}

          <div className="flex flex-wrap gap-4 text-xs text-gray-400 mb-6">
            {livre.pages && <span>{livre.pages} pages</span>}
            {livre.annee && <span>{livre.annee}</span>}
            <span>Langue : {livre.langue?.toUpperCase()}</span>
          </div>

          {getDesc() && (
            <p className="text-gray-600 text-sm leading-relaxed whitespace-pre-line mb-8">
              {getDesc()}
            </p>
          )}

          <div className="flex flex-wrap gap-3 mt-auto">
            <button
              onClick={() => setShowReader(true)}
              className="inline-flex items-center gap-2 px-7 py-3.5 rounded-2xl
                         bg-emerald text-white font-semibold text-sm
                         hover:bg-emerald-dark transition-all
                         shadow-[0_10px_25px_rgba(13,92,74,0.25)]
                         hover:-translate-y-0.5">
              <IconBook size={18} />
              Lire maintenant
            </button>
            <a
              href={livre.pdf_url}
              download
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-7 py-3.5 rounded-2xl
                         bg-white text-emerald-dark font-semibold text-sm
                         border-2 border-emerald/15
                         hover:border-gold hover:text-gold transition-all">
              <IconDownload size={18} />
              Télécharger le PDF
            </a>
          </div>
        </div>
      </div>

      {showReader && (
        <div className="bg-white rounded-[28px] overflow-hidden border border-emerald/10
                        shadow-[0_25px_60px_rgba(13,92,74,0.1)]">
          <div className="px-6 py-4 border-b border-emerald/10 flex items-center justify-between">
            <div className="font-bold text-emerald-dark text-sm">Lecture en ligne</div>
            <button onClick={() => setShowReader(false)}
              className="text-gray-400 hover:text-terracotta text-sm font-semibold">
              Fermer ✕
            </button>
          </div>
          <div className="bg-gray-100" style={{ height: "80vh" }}>
            <iframe
              src={`${livre.pdf_url}#view=FitH`}
              title={getTitre()}
              className="w-full h-full border-0"
            />
          </div>
        </div>
      )}
    </main>
  );
}