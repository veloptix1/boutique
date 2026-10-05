"use client";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { IconCheck } from "@/components/icons";

type Video = any;
type Savant = { id: string; nom_fr: string };

const empty: Video = {
  titre: "",
  description: "",
  youtube_url: "",
  youtube_video_id: "",
  savant_id: null,
  categorie: "",
  duree: null,
  ordre: 0,
};

// Extraire l'ID YouTube depuis une URL
function extractYouTubeId(url: string): string {
  if (!url) return "";
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([a-zA-Z0-9_-]{11})/,
    /^([a-zA-Z0-9_-]{11})$/,
  ];
  for (const p of patterns) {
    const m = url.match(p);
    if (m) return m[1];
  }
  return "";
}

export default function AdminLivePage() {
  const [list, setList] = useState<Video[]>([]);
  const [savants, setSavants] = useState<Savant[]>([]);
  const [editing, setEditing] = useState<Video | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const load = async () => {
    const [v, s] = await Promise.all([
      supabase.from("videos").select("*").order("ordre").order("created_at", { ascending: false }),
      supabase.from("savants").select("id, nom_fr").order("nom_fr"),
    ]);
    setList(v.data || []);
    setSavants(s.data || []);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const save = async () => {
    if (!editing) return;
    if (!editing.titre || !editing.youtube_url) {
      alert("Titre et URL YouTube sont obligatoires");
      return;
    }

    const videoId = extractYouTubeId(editing.youtube_url);
    if (!videoId) {
      alert("URL YouTube invalide. Exemple : https://youtube.com/watch?v=XXXXXXXXXXX");
      return;
    }

    setSaving(true);
    const payload: any = { ...editing, youtube_video_id: videoId };
    if (!payload.id) delete payload.id;
    if (!payload.savant_id) payload.savant_id = null;

    const { error } = editing.id
      ? await supabase.from("videos").update(payload).eq("id", editing.id)
      : await supabase.from("videos").insert(payload);

    setSaving(false);
    if (error) { alert("Erreur : " + error.message); return; }
    setEditing(null);
    load();
  };

  const remove = async (id?: string) => {
    if (!id || !confirm("Supprimer cette vidéo ?")) return;
    await supabase.from("videos").delete().eq("id", id);
    load();
  };

  const getSavantNom = (id: string | null) =>
    savants.find((s) => s.id === id)?.nom_fr || "—";

  return (
    <main className="p-6 lg:p-12 max-w-[1400px] mx-auto">
      <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
        <div>
          <div className="text-xs font-bold text-terracotta uppercase tracking-[3px] mb-2">
            Contenu
          </div>
          <h1 className="font-amiri font-bold text-emerald-dark text-3xl">
            Vidéos
          </h1>
          <p className="text-gray-500 text-sm">{list.length} vidéo(s)</p>
        </div>
        <button onClick={() => setEditing({ ...empty })}
          className="px-6 py-3 rounded-2xl bg-emerald text-white font-semibold text-sm
                     hover:bg-emerald-dark transition shadow-[0_8px_20px_rgba(13,92,74,0.25)]">
          + Ajouter une vidéo
        </button>
      </div>

      {loading ? (
        <p className="text-gray-400">Chargement...</p>
      ) : list.length === 0 ? (
        <div className="bg-white rounded-3xl p-16 text-center border border-emerald/5">
          <p className="text-gray-400">Aucune vidéo</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {list.map((v) => (
            <div key={v.id} className="bg-white rounded-3xl overflow-hidden border border-emerald/5">
              <div className="aspect-video bg-black">
                <img src={`https://img.youtube.com/vi/${v.youtube_video_id}/hqdefault.jpg`}
                  alt={v.titre}
                  className="w-full h-full object-cover" />
              </div>
              <div className="p-4">
                <div className="font-bold text-emerald-dark text-sm mb-1 line-clamp-2">
                  {v.titre}
                </div>
                <div className="text-xs text-gray-500 mb-1">{getSavantNom(v.savant_id)}</div>
                {v.categorie && (
                  <div className="inline-block px-2 py-0.5 rounded-full bg-gold/15
                                  text-gold text-[0.65rem] font-bold mb-3">
                    {v.categorie}
                  </div>
                )}
                <div className="flex gap-2 mt-3">
                  <button onClick={() => setEditing(v)}
                    className="flex-1 px-3 py-2 rounded-lg bg-emerald/10 text-emerald
                               text-xs font-semibold hover:bg-emerald/20">
                    Modifier
                  </button>
                  <button onClick={() => remove(v.id)}
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
                {editing.id ? "Modifier" : "Ajouter"} une vidéo
              </h2>
              <button onClick={() => setEditing(null)}
                className="text-gray-400 hover:text-terracotta text-2xl leading-none">×</button>
            </div>

            <div className="p-6 space-y-5">
              <Field label="Titre *">
                <input value={editing.titre}
                  onChange={(e) => setEditing({ ...editing, titre: e.target.value })}
                  className="inp" />
              </Field>

              <Field label="URL YouTube *">
                <input value={editing.youtube_url}
                  onChange={(e) => setEditing({ ...editing, youtube_url: e.target.value })}
                  className="inp font-mono text-xs"
                  placeholder="https://youtube.com/watch?v=XXXXXXXXXXX" />
              </Field>

              <Field label="Description">
                <textarea rows={3} value={editing.description || ""}
                  onChange={(e) => setEditing({ ...editing, description: e.target.value })}
                  className="inp" />
              </Field>

              <div className="grid grid-cols-2 gap-4">
                <Field label="Savant">
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
                  <input value={editing.categorie || ""}
                    onChange={(e) => setEditing({ ...editing, categorie: e.target.value })}
                    className="inp" placeholder="Croyance, Prière..." />
                </Field>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <Field label="Durée (minutes)">
                  <input type="number" value={editing.duree || ""}
                    onChange={(e) => setEditing({ ...editing, duree: Number(e.target.value) || null })}
                    className="inp" />
                </Field>
                <Field label="Ordre">
                  <input type="number" value={editing.ordre || 0}
                    onChange={(e) => setEditing({ ...editing, ordre: Number(e.target.value) })}
                    className="inp" />
                </Field>
              </div>

              {editing.youtube_url && extractYouTubeId(editing.youtube_url) && (
                <div className="bg-cream rounded-2xl p-4">
                  <div className="text-xs font-bold text-gold uppercase tracking-wider mb-2">
                    Aperçu
                  </div>
                  <div className="aspect-video bg-black rounded-xl overflow-hidden">
                    <img src={`https://img.youtube.com/vi/${extractYouTubeId(editing.youtube_url)}/hqdefault.jpg`}
                      alt="Aperçu"
                      className="w-full h-full object-cover" />
                  </div>
                </div>
              )}
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
