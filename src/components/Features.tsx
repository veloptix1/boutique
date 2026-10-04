import { IconSpeaker, IconBook, IconDownload, IconSearch } from "./icons";

const features = [
  { Icon: IconSpeaker,  color: "bg-emerald/10 text-emerald",       t: "Audio des savants",  d: "Des centaines d'enseignements authentiques en français et en arabe." },
  { Icon: IconBook,     color: "bg-gold/15 text-gold",             t: "Hadiths authentiques", d: "Texte arabe, traduction française et degré d'authenticité vérifié." },
  { Icon: IconDownload, color: "bg-terracotta/10 text-terracotta", t: "Écoute hors ligne",  d: "Téléchargez vos audios préférés et écoutez sans connexion." },
  { Icon: IconSearch,   color: "bg-indigo/10 text-indigo",         t: "Recherche rapide",   d: "Trouvez un hadith, un savant ou un thème en quelques secondes." },
];

export default function Features() {
  return (
    <section className="px-[6%] py-16 max-w-[1200px] mx-auto text-center">
      <h2 className="font-amiri font-bold text-emerald-dark
                     text-[clamp(1.8rem,4vw,2.6rem)] mb-3">
        Pourquoi AL BASIRAH ?
      </h2>
      <p className="text-gray-500 mb-10">Une expérience pensée pour les francophones</p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {features.map(({ Icon, color, t, d }, i) => (
          <div key={i} className="bg-white rounded-3xl p-7 text-left border border-emerald/5
                                  hover:-translate-y-1.5 hover:shadow-[0_20px_40px_rgba(13,92,74,0.1)]
                                  transition-all">
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${color}`}>
              <Icon size={22} />
            </div>
            <h3 className="font-bold text-emerald-dark text-base mb-1.5">{t}</h3>
            <p className="text-sm text-gray-500 leading-relaxed">{d}</p>
          </div>
        ))}
      </div>
    </section>
  );
}