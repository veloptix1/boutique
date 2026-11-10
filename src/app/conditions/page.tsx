"use client";
import Link from "next/link";
import { BackLink, PageHeader } from "@/components/ui";
import { EndMark } from "@/components/PageHeader";

export default function ConditionsPage() {
  return (
    <main className="page max-w-[900px]">
      <BackLink href="/dashboard" label="Retour" />


      <PageHeader title="Conditions d''utilisation" subtitle="Dernière mise à jour : Octobre 2026" />

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
          <section key={i} className="bg-white rounded-2xl p-6 sm:p-8 border border-line">
            <h2 className="font-amiri font-bold text-emerald-dark text-xl mb-3">{s.t}</h2>
            <p className="text-sm text-ink/80 leading-relaxed">{s.c}</p>
          </section>
        ))}
      </div>

      <EndMark />
    </main>
  );
}
