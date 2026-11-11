import Link from "next/link";
import { IconSpeaker, IconBook, IconLivre, IconStar } from "./icons";

const sections = [
  { Icon: IconSpeaker, href: "/audio",   t: "Audio",   d: "Cours des savants et récitations du Coran." },
  { Icon: IconBook,    href: "/hadiths", t: "Hadiths", d: "Texte arabe, traduction et explication." },
  { Icon: IconLivre,   href: "/livres",  t: "Livres",  d: "À lire en ligne ou à télécharger en PDF." },
  { Icon: IconStar,    href: "/live",    t: "Vidéos",  d: "Conférences et enseignements filmés." },
];

export default function Features() {
  return (
    <section className="mx-auto max-w-[640px] px-4 pb-10">
      <h2 className="h-section mb-3 px-1">Explorer</h2>
      <ul className="card divide-y divide-line overflow-hidden">
        {sections.map(({ Icon, href, t, d }) => (
          <li key={href}>
            <Link href={href} className="flex min-h-[72px] items-center gap-4 px-4 py-3 no-underline active:bg-cream">
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-emerald/10 text-link">
                <Icon size={22} />
              </span>
              <span className="min-w-0 flex-1">
                <span className="block font-semibold text-heading">{t}</span>
                <span className="block text-sm leading-snug text-muted">{d}</span>
              </span>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="shrink-0 text-muted" aria-hidden="true"><path d="M9 6l6 6-6 6" /></svg>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
