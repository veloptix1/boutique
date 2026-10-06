"use client";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { IconCheck } from "@/components/icons";

const empty: any = {
  titre: "",
  slug: "",
  resume: "",
  contenu: "",
  image_url: "",
  categorie: "",
  auteur: "",
  source: "",
  publie: true,
  epingle: false,
  ordre: 0,
};

export default function AdminActualitesPage() {
  const [list, setList] = useState<any[]>([]);
  const [editing, setEditing] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  const load = async () => {
    const { data } = await supabase
      .from("actualites").select("*")
      .order("created_at", { ascending: false });
    setList(data || []);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const uploadImage = async (file: File) => {
    setUploading(true);
    const ext = file.name.split(".").pop()?.toLowerCase() || "jpg";
    const name = `actu-${Date.now()}.${ext}`;

    const { error } = await supabase.storage.from("actualites").upload(name, file);
    setUploading(false);
    if (error) { alert("Erreur upload : " + error.message); return; }

    const { data } = supabase.storage.from("actualites").getPublicUrl(name);
    setEditing((e: any) => e ? { ...e, image_url: data.publicUrl } : null);
  };

  const save = async () => {
    if (!editing) return;
    if (!editing.titre || !editing.contenu) {
      alert("Titre et contenu obligatoires");
      return;
    }
    if (!editing.slug) {
      editing.slug = editing.titre.toLowerCase()
        .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
        .replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
    }

    setSaving(true);
    const payload = { ...editing };
    if (!payload.id) delete payload.id;
    const { error } = editing.id
      ? await supabase.from("actualites").update(payload).eq("id", editing.id)
      : await supabase.from("actualites").insert(payload);
    setSaving(false);
    if (error) { alert(error.message); return; }
    setEditing(null);
    load();
  };

  const remove = async (id: string) => {
    if (!confirm("Supprimer cette actualité ?")) return;
    await supabase.from("actualites").delete().eq("id", id);
    load();
  };

  const togglePublie = async (a: any) => {
    await supabase.from("actualites").update({ publie: !a.publie }).eq("id", a.id);
    load();
  };

  const toggleEpingle = async (a: any) => {
    await supabase.from("actualites").update({ epingle: !a.epingle }).eq("id", a.id);
    load();
  };

  return (
    <main className="p-6 lg:p-12 max-w-[1400px] mx-auto">
      <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
        <div>
          <div className="text-xs font-bold text-gold uppercase tracking-[3px] mb-2">
            Contenu
          </div>
          <h1 className="font-amiri font-bold text-emerald-dark text-3xl">
            Actualités
          </h1>
          <p className="text-gray-500 text-sm">{list.length} actualité(s)</p>
        </div>
        <button onClick={() => setEditing({ ...empty })}
          className="px-6 py-3 rounded-2xl bg-emerald text-white font-semibold text-sm
                     hover:bg-emerald-dark transition shadow-[0_8px_20px_rgba(13,92,74,0.25)]">
          + Nouvelle actualité
        </button>
      </div>

      {loading ? (
        <p className="text-gray-400">Chargement...</p>
      ) : list.length === 0 ? (
        <div className="bg-white rounded-3xl p-16 text-center border border-emerald/5">
          <p className="text-gray-400">Aucune actualité</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {list.map((a) => (
            <div key={a.id} className="bg-white rounded-3xl overflow-hidden border border-emerald/5">
              <div className="aspect-video bg-cream relative">
                {a.image_url ? (
                  <img src={a.image_url} alt={a.titre} className="w-full h-full object-cover" />
                ) : (
                  <div className="flex items-center justify-center h-full text-gray-300">
                    Pas d''image
                  </div>
                )}
                {a.epingle && (
                  <div className="absolute top-2 left-2 px-2.5 py-1 rounded-full
                                  bg-terracotta text-white text-[0.6rem] font-bold">
                    ÉPINGLÉ
                  </div>
                )}
              </div>
              <div className="p-4">
                <div className="font-bold text-emerald-dark text-sm mb-1 line-clamp-2">
                  {a.titre}
                </div>
                <div className="flex items-center gap-2 text-xs text-gray-400 mb-3">
                  {a.categorie && <span>{a.categorie}</span>}
                  <span>·</span>
                  <span>{new Date(a.created_at).toLocaleDateString("fr-FR")}</span>
                </div>

                <div className="flex flex-wrap gap-2 mb-3">
                  <button onClick={() => togglePublie(a)}
                    className={`px-2.5 py-1 rounded-full text-[0.65rem] font-bold
                      ${a.publie ? "bg-emerald/10 text-emerald" : "bg-gray-200 text-gray-500"}`}>
                    {a.publie ? "Publié" : "Brouillon"}
                  </button>
                  <button onClick={() => toggleEpingle(a)}
                    className={`px-2.5 py-1 rounded-full text-[0.65rem] font-bold
                      ${a.epingle ? "bg-gold/20 text-gold" : "bg-gray-100 text-gray-500"}`}>
                    {a.epingle ? "Épinglé" : "Non épinglé"}
                  </button>
                </div>

                <div className="flex gap-2">
                  <button onClick={() => setEditing(a)}
                    className="flex-1 px-3 py-2 rounded-lg bg-emerald/10 text-emerald
                               text-xs font-semibold hover:bg-emerald/20">
                    Modifier
                  </button>
                  <button onClick={() => remove(a.id)}
                    className="px-3 py-2 rounded-lg bg-terracotta/10 text-terracotta
                               text-xs font-semibold hover:bg-terracotta/20">
                    Suppr.
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
          <div className="bg-white rounded-3xl w-full max-w-3xl my-8">
            <div className="sticky top-0 bg-white border-b border-emerald/10 px-6 py-4
                            flex items-center justify-between rounded-t-3xl">
              <h2 className="font-bold text-emerald-dark">
                {editing.id ? "Modifier" : "Nouvelle"} actualité
              </h2>
              <button onClick={() => setEditing(null)}
                className="text-gray-400 hover:text-terracotta text-2xl">×</button>
            </div>

            <div className="p-6 space-y-5">
              <Field label="Titre *">
                <input value={editing.titre}
                  onChange={(e) => setEditing({ ...editing, titre: e.target.value })}
                  className="inp" />
              </Field>

              <div className="grid grid-cols-2 gap-4">
                <Field label="Catégorie">
                  <input value={editing.categorie}
                    onChange={(e) => setEditing({ ...editing, categorie: e.target.value })}
                    className="inp" placeholder="Annonce, Événement, Fatwa..." />
                </Field>
                <Field label="Auteur">
                  <input value={editing.auteur}
                    onChange={(e) => setEditing({ ...editing, auteur: e.target.value })}
                    className="inp" />
                </Field>
              </div>

              <Field label="Image">
                <input type="file" accept="image/*"
                  onChange={(e) => e.target.files?.[0] && uploadImage(e.target.files[0])}
                  className="inp text-xs" />
                {uploading && <p className="text-xs text-emerald mt-2">Upload...</p>}
                {editing.image_url && (
                  <img src={editing.image_url} alt="" className="mt-3 w-full max-h-48 object-cover rounded-xl" />
                )}
              </Field>

              <Field label="Résumé (aperçu)">
                <textarea rows={2} value={editing.resume}
                  onChange={(e) => setEditing({ ...editing, resume: e.target.value })}
                  className="inp" />
              </Field>

              <Field label="Contenu *">
                <textarea rows={10} value={editing.contenu}
                  onChange={(e) => setEditing({ ...editing, contenu: e.target.value })}
                  className="inp" />
              </Field>

              <Field label="Source">
                <input value={editing.source}
                  onChange={(e) => setEditing({ ...editing, source: e.target.value })}
                  className="inp" placeholder="Ex: Site officiel du comité..." />
              </Field>

              <div className="grid grid-cols-2 gap-4">
                <Field label="Publié">
                  <button type="button"
                    onClick={() => setEditing({ ...editing, publie: !editing.publie })}
                    className={`w-full px-4 py-3 rounded-xl border-2 text-sm font-semibold transition
                      ${editing.publie
                        ? "bg-emerald text-white border-emerald"
                        : "bg-white text-gray-500 border-emerald/10"}`}>
                    {editing.publie ? "Oui" : "Non"}
                  </button>
                </Field>
                <Field label="Épinglé en haut">
                  <button type="button"
                    onClick={() => setEditing({ ...editing, epingle: !editing.epingle })}
                    className={`w-full px-4 py-3 rounded-xl border-2 text-sm font-semibold transition
                      ${editing.epingle
                        ? "bg-gold text-emerald-dark border-gold"
                        : "bg-white text-gray-500 border-emerald/10"}`}>
                    {editing.epingle ? "Oui" : "Non"}
                  </button>
                </Field>
              </div>
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
