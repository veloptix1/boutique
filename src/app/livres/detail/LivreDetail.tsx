"use client";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { BackLink } from "@/components/ui";
import { supabase } from "@/lib/supabase";
import { safeUrl } from "@/lib/security";
import { useLang } from "@/components/LangProvider";
import { EndMark } from "@/components/PageHeader";
import { IconLivre, IconUser, IconDownload, IconBook } from "@/components/icons";

export default function LivreDetail() {
  const searchParams = useSearchParams();
  const slug = searchParams.get("slug") || "";
  const { lang } = useLang();
  const [livre, setLivre] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [showReader, setShowReader] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const { data } = await supabase.from("livres").select("*").eq("slug", slug).limit(1);
        if (data && data.length > 0) setLivre(data[0]);
      } catch (e) { console.error(e); }
      finally { setLoading(false); }
    })();
  }, [slug]);

  if (loading) return <div className="min-h-dvh flex items-center justify-center bg-cream"><p className="text-emerald">Chargement...</p></div>;
  if (!livre) return (
    <main className="page text-center">
      <h1 className="font-amiri font-bold text-emerald-dark text-3xl mb-4">Livre introuvable</h1>
      <BackLink href="/livres" label="Retour aux livres" />
    </main>
  );

  const getTitre = () => lang === "ar" ? livre.titre_ar || livre.titre_fr : lang === "en" ? livre.titre_en || livre.titre_fr : livre.titre_fr;
  const getAuteur = () => lang === "ar" ? livre.auteur_ar || livre.auteur_fr : lang === "en" ? livre.auteur_en || livre.auteur_fr : livre.auteur_fr;
  const getDesc = () => lang === "ar" ? livre.description_ar || livre.description_fr : lang === "en" ? livre.description_en || livre.description_fr : livre.description_fr;

  // URL encodée pour Google Docs Viewer
  const pdfUrl = safeUrl(livre.pdf_url) ?? "#";
  const googleViewerUrl = `https://docs.google.com/viewer?url=${encodeURIComponent(pdfUrl)}&embedded=true`;

  return (
    <main className="page">

      <BackLink href="/livres" label="Retour aux livres" />


      <div className="mb-10 grid md:grid-cols-[280px_1fr] gap-8">
        {/* Couverture */}
        <div className="bg-gradient-to-br from-emerald to-emerald-dark rounded-2xl
                        aspect-[3/4] flex items-center justify-center
                        overflow-hidden">
          {livre.couverture_url ? (
            <img loading="lazy" decoding="async" src={livre.couverture_url} alt={getTitre()}
              className="w-full h-full object-cover" />
          ) : (
            <div className="text-gold flex flex-col items-center gap-4">
              <IconLivre size={64} />
              <div className="text-xs font-semibold opacity-70">
                {livre.langue?.toUpperCase()}
              </div>
            </div>
          )}
        </div>

        {/* Infos */}
        <div className="flex flex-col">
          {livre.categorie && (
            <div className="inline-block self-start px-3 py-1 rounded-full
                            bg-emerald/8 text-emerald text-xs font-bold mb-3">
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
            <div className="flex items-center gap-2 text-ink/80 mb-6">
              <IconUser size={18} />
              <span className="font-semibold">{getAuteur()}</span>
            </div>
          )}

          <div className="flex flex-wrap gap-4 text-xs text-muted mb-6">
            {livre.pages && <span>{livre.pages} pages</span>}
            {livre.annee && <span>{livre.annee}</span>}
            <span>Langue : {livre.langue?.toUpperCase()}</span>
          </div>

          {getDesc() && (
            <p className="text-ink/80 text-sm leading-relaxed whitespace-pre-line mb-8">
              {getDesc()}
            </p>
          )}

          <div className="flex flex-wrap gap-3 mt-auto">
            <button
              onClick={() => setShowReader(!showReader)}
              className="inline-flex items-center gap-2 px-7 py-3.5 rounded-2xl
                         bg-emerald text-white font-semibold text-sm
                         hover:bg-emerald-dark transition-all">
              <IconBook size={18} />
              {showReader ? "Fermer la lecture" : "Lire maintenant"}
            </button>
            <a
              href={pdfUrl}
              download
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-7 py-3.5 rounded-2xl
                         bg-white text-emerald-dark font-semibold text-sm
                         border border-line
                         hover:border-gold hover:text-gold transition-all">
              <IconDownload size={18} />
              Télécharger le PDF
            </a>
          </div>
        </div>
      </div>

      {/* Lecteur PDF intégré */}
      {showReader && (
        <div className="bg-white rounded-2xl overflow-hidden border border-line">
          <div className="px-6 py-4 border-b border-line flex items-center justify-between">
            <div className="font-bold text-emerald-dark text-sm">
              Lecture en ligne — {getTitre()}
            </div>
            <button onClick={() => setShowReader(false)}
              className="text-muted hover:text-terracotta text-sm font-semibold">
              Fermer ✕
            </button>
          </div>
          <div className="bg-gray-100" style={{ height: "85vh" }}>
            <iframe
              src={googleViewerUrl}
              title={getTitre()}
              className="w-full h-full border-0"
              sandbox="allow-scripts allow-same-origin allow-popups"
              referrerPolicy="no-referrer"
            />
          </div>
          <div className="px-6 py-3 border-t border-line bg-cream text-center">
            <p className="text-xs text-muted">
              Si le PDF ne s'affiche pas, <a href={pdfUrl} target="_blank" rel="noopener noreferrer" className="text-emerald font-semibold hover:underline">cliquez ici pour l'ouvrir dans un nouvel onglet</a>.
            </p>
          </div>
        </div>
      )}

      <EndMark />
    </main>
  );
}
