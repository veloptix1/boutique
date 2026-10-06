"use client";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { useLang } from "@/components/LangProvider";
import { Bismillah, EndMark } from "@/components/PageHeader";

export default function ActualiteDetail() {
  const searchParams = useSearchParams();
  const slug = searchParams.get("slug") || "";
  const { lang } = useLang();
  const [actu, setActu] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const { data } = await supabase
          .from("actualites").select("*").eq("slug", slug).limit(1);
        if (data && data.length > 0) setActu(data[0]);
      } catch (e) { console.error(e); }
      finally { setLoading(false); }
    })();
  }, [slug]);

  if (loading) return <div className="min-h-screen flex items-center justify-center bg-cream"><p className="text-emerald">Chargement...</p></div>;
  if (!actu) return (
    <main className="px-[6%] pt-32 pb-32 max-w-[1200px] mx-auto text-center">
      <h1 className="font-amiri font-bold text-emerald-dark text-3xl mb-4">Actualité introuvable</h1>
      <Link href="/nouveau" className="text-emerald hover:underline font-semibold">← Retour</Link>
    </main>
  );

  return (
    <main className="px-[6%] pt-24 pb-40 max-w-[900px] mx-auto min-h-screen">

      <Link href="/nouveau" className="text-emerald text-sm font-semibold hover:underline">
        ← Retour aux actualités
      </Link>

      <div className="mt-8">
        <Bismillah />
      </div>

      {/* Image */}
      {actu.image_url && (
        <div className="mb-8 rounded-3xl overflow-hidden bg-cream aspect-video">
          <img src={actu.image_url} alt={actu.titre}
            className="w-full h-full object-cover" />
        </div>
      )}

      {/* Infos */}
      <div className="mb-8">
        {actu.categorie && (
          <div className="inline-block px-3 py-1 rounded-full bg-gold/15 text-gold
                          text-[0.7rem] font-bold uppercase tracking-wider mb-3">
            {actu.categorie}
          </div>
        )}

        <h1 className="font-amiri font-bold text-emerald-dark text-3xl sm:text-4xl leading-tight mb-4">
          {actu.titre}
        </h1>

        <div className="flex flex-wrap items-center gap-3 text-xs text-gray-500">
          <span>{new Date(actu.created_at).toLocaleDateString("fr-FR", {
            day: "numeric", month: "long", year: "numeric",
          })}</span>
          {actu.auteur && (
            <>
              <span>·</span>
              <span>Par {actu.auteur}</span>
            </>
          )}
          {actu.source && (
            <>
              <span>·</span>
              <span>Source : {actu.source}</span>
            </>
          )}
        </div>
      </div>

      {/* Résumé */}
      {actu.resume && (
        <div className="bg-cream rounded-2xl p-5 border-l-4 border-gold mb-8">
          <p className="text-sm text-gray-700 leading-relaxed italic">
            {actu.resume}
          </p>
        </div>
      )}

      {/* Contenu */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-emerald/5 mb-8">
        <p className="text-gray-700 leading-relaxed whitespace-pre-line">
          {actu.contenu}
        </p>
      </div>

      <EndMark />
    </main>
  );
}
