"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { prepareUpload } from "@/lib/security";
import { IconSpeaker, IconSearch, IconPlay } from "@/components/icons";

type Sourate = {
  numero: number;
  nom_ar: string;
  nom_fr: string;
  nom_translit: string;
  versets: number;
  type: string;
};

type CoranAudio = {
  id?: string;
  sourate_numero: number;
  recitateur_slug: string;
  recitateur_nom: string;
  audio_url: string;
  duree: number | null;
};

const RECITATEURS = [
  { slug: "alafasy",       nom: "Cheikh Mishary Al-Afasy" },
  { slug: "husary",        nom: "Cheikh Mahmoud Khalil Al-Husary" },
  { slug: "abdulbasit",    nom: "Cheikh Abdul-Basit Abdul-Samad" },
  { slug: "muaiqly",       nom: "Cheikh Maher Al-Muaiqly" },
  { slug: "shuraim",       nom: "Cheikh Saud Al-Shuraim" },
  { slug: "sudais",        nom: "Cheikh Abdul-Rahman Al-Sudais" },
  { slug: "ghamdi",        nom: "Cheikh Saad Al-Ghamdi" },
  { slug: "ajamy",         nom: "Cheikh Ahmed Al-Ajamy" },
  { slug: "autre",         nom: "Autre (à préciser)" },
];

