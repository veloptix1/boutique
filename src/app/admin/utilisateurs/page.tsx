"use client";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { IconUser } from "@/components/icons";

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
    const newRole = u.role === "admin" ? "user" : "admin";
    if (!confirm(`Passer ${u.email} en ${newRole} ?`)) return;
    await supabase.from("profiles").update({ role: newRole }).eq("id", u.id);
    load();
  };

  return (
    <main className="p-6 lg:p-12 max-w-[1400px] mx-auto">
      <div className="mb-8">
        <div className="text-xs font-bold text-gold uppercase tracking-[3px] mb-2">
          Utilisateurs
        </div>
        <h1 className="font-amiri font-bold text-emerald-dark text-3xl">
          Utilisateurs
        </h1>
        <p className="text-gray-500 text-sm">{users.length} inscrit(s)</p>
      </div>

      {loading ? (
        <p className="text-gray-400">Chargement...</p>
      ) : (
        <div className="bg-white rounded-3xl border border-emerald/5 overflow-hidden">
          <table className="w-full">
            <thead className="bg-emerald/5">
              <tr className="text-left text-xs font-bold text-emerald-dark uppercase tracking-wider">
                <th className="px-6 py-4">Utilisateur</th>
                <th className="px-6 py-4 hidden md:table-cell">Inscrit le</th>
                <th className="px-6 py-4">Rôle</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u.id} className="border-t border-emerald/5 hover:bg-cream/50">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-emerald/10 flex items-center justify-center text-emerald">
                        <IconUser size={16} />
                      </div>
                      <div>
                        <div className="font-semibold text-emerald-dark text-sm">
                          {u.nom || "Sans nom"}
                        </div>
                        <div className="text-xs text-gray-400">{u.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600 hidden md:table-cell">
                    {new Date(u.created_at).toLocaleDateString("fr-FR")}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-[0.7rem] font-bold uppercase
                      ${u.role === "admin"
                        ? "bg-gold/15 text-gold"
                        : "bg-emerald/10 text-emerald"}`}>
                      {u.role}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button onClick={() => toggleRole(u)}
                      className="px-3 py-1.5 rounded-lg bg-emerald/10 text-emerald
                                 text-xs font-semibold hover:bg-emerald/20">
                      {u.role === "admin" ? "Retirer admin" : "Nommer admin"}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </main>
  );
}