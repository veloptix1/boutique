
"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { IconUser, IconLivre, IconSpeaker, IconParchemin, IconArrowRight } from "@/components/icons";

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    savants: 0, livres: 0, audios: 0, hadiths: 0, users: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const [s, l, a, h, u] = await Promise.all([
        supabase.from("savants").select("*", { count: "exact", head: true }),
        supabase.from("livres").select("*", { count: "exact", head: true }),
        supabase.from("audios").select("*", { count: "exact", head: true }),
        supabase.from("hadiths").select("*", { count: "exact", head: true }),
        supabase.from("profiles").select("*", { count: "exact", head: true }),
      ]);
      setStats({
        savants: s.count || 0,
        livres: l.count || 0,
        audios: a.count || 0,
        hadiths: h.count || 0,
        users: u.count || 0,
      });
      setLoading(false);
    })();
  }, []);

  const cards = [
    { label: "Savants",       value: stats.savants, Icon: IconUser,       href: "/admin/savants",      color: "emerald" },
    { label: "Livres",        value: stats.livres,  Icon: IconLivre,      href: "/admin/livres",       color: "gold" },
    { label: "Audios",        value: stats.audios,  Icon: IconSpeaker,    href: "/admin/audios",       color: "terracotta" },
    { label: "Hadiths",       value: stats.hadiths, Icon: IconParchemin,  href: "/admin/hadiths",      color: "indigo" },
    { label: "Utilisateurs",  value: stats.users,   Icon: IconUser,       href: "/admin/utilisateurs", color: "emerald" },
  ];

  const colorMap: Record<string, string> = {
    emerald: "bg-emerald/10 text-link",
    gold: "bg-gold/15 text-gold-deep",
    terracotta: "bg-terracotta/10 text-terracotta",
    indigo: "bg-indigo/10 text-indigo",
  };

  return (
    <main className="p-6 lg:p-12 max-w-[1400px] mx-auto">
      <div className="mb-10">
        <h1 className="font-amiri font-bold text-heading text-3xl sm:text-4xl">
          Tableau de bord
        </h1>
        <p className="text-muted mt-2">
          Gérez tout le contenu de l'application depuis cet espace.
        </p>
      </div>

      {loading ? (
        <p className="text-muted">Chargement...</p>
      ) : (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
          {cards.map(({ label, value, Icon, href, color }) => (
            <Link key={href} href={href}
              className="bg-surface rounded-2xl p-6 border border-line
                         transition-all no-underline group">
              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-4
                              ${colorMap[color]} transition`}>
                <Icon size={22} />
              </div>
              <div className="font-amiri font-bold text-heading text-3xl mb-1">
                {value}
              </div>
              <div className="flex items-center justify-between text-sm text-muted">
                {label}
                <IconArrowRight size={14} />
              </div>
            </Link>
          ))}
        </div>
      )}

      <div className="mt-12 bg-surface rounded-2xl p-8 border border-line">
        <h2 className="font-bold text-heading text-xl mb-3">
          Par où commencer ?
        </h2>
        <ul className="space-y-2 text-sm text-ink/80">
          <li>1. Ajoutez d'abord des <strong>Savants</strong> (ils servent à classer les audios)</li>
          <li>2. Puis ajoutez des <strong>Livres</strong> (upload PDF direct)</li>
          <li>3. Puis des <strong>Audios</strong> (upload MP3)</li>
          <li>4. Enfin des <strong>Hadiths</strong> rattachés aux savants</li>
        </ul>
      </div>
    </main>
  );
}