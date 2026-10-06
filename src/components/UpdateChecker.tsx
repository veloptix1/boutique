"use client";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

// ⚠️ À METTRE À JOUR à chaque nouvelle version de l'app
const CURRENT_VERSION_CODE = 1;
const CURRENT_VERSION = "1.0.0";
const CURRENT_PLATFORM = "android"; // ou "ios" selon la plateforme

export default function UpdateChecker() {
  const [update, setUpdate] = useState<any>(null);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const { data } = await supabase
          .from("app_versions")
          .select("*")
          .eq("platform", CURRENT_PLATFORM)
          .eq("actif", true)
          .order("version_code", { ascending: false })
          .limit(1);

        if (data && data.length > 0) {
          const latest = data[0];
          if (latest.version_code > CURRENT_VERSION_CODE) {
            // Vérifier si l'utilisateur a déjà ignoré cette version
            const dismissedVersion = localStorage.getItem("dismissed_version");
            if (dismissedVersion === latest.version && !latest.obligatoire) {
              return; // l'utilisateur a déjà ignoré cette version
            }
            setUpdate(latest);
          }
        }
      } catch (e) {
        console.error(e);
      }
    })();
  }, []);

  const handleDismiss = () => {
    if (update) {
      localStorage.setItem("dismissed_version", update.version);
    }
    setDismissed(true);
  };

  if (!update || dismissed) return null;

  return (
    <div className="fixed inset-0 z-[9999] bg-black/70 backdrop-blur-sm
                    flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl w-full max-w-md p-6 sm:p-8
                      shadow-[0_30px_80px_rgba(0,0,0,0.3)] relative">

        <div className="w-16 h-16 mx-auto mb-5 rounded-2xl
                        bg-gradient-to-br from-emerald to-emerald-dark
                        flex items-center justify-center">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none"
               stroke="#d4af37" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/>
            <path d="M7 10l5 5 5-5M12 15V3"/>
          </svg>
        </div>

        <h2 className="font-amiri font-bold text-emerald-dark text-2xl text-center mb-2">
          Nouvelle version disponible
        </h2>

        <p className="text-center text-sm text-gray-500 mb-1">
          Version {update.version}
        </p>

        {update.taille && (
          <p className="text-center text-xs text-gray-400 mb-4">
            {update.taille}
          </p>
        )}

        {update.release_notes && (
          <div className="bg-cream rounded-2xl p-4 my-4 text-sm text-gray-600
                          max-h-32 overflow-y-auto">
            <div className="text-xs font-bold text-gold uppercase tracking-wider mb-2">
              Nouveautés
            </div>
            {update.release_notes}
          </div>
        )}

        <div className="flex flex-col gap-2 mt-5">
          <a href={update.download_url} target="_blank" rel="noopener noreferrer"
            className="w-full py-3.5 rounded-2xl bg-emerald text-white font-semibold
                       text-sm text-center hover:bg-emerald-dark transition
                       inline-flex items-center justify-center gap-2">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
                 stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/>
              <path d="M7 10l5 5 5-5M12 15V3"/>
            </svg>
            Télécharger la mise à jour
          </a>

          {!update.obligatoire && (
            <button onClick={handleDismiss}
              className="w-full py-3 rounded-2xl border-2 border-emerald/15
                         text-emerald-dark font-semibold text-sm
                         hover:border-terracotta hover:text-terracotta transition">
              Plus tard
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
