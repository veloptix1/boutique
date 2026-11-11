"use client";
import { EndMark } from "@/components/PageHeader";
import { useEffect, useState } from "react";
import Link from "next/link";
import { BackLink, PageHeader } from "@/components/ui";
import { supabase } from "@/lib/supabase";
import { clamp } from "@/lib/security";
import { IconCheck } from "@/components/icons";

type Ticket = {
  id: string;
  sujet: string;
  message: string;
  statut: string;
  reponse_admin: string | null;
  created_at: string;
};

const reseaux = [
  {
    nom: "YouTube",
    url: "https://www.youtube.com/@albasirah1",
    color: "#ff0000",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
        <path d="M23.5 6.2a3 3 0 00-2.1-2.1C19.5 3.6 12 3.6 12 3.6s-7.5 0-9.4.5A3 3 0 00.5 6.2C0 8.1 0 12 0 12s0 3.9.5 5.8a3 3 0 002.1 2.1c1.9.5 9.4.5 9.4.5s7.5 0 9.4-.5a3 3 0 002.1-2.1C24 15.9 24 12 24 12s0-3.9-.5-5.8zM9.6 15.6V8.4L15.8 12z"/>
      </svg>
    ),
  },
  {
    nom: "TikTok",
    url: "https://tiktok.com/@albasirah2",
    color: "#000000",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
        <path d="M19.6 6.7a5.4 5.4 0 01-3.7-1.5 5.4 5.4 0 01-1.4-2.8h-3.6v13.2a3 3 0 11-3-3c.3 0 .6 0 .9.1v-3.7a6.7 6.7 0 00-.9-.1 6.7 6.7 0 106.7 6.7V9.9a9 9 0 005 1.5V7.7c-.3 0-.7-.1-1-.3z"/>
      </svg>
    ),
  },
  {
    nom: "Facebook",
    url: "https://facebook.com/albasirah",
    color: "#1877f2",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
        <path d="M24 12.07C24 5.4 18.63 0 12 0S0 5.4 0 12.07C0 18.1 4.39 23.1 10.13 24v-8.44H7.08v-3.49h3.05V9.41c0-3.02 1.79-4.69 4.53-4.69 1.31 0 2.68.24 2.68.24v2.97h-1.51c-1.49 0-1.96.93-1.96 1.89v2.25h3.33l-.53 3.49h-2.8V24C19.61 23.1 24 18.1 24 12.07z"/>
      </svg>
    ),
  },
];

