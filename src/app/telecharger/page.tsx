"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { BackLink } from "@/components/ui";
import { supabase } from "@/lib/supabase";
import { safeUrl } from "@/lib/security";
import { EndMark } from "@/components/PageHeader";

type Version = {
  id: string;
  platform: string;
  version: string;
  version_code: number;
  download_url: string;
  taille: string | null;
  release_notes: string | null;
  created_at: string;
};

export default function TelechargerPage() {
  const [versions, setVersions] = useState<Version[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const { data } = await supabase
          .from("app_versions")
          .select("*")
          .eq("actif", true)
          .order("version_code", { ascending: false });
        setVersions(data || []);
      } catch (e) { console.error(e); }
      finally { setLoading(false); }
    })();
  }, []);

  const android = versions.find((v) => v.platform === "android");
  const ios = versions.find((v) => v.platform === "ios");

  return (
    <main className="page max-w-[900px]">

      <BackLink href="/dashboard" label="Retour" />


      <div className="mb-12 text-center">
        <div className="w-16 h-16 mx-auto rounded-2xl bg-emerald/10 flex items-center justify-center text-link mb-4">
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none"
               stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/>
            <path d="M7 10l5 5 5-5M12 15V3"/>
          </svg>
        </div>
        <h1 className="font-amiri font-bold text-heading text-[1.75rem] leading-tight sm:text-4xl mb-3">
          Télécharger l''application
        </h1>
        <p className="text-muted max-w-2xl mx-auto">
          Installez AL BASIRAH sur votre téléphone pour écouter les savants,
          lire le Coran et découvrir les hadiths authentiques partout.
        </p>
      </div>

      {loading ? (
        <p className="text-muted text-center">Chargement...</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">

          {/* Android */}
          <div className="bg-surface rounded-2xl p-6 border border-line">
            <div className="w-16 h-16 rounded-2xl bg-emerald/10 flex items-center justify-center mb-4">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="#0d5c4a">
                <path d="M17.6 9.48l1.84-3.18c.16-.31.04-.69-.26-.85a.637.637 0 00-.83.22l-1.88 3.24a11.463 11.463 0 00-8.94 0L5.65 5.67a.643.643 0 00-.87-.2c-.28.18-.37.54-.22.83L6.4 9.48A10.78 10.78 0 001 18h22a10.78 10.78 0 00-5.4-8.52zM7 15.25a1.25 1.25 0 110-2.5 1.25 1.25 0 010 2.5zm10 0a1.25 1.25 0 110-2.5 1.25 1.25 0 010 2.5z"/>
              </svg>
            </div>
            <h2 className="font-amiri font-bold text-heading text-2xl mb-2">Android</h2>
            <p className="text-sm text-muted mb-4">
              Compatible avec tous les téléphones Android 6.0+
            </p>

            {android ? (
              <>
                <div className="flex items-center gap-2 mb-3">
                  <span className="px-3 py-1 rounded-full bg-emerald/10 text-link
                                   text-xs font-bold">
                    v{android.version}
                  </span>
                  {android.taille && (
                    <span className="text-xs text-muted">{android.taille}</span>
                  )}
                </div>

                {android.release_notes && (
                  <p className="text-xs text-muted mb-4 leading-relaxed">
                    {android.release_notes}
                  </p>
                )}

                <a href={safeUrl(android.download_url) ?? "#"} target="_blank" rel="noopener noreferrer"
                  className="w-full py-3.5 rounded-2xl bg-emerald text-white font-semibold
                             text-sm text-center hover:bg-emerald-dark transition
                             inline-flex items-center justify-center gap-2">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
                       stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                    <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/>
                    <path d="M7 10l5 5 5-5M12 15V3"/>
                  </svg>
                  Télécharger l''APK
                </a>
              </>
            ) : (
              <p className="text-sm text-muted">Aucune version disponible</p>
            )}
          </div>

          {/* iOS */}
          <div className="bg-surface rounded-2xl p-6 border border-line">
            <div className="w-16 h-16 rounded-2xl bg-emerald/10 flex items-center justify-center mb-4">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="#333">
                <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09l.01-.01zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z"/>
              </svg>
            </div>
            <h2 className="font-amiri font-bold text-heading text-2xl mb-2">iOS</h2>
            <p className="text-sm text-muted mb-4">
              Compatible avec iPhone et iPad (iOS 13+)
            </p>

            {ios ? (
              <>
                <div className="flex items-center gap-2 mb-3">
                  <span className="px-3 py-1 rounded-full bg-emerald/10 text-link
                                   text-xs font-bold">
                    v{ios.version}
                  </span>
                  {ios.taille && (
                    <span className="text-xs text-muted">{ios.taille}</span>
                  )}
                </div>

                {ios.release_notes && (
                  <p className="text-xs text-muted mb-4 leading-relaxed">
                    {ios.release_notes}
                  </p>
                )}

                <a href={safeUrl(ios.download_url) ?? "#"} target="_blank" rel="noopener noreferrer"
                  className="w-full py-3.5 rounded-2xl bg-gray-800 text-white font-semibold
                             text-sm text-center hover:bg-black transition
                             inline-flex items-center justify-center gap-2">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
                       stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                    <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/>
                    <path d="M7 10l5 5 5-5M12 15V3"/>
                  </svg>
                  Télécharger
                </a>
              </>
            ) : (
              <p className="text-sm text-muted">Bientôt disponible</p>
            )}
          </div>
        </div>
      )}

      {/* Comment installer */}
      <div className="mt-12 bg-emerald/5 rounded-2xl p-6 sm:p-8 border border-line">
        <h2 className="font-amiri font-bold text-heading text-xl mb-4">
          Comment installer sur Android
        </h2>
        <ol className="space-y-3 text-sm text-ink">
          <li className="flex gap-3">
            <span className="shrink-0 w-6 h-6 rounded-full bg-emerald text-white
                             flex items-center justify-center text-xs font-bold">1</span>
            <span>Cliquez sur le bouton « Télécharger l''APK » ci-dessus.</span>
          </li>
          <li className="flex gap-3">
            <span className="shrink-0 w-6 h-6 rounded-full bg-emerald text-white
                             flex items-center justify-center text-xs font-bold">2</span>
            <span>Ouvrez le fichier téléchargé. Si Android vous demande d''autoriser
            l''installation depuis cette source, acceptez.</span>
          </li>
          <li className="flex gap-3">
            <span className="shrink-0 w-6 h-6 rounded-full bg-emerald text-white
                             flex items-center justify-center text-xs font-bold">3</span>
            <span>Attendez la fin de l''installation, puis ouvrez AL BASIRAH.</span>
          </li>
        </ol>
      </div>

      <EndMark />
    </main>
  );
}
