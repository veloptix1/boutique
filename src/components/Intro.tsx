"use client";
import { useEffect, useState } from "react";

// Salutation d'ouverture : courte, une seule fois par session
export default function Intro() {
  const [show, setShow] = useState(false);
  const [hide, setHide] = useState(false);

  useEffect(() => {
    try {
      if (sessionStorage.getItem("intro_vue")) return;
      sessionStorage.setItem("intro_vue", "1");
    } catch { /* stockage indisponible : on affiche quand même */ }
    setShow(true);
    const t = setTimeout(() => setHide(true), 2200);
    const r = setTimeout(() => setShow(false), 2900);
    return () => { clearTimeout(t); clearTimeout(r); };
  }, []);

  if (!show) return null;

  return (
    <div aria-hidden="true"
         className={`fixed inset-0 z-[9999] flex items-center justify-center bg-emerald-dark transition-opacity duration-700
                     ${hide ? "pointer-events-none opacity-0" : "opacity-100"}`}>
      <div className="animate-intro px-6 text-center font-amiri font-bold leading-[1.7] text-gold text-[clamp(1.8rem,7vw,3rem)]" dir="rtl">
        <span className="block">السلام عليكم</span>
        <span className="block">ورحمة الله وبركاته</span>
      </div>
    </div>
  );
}
