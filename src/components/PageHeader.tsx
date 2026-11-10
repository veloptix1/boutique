"use client";

// Conservé pour compatibilité : la basmala n'apparaît plus que sur l'accueil.
export function Bismillah() {
  return null;
}

/** Fin de page discrète. */
export function EndMark() {
  return (
    <p className="mt-12 text-center font-amiri text-base text-gold-deep">
      والله أعلم
    </p>
  );
}
