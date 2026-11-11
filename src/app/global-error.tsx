"use client";
import "./globals.css";

// Dernier filet de sécurité : s'affiche si l'erreur vient de la mise en page elle-même.
export default function GlobalError({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <html lang="fr">
      <body>
        <main className="page flex min-h-dvh flex-col items-center justify-center text-center">
          <p aria-hidden="true" className="font-amiri text-[5.5rem] font-bold leading-none text-gold-deep">500</p>
          <h1 className="h-page mt-2">Une erreur est survenue</h1>
          <p className="mx-auto mt-3 max-w-sm text-muted">L'application a rencontré un problème inattendu.</p>
          <div className="mt-8 flex w-full max-w-xs flex-col gap-3">
            <button onClick={reset} className="btn-primary">Réessayer</button>
            <a href="/" className="btn-secondary">Retour à l'accueil</a>
          </div>
        </main>
      </body>
    </html>
  );
}
