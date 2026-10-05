"use client";
import Link from "next/link";
import { Bismillah, EndMark } from "@/components/PageHeader";

export default function ConditionsPage() {
  return (
    <main className="px-[6%] pt-24 pb-40 max-w-[900px] mx-auto min-h-screen">
      <Link href="/dashboard" className="text-emerald text-sm font-semibold hover:underline">← Retour</Link>

      <div className="mt-8">
        <Bismillah />
      </div>

      <div className="mb-10">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-12 h-12 rounded-2xl bg-emerald/10 flex items-center justify-center text-emerald">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/>
              <path d="M14 2v6h6M16 13H8M16 17H8M10 9H8"/>
            </svg>
          </div>
          <div className="text-xs font-bold text-gold uppercase tracking-[3px]">Légal</div>
        </div>
        <h1 className="font-amiri font-bold text-emerald-dark text-4xl sm:text-5xl mb-3">Conditions d''utilisation</h1>
        <p className="text-gray-500">Dernière mise à jour : Octobre 2026</p>
      </div>

      <div className="space-y-6">
        {[
          { t: "1. Acceptation des conditions", c: "En utilisant l''application AL BASIRAH, vous acceptez pleinement et sans réserve les présentes conditions d''utilisation. Si vous n''acceptez pas ces conditions, veuillez ne pas utiliser l''application." },
          { t: "2. Objet de l''application", c: "AL BASIRAH est une application islamique audio destinée à faciliter l''accès aux enseignements des savants de la Salafiya, aux hadiths authentiques et au Saint Coran. Elle est fournie gratuitement à des fins d''apprentissage et d''enrichissement spirituel." },
          { t: "3. Contenu et authenticité", c: "Nous nous efforçons de ne publier que des contenus authentiques et vérifiés : Hadiths (uniquement sahih ou hasan avec sources précises), Coran (texte uthmani + traduction reconnue), Savants (uniquement ceux de la Salafiya bien guidée). Malgré nos vérifications, nous ne pouvons garantir l''absence totale d''erreur." },
          { t: "4. Utilisation de l''application", c: "Vous vous engagez à utiliser l''application à des fins licites, ne pas reproduire ou vendre le contenu sans autorisation, ne pas tenter de pirater ou modifier l''application, respecter les droits d''auteur des savants." },
          { t: "5. Compte utilisateur", c: "Pour accéder à certaines fonctionnalités (favoris, tickets support), vous devez créer un compte. Vous êtes responsable de la confidentialité de vos identifiants." },
          { t: "6. Propriété intellectuelle", c: "Le nom « AL BASIRAH », le logo, l''interface et le code de l''application sont la propriété exclusive de leurs auteurs. Les audios et livres appartiennent à leurs auteurs respectifs." },
          { t: "7. Données personnelles", c: "Nous collectons uniquement les données nécessaires au fonctionnement de l''application (email, nom). Ces données ne sont jamais partagées avec des tiers à des fins commerciales." },
          { t: "8. Limitation de responsabilité", c: "AL BASIRAH est fournie « en l''état ». Nous ne pouvons être tenus responsables des interruptions de service, des pertes de données ou de tout dommage résultant de l''utilisation de l''application." },
          { t: "9. Modification des conditions", c: "Nous nous réservons le droit de modifier ces conditions à tout moment. Les modifications prendront effet dès leur publication dans l''application." },
          { t: "10. Contact", c: "Pour toute question relative à ces conditions, contactez-nous via la page Support de l''application." },
        ].map((s, i) => (
          <section key={i} className="bg-white rounded-3xl p-6 sm:p-8 border border-emerald/5">
            <h2 className="font-amiri font-bold text-emerald-dark text-xl mb-3">{s.t}</h2>
            <p className="text-sm text-gray-600 leading-relaxed">{s.c}</p>
          </section>
        ))}
      </div>

      <EndMark />
    </main>
  );
}
