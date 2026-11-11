"use client";
import { useState } from "react";
import Link from "next/link";
import { BackLink, PageHeader } from "@/components/ui";
import { EndMark } from "@/components/PageHeader";

const faqs = [
  { q: "Qu''est-ce qu''AL BASIRAH ?", r: "AL BASIRAH est une application islamique audio qui permet d''écouter les enseignements des savants de la Salafiya, de lire le Coran, de découvrir les hadiths authentiques et bien plus encore. Le tout en français, anglais et arabe." },
  { q: "L''application est-elle gratuite ?", r: "Oui, AL BASIRAH est entièrement gratuite. Aucun abonnement n''est requis pour accéder à l''ensemble du contenu." },
  { q: "Les contenus sont-ils authentiques ?", r: "Tous les contenus (hadiths, passages coraniques, paroles des savants) sont vérifiés et sourcés. Nous ne publions que les hadiths authentiques (sahih) ou bons (hasan), avec leurs références précises." },
  { q: "Quels savants sont référencés ?", r: "Nous référençons les savants de la Salafiya bien guidée : les classiques (Ibn Taymiyya, Ibn al-Qayyim, An-Nawawi...) et les contemporains (Ibn Baz, Al-Albani, Uthaymin, Al-Fawzan...)." },
  { q: "Comment fonctionne le lecteur audio ?", r: "Le lecteur audio persistant vous permet d''écouter un cours tout en naviguant dans l''application. Appuyez sur un audio pour lancer la lecture, il continue même en changeant de page." },
  { q: "Puis-je télécharger les audios ?", r: "Oui, la plupart des audios et livres peuvent être téléchargés pour une écoute hors ligne." },
  { q: "L''application est-elle disponible sur iOS et Android ?", r: "Oui, AL BASIRAH est disponible sur les deux plateformes." },
  { q: "Comment signaler un problème ou suggérer du contenu ?", r: "Utilisez la section Support de l''application pour ouvrir un ticket." },
  { q: "Les traductions sont-elles fiables ?", r: "Pour le Coran, nous utilisons la traduction de Muhammad Hamidullah, reconnue et largement acceptée. Pour les hadiths, nous fournissons le texte arabe original avec une traduction française." },
  { q: "Puis-je contribuer à l''application ?", r: "Oui, contactez-nous via la page Support." },
];

export default function FAQPage() {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <main className="page max-w-[900px]">
      <BackLink href="/dashboard" label="Retour" />


      <PageHeader title="Questions fréquentes" subtitle="Les réponses aux questions les plus courantes sur AL BASIRAH." />

      <div className="space-y-3">
        {faqs.map((faq, i) => {
          const isOpen = open === i;
          return (
            <div key={i} className="bg-surface rounded-2xl border border-line hover:border-emerald/15 transition-all overflow-hidden">
              <button onClick={() => setOpen(isOpen ? null : i)}
                className="w-full px-6 py-5 flex items-center justify-between gap-4 text-left">
                <span className="font-bold text-heading text-sm sm:text-base">{faq.q}</span>
                <span aria-pressed={isOpen} className="chip">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                    <path d="M12 5v14M5 12h14"/>
                  </svg>
                </span>
              </button>
              {isOpen && (
                <div className="px-6 pb-5 border-t border-line pt-4">
                  <p className="text-sm text-ink/80 leading-relaxed">{faq.r}</p>
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div className="mt-12 bg-emerald/5 rounded-2xl p-8 text-center border border-line">
        <h2 className="font-amiri font-bold text-heading text-xl mb-2">Vous n''avez pas trouvé votre réponse ?</h2>
        <p className="text-sm text-ink/80 mb-4">Ouvrez un ticket auprès de notre équipe support.</p>
        <Link href="/support" className="inline-block px-6 py-3 rounded-2xl bg-emerald text-white font-semibold text-sm hover:bg-emerald-dark transition">
          Contacter le support
        </Link>
      </div>

      <EndMark />
    </main>
  );
}
