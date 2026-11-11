"use client";
import { useEffect } from "react";
import Link from "next/link";
import StatusPage from "@/components/StatusPage";

export default function ErrorPage({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => { console.error(error); }, [error]);
  return (
    <StatusPage code="500" title="Une erreur est survenue" text="Quelque chose s'est mal passé de notre côté. Réessayez dans un instant.">
      <button onClick={reset} className="btn-primary">Réessayer</button>
      <Link href="/" className="btn-secondary">Retour à l'accueil</Link>
    </StatusPage>
  );
}
