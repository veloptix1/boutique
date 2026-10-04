"use client";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { IconParchemin, IconCheck } from "@/components/icons";

type Hadith = {
  id?: string;
  texte_ar: string;
  texte_fr: string;
  texte_en: string;
  source: string;
  rapporteur: string;
  authenticite: string;
  explication_fr: string;
  savant_id: string | null;
  categorie: string;
  ordre: number;
};

type Savant = { id: string; nom_fr: string };

const empty: Hadith = {
  texte_ar: "", texte_fr: "", texte_en: "",
  source: "", rapporteur: "", authenticite: "sahih",
  explication_fr: "", savant_id: null, categorie: "", ordre: 0,
};

export default function AdminHadithsPage() {
  const [list, setList] = useState<Hadith[]>([]);
  const [savants, setSavants] = useState<Savant[]>([]);
  const [editing, setEditing] = useState<Hadith | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [search, setSearch] = useState("");

  const load = async () => {
    const [h, s] = await Promise.all([
      supabase.from("hadiths").select("*").order("created_at", { ascending: false }),
      supabase.from("savants").select("id, nom_fr").order("nom_fr"),
    ]);
    setList(h.data || []);
    setSavants(s.data || []);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const save = async () => {
    if (!editing) return;
    if (!editing.texte_ar) {
      alert("Le texte arabe est obligatoire");
      return;
    }
    setSaving(true);
    const payload: any = { ...editing };
    if (!payload.id) delete payload.id;
    if (!payload.savant_id) payload.savant_id = null;

    const { error } = editing.id
      ? await supabase.from("hadiths").update(payload).eq("id", editing.id)
      : await supabase.from("hadiths").insert(payload);

    setSaving(false);
    if (error) { alert("Erreur : " + error.message); return; }
    setEditing(null);
    load();
  };

  const remove = async (id?: string) => {
    if (!id || !confirm("Supprimer ce hadith ?")) return;
    await supabase.from("hadiths").delete().eq("id", id);
    load();
  };

  const authColor = (a: string) => {
    if (a === "sahih") return "bg-emerald/10 text-emerald";
    if (a === "hasan") return "bg-gold/15 text-gold";
    return "bg-terracotta/10 text-terracotta";
  };

  const filtered = list.filter((h) =>
    h.texte_fr?.toLowerCase().includes(search.toLowerCase()) ||
    h.texte_ar?.includes(search)
  );

  return (
    <main className="p-6 lg:p-12 max-w-[1400px] mx-auto">
      <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
        <div>
          <div className="text-xs font-bold text-gold uppercase tracking-[3px] mb-2">
            Contenu
          </div>
          <h1 className="font-amiri font-bold text-emerald-dark text-3xl">Hadiths</h1>
          <p className="text-gray-500 text-sm">{list.length} hadith(s)</p>
        </div>
        <button onClick={() => setEditing({ ...empty })}
          className="px-6 py-3 rounded-2xl bg-emerald text-white font-semibold text-sm
                     hover:bg-emerald-dark transition shadow-[0_8px_20px_rgba(13,92,74,0.25)]">
          + Ajouter un hadith
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
            <IconParchemin size={28} />
          </div>
          <p className="text-gray-400">Aucun hadith</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filtered.map((h) => (
            <div key={h.id} className="bg-white rounded-3xl p-6 border border-emerald/5
                                       hover:shadow-lg transition">
              <div className="flex items-center justify-between mb-3">
                <span className={`px-3 py-1 rounded-full text-[0.7rem] font-bold uppercase
                  ${authColor(h.authenticite)}`}>
                  {h.authenticite}
                </span>
                <span className="text-xs text-gray-400">{h.source}</span>
              </div>

              <div className="font-amiri text-emerald-dark text-lg mb-3 leading-relaxed"
                   dir="rtl">
                {h.texte_ar.substring(0, 120)}...
              </div>

              {h.texte_fr && (
                <p className="text-sm text-gray-600 mb-4 line-clamp-3">
                  {h.texte_fr}
                </p>
              )}

              <div className="flex justify-end gap-2 pt-3 border-t border-emerald/5">
                <button onClick={() => setEditing(h)}
                  className="px-3 py-1.5 rounded-lg bg-emerald/10 text-emerald
                             text-xs font-semibold hover:bg-emerald/20">
                  Modifier
                </button>
                <button onClick={() => remove(h.id)}
                  className="px-3 py-1.5 rounded-lg bg-terracotta/10 text-terracotta
                             text-xs font-semibold hover:bg-terracotta/20">
                  Suppr.
                </button>
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
                {editing.id ? "Modifier" : "Ajouter"} un hadith
              </h2>
              <button onClick={() => setEditing(null)}
                className="text-gray-400 hover:text-terracotta text-2xl leading-none">×</button>
            </div>

            <div className="p-6 space-y-5">
              <Field label="Texte AR *">
                <textarea rows={4} dir="rtl" value={editing.texte_ar}
                  onChange={(e) => setEditing({ ...editing, texte_ar: e.target.value })}
                  className="inp font-amiri text-lg" />
              </Field>

              <div className="grid grid-cols-2 gap-4">
                <Field label="Traduction FR">
                  <textarea rows={3} value={editing.texte_fr}
                    onChange={(e) => setEditing({ ...editing, texte_fr: e.target.value })}
                    className="inp" />
                </Field>
                <Field label="Traduction EN">
                  <textarea rows={3} value={editing.texte_en}
                    onChange={(e) => setEditing({ ...editing, texte_en: e.target.value })}
                    className="inp" />
                </Field>
              </div>

              <Field label="Explication FR">
                <textarea rows={4} value={editing.explication_fr}
                  onChange={(e) => setEditing({ ...editing, explication_fr: e.target.value })}
                  className="inp" />
              </Field>

              <div className="grid grid-cols-3 gap-4">
                <Field label="Source">
                  <input value={editing.source}
                    onChange={(e) => setEditing({ ...editing, source: e.target.value })}
                    className="inp" placeholder="Sahih al-Bukhari" />
                </Field>
                <Field label="Rapporteur">
                  <input value={editing.rapporteur}
                    onChange={(e) => setEditing({ ...editing, rapporteur: e.target.value })}
                    className="inp" placeholder="Abu Hurayra" />
                </Field>
                <Field label="Authenticité">
                  <select value={editing.authenticite}
                    onChange={(e) => setEditing({ ...editing, authenticite: e.target.value })}
                    className="inp">
                    <option value="sahih">Sahih (authentique)</option>
                    <option value="hasan">Hasan (bon)</option>
                    <option value="daif">Da'if (faible)</option>
                  </select>
                </Field>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <Field label="Savant associé">
                  <select value={editing.savant_id || ""}
                    onChange={(e) => setEditing({ ...editing, savant_id: e.target.value || null })}
                    className="inp">
                    <option value="">— Aucun —</option>
                    {savants.map((s) => (
                      <option key={s.id} value={s.id}>{s.nom_fr}</option>
                    ))}
                  </select>
                </Field>
                <Field label="Catégorie">
                  <input value={editing.categorie}
                    onChange={(e) => setEditing({ ...editing, categorie: e.target.value })}
                    className="inp" placeholder="Croyance" />
                </Field>
                <Field label="Ordre">
                  <input type="number" value={editing.ordre}
                    onChange={(e) => setEditing({ ...editing, ordre: Number(e.target.value) })}
                    className="inp" />
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
              <button onClick={save} disabled={saving}
                className="px-6 py-3 rounded-2xl bg-emerald text-white font-semibold text-sm
                           disabled:opacity-50 inline-flex items-center gap-2">
                <IconCheck size={16} />
                {saving ? "Enreg..." : "Enregistrer"}
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