"use client";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

type Profile = {
  id: string;
  email: string;
  nom: string | null;
  role: string;
  created_at: string;
};

export default function AdminUsersPage() {
  const [users, setUsers] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    const { data } = await supabase
      .from("profiles").select("*").order("created_at", { ascending: false });
    setUsers(data || []);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const toggleRole = async (u: Profile) => {
    const { data: { user: me } } = await supabase.auth.getUser();
    if (me?.id === u.id) { alert("Vous ne pouvez pas modifier votre propre rôle."); return; }
    const newRole = u.role === "admin" ? "user" : "admin";
    if (!confirm(`Passer ${u.email} en ${newRole} ?`)) return;
    const { error } = await supabase.from("profiles").update({ role: newRole }).eq("id", u.id);
    if (error) { alert("Action refusée."); return; }
    load();
  };

  return (
    <main className="p-6 lg:p-12 max-w-[1400px] mx-auto">
      <div className="mb-8">
        <h1 className="font-amiri font-bold text-heading text-3xl">
          Utilisateurs
        </h1>
        <p className="text-muted text-sm">{users.length} inscrit(s)</p>
      </div>

      {loading ? (
        <p className="text-muted">Chargement…</p>
      ) : (
        <>
          {/* Mobile : une carte par utilisateur */}
          <ul className="space-y-3 md:hidden">
            {users.map((u) => (
              <li key={u.id} className="card p-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="truncate font-semibold text-heading">{u.nom || "Sans nom"}</p>
                    <p className="truncate text-sm text-muted">{u.email}</p>
                    <p className="mt-1 text-xs text-muted">Inscrit le {new Date(u.created_at).toLocaleDateString("fr-FR")}</p>
                  </div>
                  <span className={`badge shrink-0 ${u.role === "admin" ? "bg-gold/25 text-gold-deep" : "bg-emerald/10 text-link"}`}>
                    {u.role === "admin" ? "Admin" : "Membre"}
                  </span>
                </div>
                <button onClick={() => toggleRole(u)} className="btn-secondary btn-sm mt-3 w-full">
                  {u.role === "admin" ? "Retirer les droits admin" : "Nommer administrateur"}
                </button>
              </li>
            ))}
          </ul>

          {/* Tablette et ordinateur : tableau */}
          <div className="card hidden overflow-hidden md:block">
            <table className="w-full">
              <thead className="bg-emerald/5">
                <tr className="text-left text-sm font-semibold text-heading">
                  <th className="px-6 py-4">Utilisateur</th>
                  <th className="px-6 py-4">Inscrit le</th>
                  <th className="px-6 py-4">Rôle</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((u) => (
                  <tr key={u.id} className="border-t border-line">
                    <td className="px-6 py-4">
                      <div className="font-semibold text-heading text-sm">{u.nom || "Sans nom"}</div>
                      <div className="text-xs text-muted">{u.email}</div>
                    </td>
                    <td className="px-6 py-4 text-sm text-ink/80">{new Date(u.created_at).toLocaleDateString("fr-FR")}</td>
                    <td className="px-6 py-4">
                      <span className={`badge ${u.role === "admin" ? "bg-gold/25 text-gold-deep" : "bg-emerald/10 text-link"}`}>
                        {u.role === "admin" ? "Admin" : "Membre"}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button onClick={() => toggleRole(u)} className="btn-secondary btn-sm">
                        {u.role === "admin" ? "Retirer admin" : "Nommer admin"}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </main>
  );
}