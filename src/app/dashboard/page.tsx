"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { FullLoader } from "@/components/ui";
import { IconSpeaker, IconLivre, IconParchemin, IconBook, IconStar, IconProphetes, IconSahaba, IconBio, IconTafsir, IconArrowRight } from "@/components/icons";

const principal = [
  { Icon: IconSpeaker,   label: "Audio",     href: "/audio" },
  { Icon: IconLivre,     label: "Livres",    href: "/livres" },
  { Icon: IconParchemin, label: "Hadiths",   href: "/hadiths" },
  { Icon: IconBook,      label: "Vidéos",    href: "/live" },
];

const apprendre = [
  { Icon: IconTafsir,    label: "Coran",                  desc: "Récitations sourate par sourate", href: "/audio/coran" },
  { Icon: IconBio,       label: "Savants",                desc: "Biographies et enseignements",     href: "/audio/savants" },
  { Icon: IconProphetes, label: "Prophètes",              desc: "Leur histoire et leurs leçons",    href: "/prophetes" },
  { Icon: IconSahaba,    label: "Les Sahaba",             desc: "Les compagnons du Prophète ﷺ",     href: "/sahaba" },
  { Icon: IconParchemin, label: "Rapporteurs de hadith",  desc: "Qui a transmis, et comment",       href: "/rapporteurs" },
  { Icon: IconStar,      label: "Nouveautés",             desc: "Les derniers contenus ajoutés",    href: "/nouveau" },
];

export default function DashboardPage() {
  const router = useRouter();
  const [nom, setNom] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        const user = session?.user;
        if (!user) { router.push("/auth"); return; }
        const { data } = await supabase.from("profiles").select("nom").eq("id", user.id).single();
        setNom(data?.nom || "");
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    })();
  }, [router]);

  if (loading) return <FullLoader />;

  return (
    <main className="page">
      <header className="mb-6">
        <p className="text-sm text-muted">Assalamu alaykum</p>
        <h1 className="h-page">{nom || "Bienvenue"}</h1>
      </header>

      <section aria-label="Accès rapide" className="mb-8 grid grid-cols-2 gap-3 sm:grid-cols-4">
        {principal.map(({ Icon, label, href }) => (
          <Link key={href} href={href} className="card-link flex min-h-[96px] flex-col justify-between p-4">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald/10 text-link">
              <Icon size={22} />
            </span>
            <span className="font-semibold text-heading">{label}</span>
          </Link>
        ))}
      </section>

      <section aria-labelledby="apprendre">
        <h2 id="apprendre" className="h-section mb-3">Apprendre</h2>
        <ul className="card divide-y divide-line overflow-hidden">
          {apprendre.map(({ Icon, label, desc, href }) => (
            <li key={href}>
              <Link href={href} className="flex min-h-[68px] items-center gap-4 px-4 py-3 no-underline active:bg-cream">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gold/20 text-gold-deep">
                  <Icon size={20} />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block font-semibold text-heading">{label}</span>
                  <span className="block truncate text-sm text-muted">{desc}</span>
                </span>
                <span className="shrink-0 text-muted"><IconArrowRight size={16} /></span>
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </main>
  );
}
