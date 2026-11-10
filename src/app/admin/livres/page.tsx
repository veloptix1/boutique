"use client";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { prepareUpload } from "@/lib/security";
import { IconLivre, IconCheck, IconDownload } from "@/components/icons";

type Livre = {
  id?: string;
  slug: string;
  titre_fr: string;
  titre_ar: string;
  titre_en: string;
  auteur_fr: string;
  auteur_ar: string;
  auteur_en: string;
  description_fr: string;
  couverture_url: string;
  pdf_url: string;
  pages: number | null;
  langue: string;
  categorie: string;
  annee: string;
  ordre: number;
};

const empty: Livre = {
  slug: "", titre_fr: "", titre_ar: "", titre_en: "",
  auteur_fr: "", auteur_ar: "", auteur_en: "",
  description_fr: "", couverture_url: "", pdf_url: "",
  pages: null, langue: "fr", categorie: "", annee: "", ordre: 0,
};

export default function AdminLivresPage() {
  const [list, setList] = useState<Livre[]>([]);
  const [editing, setEditing] = useState<Livre | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  const load = async () => {
    const { data } = await supabase.from("livres").select("*").order("ordre");
    setList(data || []);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const uploadPDF = async (file: File) => {
    setUploading(true);
    let name: string;
    try { name = prepareUpload(file, "pdf"); }
    catch (e: any) { setUploading(false); alert(e.message); return; }
    const { error } = await supabase.storage.from("livres").upload(name, file);
    setUploading(false);
    if (error) { alert("Erreur upload : " + error.message); return; }
    const { data } = supabase.storage.from("livres").getPublicUrl(name);
    setEditing((e) => e ? { ...e, pdf_url: data.publicUrl } : null);
  };

  const uploadCover = async (file: File) => {
    setUploading(true);
    let name: string;
    try { name = prepareUpload(file, "image", "cover-"); }
    catch (e: any) { setUploading(false); alert(e.message); return; }
    const { error } = await supabase.storage.from("covers").upload(name, file);
    setUploading(false);
    if (error) { alert("Erreur upload : " + error.message); return; }
    const { data } = supabase.storage.from("covers").getPublicUrl(name);
    setEditing((e) => e ? { ...e, couverture_url: data.publicUrl } : null);
  };

  const save = async () => {
    if (!editing) return;
    if (!editing.titre_fr || !editing.slug || !editing.pdf_url) {
      alert("Titre FR, slug et PDF sont obligatoires");
      return;
    }
    setSaving(true);
    const payload: any = { ...editing };
    if (!payload.id) delete payload.id;

    const { error } = editing.id
      ? await supabase.from("livres").update(payload).eq("id", editing.id)
      : await supabase.from("livres").insert(payload);

    setSaving(false);
    if (error) { alert("Erreur : " + error.message); return; }
    setEditing(null);
    load();
  };

  const remove = async (id?: string) => {
    if (!id || !confirm("Supprimer ce livre ?")) return;
    await supabase.from("livres").delete().eq("id", id);
    load();
  };

  const autoSlug = (s: string) =>
    s.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

  return (
    <main className="p-6 lg:p-12 max-w-[1400px] mx-auto">
      <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="font-amiri font-bold text-emerald-dark text-3xl">
            Livres
          </h1>
          <p className="text-muted text-sm">{list.length} livre(s)</p>
        </div>
        <button onClick={() => setEditing({ ...empty })}
          className="px-6 py-3 rounded-2xl bg-emerald text-white font-semibold text-sm
                     hover:bg-emerald-dark transition">
          + Ajouter un livre
        </button>
      </div>

      {loading ? (
        <p className="text-muted">Chargement...</p>
      ) : list.length === 0 ? (
        <div className="bg-white rounded-2xl p-16 text-center border border-line">
          <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gold/15 flex items-center justify-center text-gold">
            <IconLivre size={28} />
          </div>
          <p className="text-muted">Aucun livre</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {list.map((l) => (
            <div key={l.id} className="bg-white rounded-2xl overflow-hidden
                                       border border-line hover:shadow-lg transition">
              <div className="aspect-[3/4] bg-gradient-to-br from-emerald to-emerald-dark
                              flex items-center justify-center overflow-hidden">
                {l.couverture_url ? (
                  <img loading="lazy" decoding="async" src={l.couverture_url} alt="" className="w-full h-full object-cover" />
                ) : (
                  <IconLivre size={48} />
                )}
              </div>
              <div className="p-4">
                <div className="font-bold text-emerald-dark text-sm mb-1 truncate">
                  {l.titre_fr}
                </div>
                <div className="text-xs text-muted mb-3 truncate">{l.auteur_fr}</div>
                <div className="flex gap-2">
                  <button onClick={() => setEditing(l)}
                    className="flex-1 px-3 py-2 rounded-lg bg-emerald/10 text-emerald
                               text-xs font-semibold hover:bg-emerald/20">
                    Modifier
                  </button>
                  <a href={l.pdf_url} target="_blank" rel="noopener noreferrer"
                    className="px-3 py-2 rounded-lg bg-gold/15 text-gold-deep hover:bg-gold/25">
                    <IconDownload size={14} />
                  </a>
                  <button onClick={() => remove(l.id)}
                    className="px-3 py-2 rounded-lg bg-terracotta/10 text-terracotta
                               text-xs font-semibold hover:bg-terracotta/20">
                    ✕
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {editing && (
        <div className="fixed inset-0 z-[1000] bg-black/60 flex items-start justify-center
                        p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl w-full max-w-3xl my-8">
            <div className="sticky top-0 bg-white border-b border-line px-6 py-4
                            flex items-center justify-between rounded-t-3xl">
              <h2 className="font-bold text-emerald-dark">
                {editing.id ? "Modifier" : "Ajouter"} un livre
              </h2>
              <button onClick={() => setEditing(null)}
                className="text-muted hover:text-terracotta text-2xl leading-none">×</button>
            </div>

            <div className="p-6 space-y-5">
              <div className="grid grid-cols-2 gap-4">
                <Field label="Titre FR *">
                  <input value={editing.titre_fr}
                    onChange={(e) => {
                      const v = e.target.value;
                      setEditing({
                        ...editing, titre_fr: v,
                        slug: editing.id ? editing.slug : autoSlug(v),
                      });
                    }} className="field" />
                </Field>
                <Field label="Slug *">
                  <input value={editing.slug}
                    onChange={(e) => setEditing({ ...editing, slug: e.target.value })}
                    className="field font-mono" />
                </Field>
              </div>

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

              <div className="grid grid-cols-3 gap-4">
                <Field label="Auteur FR">
                  <input value={editing.auteur_fr}
                    onChange={(e) => setEditing({ ...editing, auteur_fr: e.target.value })}
                    className="field" />
                </Field>
                <Field label="Auteur AR">
                  <input dir="rtl" value={editing.auteur_ar}
                    onChange={(e) => setEditing({ ...editing, auteur_ar: e.target.value })}
                    className="field font-amiri" />
                </Field>
                <Field label="Auteur EN">
                  <input value={editing.auteur_en}
                    onChange={(e) => setEditing({ ...editing, auteur_en: e.target.value })}
                    className="field" />
                </Field>
              </div>

              <Field label="Description FR">
                <textarea rows={3} value={editing.description_fr}
                  onChange={(e) => setEditing({ ...editing, description_fr: e.target.value })}
                  className="field" />
              </Field>

              <div className="grid grid-cols-2 gap-4">
                <Field label="Fichier PDF *">
                  <input type="file" accept="application/pdf"
                    onChange={(e) => e.target.files?.[0] && uploadPDF(e.target.files[0])}
                    className="inp text-xs" />
                  {editing.pdf_url && (
                    <p className="text-xs text-emerald mt-1 truncate">✓ {editing.pdf_url}</p>
                  )}
                </Field>
                <Field label="Couverture (image)">
                  <input type="file" accept="image/*"
                    onChange={(e) => e.target.files?.[0] && uploadCover(e.target.files[0])}
                    className="inp text-xs" />
                  {editing.couverture_url && (
                    <p className="text-xs text-emerald mt-1 truncate">✓ {editing.couverture_url}</p>
                  )}
                </Field>
              </div>

              <div className="grid grid-cols-4 gap-4">
                <Field label="Pages">
                  <input type="number" value={editing.pages || ""}
                    onChange={(e) => setEditing({ ...editing, pages: Number(e.target.value) || null })}
                    className="field" />
                </Field>
                <Field label="Langue">
                  <select value={editing.langue}
                    onChange={(e) => setEditing({ ...editing, langue: e.target.value })}
                    className="field">
                    <option value="fr">FR</option>
                    <option value="ar">AR</option>
                    <option value="en">EN</option>
                  </select>
                </Field>
                <Field label="Catégorie">
                  <input value={editing.categorie}
                    onChange={(e) => setEditing({ ...editing, categorie: e.target.value })}
                    className="field" />
                </Field>
                <Field label="Ordre">
                  <input type="number" value={editing.ordre}
                    onChange={(e) => setEditing({ ...editing, ordre: Number(e.target.value) })}
                    className="field" />
                </Field>
              </div>
            </div>

            <div className="sticky bottom-0 bg-white border-t border-line px-6 py-4
                            flex justify-end gap-3 rounded-b-3xl">
              <button onClick={() => setEditing(null)}
                className="px-6 py-3 rounded-2xl border border-line
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
      <label className="block text-xs font-semibold text-emerald-dark mb-1.5">
        {label}
      </label>
      {children}
    </div>
  );
}