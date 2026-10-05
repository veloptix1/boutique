"use client";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { IconCheck } from "@/components/icons";

export default function AdminSupportPage() {
  const [tickets, setTickets] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<any>(null);

  const load = async () => {
    const { data } = await supabase
      .from("support_tickets").select("*").order("created_at", { ascending: false });
    setTickets(data || []);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const repondre = async () => {
    if (!editing) return;
    const { error } = await supabase
      .from("support_tickets")
      .update({
        reponse_admin: editing.reponse_admin,
        statut: editing.statut,
        updated_at: new Date().toISOString(),
      })
      .eq("id", editing.id);
    if (error) { alert("Erreur : " + error.message); return; }
    setEditing(null);
    load();
  };

  const statutBadge = (s: string) => {
    if (s === "resolu") return "bg-emerald/10 text-emerald";
    if (s === "en_cours") return "bg-gold/15 text-gold";
    if (s === "ferme") return "bg-gray-200 text-gray-500";
    return "bg-terracotta/10 text-terracotta";
  };

  const stats = {
    total: tickets.length,
    ouvert: tickets.filter(t => t.statut === "ouvert").length,
    en_cours: tickets.filter(t => t.statut === "en_cours").length,
    resolu: tickets.filter(t => t.statut === "resolu").length,
  };

  return (
    <main className="p-6 lg:p-12 max-w-[1400px] mx-auto">
      <div className="mb-8">
        <div className="text-xs font-bold text-gold uppercase tracking-[3px] mb-2">
          Support
        </div>
        <h1 className="font-amiri font-bold text-emerald-dark text-3xl">
          Tickets de support
        </h1>
        <p className="text-gray-500 text-sm">{tickets.length} ticket(s)</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4 mb-8">
        <div className="bg-white rounded-2xl p-4 border border-emerald/5">
          <div className="text-xs font-bold text-gray-400 uppercase mb-1">Total</div>
          <div className="font-amiri font-bold text-emerald-dark text-2xl">{stats.total}</div>
        </div>
        <div className="bg-white rounded-2xl p-4 border border-emerald/5">
          <div className="text-xs font-bold text-terracotta uppercase mb-1">Ouverts</div>
          <div className="font-amiri font-bold text-terracotta text-2xl">{stats.ouvert}</div>
        </div>
        <div className="bg-white rounded-2xl p-4 border border-emerald/5">
          <div className="text-xs font-bold text-gold uppercase mb-1">En cours</div>
          <div className="font-amiri font-bold text-gold text-2xl">{stats.en_cours}</div>
        </div>
        <div className="bg-white rounded-2xl p-4 border border-emerald/5">
          <div className="text-xs font-bold text-emerald uppercase mb-1">Résolus</div>
          <div className="font-amiri font-bold text-emerald text-2xl">{stats.resolu}</div>
        </div>
      </div>

      {loading ? (
        <p className="text-gray-400">Chargement...</p>
      ) : tickets.length === 0 ? (
        <div className="bg-white rounded-3xl p-16 text-center border border-emerald/5">
          <p className="text-gray-400">Aucun ticket</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {tickets.map((t) => (
            <div key={t.id} className="bg-white rounded-3xl p-6 border border-emerald/5
                                       hover:border-emerald/15 transition">
              <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
                <div>
                  <div className="font-bold text-emerald-dark text-base">{t.sujet}</div>
                  <div className="text-xs text-gray-500 mt-0.5">
                    {t.user_nom} — {t.user_email}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`px-3 py-1 rounded-full text-[0.65rem] font-bold uppercase
                    ${statutBadge(t.statut)}`}>
                    {t.statut.replace("_", " ")}
                  </span>
                  <button onClick={() => setEditing(t)}
                    className="px-4 py-1.5 rounded-lg bg-emerald text-white text-xs font-semibold
                               hover:bg-emerald-dark transition">
                    Répondre
                  </button>
                </div>
              </div>

              <p className="text-sm text-gray-600 mb-3">{t.message}</p>

              <div className="text-xs text-gray-400">
                {new Date(t.created_at).toLocaleDateString("fr-FR", {
                  day: "numeric", month: "long", year: "numeric",
                  hour: "2-digit", minute: "2-digit",
                })}
              </div>

              {t.reponse_admin && (
                <div className="mt-4 pt-4 border-t border-emerald/10 bg-cream rounded-2xl p-4">
                  <div className="text-xs font-bold text-gold uppercase tracking-wider mb-2">
                    Votre réponse
                  </div>
                  <p className="text-sm text-gray-700">{t.reponse_admin}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {editing && (
        <div className="fixed inset-0 z-[1000] bg-black/60 flex items-start justify-center
                        p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl w-full max-w-2xl my-8">
            <div className="px-6 py-4 border-b border-emerald/10 flex items-center justify-between">
              <h2 className="font-bold text-emerald-dark">Répondre au ticket</h2>
              <button onClick={() => setEditing(null)}
                className="text-gray-400 hover:text-terracotta text-2xl leading-none">×</button>
            </div>

            <div className="p-6 space-y-5">
              <div className="bg-cream rounded-2xl p-4">
                <div className="text-xs font-bold text-gold uppercase tracking-wider mb-2">
                  Message de l'utilisateur
                </div>
                <div className="font-bold text-emerald-dark text-sm mb-1">{editing.sujet}</div>
                <p className="text-sm text-gray-600">{editing.message}</p>
              </div>

              <Field label="Statut">
                <select value={editing.statut}
                  onChange={(e) => setEditing({ ...editing, statut: e.target.value })}
                  className="inp">
                  <option value="ouvert">Ouvert</option>
                  <option value="en_cours">En cours</option>
                  <option value="resolu">Résolu</option>
                  <option value="ferme">Fermé</option>
                </select>
              </Field>

              <Field label="Votre réponse">
                <textarea rows={5} value={editing.reponse_admin || ""}
                  onChange={(e) => setEditing({ ...editing, reponse_admin: e.target.value })}
                  className="inp" />
              </Field>
            </div>

            <div className="px-6 py-4 border-t border-emerald/10 flex justify-end gap-3">
              <button onClick={() => setEditing(null)}
                className="px-6 py-3 rounded-2xl border-2 border-emerald/15
                           text-emerald-dark font-semibold text-sm">
                Annuler
              </button>
              <button onClick={repondre}
                className="px-6 py-3 rounded-2xl bg-emerald text-white font-semibold text-sm
                           inline-flex items-center gap-2">
                <IconCheck size={16} />
                Envoyer la réponse
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
