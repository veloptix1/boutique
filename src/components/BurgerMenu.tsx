"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { supabase } from "@/lib/supabase";

const links = [
  { label: "Live", href: "/live" },
  { label: "Mise en garde", href: "/mise-en-garde" },
  { label: "Nouveau", href: "/nouveau" },
  { label: "FAQ", href: "/faq" },
  { label: "Conditions", href: "/conditions" },
  { label: "Support", href: "/support" },
];

export default function BurgerMenu() {
  const [open, setOpen] = useState(false);
  const [connected, setConnected] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setConnected(!!data.session);
    });
    const { data: listener } = supabase.auth.onAuthStateChange((_e, session) => {
      setConnected(!!session);
    });
    return () => listener.subscription.unsubscribe();
  }, []);

  useEffect(() => {
    (async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      const { data } = await supabase
        .from("profiles").select("role").eq("id", user.id).single();
      setIsAdmin(data?.role === "admin");
    })();
  }, [connected]);

  useEffect(() => { setOpen(false); }, [pathname]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") setOpen(false); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        aria-label="Ouvrir le menu"
        aria-expanded={open}
        className="flex h-11 w-11 items-center justify-center rounded-xl text-heading active:bg-emerald/10"
      >
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
          <path d="M4 7h16M4 12h16M4 17h10" />
        </svg>
      </button>

      {open && (
        <button
          aria-label="Fermer le menu"
          onClick={() => setOpen(false)}
          className="fixed inset-0 z-[998] cursor-default bg-black/50"
        />
      )}

      <aside
        role="dialog"
        aria-modal="true"
        aria-label="Menu"
        aria-hidden={!open}
        className={`fixed right-0 top-0 z-[999] flex h-[100dvh] w-[86%] max-w-[360px] flex-col bg-emerald-dark
                    transition-transform duration-300 ease-out
                    ${open ? "translate-x-0" : "invisible translate-x-full"}`}
        style={{ paddingTop: "var(--safe-top)", paddingBottom: "var(--safe-bottom)" }}
      >
        <div className="flex h-14 shrink-0 items-center justify-between border-b border-white/10 px-5">
          <span className="font-amiri text-2xl font-bold text-gold" dir="rtl">بصيرة</span>
          <button onClick={() => setOpen(false)} aria-label="Fermer le menu"
                  className="flex h-11 w-11 items-center justify-center rounded-xl text-2xl leading-none text-white/80 active:bg-white/10">
            ×
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto px-3 py-3">
          {connected && (
            <Link href="/dashboard" className="mb-1 flex h-12 items-center rounded-xl px-4 font-semibold text-gold no-underline active:bg-white/10">
              Tableau de bord
            </Link>
          )}
          {isAdmin && (
            <Link href="/admin" className="mb-2 flex h-12 items-center rounded-xl bg-gold px-4 font-semibold text-emerald-dark no-underline">
              Espace administrateur
            </Link>
          )}
          {links.map(({ label, href }) => {
            const current = pathname?.replace(/\/+$/, "") === href;
            return (
              <Link key={href} href={href} aria-current={current ? "page" : undefined}
                    className={`flex h-12 items-center rounded-xl px-4 font-medium no-underline active:bg-white/10
                                ${current ? "bg-white/10 text-gold" : "text-white/90"}`}>
                {label}
              </Link>
            );
          })}
        </nav>

        <p className="shrink-0 border-t border-white/10 px-5 py-4 text-center text-xs text-white/50">
          AL BASIRAH © 2026
        </p>
      </aside>
    </>
  );
}
