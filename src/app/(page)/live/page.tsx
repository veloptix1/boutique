"use client";
import Link from "next/link";

export default function LivePage() {
  return (
    <main className="px-[6%] pt-24 pb-40 max-w-[900px] mx-auto min-h-screen">
      <Link href="/dashboard" className="text-emerald text-sm font-semibold hover:underline">
        ← Retour
      </Link>
      <div className="mt-8 mb-12">
        <h1 className="font-amiri font-bold text-emerald-dark text-4xl sm:text-5xl mb-3">
          Live
        </h1>
        <div className="w-24 h-1 bg-gold rounded-full" />
      </div>
      <div className="bg-white rounded-3xl p-16 text-center border border-emerald/5">
        <h2 className="font-bold text-emerald-dark text-xl mb-2">
          Bientôt disponible
        </h2>
        <p className="text-gray-500 text-sm max-w-md mx-auto">
          Cette section sera bientôt remplie.
        </p>
      </div>
    </main>
  );
}