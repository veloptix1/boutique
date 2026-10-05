"use client";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { IconCheck } from "@/components/icons";

const empty: any = {
  slug: "", nom_fr: "", nom_ar: "", nom_en: "",
  surnom_fr: "", surnom_ar: "", epoque: "", lieu: "",
  peuple: "", passages_coran: "", hadiths: "",
  paroles_savants: "", ordre: 0,
};

export default function AdminProphetesPage() {
  const [list, setList] = useState<any[]>([]);
  const [editing, setEditing] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const load = async () => {
    const { data } = await supabase.from("prophetes").select("*").order("ordre");
    setList(data || []);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const save = async () => {
    if (!editing) return;
    if (!editing.nom_fr || !editing.slug) {
      alert("Nom FR et slug obligatoires");
      return;
    }
    setSaving(true);
    const payload = { ...editing };
    if (!payload.id) delete payload.id;
    const { error } = editing.id
      ? await supabase.from("prophetes").update(payload).eq("id", editing.id)
      : await supabase.from("prophetes").insert(payload);
    setSaving(false);
    if (error) { alert(error.message); return; }
    setEditing(null);
    load();
  };

  const remove = async (id: string) => {
    if (!confirm("Supprimer ?")) return;
    await supabase.from("prophetes").delete().eq("id", id);
    load();
  };

  return (
    <main className="p-6 lg:p-12 max-w-[1400px] mx-auto">
      <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
        <div>
          <div className="text-xs font-bold text-gold uppercase tracking-[3px] mb-2">Contenu</div>
          <h1 className="font-amiri font-bold text-emerald-dark text-3xl">Prophètes</h1>
          <p className="text-gray-500 text-sm">{list.length} prophète(s)</p>
        </div>
        <button onClick={() => setEditing({ ...empty })}
          className="px-6 py-3 rounded-2xl bg-emerald text-white font-semibold text-sm
                     hover:bg-emerald-dark transition shadow-[0_8px_20px_rgba(13,92,74,0.25)]">
          + Ajouter
        </button>
      </div>

      {loading ? (
        <p className="text-gray-400">Chargement...</p>
      ) : (
        <div className="bg-white rounded-3xl border border-emerald/5 overflow-hidden">
          <table className="w-full">
            <thead className="bg-emerald/5">
              <tr className="text-left text-xs font-bold text-emerald-dark uppercase tracking-wider">
                <th className="px-6 py-4">N°</th>
                <th className="px-6 py-4">Nom</th>
                <th className="px-6 py-4 hidden md:table-cell">Surnom</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {list.map((p) => (
                <tr key={p.id} className="border-t border-emerald/5 hover:bg-cream/50">
                  <td className="px-6 py-4 text-emerald font-bold">{p.ordre}</td>
                  <td className="px-6 py-4">
                    <div className="font-semibold text-emerald-dark text-sm">{p.nom_fr}</div>
                    <div className="text-xs text-gray-400 font-amiri" dir="rtl">{p.nom_ar}</div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600 hidden md:table-cell">{p.surnom_fr || "—"}</td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-2">
                      <button onClick={() => setEditing(p)}
                        className="px-3 py-1.5 rounded-lg bg-emerald/10 text-emerald text-xs font-semibold hover:bg-emerald/20">
                        Modifier
                      </button>
                      <button onClick={() => remove(p.id)}
                        className="px-3 py-1.5 rounded-lg bg-terracotta/10 text-terracotta text-xs font-semibold hover:bg-terracotta/20">
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
        <div className="fixed inset-0 z-[1000] bg-black/60 flex items-start justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl w-full max-w-3xl my-8">
            <div className="sticky top-0 bg-white border-b border-emerald/10 px-6 py-4 flex items-center justify-between rounded-t-3xl">
              <h2 className="font-bold text-emerald-dark">{editing.id ? "Modifier" : "Ajouter"}</h2>
              <button onClick={() => setEditing(null)} className="text-gray-400 hover:text-terracotta text-2xl">×</button>
            </div>

            <div className="p-6 space-y-5">
              <div className="grid grid-cols-2 gap-4">
                <Field label="Nom FR *">
                  <input value={editing.nom_fr}
                    onChange={(e) => setEditing({ ...editing, nom_fr: e.target.value,
                      slug: editing.id ? editing.slug : e.target.value.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") })}
                    className="inp" />
                </Field>
                <Field label="Slug *">
                  <input value={editing.slug}
                    onChange={(e) => setEditing({ ...editing, slug: e.target.value })}
                    className="inp font-mono text-xs" />
                </Field>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <Field label="Nom AR">
                  <input dir="rtl" value={editing.nom_ar}
                    onChange={(e) => setEditing({ ...editing, nom_ar: e.target.value })}
                    className="inp font-amiri" />
                </Field>
                <Field label="Nom EN">
                  <input value={editing.nom_en}
                    onChange={(e) => setEditing({ ...editing, nom_en: e.target.value })}
                    className="inp" />
                </Field>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <Field label="Surnom FR">
                  <input value={editing.surnom_fr}
                    onChange={(e) => setEditing({ ...editing, surnom_fr: e.target.value })}
                    className="inp" />
                </Field>
                <Field label="Surnom AR">
                  <input dir="rtl" value={editing.surnom_ar}
                    onChange={(e) => setEditing({ ...editing, surnom_ar: e.target.value })}
                    className="inp font-amiri" />
                </Field>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <Field label="Époque">
                  <input value={editing.epoque}
                    onChange={(e) => setEditing({ ...editing, epoque: e.target.value })}
                    className="inp" />
                </Field>
                <Field label="Lieu">
                  <input value={editing.lieu}
                    onChange={(e) => setEditing({ ...editing, lieu: e.target.value })}
                    className="inp" />
                </Field>
                <Field label="Ordre">
                  <input type="number" value={editing.ordre}
                    onChange={(e) => setEditing({ ...editing, ordre: Number(e.target.value) })}
                    className="inp" />
                </Field>
              </div>
              <Field label="Peuple">
                <input value={editing.peuple}
                  onChange={(e) => setEditing({ ...editing, peuple: e.target.value })}
                  className="inp" />
              </Field>
              <Field label="Passages Coran (séparés par —)">
                <textarea rows={3} value={editing.passages_coran}
                  onChange={(e) => setEditing({ ...editing, passages_coran: e.target.value })}
                  className="inp font-mono text-xs" />
              </Field>
              <Field label="Hadiths (séparés par —)">
                <textarea rows={3} value={editing.hadiths}
                  onChange={(e) => setEditing({ ...editing, hadiths: e.target.value })}
                  className="inp font-mono text-xs" />
              </Field>
              <Field label="Paroles des savants">
                <textarea rows={4} value={editing.paroles_savants}
                  onChange={(e) => setEditing({ ...editing, paroles_savants: e.target.value })}
                  className="inp" />
              </Field>
            </div>

            <div className="sticky bottom-0 bg-white border-t border-emerald/10 px-6 py-4 flex justify-end gap-3 rounded-b-3xl">
              <button onClick={() => setEditing(null)}
                className="px-6 py-3 rounded-2xl border-2 border-emerald/15 text-emerald-dark font-semibold text-sm">
                Annuler
              </button>
              <button onClick={save} disabled={saving}
                className="px-6 py-3 rounded-2xl bg-emerald text-white font-semibold text-sm disabled:opacity-50 inline-flex items-center gap-2">
                <IconCheck size={16} />{saving ? "Enreg..." : "Enregistrer"}
              </button>
            </div>
          </div>
        </div>
      )}

      <style jsx global>{`
        .inp { width: 100%; padding: 12px 16px; border-radius: 14px; border: 2px solid rgba(13,92,74,0.1); outline: none; font-size: 14px; font-family: inherit; background: white; }
        .inp:focus { border-color: #d4af37; }
      `}</style>
    </main>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-xs font-semibold text-emerald-dark mb-1.5 uppercase tracking-wider">{label}</label>
      {children}
    </div>
  );
}
