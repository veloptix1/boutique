"use client";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

const CURRENT_VERSION_CODE = 1;
const CURRENT_VERSION = "1.0.0";

export default function UpdateChecker() {
  const [update, setUpdate] = useState<any>(null);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const { data } = await supabase
          .from("app_versions")
          .select("*")
          .eq("platform", "android")
          .order("version_code", { ascending: false })
          .limit(1);

        if (data && data.length > 0) {
          const latest = data[0];
          if (latest.version_code > CURRENT_VERSION_CODE) setUpdate(latest);
        }
      } catch (e) { console.error(e); }
    })();
  }, []);

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
            <path d="M12 3v14M5 12l7 7 7-7"/>
            <path d="M5 21h14"/>
          </svg>
        </div>

        <h2 className="font-amiri font-bold text-emerald-dark text-2xl text-center mb-2">
          Nouvelle version disponible
        </h2>
        <p className="text-center text-sm text-gray-500 mb-1">Version {update.version}</p>

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
              <path d="M12 3v14M5 12l7 7 7-7"/>
              <path d="M5 21h14"/>
            </svg>
            Télécharger la mise à jour
          </a>

          {!update.obligatoire && (
            <button onClick={() => setDismissed(true)}
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
