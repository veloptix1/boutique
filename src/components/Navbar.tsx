"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { supabase } from "@/lib/supabase";
import BurgerMenu from "./BurgerMenu";
import { useTheme } from "./ThemeProvider";

export default function Navbar() {
  const [connected, setConnected] = useState(false);
  const { dark, toggle } = useTheme();

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => setConnected(!!data.session));
    const { data: listener } = supabase.auth.onAuthStateChange((_e, session) => setConnected(!!session));
    return () => listener.subscription.unsubscribe();
  }, []);

  return (
    <header className="fixed inset-x-0 top-0 z-[800] border-b border-line bg-cream/95 backdrop-blur"
            style={{ paddingTop: "var(--safe-top)" }}>
      <div className="mx-auto flex h-14 max-w-[1100px] items-center justify-between px-4 sm:px-6">
        <Link href={connected ? "/dashboard" : "/"} className="flex items-center gap-2.5 no-underline" aria-label="AL BASIRAH, accueil">
          <Image src="/logo.png" alt="" width={32} height={32} className="h-8 w-8 object-contain" priority />
          <span className="text-[0.95rem] font-semibold tracking-wide text-heading">AL BASIRAH</span>
        </Link>

        <div className="flex items-center gap-1">
          <Link href={connected ? "/profil" : "/auth"}
                className="btn-primary btn-sm hidden sm:inline-flex">
            {connected ? "Mon profil" : "Connexion"}
          </Link>
          <button onClick={toggle} aria-label={dark ? "Passer en mode clair" : "Passer en mode sombre"}
                  className="flex h-11 w-11 items-center justify-center rounded-xl text-heading active:bg-emerald/10">
            {dark ? (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
                <circle cx="12" cy="12" r="4" /><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
              </svg>
            ) : (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z" />
              </svg>
            )}
          </button>
          <BurgerMenu />
        </div>
      </div>
    </header>
  );
}
