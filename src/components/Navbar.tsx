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
    const { data: listener } = supabase.auth.onAuthStateChange((_e, session) =>
      setConnected(!!session));
    return () => listener.subscription.unsubscribe();
  }, []);

  return (
    <header className="fixed top-0 left-0 right-0 z-[800] px-[6%] py-3
                       flex justify-between items-center
                       bg-cream/90 backdrop-blur-md
                       border-b border-emerald/10">
      <Link href={connected ? "/dashboard" : "/"} className="flex items-center gap-3 no-underline">
        <Image
          src="/logo.png"
          alt="AL BASIRAH"
          width={44}
          height={44}
          className="w-11 h-11 object-contain"
          priority
        />
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
                     font-semibold hover:bg-emerald-dark transition">
          {connected ? "Dashboard" : "Connexion"}
        </Link>
        <BurgerMenu />
      </div>
    </header>
  );
}
