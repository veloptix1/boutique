"use client";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { prepareUpload } from "@/lib/security";
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

    let name: string;
    try { name = prepareUpload(file, "audio"); }
    catch (e: any) { setUploading(false); alert(e.message); return; }

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
          <h1 className="font-amiri font-bold text-heading text-3xl">Audios</h1>
          <p className="text-muted text-sm">{list.length} audio(s)</p>
        </div>
        <button onClick={() => setEditing({ ...empty })}
          className="px-6 py-3 rounded-2xl bg-emerald text-white font-semibold text-sm
                     hover:bg-emerald-dark transition">
          + Ajouter un audio
        </button>
      </div>

      <input type="text" placeholder="Rechercher..."
        value={search} onChange={(e) => setSearch(e.target.value)}
        className="field" />

      {loading ? (
        <p className="text-muted">Chargement...</p>
      ) : filtered.length === 0 ? (
        <div className="bg-surface rounded-2xl p-16 text-center border border-line">
          <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-emerald/10 flex items-center justify-center text-link">
            <IconSpeaker size={28} />
          </div>
          <p className="text-muted">Aucun audio</p>
        </div>
      ) : (
        <div className="bg-surface rounded-2xl border border-line overflow-hidden">
          <table className="w-full">
            <thead className="bg-emerald/5">
              <tr className="text-left text-xs font-bold text-heading">
                <th className="px-6 py-4">Titre</th>
                <th className="px-6 py-4 hidden md:table-cell">Savant</th>
                <th className="px-6 py-4 hidden lg:table-cell">Durée</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((a) => (
                <tr key={a.id} className="border-t border-line hover:bg-cream/50">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gold flex items-center justify-center shrink-0">
                        <IconPlay size={12} />
                      </div>
                      <div className="min-w-0">
                        <div className="font-semibold text-heading text-sm truncate">
                          {a.titre_fr}
                        </div>
                        {a.titre_ar && (
                          <div className="text-xs text-muted truncate font-amiri" dir="rtl">
                            {a.titre_ar}
                          </div>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-ink/80 hidden md:table-cell">
                    {getSavantNom(a.savant_id)}
                  </td>
                  <td className="px-6 py-4 text-sm text-ink/80 hidden lg:table-cell">
                    {a.duree ? `${Math.floor(a.duree / 60)} min` : "—"}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-2">
                      <button onClick={() => setEditing(a)}
                        className="px-3 py-1.5 rounded-lg bg-emerald/10 text-link
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
          <div className="bg-surface rounded-2xl w-full max-w-3xl my-8">
            <div className="sticky top-0 bg-surface border-b border-line px-6 py-4
                            flex items-center justify-between rounded-t-3xl">
              <h2 className="font-bold text-heading">
                {editing.id ? "Modifier" : "Ajouter"} un audio
              </h2>
              <button onClick={() => setEditing(null)}
                className="text-muted hover:text-terracotta text-2xl leading-none">×</button>
            </div>

            <div className="p-6 space-y-5">
              <Field label="Titre FR *">
                <input value={editing.titre_fr}
                  onChange={(e) => setEditing({ ...editing, titre_fr: e.target.value })}
                  className="field" />
              </Field>

              <div className="grid grid-cols-2 gap-4">
                <Field label="Titre AR">
                  <input dir="rtl" value={editing.titre_ar}
                    onChange={(e) => setEditing({ ...editing, titre_ar: e.target.value })}
                    className="field font-amiri" />
                </Field>
                <Field label="Titre EN">
                  <input value={editing.titre_en}
                    onChange={(e) => setEditing({ ...editing, titre_en: e.target.value })}
                    className="field" />
                </Field>
              </div>

              <Field label="Description FR">
                <textarea rows={3} value={editing.description_fr}
                  onChange={(e) => setEditing({ ...editing, description_fr: e.target.value })}
                  className="field" />
              </Field>

              <div className="grid grid-cols-2 gap-4">
                <Field label="Savant">
                  <select value={editing.savant_id || ""}
                    onChange={(e) => setEditing({ ...editing, savant_id: e.target.value || null })}
                    className="field">
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
                    className="field">
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
                      <span className="text-xs text-link font-semibold">
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
                  className="field" />
              </Field>
            </div>

            <div className="sticky bottom-0 bg-surface border-t border-line px-6 py-4
                            flex justify-end gap-3 rounded-b-3xl">
              <button onClick={() => setEditing(null)}
                className="px-6 py-3 rounded-2xl border border-line
                           text-heading font-semibold text-sm">
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
          border: 1px solid rgb(var(--line) / 0.25); outline: none;
          font-size: 14px; font-family: inherit; background: rgb(var(--surface)); color: rgb(var(--ink));
        }
        .inp:focus { border-color: #d4af37; }
      `}</style>
    </main>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-xs font-semibold text-heading mb-1.5">
        {label}
      </label>
      {children}
    </div>
  );
}