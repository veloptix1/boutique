"use client";
import { useState } from "react";
import StatusPage from "./StatusPage";

export default function OfflineScreen({ onRetry }: { onRetry: () => Promise<boolean> }) {
  const [checking, setChecking] = useState(false);
  const [failed, setFailed] = useState(false);

  const retry = async () => {
    setChecking(true); setFailed(false);
    const ok = await onRetry();
    setChecking(false); setFailed(!ok);
  };

  return (
    <StatusPage title="Vous êtes hors ligne" text="Cette page a besoin d'internet. Vérifiez votre connexion Wi-Fi ou vos données mobiles, puis réessayez.">
      <svg aria-hidden="true" className="mx-auto -mt-2 mb-2 text-gold-deep" width="56" height="56" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <path d="M2 8.8a15 15 0 0 1 4.2-2.6M22 8.8a15 15 0 0 0-10-3.3M5 12.5a10 10 0 0 1 3.2-1.9M19 12.5a10 10 0 0 0-4.2-2.2M8.5 16.4a5 5 0 0 1 7 0" />
        <circle cx="12" cy="19.5" r="0.8" fill="currentColor" /><path d="M3 3l18 18" />
      </svg>
      <button onClick={retry} disabled={checking} className="btn-primary">{checking ? "Vérification…" : "Réessayer"}</button>
      {failed && <p role="status" className="text-sm text-terracotta-deep">Toujours pas de connexion.</p>}
    </StatusPage>
  );
}
