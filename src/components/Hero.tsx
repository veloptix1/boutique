"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { IconPlay, IconStar, IconCheck, IconSpeaker } from "./icons";

const audios = [
  { t: "Les 40 Hadiths Nawawi", a: "Cheikh Ibn Baz" },
  { t: "Explication du Tajwid", a: "Cheikh Al-Albani" },
  { t: "Riyad As-Salihin", a: "Cheikh Uthaymin" },
];

export default function Hero() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleStartListening = async () => {
    setLoading(true);
    const { data: { user } } = await supabase.auth.getUser();
    if (user) router.push("/audio");
    else router.push("/auth");
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center
                        px-[6%] pt-28 pb-24 overflow-hidden
                        bg-gradient-to-b from-cream to-[#f0e9d9]">

      <div className="absolute w-[400px] h-[400px] rounded-full blur-[80px] opacity-30
                      bg-emerald -top-24 -left-24 pointer-events-none" />
      <div className="absolute w-[350px] h-[350px] rounded-full blur-[80px] opacity-30
                      bg-gold -bottom-20 -right-20 pointer-events-none" />

      <div className="relative z-10 max-w-[1200px] w-full grid md:grid-cols-2 gap-12 items-center">
        <div className="text-center md:text-left">
          <div className="inline-flex items-center gap-2 bg-white border border-emerald/10
                          px-4 py-2 rounded-full text-[0.7rem] sm:text-xs font-semibold
                          text-emerald tracking-wider mb-6 shadow-sm">
            <IconStar size={12} color="#d4af37" />
            APPLICATION ISLAMIQUE AUDIO
          </div>

          <h1 className="font-amiri font-bold text-emerald-dark leading-[0.95]
                         text-[2rem] sm:text-[2.8rem] md:text-[3.5rem] lg:text-[4.5rem] mb-2 break-words">
            AL BASIRAH
          </h1>
          <div className="font-amiri font-bold text-gold
                          text-[1.3rem] sm:text-[1.6rem] md:text-[1.9rem] lg:text-[2.2rem]
                          mb-6" dir="rtl">
            بصيرة
          </div>

          <p className="text-gray-500 text-sm sm:text-base max-w-[520px] mb-9 mx-auto md:mx-0">
            Écoutez la parole des savants, découvrez les hadiths authentiques
            et nourrissez votre âme. Une bibliothèque audio islamique en
            français et en arabe.
          </p>

          <div className="flex gap-3 flex-wrap justify-center md:justify-start">
            <button onClick={handleStartListening} disabled={loading}
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full
                         bg-emerald text-white font-semibold text-sm
                         shadow-[0_10px_25px_rgba(13,92,74,0.25)]
                         hover:bg-emerald-dark hover:-translate-y-0.5
                         transition-all disabled:opacity-50">
              <IconPlay size={16} color="#fff" />
              {loading ? "Chargement..." : "Commencer l'écoute"}
            </button>
            <button onClick={handleStartListening}
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full
                         bg-white text-emerald-dark font-semibold text-sm
                         border-2 border-emerald/15
                         hover:border-gold hover:text-gold transition-all">
              Mon espace
            </button>
          </div>
        </div>

        <div className="relative flex justify-center mt-8 md:mt-0">
          <div className="bg-white rounded-[28px] p-5 sm:p-7 w-full max-w-[360px]
                          shadow-[0_30px_60px_rgba(13,92,74,0.15)]
                          relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1.5
                            bg-gradient-to-r from-emerald via-gold to-terracotta" />
            <div className="flex items-center gap-3 mb-5">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald to-emerald-light
                              flex items-center justify-center shrink-0">
                <IconSpeaker size={22} />
              </div>
              <div>
                <div className="font-bold text-emerald-dark text-sm">Bibliothèque Audio</div>
                <div className="text-xs text-gray-500">Les savants de référence</div>
              </div>
            </div>
            {audios.map((a, i) => (
              <div key={i} className="flex items-center gap-3 p-3 rounded-2xl bg-cream
                                      mb-2.5 hover:bg-[#f0e9d9] hover:translate-x-1
                                      transition-all cursor-pointer">
                <div className="w-9 h-9 rounded-full bg-gold flex items-center justify-center
                                shadow-[0_4px_10px_rgba(212,175,55,0.35)] shrink-0">
                  <IconPlay size={12} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-xs sm:text-sm font-semibold text-emerald-dark truncate">{a.t}</div>
                  <div className="text-[0.68rem] text-gray-500 truncate">{a.a}</div>
                </div>
                <div className="flex items-end gap-[2px] h-4">
                  {[0,1,2,3].map((n) => (
                    <span key={n} className="w-[2.5px] bg-emerald rounded-sm animate-eq"
                          style={{ animationDelay: `${n * 0.15}s`, height: `${6 + (n % 3) * 3}px` }} />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
