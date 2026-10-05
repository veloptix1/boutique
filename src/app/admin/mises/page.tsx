"use client";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { IconCheck } from "@/components/icons";

type Mise = any;
type Savant = { id: string; nom_fr: string };

const empty: Mise = {
  savant_id: null,
  cible_nom: "",
  cible_photo_url: "",
  cible_description: "",
  raison_fr: "",
  raison_ar: "",
  raison_en: "",
  sources: "",
  categorie: "",
};

export default function AdminMisesPage() {
  const [list, setList] = useState<Mise[]>([]);
  const [savants, setSavants] = useState<Savant[]>([]);
  const [editing, setEditing] = useState<Mise | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  const load = async () => {
    const [m, s] = await Promise.all([
      supabase.from("mises_en_garde").select("*").order("created_at", { ascending: false }),
      supabase.from("savants").select("id, nom_fr").order("nom_fr"),
    ]);
    setList(m.data || []);
    setSavants(s.data || []);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const uploadPhoto = async (file: File) => {
    setUploading(true);
    const ext = file.name.split(".").pop()?.toLowerCase() || "jpg";
    const clean = file.name.replace(/\.[^/.]+$/, "").normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "").replace(/[^a-zA-Z0-9]/g, "-")
      .replace(/-+/g, "-").substring(0, 30);
    const name = `mise-${Date.now()}-${clean}.${ext}`;

    const { error } = await supabase.storage.from("mises").upload(name, file);
    setUploading(false);
    if (error) { alert("Erreur upload : " + error.message); return; }

    const { data } = supabase.storage.from("mises").getPublicUrl(name);
    setEditing((e: any) => e ? { ...e, cible_photo_url: data.publicUrl } : null);
  };

  const save = async () => {
    if (!editing) return;
    if (!editing.savant_id || !editing.cible_nom) {
      alert("Savant et nom de la cible sont obligatoires");
      return;
    }
    setSaving(true);
    const payload: any = { ...editing };
    if (!payload.id) delete payload.id;
    if (!payload.savant_id) payload.savant_id = null;

    const { error } = editing.id
      ? await supabase.from("mises_en_garde").update(payload).eq("id", editing.id)
      : await supabase.from("mises_en_garde").insert(payload);

    setSaving(false);
    if (error) { alert("Erreur : " + error.message); return; }
    setEditing(null);
    load();
  };

  const remove = async (id?: string) => {
    if (!id || !confirm("Supprimer cette mise en garde ?")) return;
    await supabase.from("mises_en_garde").delete().eq("id", id);
    load();
  };

  const getSavantNom = (id: string) =>
    savants.find((s) => s.id === id)?.nom_fr || "—";

  return (
    <main className="p-6 lg:p-12 max-w-[1400px] mx-auto">
      <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
        <div>
          <div className="text-xs font-bold text-terracotta uppercase tracking-[3px] mb-2">
            Contenu
          </div>
          <h1 className="font-amiri font-bold text-emerald-dark text-3xl">
            Mises en garde
          </h1>
          <p className="text-gray-500 text-sm">{list.length} mise(s) en garde</p>
        </div>
        <button onClick={() => setEditing({ ...empty })}
          className="px-6 py-3 rounded-2xl bg-terracotta text-white font-semibold text-sm
                     hover:opacity-90 transition shadow-[0_8px_20px_rgba(193,80,46,0.25)]">
          + Ajouter
        </button>
      </div>

      {loading ? (
        <p className="text-gray-400">Chargement...</p>
      ) : list.length === 0 ? (
        <div className="bg-white rounded-3xl p-16 text-center border border-emerald/5">
          <p className="text-gray-400">Aucune mise en garde</p>
        </div>
      ) : (
        <div className="bg-white rounded-3xl border border-emerald/5 overflow-hidden">
          <table className="w-full">
            <thead className="bg-emerald/5">
              <tr className="text-left text-xs font-bold text-emerald-dark uppercase tracking-wider">
                <th className="px-6 py-4">Cible</th>
                <th className="px-6 py-4 hidden md:table-cell">Par</th>
                <th className="px-6 py-4 hidden lg:table-cell">Catégorie</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {list.map((m) => (
                <tr key={m.id} className="border-t border-emerald/5 hover:bg-cream/50">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-terracotta/10 flex items-center justify-center
                                      text-terracotta overflow-hidden shrink-0">
                        {m.cible_photo_url ? (
                          <img src={m.cible_photo_url} alt="" className="w-full h-full object-cover" />
                        ) : (
                          <span className="text-xs font-bold">{m.cible_nom?.charAt(0)}</span>
                        )}
                      </div>
                      <div className="font-semibold text-emerald-dark text-sm truncate">
                        {m.cible_nom}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600 hidden md:table-cell">
                    {getSavantNom(m.savant_id)}
                  </td>
                  <td className="px-6 py-4 hidden lg:table-cell">
                    {m.categorie && (
                      <span className="px-3 py-1 rounded-full bg-terracotta/10 text-terracotta
                                       text-[0.7rem] font-bold">
                        {m.categorie}
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-2">
                      <button onClick={() => setEditing(m)}
                        className="px-3 py-1.5 rounded-lg bg-emerald/10 text-emerald
                                   text-xs font-semibold hover:bg-emerald/20">
                        Modifier
                      </button>
                      <button onClick={() => remove(m.id)}
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

      {editing && (
        <div className="fixed inset-0 z-[1000] bg-black/60 flex items-start justify-center
                        p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl w-full max-w-3xl my-8">
            <div className="sticky top-0 bg-white border-b border-emerald/10 px-6 py-4
                            flex items-center justify-between rounded-t-3xl">
              <h2 className="font-bold text-emerald-dark">
                {editing.id ? "Modifier" : "Ajouter"} une mise en garde
              </h2>
              <button onClick={() => setEditing(null)}
                className="text-gray-400 hover:text-terracotta text-2xl leading-none">×</button>
            </div>

            <div className="p-6 space-y-5">
              <Field label="Savant qui met en garde *">
                <select value={editing.savant_id || ""}
                  onChange={(e) => setEditing({ ...editing, savant_id: e.target.value || null })}
                  className="inp">
                  <option value="">— Choisir un savant —</option>
                  {savants.map((s) => (
                    <option key={s.id} value={s.id}>{s.nom_fr}</option>
                  ))}
                </select>
              </Field>

              <Field label="Nom de la cible *">
                <input value={editing.cible_nom}
                  onChange={(e) => setEditing({ ...editing, cible_nom: e.target.value })}
                  className="inp" placeholder="Personne, groupe ou secte" />
              </Field>

              <Field label="Description de la cible">
                <textarea rows={2} value={editing.cible_description}
                  onChange={(e) => setEditing({ ...editing, cible_description: e.target.value })}
                  className="inp" />
              </Field>

              <Field label="Photo de la cible">
                <input type="file" accept="image/*"
                  onChange={(e) => e.target.files?.[0] && uploadPhoto(e.target.files[0])}
                  className="inp text-xs" />
                {editing.cible_photo_url && (
                  <img src={editing.cible_photo_url} alt="" className="mt-3 w-32 h-32 object-cover rounded-xl" />
                )}
              </Field>

              <Field label="Raison FR">
                <textarea rows={4} value={editing.raison_fr}
                  onChange={(e) => setEditing({ ...editing, raison_fr: e.target.value })}
                  className="inp" />
              </Field>

              <Field label="Raison AR">
                <textarea rows={3} dir="rtl" value={editing.raison_ar}
                  onChange={(e) => setEditing({ ...editing, raison_ar: e.target.value })}
                  className="inp font-amiri" />
              </Field>

              <Field label="Raison EN">
                <textarea rows={3} value={editing.raison_en}
                  onChange={(e) => setEditing({ ...editing, raison_en: e.target.value })}
                  className="inp" />
              </Field>

              <Field label="Sources">
                <input value={editing.sources}
                  onChange={(e) => setEditing({ ...editing, sources: e.target.value })}
                  className="inp" placeholder="Réfutation de..., cassette n°..., etc." />
              </Field>

              <Field label="Catégorie">
                <input value={editing.categorie}
                  onChange={(e) => setEditing({ ...editing, categorie: e.target.value })}
                  className="inp" placeholder="Secte, Personne, Groupe..." />
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
                className="px-6 py-3 rounded-2xl bg-terracotta text-white font-semibold text-sm
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
