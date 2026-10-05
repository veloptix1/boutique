"use client";
import { Bismillah, EndMark } from "@/components/PageHeader";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import {
  IconAqida, IconSalat, IconLivre, IconParchemin,
  IconProphetes, IconSahaba, IconBio, IconTafsir,
  IconSpeaker, IconBook, IconStar, IconUser,
  IconArrowRight, IconSparkle,
} from "@/components/icons";

const categories = [
  { slug: "croyance",    Icon: IconAqida,     label: "Croyance",               color: "emerald" },
  { slug: "priere",      Icon: IconSalat,     label: "La Prière",              color: "gold" },
  { slug: "livre",       Icon: IconLivre,     label: "Livre",                  color: "terracotta" },
  { slug: "rapporteurs", Icon: IconParchemin, label: "Rapporteurs Hadith",     color: "indigo" },
  { slug: "prophetes",   Icon: IconProphetes, label: "Prophètes",              color: "emerald" },
  { slug: "saaba",       Icon: IconSahaba,    label: "Les Sahaba",             color: "gold" },
  { slug: "biographie",  Icon: IconBio,       label: "Biographie des Savants", color: "terracotta" },
  { slug: "tafsir",      Icon: IconTafsir,    label: "Tafsir",                 color: "indigo" },
];

const colorMap: Record<string, { bg: string; text: string; grad: string }> = {
  emerald:    { bg: "bg-emerald/10",    text: "text-emerald",    grad: "from-emerald to-emerald-light" },
  gold:       { bg: "bg-gold/15",       text: "text-gold",       grad: "from-gold to-gold-light" },
  terracotta: { bg: "bg-terracotta/10", text: "text-terracotta", grad: "from-terracotta to-[#e07a56]" },
  indigo:     { bg: "bg-indigo/10",     text: "text-indigo",     grad: "from-indigo to-[#4a5c94]" },
};

export default function DashboardPage() {
  const router = useRouter();
  const [nom, setNom] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
          router.push("/auth");
          return;
        }
        const { data } = await supabase
          .from("profiles").select("nom").eq("id", user.id).single();
        setNom(data?.nom || "Utilisateur");
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    })();
  }, [router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-cream">
        <p className="text-emerald">Chargement...</p>
      </div>
    );
  }

  // 🎯 Raccourcis : Audio / Livres / Hadiths / Profil
  const shortcuts = [
    { Icon: IconSpeaker, label: "Audio",   href: "/audio",   color: "emerald" },
    { Icon: IconLivre,   label: "Livres",  href: "/livres",  color: "gold" },
    { Icon: IconParchemin, label: "Hadiths", href: "/hadiths", color: "terracotta" },
    { Icon: IconUser,    label: "Profil",  href: "/profil",  color: "indigo" },
    { Icon: IconBook,    label: "Vidéos",  href: "/live",    color: "emerald" },
    { Icon: IconStar,    label: "Prophètes", href: "/prophetes", color: "gold" },
    { Icon: IconUser,    label: "Sahaba",   href: "/sahaba",    color: "terracotta" },
  ];

  return (
    <main className="px-[6%] pt-24 pb-40 max-w-[1200px] mx-auto min-h-screen">
      <Bismillah />

      {/* En-tête salutation */}
      <div className="relative mb-12 rounded-3xl overflow-hidden
                      bg-gradient-to-br from-emerald-dark via-emerald to-emerald-light
                      p-8 sm:p-10 text-white shadow-[0_20px_50px_rgba(13,92,74,0.25)]">
        <div className="absolute inset-0 opacity-[0.08]"
             style={{
               backgroundImage: `url("data:image/svg+xml,%3Csvg width='80' height='80' viewBox='0 0 80 80' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M40 0 L80 40 L40 80 L0 40 Z' fill='none' stroke='%23ffffff' stroke-width='1'/%3E%3C/svg%3E")`
             }} />
        <div className="relative z-10 flex items-start justify-between flex-wrap gap-4">
          <div>
            <div className="flex items-center gap-2 text-gold text-xs font-semibold uppercase tracking-widest mb-2">
              <IconSparkle size={14} />
              Assalamu alaykum
            </div>
            <h1 className="font-amiri font-bold text-3xl sm:text-4xl leading-tight">
              {nom}
            </h1>
            <p className="text-white/70 text-sm mt-2">
              Bienvenue dans votre espace AL BASIRAH
            </p>
          </div>
          <div className="hidden sm:flex w-16 h-16 rounded-2xl bg-white/10 backdrop-blur
                          items-center justify-center border border-white/20">
            <IconSpeaker size={28} />
          </div>
        </div>
      </div>

      {/* Raccourcis rapides */}
      <div className="mb-12">
        <h2 className="font-amiri font-bold text-emerald-dark text-2xl mb-5">
          Accès rapide
        </h2>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {shortcuts.map(({ Icon, label, href, color }) => {
            const c = colorMap[color];
            return (
              <Link key={href} href={href}
                className="bg-white rounded-3xl p-5 flex items-center gap-4
                           border border-emerald/5 hover:-translate-y-1
                           hover:shadow-[0_20px_40px_rgba(13,92,74,0.1)]
                           transition-all no-underline group">
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0
                                ${c.bg} ${c.text} group-hover:scale-110 transition-transform`}>
                  <Icon size={22} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-bold text-emerald-dark text-sm">{label}</div>
                  <div className="text-[0.7rem] text-gray-400">Voir</div>
                </div>
                <span className="text-gray-300 group-hover:text-emerald transition">
                  <IconArrowRight size={16} />
                </span>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Catégories */}
      <div className="mb-6 flex items-center justify-between flex-wrap gap-3">
        <div>
          <h2 className="font-amiri font-bold text-emerald-dark text-2xl">
            Nos catégories
          </h2>
          <p className="text-gray-500 text-sm">Explorez les enseignements par thème</p>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        {categories.map(({ slug, Icon, label, color }) => {
          const c = colorMap[color];
          return (
            <Link
              key={slug}
              href={`/categorie/${slug}`}
              className="relative bg-white rounded-3xl p-6 flex flex-col items-start text-left
                         border border-emerald/5 overflow-hidden
                         hover:-translate-y-1.5
                         hover:shadow-[0_25px_50px_rgba(13,92,74,0.15)]
                         transition-all no-underline group"
            >
              <div className={`absolute top-0 left-0 w-full h-1 bg-gradient-to-r ${c.grad}
                              transform scale-x-0 group-hover:scale-x-100
                              origin-left transition-transform duration-500`} />

              <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-5
                              ${c.bg} ${c.text}
                              group-hover:scale-110 group-hover:rotate-3
                              transition-transform duration-300`}>
                <Icon size={26} />
              </div>

              <div className="font-bold text-emerald-dark text-sm leading-tight mb-2">
                {label}
              </div>

              <div className="flex items-center gap-1.5 text-xs font-semibold text-gray-400
                              group-hover:text-emerald transition mt-auto pt-3">
                Découvrir
                <IconArrowRight size={12} />
              </div>
            </Link>
          );
        })}
      </div>
      <EndMark />
    </main>
  );
}
