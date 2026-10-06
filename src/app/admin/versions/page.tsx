"use client";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { IconCheck } from "@/components/icons";

const empty: any = {
  platform: "android",
  version: "",
  version_code: 0,
  download_url: "",
  taille: "",
  release_notes: "",
  obligatoire: false,
  actif: true,
};

export default function AdminVersionsPage() {
  const [list, setList] = useState<any[]>([]);
  const [editing, setEditing] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const load = async () => {
    const { data } = await supabase
      .from("app_versions")
      .select("*")
      .order("platform")
      .order("version_code", { ascending: false });
    setList(data || []);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const save = async () => {
    if (!editing) return;
    if (!editing.version || !editing.download_url || !editing.version_code) {
      alert("Version, code de version et URL sont obligatoires");
      return;
    }
    setSaving(true);
    const payload = { ...editing };
    if (!payload.id) delete payload.id;

    const { error } = editing.id
      ? await supabase.from("app_versions").update(payload).eq("id", editing.id)
      : await supabase.from("app_versions").insert(payload);

    setSaving(false);
    if (error) { alert(error.message); return; }
    setEditing(null);
    load();
  };

  const remove = async (id: string) => {
    if (!confirm("Supprimer cette version ?")) return;
    await supabase.from("app_versions").delete().eq("id", id);
    load();
  };

  const toggleActif = async (v: any) => {
    await supabase.from("app_versions").update({ actif: !v.actif }).eq("id", v.id);
    load();
  };

  const android = list.filter((v) => v.platform === "android");
  const ios = list.filter((v) => v.platform === "ios");

  const lastAndroid = android[0];
  const lastIOS = ios[0];

  return (
    <main className="p-6 lg:p-12 max-w-[1400px] mx-auto">
      <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
        <div>
          <div className="text-xs font-bold text-gold uppercase tracking-[3px] mb-2">
            Application
          </div>
          <h1 className="font-amiri font-bold text-emerald-dark text-3xl">
            Versions de l''application
          </h1>
          <p className="text-gray-500 text-sm">
            Gérez les mises à jour Android et iOS
          </p>
        </div>
        <button onClick={() => setEditing({ ...empty })}
          className="px-6 py-3 rounded-2xl bg-emerald text-white font-semibold text-sm
                     hover:bg-emerald-dark transition shadow-[0_8px_20px_rgba(13,92,74,0.25)]">
          + Publier une version
        </button>
      </div>

      {/* Version actuelle */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 mb-8">
        {/* Android actuel */}
        <div className="bg-white rounded-3xl p-6 border-2 border-emerald/15">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-2xl bg-emerald/10 flex items-center justify-center">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="#0d5c4a">
                <path d="M17.6 9.48l1.84-3.18c.16-.31.04-.69-.26-.85a.637.637 0 00-.83.22l-1.88 3.24a11.463 11.463 0 00-8.94 0L5.65 5.67a.643.643 0 00-.87-.2c-.28.18-.37.54-.22.83L6.4 9.48A10.78 10.78 0 001 18h22a10.78 10.78 0 00-5.4-8.52zM7 15.25a1.25 1.25 0 110-2.5 1.25 1.25 0 010 2.5zm10 0a1.25 1.25 0 110-2.5 1.25 1.25 0 010 2.5z"/>
              </svg>
            </div>
            <div>
              <div className="text-xs font-bold text-gold uppercase tracking-wider">Android</div>
              <div className="font-bold text-emerald-dark text-lg">
                {lastAndroid ? `v${lastAndroid.version}` : "—"}
              </div>
            </div>
          </div>
          {lastAndroid && (
            <>
              <div className="text-xs text-gray-500 mb-1">Code : {lastAndroid.version_code}</div>
              <div className="text-xs text-gray-500 mb-3">{lastAndroid.taille || "Taille non définie"}</div>
              {lastAndroid.release_notes && (
                <p className="text-xs text-gray-600 bg-cream p-3 rounded-xl line-clamp-3">
                  {lastAndroid.release_notes}
                </p>
              )}
            </>
          )}
        </div>

        {/* iOS actuel */}
        <div className="bg-white rounded-3xl p-6 border-2 border-gray-200">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-2xl bg-gray-100 flex items-center justify-center">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="#333">
                <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09l.01-.01zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z"/>
              </svg>
            </div>
            <div>
              <div className="text-xs font-bold text-gold uppercase tracking-wider">iOS</div>
              <div className="font-bold text-emerald-dark text-lg">
                {lastIOS ? `v${lastIOS.version}` : "—"}
              </div>
            </div>
          </div>
          {lastIOS && (
            <>
              <div className="text-xs text-gray-500 mb-1">Code : {lastIOS.version_code}</div>
              <div className="text-xs text-gray-500 mb-3">{lastIOS.taille || "Taille non définie"}</div>
              {lastIOS.release_notes && (
                <p className="text-xs text-gray-600 bg-cream p-3 rounded-xl line-clamp-3">
                  {lastIOS.release_notes}
                </p>
              )}
            </>
          )}
        </div>
      </div>

      {/* Historique */}
      <div className="bg-white rounded-3xl border border-emerald/5 overflow-hidden">
        <div className="px-6 py-4 border-b border-emerald/5">
          <h2 className="font-bold text-emerald-dark">Historique des versions</h2>
        </div>

        {loading ? (
          <p className="p-6 text-gray-400">Chargement...</p>
        ) : list.length === 0 ? (
          <p className="p-12 text-center text-gray-400">Aucune version publiée</p>
        ) : (
          <table className="w-full">
            <thead className="bg-emerald/5">
              <tr className="text-left text-xs font-bold text-emerald-dark uppercase tracking-wider">
                <th className="px-6 py-4">Plateforme</th>
                <th className="px-6 py-4">Version</th>
                <th className="px-6 py-4 hidden md:table-cell">Code</th>
                <th className="px-6 py-4 hidden lg:table-cell">Obligatoire</th>
                <th className="px-6 py-4 hidden lg:table-cell">Actif</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {list.map((v) => (
                <tr key={v.id} className="border-t border-emerald/5 hover:bg-cream/50">
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full
                                     text-xs font-bold
                      ${v.platform === "android"
                        ? "bg-emerald/10 text-emerald"
                        : "bg-gray-200 text-gray-600"}`}>
                      {v.platform === "android" ? "Android" : "iOS"}
                    </span>
                  </td>
                  <td className="px-6 py-4 font-semibold text-emerald-dark text-sm">
                    v{v.version}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600 hidden md:table-cell">
                    {v.version_code}
                  </td>
                  <td className="px-6 py-4 hidden lg:table-cell">
                    {v.obligatoire ? (
                      <span className="px-2.5 py-1 rounded-full bg-terracotta/10 text-terracotta
                                       text-xs font-bold">Oui</span>
                    ) : (
                      <span className="px-2.5 py-1 rounded-full bg-gray-100 text-gray-500
                                       text-xs font-bold">Non</span>
                    )}
                  </td>
                  <td className="px-6 py-4 hidden lg:table-cell">
                    <button onClick={() => toggleActif(v)}
                      className={`px-2.5 py-1 rounded-full text-xs font-bold transition
                        ${v.actif
                          ? "bg-emerald/10 text-emerald hover:bg-emerald/20"
                          : "bg-gray-100 text-gray-400 hover:bg-gray-200"}`}>
                      {v.actif ? "Actif" : "Inactif"}
                    </button>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-2">
                      <button onClick={() => setEditing(v)}
                        className="px-3 py-1.5 rounded-lg bg-emerald/10 text-emerald
                                   text-xs font-semibold hover:bg-emerald/20">
                        Modifier
                      </button>
                      <button onClick={() => remove(v.id)}
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
        )}
      </div>

      {/* Guide */}
      <div className="mt-8 bg-gold/5 rounded-3xl p-6 border border-gold/20">
        <h3 className="font-bold text-emerald-dark text-base mb-3">
          📌 Comment publier une mise à jour ?
        </h3>
        <ol className="space-y-2 text-sm text-gray-600">
          <li>1. Modifiez `CURRENT_VERSION_CODE` dans `components/UpdateChecker.tsx`</li>
          <li>2. Poussez le code → GitHub Actions build un nouvel APK</li>
          <li>3. Cliquez sur « Publier une version » ci-dessus et entrez le nouveau code</li>
          <li>4. Tous les utilisateurs verront le pop-up à leur prochaine ouverture ✅</li>
        </ol>
      </div>

      {/* Modal */}
      {editing && (
        <div className="fixed inset-0 z-[1000] bg-black/60 flex items-start justify-center
                        p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl w-full max-w-2xl my-8">
            <div className="sticky top-0 bg-white border-b border-emerald/10 px-6 py-4
                            flex items-center justify-between rounded-t-3xl">
              <h2 className="font-bold text-emerald-dark">
                {editing.id ? "Modifier" : "Publier"} une version
              </h2>
              <button onClick={() => setEditing(null)}
                className="text-gray-400 hover:text-terracotta text-2xl">×</button>
            </div>

            <div className="p-6 space-y-5">
              <Field label="Plateforme *">
                <div className="grid grid-cols-2 gap-2">
                  {["android", "ios"].map((p) => (
                    <button key={p} type="button"
                      onClick={() => setEditing({ ...editing, platform: p })}
                      className={`px-4 py-3 rounded-xl border-2 text-sm font-semibold transition
                        ${editing.platform === p
                          ? "bg-emerald text-white border-emerald"
                          : "bg-white text-gray-500 border-emerald/10 hover:border-emerald/30"}`}>
                      {p === "android" ? "Android" : "iOS"}
                    </button>
                  ))}
                </div>
              </Field>

              <div className="grid grid-cols-2 gap-4">
                <Field label="Version (ex: 1.0.2) *">
                  <input value={editing.version}
                    onChange={(e) => setEditing({ ...editing, version: e.target.value })}
                    className="inp" placeholder="1.0.0" />
                </Field>
                <Field label="Code de version (ex: 2) *">
                  <input type="number" value={editing.version_code}
                    onChange={(e) => setEditing({ ...editing, version_code: Number(e.target.value) })}
                    className="inp" placeholder="1" />
                </Field>
              </div>

              <Field label="URL de téléchargement *">
                <input value={editing.download_url}
                  onChange={(e) => setEditing({ ...editing, download_url: e.target.value })}
                  className="inp font-mono text-xs"
                  placeholder="https://github.com/veloptix1/boutique/releases/latest" />
              </Field>

              <Field label="Taille (ex: ~50 MB)">
                <input value={editing.taille}
                  onChange={(e) => setEditing({ ...editing, taille: e.target.value })}
                  className="inp" placeholder="~50 MB" />
              </Field>

              <Field label="Nouveautés">
                <textarea rows={4} value={editing.release_notes}
                  onChange={(e) => setEditing({ ...editing, release_notes: e.target.value })}
                  className="inp" placeholder="Ex: Ajout des Prophètes, correction de bugs..." />
              </Field>

              <div className="grid grid-cols-2 gap-4">
                <Field label="Obligatoire">
                  <button type="button"
                    onClick={() => setEditing({ ...editing, obligatoire: !editing.obligatoire })}
                    className={`w-full px-4 py-3 rounded-xl border-2 text-sm font-semibold transition
                      ${editing.obligatoire
                        ? "bg-terracotta text-white border-terracotta"
                        : "bg-white text-gray-500 border-emerald/10"}`}>
                    {editing.obligatoire ? "Oui" : "Non"}
                  </button>
                </Field>
                <Field label="Actif">
                  <button type="button"
                    onClick={() => setEditing({ ...editing, actif: !editing.actif })}
                    className={`w-full px-4 py-3 rounded-xl border-2 text-sm font-semibold transition
                      ${editing.actif
                        ? "bg-emerald text-white border-emerald"
                        : "bg-white text-gray-500 border-emerald/10"}`}>
                    {editing.actif ? "Oui" : "Non"}
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
              <button onClick={save} disabled={saving}
                className="px-6 py-3 rounded-2xl bg-emerald text-white font-semibold text-sm
                           disabled:opacity-50 inline-flex items-center gap-2">
                <IconCheck size={16} />{saving ? "Enreg..." : "Publier"}
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
