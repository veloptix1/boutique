"use client";
import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import {
  IconMosque, IconSpeaker, IconLivre, IconBook, IconCrown,
  IconUser, IconHome, IconArrowRight, IconParchemin, IconStar,
} from "@/components/icons";

const menu = [
  { href: "/admin",              label: "Tableau de bord", Icon: IconHome },
  { href: "/admin/savants",      label: "Savants",         Icon: IconUser },
  { href: "/admin/livres",       label: "Livres",          Icon: IconLivre },
  { href: "/admin/audios",       label: "Audios",          Icon: IconSpeaker },
  { href: "/admin/hadiths",      label: "Hadiths",         Icon: IconParchemin },
  { href: "/admin/rapporteurs",  label: "Rapporteurs",     Icon: IconUser },
  { href: "/admin/coran",        label: "Coran",           Icon: IconBook },
  { href: "/admin/prophetes",    label: "Prophètes",       Icon: IconStar },
  { href: "/admin/sahaba",       label: "Sahaba",          Icon: IconUser },
  { href: "/admin/live",         label: "Vidéos",          Icon: IconBook },
  { href: "/admin/actualites",   label: "Actualités",      Icon: IconStar },
  { href: "/admin/mises",        label: "Mises en garde",  Icon: IconCrown },
  { href: "/admin/support",      label: "Support",         Icon: IconUser },
  { href: "/admin/versions",     label: "Versions App",    Icon: IconBook },
  { href: "/admin/utilisateurs", label: "Utilisateurs",    Icon: IconUser },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [loading, setLoading] = useState(true);
  const [authorized, setAuthorized] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    (async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { router.push("/auth"); return; }
      const { data: profile } = await supabase
        .from("profiles").select("role").eq("id", user.id).single();
      if (profile?.role !== "admin") { router.push("/dashboard"); return; }
      setAuthorized(true);
      setLoading(false);
    })();
  }, [router]);

  useEffect(() => { setMenuOpen(false); }, [pathname]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-cream">
        <p className="text-emerald">Vérification des droits...</p>
      </div>
    );
  }

  if (!authorized) return null;

  return (
    <div className="min-h-screen bg-cream flex">

      {/* Sidebar Desktop */}
      <aside className="hidden lg:flex flex-col w-64 bg-emerald-dark text-white
                        fixed top-0 left-0 h-screen z-[900]">
        <div className="p-6 border-b border-white/10">
          <Link href="/admin" className="flex items-center gap-3 no-underline">
            <div className="w-10 h-10 rounded-xl bg-gold/20 flex items-center justify-center">
              <IconMosque size={22} color="#d4af37" />
            </div>
            <div>
              <div className="font-extrabold tracking-wider text-sm">ADMIN</div>
              <div className="text-[0.6rem] text-gold tracking-widest">AL BASIRAH</div>
            </div>
          </Link>
        </div>

        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {menu.map(({ href, label, Icon }) => {
            const active = pathname === href ||
              (href !== "/admin" && pathname.startsWith(href));
            return (
              <Link key={href} href={href}
                className={`flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-medium
                            transition-all no-underline
                  ${active
                    ? "bg-gold text-emerald-dark font-bold"
                    : "text-white/70 hover:bg-white/5 hover:text-white"}`}>
                <Icon size={18} />
                {label}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-white/10">
          <Link href="/dashboard"
            className="flex items-center justify-between px-4 py-3 rounded-2xl
                       bg-white/5 text-white/70 text-sm hover:bg-white/10
                       hover:text-white transition no-underline">
            Retour à l'app
            <IconArrowRight size={14} />
          </Link>
        </div>
      </aside>

      {/* Top bar mobile */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-[900] bg-emerald-dark text-white
                      px-4 py-3 flex items-center justify-between shadow-lg">
        <Link href="/admin" className="flex items-center gap-2 no-underline text-white">
          <div className="w-8 h-8 rounded-lg bg-gold/20 flex items-center justify-center">
            <IconMosque size={16} color="#d4af37" />
          </div>
          <span className="font-bold text-sm tracking-wider">ADMIN</span>
        </Link>
        <button onClick={() => setMenuOpen(!menuOpen)}
          className="w-9 h-9 rounded-lg bg-white/10 flex items-center justify-center">
          <span className="text-gold text-xl leading-none">{menuOpen ? "×" : "☰"}</span>
        </button>
      </div>

      {/* Menu mobile */}
      {menuOpen && (
        <div className="lg:hidden fixed top-[56px] left-0 right-0 z-[900] bg-emerald-dark
                        text-white p-4 space-y-1 max-h-[calc(100vh-56px)] overflow-y-auto">
          {menu.map(({ href, label, Icon }) => {
            const active = pathname === href ||
              (href !== "/admin" && pathname.startsWith(href));
            return (
              <Link key={href} href={href} onClick={() => setMenuOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-medium
                            transition-all no-underline
                  ${active
                    ? "bg-gold text-emerald-dark font-bold"
                    : "text-white/70 hover:bg-white/5 hover:text-white"}`}>
                <Icon size={18} />
                {label}
              </Link>
            );
          })}
          <Link href="/dashboard"
            className="flex items-center justify-between px-4 py-3 rounded-2xl
                       bg-white/5 text-white/70 text-sm hover:bg-white/10
                       hover:text-white transition no-underline">
            Retour à l'app
            <IconArrowRight size={14} />
          </Link>
        </div>
      )}

      {/* Contenu */}
      <div className="flex-1 lg:ml-64 pt-[56px] lg:pt-0 w-full">
        {children}
      </div>
    </div>
  );
}
