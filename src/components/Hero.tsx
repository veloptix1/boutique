"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { IconPlay } from "./icons";

export default function Hero() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const go = async (target: string) => {
    setLoading(true);
    const { data: { user } } = await supabase.auth.getUser();
    router.push(user ? target : "/auth");
  };

  return (
    <section className="mx-auto max-w-[640px] px-5 pb-8 pt-8 text-center sm:pt-14">
      {/* Le seul moment solennel de l'app : la basmala */}
      <p className="font-amiri text-[clamp(1.7rem,7.5vw,2.6rem)] leading-[1.7] text-gold-deep" dir="rtl">
        بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
      </p>

      <h1 className="mt-6 font-amiri text-[2.6rem] font-bold leading-none text-heading sm:text-6xl">
        AL BASIRAH
      </h1>
      <p className="mt-2 font-amiri text-2xl font-bold text-link" dir="rtl">بصيرة</p>

      <p className="mx-auto mt-5 max-w-md text-base leading-relaxed text-muted">
        Écoutez la parole des savants, lisez les hadiths et les livres de référence,
        en français et en arabe.
      </p>

      <div className="mx-auto mt-7 flex max-w-sm flex-col gap-3">
        <button onClick={() => go("/audio")} disabled={loading} className="btn-primary">
          <IconPlay size={16} />
          {loading ? "Chargement…" : "Commencer l'écoute"}
        </button>
        <button onClick={() => go("/dashboard")} disabled={loading} className="btn-secondary">
          Mon espace
        </button>
      </div>
    </section>
  );
}
