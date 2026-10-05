"use client";
import Link from "next/link";

export default function ConditionsPage() {
  return (
    <main className="px-[6%] pt-24 pb-40 max-w-[900px] mx-auto min-h-screen">

      <Link href="/dashboard" className="text-emerald text-sm font-semibold hover:underline">
        ← Retour
      </Link>

      <div className="mt-6 mb-10">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-12 h-12 rounded-2xl bg-emerald/10 flex items-center justify-center text-emerald">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none"
                 stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/>
              <path d="M14 2v6h6M16 13H8M16 17H8M10 9H8"/>
            </svg>
          </div>
          <div className="text-xs font-bold text-gold uppercase tracking-[3px]">
            Légal
          </div>
        </div>
        <h1 className="font-amiri font-bold text-emerald-dark text-4xl sm:text-5xl mb-3">
          Conditions d''utilisation
        </h1>
        <p className="text-gray-500">
          Dernière mise à jour : Octobre 2026
        </p>
      </div>

      <div className="space-y-6">
        <section className="bg-white rounded-3xl p-6 sm:p-8 border border-emerald/5">
          <h2 className="font-amiri font-bold text-emerald-dark text-xl mb-3">
            1. Acceptation des conditions
          </h2>
          <p className="text-sm text-gray-600 leading-relaxed">
            En utilisant l''application AL BASIRAH, vous acceptez pleinement et sans réserve
            les présentes conditions d''utilisation. Si vous n''acceptez pas ces conditions,
            veuillez ne pas utiliser l''application.
          </p>
        </section>

        <section className="bg-white rounded-3xl p-6 sm:p-8 border border-emerald/5">
          <h2 className="font-amiri font-bold text-emerald-dark text-xl mb-3">
            2. Objet de l''application
          </h2>
          <p className="text-sm text-gray-600 leading-relaxed">
            AL BASIRAH est une application islamique audio destinée à faciliter l''accès
            aux enseignements des savants de la Salafiya, aux hadiths authentiques et au
            Saint Coran. Elle est fournie gratuitement à des fins d''apprentissage et
            d''enrichissement spirituel.
          </p>
        </section>

        <section className="bg-white rounded-3xl p-6 sm:p-8 border border-emerald/5">
          <h2 className="font-amiri font-bold text-emerald-dark text-xl mb-3">
            3. Contenu et authenticité
          </h2>
          <p className="text-sm text-gray-600 leading-relaxed mb-3">
            Nous nous efforçons de ne publier que des contenus authentiques et vérifiés :
          </p>
          <ul className="space-y-2 text-sm text-gray-600">
            <li className="flex items-start gap-2">
              <span className="text-emerald mt-1">•</span>
              Hadiths : uniquement sahih ou hasan avec sources précises (Sahih al-Bukhârî, Sahih Muslim, etc.)
            </li>
            <li className="flex items-start gap-2">
              <span className="text-emerald mt-1">•</span>
              Coran : texte uthmani + traduction reconnue (Hamidullah pour le français)
            </li>
            <li className="flex items-start gap-2">
              <span className="text-emerald mt-1">•</span>
              Savants : uniquement ceux de la Salafiya bien guidée
            </li>
          </ul>
          <p className="text-sm text-gray-600 leading-relaxed mt-3">
            Malgré nos vérifications, nous ne pouvons garantir l''absence totale d''erreur.
            Si vous constatez une inexactitude, merci de nous la signaler via la page Support.
          </p>
        </section>

        <section className="bg-white rounded-3xl p-6 sm:p-8 border border-emerald/5">
          <h2 className="font-amiri font-bold text-emerald-dark text-xl mb-3">
            4. Utilisation de l''application
          </h2>
          <p className="text-sm text-gray-600 leading-relaxed mb-3">
            Vous vous engagez à :
          </p>
          <ul className="space-y-2 text-sm text-gray-600">
            <li className="flex items-start gap-2">
              <span className="text-emerald mt-1">•</span>
              Utiliser l''application à des fins licites et conformes à l''éthique islamique
            </li>
            <li className="flex items-start gap-2">
              <span className="text-emerald mt-1">•</span>
              Ne pas reproduire, distribuer ou vendre le contenu sans autorisation
            </li>
            <li className="flex items-start gap-2">
              <span className="text-emerald mt-1">•</span>
              Ne pas tenter de pirater, modifier ou perturber le fonctionnement de l''application
            </li>
            <li className="flex items-start gap-2">
              <span className="text-emerald mt-1">•</span>
              Respecter les droits d''auteur des savants et des ayants droit
            </li>
          </ul>
        </section>

        <section className="bg-white rounded-3xl p-6 sm:p-8 border border-emerald/5">
          <h2 className="font-amiri font-bold text-emerald-dark text-xl mb-3">
            5. Compte utilisateur
          </h2>
          <p className="text-sm text-gray-600 leading-relaxed">
            Pour accéder à certaines fonctionnalités (favoris, tickets support), vous devez
            créer un compte. Vous êtes responsable de la confidentialité de vos identifiants.
            Toute activité effectuée depuis votre compte vous est imputable.
          </p>
        </section>

        <section className="bg-white rounded-3xl p-6 sm:p-8 border border-emerald/5">
          <h2 className="font-amiri font-bold text-emerald-dark text-xl mb-3">
            6. Propriété intellectuelle
          </h2>
          <p className="text-sm text-gray-600 leading-relaxed">
            Le nom « AL BASIRAH », le logo, l''interface et le code de l''application sont
            la propriété exclusive de leurs auteurs. Les audios et livres appartiennent à
            leurs auteurs respectifs et sont diffusés avec leur autorisation ou dans le
            cadre du partage licite du savoir islamique.
          </p>
        </section>

        <section className="bg-white rounded-3xl p-6 sm:p-8 border border-emerald/5">
          <h2 className="font-amiri font-bold text-emerald-dark text-xl mb-3">
            7. Données personnelles
          </h2>
          <p className="text-sm text-gray-600 leading-relaxed">
            Nous collectons uniquement les données nécessaires au fonctionnement de
            l''application (email, nom). Ces données ne sont jamais partagées avec des tiers
            à des fins commerciales. Vous pouvez demander la suppression de votre compte à
            tout moment.
          </p>
        </section>

        <section className="bg-white rounded-3xl p-6 sm:p-8 border border-emerald/5">
          <h2 className="font-amiri font-bold text-emerald-dark text-xl mb-3">
            8. Limitation de responsabilité
          </h2>
          <p className="text-sm text-gray-600 leading-relaxed">
            AL BASIRAH est fournie « en l''état ». Nous ne pouvons être tenus responsables
            des interruptions de service, des pertes de données ou de tout dommage résultant
            de l''utilisation de l''application. Nous recommandons de toujours vérifier les
            informations religieuses auprès des savants qualifiés.
          </p>
        </section>

        <section className="bg-white rounded-3xl p-6 sm:p-8 border border-emerald/5">
          <h2 className="font-amiri font-bold text-emerald-dark text-xl mb-3">
            9. Modification des conditions
          </h2>
          <p className="text-sm text-gray-600 leading-relaxed">
            Nous nous réservons le droit de modifier ces conditions à tout moment. Les
            modifications prendront effet dès leur publication dans l''application. Il vous
            appartient de les consulter régulièrement.
          </p>
        </section>

        <section className="bg-white rounded-3xl p-6 sm:p-8 border border-emerald/5">
          <h2 className="font-amiri font-bold text-emerald-dark text-xl mb-3">
            10. Contact
          </h2>
          <p className="text-sm text-gray-600 leading-relaxed">
            Pour toute question relative à ces conditions, contactez-nous via la page
            Support de l''application.
          </p>
        </section>

        <div className="bg-emerald/5 rounded-3xl p-6 text-center border border-emerald/10">
          <p className="text-sm text-emerald-dark font-amiri font-bold">
            والله أعلم — Et Allah sait mieux
          </p>
        </div>
      </div>
    </main>
  );
}
