"use client";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { IconUser, IconCheck, IconCrown, IconStarFull, IconDiploma } from "@/components/icons";

type Savant = {
  id?: string;
  slug: string;
  nom_fr: string;
  nom_ar: string;
  nom_en: string;
  titre_fr: string;
  titre_ar: string;
  titre_en: string;
  bio_fr: string;
  bio_ar: string;
  bio_en: string;
  photo_url: string;
  pays: string;
  naissance: string;
  deces: string;
  categorie: string;
  ordre: number;
};

const empty: Savant = {
  slug: "", nom_fr: "", nom_ar: "", nom_en: "",
  titre_fr: "", titre_ar: "", titre_en: "",
  bio_fr: "", bio_ar: "", bio_en: "",
  photo_url: "", pays: "", naissance: "", deces: "",
  categorie: "classique", ordre: 0,
};

export default function AdminSavantsPage() {
  const [list, setList] = useState<Savant[]>([]);
  const [editing, setEditing] = useState<Savant | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("tous");

  const load = async () => {
    const { data } = await supabase.from("savants").select("*").order("ordre");
    setList(data || []);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const save = async () => {
    if (!editing) return;
    if (!editing.nom_fr || !editing.slug) {
      alert("Nom FR et slug sont obligatoires");
      return;
    }
    setSaving(true);
    const payload = { ...editing };
    if (!payload.id) delete payload.id;

    const { error } = editing.id
      ? await supabase.from("savants").update(payload).eq("id", editing.id)
      : await supabase.from("savants").insert(payload);

    setSaving(false);
    if (error) { alert("Erreur : " + error.message); return; }
    setEditing(null);
    load();
  };

  const remove = async (id?: string) => {
    if (!id || !confirm("Supprimer cet élément ?")) return;
    await supabase.from("savants").delete().eq("id", id);
    load();
  };

  const autoSlug = (nom: string) =>
    nom.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

  const filtered = list
    .filter((s) => filter === "tous" || s.categorie === filter)
    .filter((s) =>
      s.nom_fr.toLowerCase().includes(search.toLowerCase()) ||
      s.nom_ar?.includes(search)
    );

  const getBadge = (cat: string) => {
    if (cat === "classique")
      return { label: "Classique", class: "bg-gold/15 text-gold-deep", Icon: IconCrown };
    if (cat === "contemporain")
      return { label: "Contemporain", class: "bg-emerald/10 text-link", Icon: IconStarFull };
    return { label: "Oustaz", class: "bg-terracotta/10 text-terracotta", Icon: IconDiploma };
  };

  // Stats
  const stats = {
    tous: list.length,
    classique: list.filter(s => s.categorie === "classique").length,
    contemporain: list.filter(s => s.categorie === "contemporain").length,
    oustaz: list.filter(s => s.categorie === "oustaz").length,
  };

  return (
    <main className="p-6 lg:p-12 max-w-[1400px] mx-auto">
      <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="font-amiri font-bold text-heading text-3xl">
            Savants & Oustaz
          </h1>
          <p className="text-muted text-sm">
            {stats.tous} élément(s) enregistré(s)
          </p>
        </div>
        <button onClick={() => setEditing({ ...empty })}
          className="px-6 py-3 rounded-2xl bg-emerald text-white font-semibold text-sm
                     hover:bg-emerald-dark transition">
          + Ajouter
        </button>
      </div>

      {/* Filtres par catégorie */}
      <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
        <button onClick={() => setFilter("tous")}
          className={`px-5 py-2.5 rounded-full text-sm font-semibold whitespace-nowrap transition
            ${filter === "tous"
              ? "bg-emerald text-white"
              : "bg-surface text-heading border border-line"}`}>
          Tous ({stats.tous})
        </button>
        <button onClick={() => setFilter("classique")}
          className={`px-5 py-2.5 rounded-full text-sm font-semibold whitespace-nowrap transition
            ${filter === "classique"
              ? "bg-gold text-emerald-dark"
              : "bg-surface text-heading border border-line"}`}>
          Classiques ({stats.classique})
        </button>
        <button onClick={() => setFilter("contemporain")}
          className={`px-5 py-2.5 rounded-full text-sm font-semibold whitespace-nowrap transition
            ${filter === "contemporain"
              ? "bg-emerald text-white"
              : "bg-surface text-heading border border-line"}`}>
          Contemporains ({stats.contemporain})
        </button>
        <button onClick={() => setFilter("oustaz")}
          className={`px-5 py-2.5 rounded-full text-sm font-semibold whitespace-nowrap transition
            ${filter === "oustaz"
              ? "bg-terracotta text-white"
              : "bg-surface text-heading border border-line"}`}>
          Oustaz ({stats.oustaz})
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
            <IconUser size={28} />
          </div>
          <p className="text-muted">Aucun élément dans cette catégorie</p>
        </div>
      ) : (
        <div className="bg-surface rounded-2xl border border-line overflow-hidden">
          <table className="w-full">
            <thead className="bg-emerald/5">
              <tr className="text-left text-xs font-bold text-heading">
                <th className="px-6 py-4">Nom</th>
                <th className="px-6 py-4 hidden md:table-cell">Titre</th>
                <th className="px-6 py-4 hidden lg:table-cell">Catégorie</th>
                <th className="px-6 py-4 hidden lg:table-cell">Pays</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((s) => {
                const badge = getBadge(s.categorie);
                const BadgeIcon = badge.Icon;
                return (
                  <tr key={s.id} className="border-t border-line hover:bg-cream/50">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-emerald/10 flex items-center justify-center
                                        text-link overflow-hidden shrink-0">
                          {s.photo_url ? (
                            <img loading="lazy" decoding="async" src={s.photo_url} alt="" className="w-full h-full object-cover" />
                          ) : (
                            <IconUser size={18} />
                          )}
                        </div>
                        <div className="min-w-0">
                          <div className="font-semibold text-heading text-sm truncate">
                            {s.nom_fr}
                          </div>
                          <div className="text-xs text-muted truncate">{s.nom_ar}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-ink/80 hidden md:table-cell">
                      {s.titre_fr || "—"}
                    </td>
                    <td className="px-6 py-4 hidden lg:table-cell">
                      <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full
                                       text-xs font-bold ${badge.class}`}>
                        <BadgeIcon size={12} />
                        {badge.label}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-ink/80 hidden lg:table-cell">
                      {s.pays || "—"}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-2">
                        <button onClick={() => setEditing(s)}
                          className="px-3 py-1.5 rounded-lg bg-emerald/10 text-link
                                     text-xs font-semibold hover:bg-emerald/20">
                          Modifier
                        </button>
                        <button onClick={() => remove(s.id)}
                          className="px-3 py-1.5 rounded-lg bg-terracotta/10 text-terracotta
                                     text-xs font-semibold hover:bg-terracotta/20">
                          Suppr.
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal Formulaire */}
      {editing && (
        <div className="fixed inset-0 z-[1000] bg-black/60 flex items-start justify-center
                        p-4 overflow-y-auto">
          <div className="bg-surface rounded-2xl w-full max-w-3xl my-8">
            <div className="sticky top-0 bg-surface border-b border-line px-6 py-4
                            flex items-center justify-between rounded-t-3xl">
              <h2 className="font-bold text-heading">
                {editing.id ? "Modifier" : "Ajouter"}
              </h2>
              <button onClick={() => setEditing(null)}
                className="text-muted hover:text-terracotta text-2xl leading-none">×</button>
            </div>

            <div className="p-6 space-y-5">

              {/* CATÉGORIE EN PREMIER */}
              <div>
                <label className="block text-xs font-semibold text-heading mb-2">
                  Type *
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { value: "classique",    label: "Classique",    Icon: IconCrown,      color: "gold" },
                    { value: "contemporain", label: "Contemporain", Icon: IconStarFull,   color: "emerald" },
                    { value: "oustaz",       label: "Oustaz",       Icon: IconDiploma,    color: "terracotta" },
                  ].map(({ value, label, Icon, color }) => {
                    const active = editing.categorie === value;
                    const activeClass = {
                      gold: "bg-gold text-emerald-dark border-gold",
                      emerald: "bg-emerald text-white border-emerald",
                      terracotta: "bg-terracotta text-white border-terracotta",
                    }[color];
                    return (
                      <button key={value} type="button"
                        onClick={() => setEditing({ ...editing, categorie: value })}
                        className={`px-4 py-3 rounded-xl border text-sm font-semibold
                                    flex flex-col items-center gap-1.5 transition
                          ${active ? activeClass : "bg-surface text-muted border-line hover:border-emerald/30"}`}>
                        <Icon size={18} />
                        {label}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <Field label="Nom FR *">
                  <input value={editing.nom_fr}
                    onChange={(e) => {
                      const v = e.target.value;
                      setEditing({
                        ...editing, nom_fr: v,
                        slug: editing.id ? editing.slug : autoSlug(v),
                      });
                    }}
                    className="field" />
                </Field>
                <Field label="Slug *">
                  <input value={editing.slug}
                    onChange={(e) => setEditing({ ...editing, slug: e.target.value })}
                    className="field font-mono" />
                </Field>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <Field label="Nom AR">
                  <input dir="rtl" value={editing.nom_ar}
                    onChange={(e) => setEditing({ ...editing, nom_ar: e.target.value })}
                    className="field font-amiri" />
                </Field>
                <Field label="Nom EN">
                  <input value={editing.nom_en}
                    onChange={(e) => setEditing({ ...editing, nom_en: e.target.value })}
                    className="field" />
                </Field>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <Field label="Titre FR">
                  <input value={editing.titre_fr}
                    onChange={(e) => setEditing({ ...editing, titre_fr: e.target.value })}
                    className="field" />
                </Field>
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

              <Field label="Bio FR">
                <textarea rows={3} value={editing.bio_fr}
                  onChange={(e) => setEditing({ ...editing, bio_fr: e.target.value })}
                  className="field" />
              </Field>

              <Field label="Bio AR">
                <textarea rows={3} dir="rtl" value={editing.bio_ar}
                  onChange={(e) => setEditing({ ...editing, bio_ar: e.target.value })}
                  className="field font-amiri" />
              </Field>

              <Field label="Bio EN">
                <textarea rows={3} value={editing.bio_en}
                  onChange={(e) => setEditing({ ...editing, bio_en: e.target.value })}
                  className="field" />
              </Field>

              <Field label="URL Photo">
                <input value={editing.photo_url}
                  onChange={(e) => setEditing({ ...editing, photo_url: e.target.value })}
                  className="field" placeholder="https://..." />
              </Field>

              <div className="grid grid-cols-4 gap-4">
                <Field label="Pays">
                  <input value={editing.pays}
                    onChange={(e) => setEditing({ ...editing, pays: e.target.value })}
                    className="field" />
                </Field>
                <Field label="Naissance">
                  <input value={editing.naissance}
                    onChange={(e) => setEditing({ ...editing, naissance: e.target.value })}
                    className="field" />
                </Field>
                <Field label="Décès">
                  <input value={editing.deces}
                    onChange={(e) => setEditing({ ...editing, deces: e.target.value })}
                    className="field" />
                </Field>
                <Field label="Ordre">
                  <input type="number" value={editing.ordre}
                    onChange={(e) => setEditing({ ...editing, ordre: Number(e.target.value) })}
                    className="field" />
                </Field>
              </div>
            </div>

            <div className="sticky bottom-0 bg-surface border-t border-line px-6 py-4
                            flex justify-end gap-3 rounded-b-3xl">
              <button onClick={() => setEditing(null)}
                className="px-6 py-3 rounded-2xl border border-line
                           text-heading font-semibold text-sm">
                Annuler
              </button>
              <button onClick={save} disabled={saving}
                className="px-6 py-3 rounded-2xl bg-emerald text-white font-semibold text-sm
                           disabled:opacity-50 inline-flex items-center gap-2">
                <IconCheck size={16} />
                {saving ? "Enregistrement..." : "Enregistrer"}
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