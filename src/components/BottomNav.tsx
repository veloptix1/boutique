"use client";
import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { IconHome, IconSpeaker, IconSearch, IconBook, IconUser } from "./icons";

export default function BottomNav() {
  const pathname = usePathname();
  const router = useRouter();
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

  const items = [
    { id: "home",    label: "Accueil",  Icon: IconHome,    href: connected ? "/dashboard" : "/" },
    { id: "audio",   label: "Audio",    Icon: IconSpeaker, href: "/audio" },
    { id: "explore", label: "Explorer", Icon: IconSearch,  href: "/dashboard", center: true },
    { id: "hadiths", label: "Hadiths",  Icon: IconBook,    href: "/hadiths" },
    { id: "profil",  label: "Profil",   Icon: IconUser,    href: connected ? "/profil" : "/auth" },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-[950]
                    bg-white/95 backdrop-blur-xl
                    border-t border-emerald/10
                    shadow-[0_-10px_30px_rgba(13,92,74,0.08)]
                    px-[6%] pt-2.5 pb-4"
         style={{ paddingBottom: "calc(16px + env(safe-area-inset-bottom))" }}>
      <div className="max-w-[600px] mx-auto flex justify-between items-center gap-1">
        {items.map(({ id, label, Icon, center, href }) => {
          const isActive = pathname === href;
          if (center) {
            return (
              <button key={id} onClick={() => router.push(href)}
                className="flex-1 flex flex-col items-center gap-1 relative">
                <div className="w-12 h-12 -mt-6 rounded-full
                                bg-gradient-to-br from-emerald to-emerald-dark
                                flex items-center justify-center
                                shadow-[0_8px_20px_rgba(13,92,74,0.35)]
                                border-[3px] border-cream
                                transition-transform hover:scale-105">
                  <span className="text-gold"><Icon size={22} /></span>
                </div>
                <span className="text-[0.68rem] font-semibold text-emerald-dark">
                  {label}
                </span>
              </button>
            );
          }
          return (
            <button key={id} onClick={() => router.push(href)}
              className={`flex-1 flex flex-col items-center gap-1 py-2 rounded-2xl
                          transition-colors relative
                          ${isActive ? "text-emerald" : "text-gray-500"}`}>
              {isActive && (
                <span className="absolute -top-2.5 w-8 h-[3px] bg-gold rounded-full" />
              )}
              <Icon size={22} />
              <span className="text-[0.68rem] font-semibold tracking-[0.3px]">
                {label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}