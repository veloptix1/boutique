"use client";
import { Bismillah, EndMark } from "@/components/PageHeader";
import { useEffect, useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { IconCheck } from "@/components/icons";
import { Bismillah, EndMark } from "@/components/PageHeader";

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
      sujet,
      message,
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
    if (s === "resolu") return "bg-emerald/10 text-emerald";
    if (s === "en_cours") return "bg-gold/15 text-gold";
    if (s === "ferme") return "bg-gray-200 text-gray-500";
    return "bg-terracotta/10 text-terracotta";
  };

  const statutLabel = (s: string) => {
    if (s === "resolu") return "Résolu";
    if (s === "en_cours") return "En cours";
    if (s === "ferme") return "Fermé";
    return "Ouvert";
  };

  return (
    <main className="px-[6%] pt-24 pb-40 max-w-[900px] mx-auto min-h-screen">

      <Link href="/dashboard" className="text-emerald text-sm font-semibold hover:underline">
        ← Retour
      </Link>

      <div className="mt-8"><Bismillah /></div>

      <div className="mb-10">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-12 h-12 rounded-2xl bg-emerald/10 flex items-center justify-center text-emerald">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none"
                 stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/>
            </svg>
          </div>
          <div className="text-xs font-bold text-gold uppercase tracking-[3px]">
            Aide & Contact
          </div>
        </div>
        <h1 className="font-amiri font-bold text-emerald-dark text-4xl sm:text-5xl mb-3">
          Support
        </h1>
        <p className="text-gray-500 max-w-2xl">
          Suivez-nous sur nos réseaux et contactez-nous pour toute question.
        </p>
      </div>

      <div className="mb-12">
        <h2 className="font-amiri font-bold text-emerald-dark text-2xl mb-5">Suivez-nous</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {reseaux.map((r) => (
            <a key={r.nom} href={r.url} target="_blank" rel="noopener noreferrer"
              className="bg-white rounded-3xl p-6 flex flex-col items-center
                         border border-emerald/5 hover:-translate-y-1
                         hover:shadow-[0_20px_40px_rgba(13,92,74,0.1)]
                         transition-all no-underline group">
              <div className="w-14 h-14 rounded-2xl flex items-center justify-center mb-4
                              group-hover:scale-110 transition"
                   style={{ backgroundColor: r.color, color: "#fff" }}>
                {r.icon}
              </div>
              <div className="font-bold text-emerald-dark text-sm">{r.nom}</div>
              <div className="text-xs text-gray-400 mt-1 truncate max-w-full">
                {r.url.replace(/^https?:\/\//, "")}
              </div>
            </a>
          ))}
        </div>
      </div>

      <div className="mb-12">
        <h2 className="font-amiri font-bold text-emerald-dark text-2xl mb-5">
          Contacter le support
        </h2>

        {!user ? (
          <div className="bg-white rounded-3xl p-8 text-center border border-emerald/5">
            <p className="text-gray-500 mb-4">Connectez-vous pour nous envoyer un message.</p>
            <Link href="/auth"
              className="inline-block px-6 py-3 rounded-2xl bg-emerald text-white
                         font-semibold text-sm hover:bg-emerald-dark transition">
              Se connecter
            </Link>
          </div>
        ) : !showForm ? (
          <button onClick={() => setShowForm(true)}
            className="w-full bg-white rounded-3xl p-6 border-2 border-dashed border-emerald/20
                       hover:border-emerald/40 transition flex items-center justify-center gap-3
                       text-emerald-dark font-semibold">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none"
                 stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <path d="M12 5v14M5 12h14"/>
            </svg>
            Ouvrir un nouveau ticket
          </button>
        ) : (
          <form onSubmit={envoyerTicket}
            className="bg-white rounded-3xl p-6 sm:p-8 border border-emerald/5">
            <div className="mb-4">
              <label className="block text-xs font-semibold text-emerald-dark mb-2 uppercase tracking-wider">Sujet *</label>
              <input type="text" value={sujet} onChange={(e) => setSujet(e.target.value)}
                placeholder="Ex : Problème d'audio, Question..." required
                className="w-full px-5 py-3 rounded-2xl border-2 border-emerald/10 focus:border-gold outline-none text-sm" />
            </div>
            <div className="mb-5">
              <label className="block text-xs font-semibold text-emerald-dark mb-2 uppercase tracking-wider">Message *</label>
              <textarea value={message} onChange={(e) => setMessage(e.target.value)} rows={5}
                placeholder="Décrivez votre demande..." required
                className="w-full px-5 py-3 rounded-2xl border-2 border-emerald/10 focus:border-gold outline-none text-sm resize-none" />
            </div>
            <div className="flex gap-3">
              <button type="button" onClick={() => setShowForm(false)}
                className="px-6 py-3 rounded-2xl border-2 border-emerald/15 text-emerald-dark font-semibold text-sm">Annuler</button>
              <button type="submit" disabled={sending}
                className="flex-1 px-6 py-3 rounded-2xl bg-emerald text-white font-semibold text-sm hover:bg-emerald-dark transition disabled:opacity-50 inline-flex items-center justify-center gap-2">
                <IconCheck size={16} />{sending ? "Envoi..." : "Envoyer le ticket"}
              </button>
            </div>
          </form>
        )}

        {success && (
          <div className="mt-4 p-4 rounded-2xl bg-emerald/10 border border-emerald/20 text-emerald-dark text-sm font-semibold text-center">
            ✅ Votre ticket a été envoyé. Nous vous répondrons bientôt.
          </div>
        )}
      </div>

      {user && tickets.length > 0 && (
        <div>
          <h2 className="font-amiri font-bold text-emerald-dark text-2xl mb-5">
            Mes tickets ({tickets.length})
          </h2>
          <div className="grid gap-4">
            {tickets.map((t) => (
              <div key={t.id} className="bg-white rounded-3xl p-6 border border-emerald/5">
                <div className="flex items-center justify-between mb-3 flex-wrap gap-2">
                  <div className="font-bold text-emerald-dark text-sm">{t.sujet}</div>
                  <span className={`px-3 py-1 rounded-full text-[0.65rem] font-bold uppercase ${statutBadge(t.statut)}`}>
                    {statutLabel(t.statut)}
                  </span>
                </div>
                <p className="text-sm text-gray-600 mb-3">{t.message}</p>
                <div className="text-xs text-gray-400">
                  {new Date(t.created_at).toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" })}
                </div>
                {t.reponse_admin && (
                  <div className="mt-4 pt-4 border-t border-emerald/10">
                    <div className="text-xs font-bold text-gold uppercase tracking-wider mb-2">Réponse du support</div>
                    <p className="text-sm text-gray-700 bg-cream p-3 rounded-xl">{t.reponse_admin}</p>
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
