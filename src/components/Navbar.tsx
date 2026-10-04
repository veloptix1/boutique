"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { IconMosque } from "./icons";
import BurgerMenu from "./BurgerMenu";

export default function Navbar() {
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setConnected(!!data.session);
    });
    const { data: listener } = supabase.auth.onAuthStateChange((_e, session) => {
      setConnected(!!session);
    });
    return () => listener.subscription.unsubscribe();
  }, []);

  return (
    <header className="fixed top-0 left-0 right-0 z-[800] px-[6%] py-3
                       flex justify-between items-center
                       bg-cream/90 backdrop-blur-md
                       border-b border-emerald/10">
      <Link href={connected ? "/dashboard" : "/"} className="flex items-center gap-3 no-underline">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald to-emerald-dark
                        flex items-center justify-center
                        shadow-[0_4px_14px_rgba(13,92,74,0.3)]">
          <IconMosque size={22} color="#d4af37" />
        </div>
        <div className="leading-none">
          <div className="font-extrabold text-emerald-dark tracking-[2px] text-[1.05rem]">
            AL BASIRAH
          </div>
          <small className="block text-[0.55rem] tracking-[2.5px] text-gold font-medium mt-1">
            VISION INTÉRIEURE
          </small>
        </div>
      </Link>

      <div className="flex items-center gap-3">
        <Link
          href={connected ? "/dashboard" : "/auth"}
          className="hidden sm:block px-5 py-2 rounded-full bg-emerald text-white text-xs
                     font-semibold hover:bg-emerald-dark transition"
        >
          {connected ? "Dashboard" : "Connexion"}
        </Link>
        <BurgerMenu />
      </div>
    </header>
  );
}