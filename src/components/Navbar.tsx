"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { supabase } from "@/lib/supabase";
import BurgerMenu from "./BurgerMenu";

export default function Navbar() {
  const [connected, setConnected] = useState(false);

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
          <span className="text-[0.95rem] font-semibold tracking-wide text-emerald-dark">AL BASIRAH</span>
        </Link>

        <div className="flex items-center gap-1">
          <Link href={connected ? "/profil" : "/auth"}
                className="btn-primary btn-sm hidden sm:inline-flex">
            {connected ? "Mon profil" : "Connexion"}
          </Link>
          <BurgerMenu />
        </div>
      </div>
    </header>
  );
}
