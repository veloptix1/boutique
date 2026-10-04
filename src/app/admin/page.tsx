
"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import {
  IconUser, IconLivre, IconSpeaker, IconParchemin, IconArrowRight,
} from "@/components/icons";

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
    emerald: "bg-emerald/10 text-emerald",
    gold: "bg-gold/15 text-gold",
    terracotta: "bg-terracotta/10 text-terracotta",
    indigo: "bg-indigo/10 text-indigo",
  };

  return (
    <main className="p-6 lg:p-12 max-w-[1400px] mx-auto">
      <div className="mb-10">
        <div className="text-xs font-bold text-gold uppercase tracking-[3px] mb-2">
          Panneau d'administration
        </div>
        <h1 className="font-amiri font-bold text-emerald-dark text-3xl sm:text-4xl">
          Tableau de bord
        </h1>
        <p className="text-gray-500 mt-2">
          Gérez tout le contenu de l'application depuis cet espace.
        </p>
      </div>

      {loading ? (
        <p className="text-gray-400">Chargement...</p>
      ) : (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
          {cards.map(({ label, value, Icon, href, color }) => (
            <Link key={href} href={href}
              className="bg-white rounded-3xl p-6 border border-emerald/5
                         hover:-translate-y-1 hover:shadow-[0_20px_40px_rgba(13,92,74,0.1)]
                         transition-all no-underline group">
              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-4
                              ${colorMap[color]} group-hover:scale-110 transition`}>
                <Icon size={22} />
              </div>
              <div className="font-amiri font-bold text-emerald-dark text-3xl mb-1">
                {value}
              </div>
              <div className="flex items-center justify-between text-sm text-gray-500">
                {label}
                <IconArrowRight size={14} />
              </div>
            </Link>
          ))}
        </div>
      )}

      <div className="mt-12 bg-white rounded-3xl p-8 border border-emerald/5">
        <h2 className="font-bold text-emerald-dark text-xl mb-3">
          Par où commencer ?
        </h2>
        <ul className="space-y-2 text-sm text-gray-600">
          <li>1. Ajoutez d'abord des <strong>Savants</strong> (ils servent à classer les audios)</li>
          <li>2. Puis ajoutez des <strong>Livres</strong> (upload PDF direct)</li>
          <li>3. Puis des <strong>Audios</strong> (upload MP3)</li>
          <li>4. Enfin des <strong>Hadiths</strong> rattachés aux savants</li>
        </ul>
      </div>
    </main>
  );
}