"use client";
import Link from "next/link";

const Chevron = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M15 18l-6-6 6-6" />
  </svg>
);

/** Lien de retour avec zone tactile de 40 px. */
export function BackLink({ href, label = "Retour" }: { href: string; label?: string }) {
  return (
    <Link href={href} className="-ml-2 mb-1 inline-flex h-10 items-center gap-0.5 rounded-lg px-2 text-sm font-medium text-emerald no-underline">
      <Chevron /> {label}
    </Link>
  );
}

/** En-tête de page : retour (optionnel), titre, sous-titre. */
export function PageHeader({ title, subtitle, back, backLabel }: { title: string; subtitle?: string; back?: string; backLabel?: string }) {
  return (
    <header className="mb-5">
      {back && (
        <Link href={back} className="-ml-2 mb-1 inline-flex h-10 items-center gap-0.5 rounded-lg px-2 text-sm font-medium text-emerald no-underline">
          <Chevron /> {backLabel || "Retour"}
        </Link>
      )}
      <h1 className="h-page">{title}</h1>
      {subtitle && <p className="mt-1.5 max-w-xl text-[0.95rem] leading-relaxed text-muted">{subtitle}</p>}
    </header>
  );
}

/** Champ de recherche pleine largeur, bouton d'effacement de 44 px. */
export function SearchField({ value, onChange, placeholder }: { value: string; onChange: (v: string) => void; placeholder: string }) {
  return (
    <div className="relative mb-3">
      <svg className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-emerald/60" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
        <circle cx="11" cy="11" r="7" /><path d="M20 20l-3.5-3.5" />
      </svg>
      <input
        type="search"
        inputMode="search"
        enterKeyHint="search"
        aria-label={placeholder}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="field pl-11 pr-12 [&::-webkit-search-cancel-button]:hidden"
      />
      {value && (
        <button type="button" onClick={() => onChange("")} aria-label="Effacer la recherche"
          className="absolute right-0 top-0 flex h-12 w-12 items-center justify-center text-xl text-muted">
          ×
        </button>
      )}
    </div>
  );
}

/** Filtres en une ligne défilante. */
export function FilterChips({ options, value, onChange }: { options: { value: string; label: string }[]; value: string; onChange: (v: string) => void }) {
  if (options.length <= 1) return null;
  return (
    <div role="group" aria-label="Filtres" className="scrollbar-none -mx-4 mb-4 flex gap-2 overflow-x-auto px-4 sm:mx-0 sm:px-0">
      {options.map((o) => (
        <button key={o.value} type="button" className="chip" aria-pressed={value === o.value} onClick={() => onChange(o.value)}>
          {o.label}
        </button>
      ))}
    </div>
  );
}

export function EmptyState({ title, hint }: { title: string; hint?: string }) {
  return (
    <div className="card px-6 py-10 text-center">
      <p className="font-amiri text-xl font-bold text-emerald-dark">{title}</p>
      {hint && <p className="mx-auto mt-1 max-w-xs text-sm text-muted">{hint}</p>}
    </div>
  );
}

/** Squelette de liste pendant le chargement. */
export function ListSkeleton({ rows = 5 }: { rows?: number }) {
  return (
    <div className="space-y-3" role="status" aria-label="Chargement">
      {Array.from({ length: rows }).map((_, i) => <div key={i} className="skeleton h-[76px]" />)}
    </div>
  );
}

export function FullLoader() {
  return (
    <div className="page" role="status" aria-label="Chargement">
      <div className="skeleton mb-4 h-9 w-2/3" />
      <ListSkeleton rows={4} />
    </div>
  );
}

export function ErrorNotice({ message }: { message: string }) {
  return <p role="alert" className="rounded-xl bg-terracotta/10 px-4 py-3 text-sm text-terracotta-deep">{message}</p>;
}
