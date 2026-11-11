import type { ReactNode } from "react";

/** Page d'état plein écran (404, 403, 500, hors ligne…). */
export default function StatusPage({ code, title, text, children }: { code?: string; title: string; text: string; children?: ReactNode }) {
  return (
    <main className="page flex min-h-[calc(100dvh-160px)] flex-col items-center justify-center text-center">
      {code && <p aria-hidden="true" className="font-amiri text-[5.5rem] font-bold leading-none text-gold-deep">{code}</p>}
      <h1 className="h-page mt-2">{title}</h1>
      <p className="mx-auto mt-3 max-w-sm leading-relaxed text-muted">{text}</p>
      {children && <div className="mt-8 flex w-full max-w-xs flex-col gap-3">{children}</div>}
    </main>
  );
}
