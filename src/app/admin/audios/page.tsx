"use client";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { IconSpeaker, IconCheck, IconPlay } from "@/components/icons";

type Audio = {
  id?: string;
  titre_fr: string;
  titre_ar: string;
  titre_en: string;
  description_fr: string;
  savant_id: string | null;
  audio_url: string;
  duree: number | null;
  langue: string;
  ordre: number;
};

type Savant = { id: string; nom_fr: string; categorie: string };

const empty: Audio = {
  titre_fr: "", titre_ar: "", titre_en: "",
  description_fr: "", savant_id: null,
  audio_url: "", duree: null, langue: "fr", ordre: 0,
};

export default function AdminAudiosPage() {
  const [list, setList] = useState<Audio[]>([]);
  const [savants, setSavants] = useState<Savant[]>([]);
  const [editing, setEditing] = useState<Audio | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [search, setSearch] = useState("");

  const load = async () => {
    const [a, s] = await Promise.all([
      supabase.from("audios").select("*").order("created_at", { ascending: false }),
      supabase.from("savants").select("id, nom_fr, categorie").order("nom_fr"),
    ]);
    setList(a.data || []);
    setSavants(s.data || []);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const uploadMP3 = async (file: File) => {
    setUploading(true);

    // 🔥 Nettoyer le nom du fichier (retire accents, caractères arabes, espaces, etc.)
    const ext = file.name.split(".").pop()?.toLowerCase() || "mp3";
    const cleanName = file.name
      .replace(/\.[^/.]+$/, "")
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-zA-Z0-9]/g, "-")
      .replace(/-+/g, "-")
      .replace(/^-|-$/g, "")
      .substring(0, 50);

    const name = `${Date.now()}-${cleanName || "audio"}.${ext}`;

    const { error } = await supabase.storage.from("audios").upload(name, file);
    setUploading(false);
    if (error) { alert("Erreur upload : " + error.message); return; }

    // Calcul automatique de la durée
    const url = URL.createObjectURL(file);
    const audio = new Audio(url);
    audio.addEventListener("loadedmetadata", () => {
      const duree = Math.round(audio.duration);
      const { data } = supabase.storage.from("audios").getPublicUrl(name);
      setEditing((e) => e ? { ...e, audio_url: data.publicUrl, duree } : null);
    });
  };

  const save = async () => {
    if (!editing) return;
    if (!editing.titre_fr || !editing.audio_url) {
      alert("Titre FR et fichier MP3 sont obligatoires");
      return;
    }
    setSaving(true);
    const payload: any = { ...editing };
    if (!payload.id) delete payload.id;
    if (!payload.savant_id) payload.savant_id = null;

    const { error } = editing.id
      ? await supabase.from("audios").update(payload).eq("id", editing.id)
      : await supabase.from("audios").insert(payload);

    setSaving(false);
    if (error) { alert("Erreur : " + error.message); return; }
    setEditing(null);
    load();
  };

  const remove = async (id?: string) => {
    if (!id || !confirm("Supprimer cet audio ?")) return;
    await supabase.from("audios").delete().eq("id", id);
    load();
  };

  const getSavantNom = (id: string | null) =>
    savants.find((s) => s.id === id)?.nom_fr || "—";

  const filtered = list.filter((a) =>
    a.titre_fr.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <main className="p-6 lg:p-12 max-w-[1400px] mx-auto">
      <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
        <div>
          <div className="text-xs font-bold text-gold uppercase tracking-[3px] mb-2">
            Contenu
          </div>
          <h1 className="font-amiri font-bold text-emerald-dark text-3xl">Audios</h1>
          <p className="text-gray-500 text-sm">{list.length} audio(s)</p>
        </div>
        <button onClick={() => setEditing({ ...empty })}
          className="px-6 py-3 rounded-2xl bg-emerald text-white font-semibold text-sm
                     hover:bg-emerald-dark transition shadow-[0_8px_20px_rgba(13,92,74,0.25)]">
          + Ajouter un audio
        </button>
      </div>

      <input type="text" placeholder="Rechercher..."
        value={search} onChange={(e) => setSearch(e.target.value)}
        className="w-full max-w-md px-5 py-3 rounded-2xl border-2 border-emerald/10
                   focus:border-gold outline-none text-sm mb-6 bg-white" />

      {loading ? (
        <p className="text-gray-400">Chargement...</p>
      ) : filtered.length === 0 ? (
        <div className="bg-white rounded-3xl p-16 text-center border border-emerald/5">
          <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-emerald/10 flex items-center justify-center text-emerald">
            <IconSpeaker size={28} />
          </div>
          <p className="text-gray-400">Aucun audio</p>
        </div>
      ) : (
        <div className="bg-white rounded-3xl border border-emerald/5 overflow-hidden">
          <table className="w-full">
            <thead className="bg-emerald/5">
              <tr className="text-left text-xs font-bold text-emerald-dark uppercase tracking-wider">
                <th className="px-6 py-4">Titre</th>
                <th className="px-6 py-4 hidden md:table-cell">Savant</th>
                <th className="px-6 py-4 hidden lg:table-cell">Durée</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((a) => (
                <tr key={a.id} className="border-t border-emerald/5 hover:bg-cream/50">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gold flex items-center justify-center shrink-0">
                        <IconPlay size={12} />
                      </div>
                      <div className="min-w-0">
                        <div className="font-semibold text-emerald-dark text-sm truncate">
                          {a.titre_fr}
                        </div>
                        {a.titre_ar && (
                          <div className="text-xs text-gray-400 truncate font-amiri" dir="rtl">
                            {a.titre_ar}
                          </div>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600 hidden md:table-cell">
                    {getSavantNom(a.savant_id)}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600 hidden lg:table-cell">
                    {a.duree ? `${Math.floor(a.duree / 60)} min` : "—"}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-2">
                      <button onClick={() => setEditing(a)}
                        className="px-3 py-1.5 rounded-lg bg-emerald/10 text-emerald
                                   text-xs font-semibold hover:bg-emerald/20">
                        Modifier
                      </button>
                      <button onClick={() => remove(a.id)}
                        className="px-3 py-1.5 rounded-lg bg-terracotta/10 text-terracotta
                                   text-xs font-semibold hover:bg-terracotta/20">
                        Suppr.
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal */}
      {editing && (
        <div className="fixed inset-0 z-[1000] bg-black/60 flex items-start justify-center
                        p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl w-full max-w-3xl my-8">
            <div className="sticky top-0 bg-white border-b border-emerald/10 px-6 py-4
                            flex items-center justify-between rounded-t-3xl">
              <h2 className="font-bold text-emerald-dark">
                {editing.id ? "Modifier" : "Ajouter"} un audio
              </h2>
              <button onClick={() => setEditing(null)}
                className="text-gray-400 hover:text-terracotta text-2xl leading-none">×</button>
            </div>

            <div className="p-6 space-y-5">
              <Field label="Titre FR *">
                <input value={editing.titre_fr}
                  onChange={(e) => setEditing({ ...editing, titre_fr: e.target.value })}
                  className="inp" />
              </Field>

              <div className="grid grid-cols-2 gap-4">
                <Field label="Titre AR">
                  <input dir="rtl" value={editing.titre_ar}
                    onChange={(e) => setEditing({ ...editing, titre_ar: e.target.value })}
                    className="inp font-amiri" />
                </Field>
                <Field label="Titre EN">
                  <input value={editing.titre_en}
                    onChange={(e) => setEditing({ ...editing, titre_en: e.target.value })}
                    className="inp" />
                </Field>
              </div>

              <Field label="Description FR">
                <textarea rows={3} value={editing.description_fr}
                  onChange={(e) => setEditing({ ...editing, description_fr: e.target.value })}
                  className="inp" />
              </Field>

              <div className="grid grid-cols-2 gap-4">
                <Field label="Savant">
                  <select value={editing.savant_id || ""}
                    onChange={(e) => setEditing({ ...editing, savant_id: e.target.value || null })}
                    className="inp">
                    <option value="">— Aucun —</option>
                    {savants.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.nom_fr} ({s.categorie})
                      </option>
                    ))}
                  </select>
                </Field>
                <Field label="Langue">
                  <select value={editing.langue}
                    onChange={(e) => setEditing({ ...editing, langue: e.target.value })}
                    className="inp">
                    <option value="fr">Français</option>
                    <option value="ar">Arabe</option>
                    <option value="en">Anglais</option>
                  </select>
                </Field>
              </div>

              <Field label="Fichier MP3 *">
                <input type="file" accept="audio/*"
                  onChange={(e) => e.target.files?.[0] && uploadMP3(e.target.files[0])}
                  className="inp text-xs" />
                {editing.audio_url && (
                  <div className="mt-3 p-3 bg-emerald/5 rounded-xl">
                    <div className="flex items-center gap-2 mb-2">
                      <IconPlay size={12} />
                      <span className="text-xs text-emerald font-semibold">
                        Fichier chargé {editing.duree && `(${Math.floor(editing.duree / 60)} min ${editing.duree % 60}s)`}
                      </span>
                    </div>
                    <audio src={editing.audio_url} controls className="w-full h-10" />
                  </div>
                )}
              </Field>

              <Field label="Ordre d'affichage">
                <input type="number" value={editing.ordre}
                  onChange={(e) => setEditing({ ...editing, ordre: Number(e.target.value) })}
                  className="inp" />
              </Field>
            </div>

            <div className="sticky bottom-0 bg-white border-t border-emerald/10 px-6 py-4
                            flex justify-end gap-3 rounded-b-3xl">
              <button onClick={() => setEditing(null)}
                className="px-6 py-3 rounded-2xl border-2 border-emerald/15
                           text-emerald-dark font-semibold text-sm">
                Annuler
              </button>
              <button onClick={save} disabled={saving || uploading}
                className="px-6 py-3 rounded-2xl bg-emerald text-white font-semibold text-sm
                           disabled:opacity-50 inline-flex items-center gap-2">
                <IconCheck size={16} />
                {saving ? "Enreg..." : uploading ? "Upload..." : "Enregistrer"}
              </button>
            </div>
          </div>
        </div>
      )}

      <style jsx global>{`
        .inp {
          width: 100%; padding: 12px 16px; border-radius: 14px;
          border: 2px solid rgba(13,92,74,0.1); outline: none;
          font-size: 14px; font-family: inherit; background: white;
        }
        .inp:focus { border-color: #d4af37; }
      `}</style>
    </main>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-xs font-semibold text-emerald-dark mb-1.5 uppercase tracking-wider">
        {label}
      </label>
      {children}
    </div>
  );
}