export default function SupportClient() {
  const [user, setUser] = useState<any>(null);
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [sujet, setSujet] = useState("");
  const [message, setMessage] = useState("");
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    (async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
      if (user) {
        const { data } = await supabase
          .from("support_tickets")
          .select("*")
          .eq("user_id", user.id)
          .order("created_at", { ascending: false });
        setTickets(data || []);
      }
      setLoading(false);
    })();
  }, []);

  const envoyerTicket = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      window.location.href = "/auth";
      return;
    }
    if (!sujet.trim() || !message.trim()) {
      alert("Sujet et message sont obligatoires");
      return;
    }
    setSending(true);

    const { data: profile } = await supabase
      .from("profiles").select("nom").eq("id", user.id).single();

    const { error } = await supabase.from("support_tickets").insert({
      user_id: user.id,
      user_email: user.email,
      user_nom: profile?.nom || "Utilisateur",
      sujet: clamp(sujet, 120),
      message: clamp(message, 2000),
    });

    setSending(false);
    if (error) { alert("Erreur : " + error.message); return; }

    setSujet("");
    setMessage("");
    setShowForm(false);
    setSuccess(true);
    setTimeout(() => setSuccess(false), 5000);

    const { data } = await supabase
      .from("support_tickets").select("*").eq("user_id", user.id)
      .order("created_at", { ascending: false });
    setTickets(data || []);
  };

  const statutBadge = (s: string) => {
    if (s === "resolu") return "bg-emerald/10 text-link";
    if (s === "en_cours") return "bg-gold/15 text-gold-deep";
    if (s === "ferme") return "bg-emerald/15 text-muted";
    return "bg-terracotta/10 text-terracotta";
  };

  const statutLabel = (s: string) => {
    if (s === "resolu") return "Résolu";
    if (s === "en_cours") return "En cours";
    if (s === "ferme") return "Fermé";
    return "Ouvert";
  };

  return (
    <main className="page max-w-[900px]">

      <BackLink href="/dashboard" label="Retour" />


      <PageHeader title="Support" subtitle="Suivez-nous sur nos réseaux et contactez-nous pour toute question." />

      <div className="mb-12">
        <h2 className="font-amiri font-bold text-heading text-2xl mb-5">Suivez-nous</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {reseaux.map((r) => (
            <a key={r.nom} href={r.url} target="_blank" rel="noopener noreferrer"
              className="bg-surface rounded-2xl p-6 flex flex-col items-center
                         border border-line
                         transition-all no-underline group">
              <div className="w-14 h-14 rounded-2xl flex items-center justify-center mb-4 transition"
                   style={{ backgroundColor: r.color, color: "#fff" }}>
                {r.icon}
              </div>
              <div className="font-bold text-heading text-sm">{r.nom}</div>
              <div className="text-xs text-muted mt-1 truncate max-w-full">
                {r.url.replace(/^https?:\/\//, "")}
              </div>
            </a>
          ))}
        </div>
      </div>

      <div className="mb-12">
        <h2 className="font-amiri font-bold text-heading text-2xl mb-5">
          Contacter le support
        </h2>

        {!user ? (
          <div className="bg-surface rounded-2xl p-8 text-center border border-line">
            <p className="text-muted mb-4">Connectez-vous pour nous envoyer un message.</p>
            <Link href="/auth"
              className="inline-block px-6 py-3 rounded-2xl bg-emerald text-white
                         font-semibold text-sm hover:bg-emerald-dark transition">
              Se connecter
            </Link>
          </div>
        ) : !showForm ? (
          <button onClick={() => setShowForm(true)}
            className="w-full bg-surface rounded-2xl p-6 border border-dashed border-emerald/20
                       hover:border-emerald/40 transition flex items-center justify-center gap-3
                       text-heading font-semibold">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none"
                 stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <path d="M12 5v14M5 12h14"/>
            </svg>
            Ouvrir un nouveau ticket
          </button>
        ) : (
          <form onSubmit={envoyerTicket}
            className="bg-surface rounded-2xl p-6 sm:p-8 border border-line">
            <div className="mb-4">
              <label className="block text-xs font-semibold text-heading mb-2">Sujet *</label>
              <input type="text" value={sujet} onChange={(e) => setSujet(e.target.value)}
                placeholder="Ex : Problème d'audio, Question..." required
                className="field" />
            </div>
            <div className="mb-5">
              <label className="block text-xs font-semibold text-heading mb-2">Message *</label>
              <textarea value={message} onChange={(e) => setMessage(e.target.value)} rows={5}
                placeholder="Décrivez votre demande..." required
                className="field resize-none" />
            </div>
            <div className="flex gap-3">
              <button type="button" onClick={() => setShowForm(false)}
                className="px-6 py-3 rounded-2xl border border-line text-heading font-semibold text-sm">Annuler</button>
              <button type="submit" disabled={sending}
                className="flex-1 px-6 py-3 rounded-2xl bg-emerald text-white font-semibold text-sm hover:bg-emerald-dark transition disabled:opacity-50 inline-flex items-center justify-center gap-2">
                <IconCheck size={16} />{sending ? "Envoi..." : "Envoyer le ticket"}
              </button>
            </div>
          </form>
        )}

        {success && (
          <div className="mt-4 p-4 rounded-2xl bg-emerald/10 border border-emerald/20 text-heading text-sm font-semibold text-center">
            ✅ Votre ticket a été envoyé. Nous vous répondrons bientôt.
          </div>
        )}
      </div>

      {user && tickets.length > 0 && (
        <div>
          <h2 className="font-amiri font-bold text-heading text-2xl mb-5">
            Mes tickets ({tickets.length})
          </h2>
          <div className="grid gap-4">
            {tickets.map((t) => (
              <div key={t.id} className="bg-surface rounded-2xl p-6 border border-line">
                <div className="flex items-center justify-between mb-3 flex-wrap gap-2">
                  <div className="font-bold text-heading text-sm">{t.sujet}</div>
                  <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${statutBadge(t.statut)}`}>
                    {statutLabel(t.statut)}
                  </span>
                </div>
                <p className="text-sm text-ink/80 mb-3">{t.message}</p>
                <div className="text-xs text-muted">
                  {new Date(t.created_at).toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" })}
                </div>
                {t.reponse_admin && (
                  <div className="mt-4 pt-4 border-t border-line">
                    <div className="text-xs font-bold text-gold mb-2">Réponse du support</div>
                    <p className="text-sm text-ink bg-cream p-3 rounded-xl">{t.reponse_admin}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
      <EndMark />
    </main>
  );
}