export default function AdminCoranPage() {
  const [sourates, setSourates] = useState<Sourate[]>([]);
  const [audios, setAudios] = useState<CoranAudio[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedSourate, setSelectedSourate] = useState<Sourate | null>(null);
  const [uploading, setUploading] = useState(false);
  const [recitateurNom, setRecitateurNom] = useState("");
  const [recitateurSlug, setRecitateurSlug] = useState("");
  const [customNom, setCustomNom] = useState("");

  const load = async () => {
    const [s, a] = await Promise.all([
      supabase.from("sourates").select("*").order("numero"),
      supabase.from("coran_audios").select("*"),
    ]);
    setSourates(s.data || []);
    setAudios(a.data || []);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const uploadMP3 = async (file: File) => {
    if (!selectedSourate) return;
    setUploading(true);

    const num = String(selectedSourate.numero).padStart(3, "0");
    const finalSlug = (recitateurSlug || "autre").replace(/[^a-z0-9-]/gi, "-").slice(0, 40);
    let fileName: string;
    try { fileName = prepareUpload(file, "audio", `${num}-${finalSlug}-`); }
    catch (e: any) { setUploading(false); alert(e.message); return; }

    // Upload
    const { error } = await supabase.storage.from("coran").upload(fileName, file);
    if (error) { alert("Erreur upload : " + error.message); setUploading(false); return; }

    // URL publique
    const { data: urlData } = supabase.storage.from("coran").getPublicUrl(fileName);

    // Calcul durée
    const audio = new Audio(urlData.publicUrl);
    audio.addEventListener("loadedmetadata", async () => {
      const duree = Math.round(audio.duration);

      const nomFinal = recitateurSlug === "autre"
        ? (customNom || "Récitateur personnalisé")
        : recitateurNom;

      const { error: err2 } = await supabase.from("coran_audios").insert({
        sourate_numero: selectedSourate.numero,
        recitateur_slug: finalSlug,
        recitateur_nom: nomFinal,
        audio_url: urlData.publicUrl,
        duree,
      });

      setUploading(false);
      if (err2) { alert("Erreur BDD : " + err2.message); return; }

      setRecitateurNom("");
      setRecitateurSlug("");
      setCustomNom("");
      setSelectedSourate(null);
      load();
    });
  };

  const remove = async (id?: string) => {
    if (!id || !confirm("Supprimer cet audio ?")) return;
    await supabase.from("coran_audios").delete().eq("id", id);
    load();
  };

  const getAudiosFor = (numero: number) =>
    audios.filter((a) => a.sourate_numero === numero);

  const filtered = sourates.filter((s) => {
    if (!search.trim()) return true;
    const q = search.toLowerCase();
    return (
      s.nom_fr.toLowerCase().includes(q) ||
      s.nom_translit.toLowerCase().includes(q) ||
      s.nom_ar.includes(search) ||
      String(s.numero) === search
    );
  });

  const totalAudios = audios.length;
  const souratesWithAudio = new Set(audios.map(a => a.sourate_numero)).size;

  return (
    <main className="p-6 lg:p-12 max-w-[1400px] mx-auto">

      {/* Header */}
      <div className="mb-8">
        <h1 className="font-amiri font-bold text-heading text-3xl sm:text-4xl mb-2">
          Coran
        </h1>
        <p className="text-muted text-sm">
          Ajoutez les récitations des 114 sourates, récitateur par récitateur.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        <div className="bg-surface rounded-2xl p-5 border border-line">
          <div className="text-xs font-bold text-muted mb-1">
            Sourates totales
          </div>
          <div className="font-amiri font-bold text-heading text-3xl">114</div>
        </div>
        <div className="bg-surface rounded-2xl p-5 border border-line">
          <div className="text-xs font-bold text-muted mb-1">
            Sourates avec audio
          </div>
          <div className="font-amiri font-bold text-heading text-3xl">{souratesWithAudio}</div>
        </div>
        <div className="bg-surface rounded-2xl p-5 border border-line col-span-2 lg:col-span-1">
          <div className="text-xs font-bold text-muted mb-1">
            Audios uploadés
          </div>
          <div className="font-amiri font-bold text-heading text-3xl">{totalAudios}</div>
        </div>
      </div>

      {/* Recherche */}
      <div className="relative mb-6">
        <div className="absolute left-5 top-1/2 -translate-y-1/2 text-link/50 pointer-events-none">
          <IconSearch size={18} />
        </div>
        <input
          type="text"
          placeholder="Rechercher une sourate..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="field"
        />
      </div>

      {/* Liste */}
      {loading ? (
        <p className="text-muted">Chargement...</p>
      ) : (
        <div className="grid gap-2">
          {filtered.map((s) => {
            const audiosSourate = getAudiosFor(s.numero);
            const hasAudio = audiosSourate.length > 0;

            return (
              <div key={s.numero}
                className="bg-surface rounded-2xl border border-line
                           hover:border-emerald/15 transition p-4">
                <div className="flex items-center gap-4">

                  {/* Numéro */}
                  <div className="w-11 h-11 rounded-xl bg-emerald/8 flex items-center justify-center
                                  text-link font-bold text-sm shrink-0">
                    {s.numero}
                  </div>

                  {/* Nom */}
                  <div className="flex-1 min-w-0">
                    <div className="font-semibold text-heading text-sm truncate">
                      {s.nom_translit} — {s.nom_fr}
                    </div>
                    <div className="flex items-center gap-2 text-xs text-muted">
                      <span className="font-amiri" dir="rtl">{s.nom_ar}</span>
                      <span>·</span>
                      <span>{s.versets} versets</span>
                      <span>·</span>
                      <span>{s.type}</span>
                    </div>
                  </div>

                  {/* Badge audio */}
                  {hasAudio && (
                    <span className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1
                                     rounded-full bg-emerald/10 text-link text-xs font-bold">
                      <IconSpeaker size={12} />
                      {audiosSourate.length}
                    </span>
                  )}

                  {/* Bouton ajouter */}
                  <button
                    onClick={() => setSelectedSourate(s)}
                    className="px-4 py-2 rounded-xl bg-emerald text-white text-xs font-semibold
                               hover:bg-emerald-dark transition shrink-0">
                    + Ajouter
                  </button>
                </div>

                {/* Audios existants */}
                {hasAudio && (
                  <div className="mt-3 pt-3 border-t border-line space-y-1.5">
                    {audiosSourate.map((a) => (
                      <div key={a.id}
                        className="flex items-center gap-3 px-3 py-2 rounded-xl bg-cream">
                        <div className="w-7 h-7 rounded-full bg-gold flex items-center justify-center shrink-0">
                          <IconPlay size={10} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="text-xs font-semibold text-heading truncate">
                            {a.recitateur_nom}
                          </div>
                          {a.duree && (
                            <div className="text-xs text-muted">
                              {Math.floor(a.duree / 60)} min {a.duree % 60}s
                            </div>
                          )}
                        </div>
                        <button onClick={() => remove(a.id)}
                          className="text-xs text-terracotta hover:underline font-semibold shrink-0">
                          Suppr.
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Modal upload */}
      {selectedSourate && (
        <div className="fixed inset-0 z-[1000] bg-black/60 flex items-end sm:items-center
                        justify-center p-0 sm:p-4"
             onClick={() => !uploading && setSelectedSourate(null)}>
          <div onClick={(e) => e.stopPropagation()}
            className="w-full sm:max-w-lg bg-surface rounded-t-3xl sm:rounded-2xl
                       p-6 max-h-[90vh] overflow-y-auto">

            <div className="flex items-center justify-between mb-5">
              <div>
                <div className="text-xs font-bold text-gold">
                  Ajouter un audio
                </div>
                <div className="font-bold text-heading text-lg mt-1">
                  Sourate {selectedSourate.numero} — {selectedSourate.nom_translit}
                </div>
              </div>
              <button onClick={() => !uploading && setSelectedSourate(null)}
                className="w-9 h-9 rounded-full bg-emerald/8 text-link
                           hover:bg-emerald/15 flex items-center justify-center
                           text-xl leading-none">×</button>
            </div>

            {/* Choix récitateur */}
            <div className="mb-5">
              <label className="block text-xs font-semibold text-heading mb-2">
                Récitateur *
              </label>
              <div className="grid grid-cols-1 gap-2">
                {RECITATEURS.map((r) => (
                  <button key={r.slug} type="button"
                    onClick={() => { setRecitateurSlug(r.slug); setRecitateurNom(r.nom); }}
                    className={`px-4 py-2.5 rounded-xl text-sm font-medium text-left
                                transition
                      ${recitateurSlug === r.slug
                        ? "bg-emerald text-white"
                        : "bg-cream text-heading hover:bg-emerald/10"}`}>
                    {r.nom}
                  </button>
                ))}
              </div>

              {recitateurSlug === "autre" && (
                <input type="text" placeholder="Nom du récitateur"
                  value={customNom}
                  onChange={(e) => setCustomNom(e.target.value)}
                  className="field" />
              )}
            </div>

            {/* Fichier */}
            <div className="mb-5">
              <label className="block text-xs font-semibold text-heading mb-2">
                Fichier MP3 *
              </label>
              <input type="file" accept="audio/*"
                disabled={!recitateurSlug || uploading}
                onChange={(e) => e.target.files?.[0] && uploadMP3(e.target.files[0])}
                className="w-full px-4 py-3 rounded-xl border border-line
                           focus:border-emerald outline-none text-sm
                           disabled:opacity-50 disabled:cursor-not-allowed" />
              {uploading && (
                <p className="text-xs text-link mt-2 font-semibold">
                  Upload en cours... Veuillez patienter
                </p>
              )}
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-line">
              <button onClick={() => setSelectedSourate(null)} disabled={uploading}
                className="px-5 py-2.5 rounded-xl border border-line
                           text-heading font-semibold text-sm disabled:opacity-50">
                Fermer
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}