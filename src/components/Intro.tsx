"use client";
import { useEffect, useState } from "react";

export default function Intro() {
  const [hide, setHide] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setHide(true), 5200);
    return () => clearTimeout(t);
  }, []);

  return (
    <div
      className={`fixed inset-0 z-[9999] flex items-center justify-center
                  bg-gradient-to-br from-emerald-dark to-emerald
                  transition-opacity duration-700
                  ${hide ? "opacity-0 invisible pointer-events-none" : "opacity-100"}`}
    >
      <div className="relative text-center px-5 max-w-[90%]">
        <div className="font-amiri font-bold text-gold text-[clamp(1.8rem,5vw,3.5rem)]
                        leading-[1.6] opacity-0 animate-carIn" dir="rtl">
          <span className="block">السلام عليكم</span>
          <span className="block">ورحمة الله وبركاته</span>
        </div>

        <div className="h-[2px] bg-gold mx-auto mt-5 w-0 animate-line" />

        <div
          className="absolute top-1/2 left-1/2 font-amiri font-bold text-gold
                     text-[clamp(2rem,6vw,4rem)] whitespace-nowrap opacity-0 animate-welcome"
          style={{ transform: "translate(-50%, -50%) scale(0.5)" }}
          dir="rtl"
        >
          أهلا وسهلا
        </div>
      </div>
    </div>
  );
}