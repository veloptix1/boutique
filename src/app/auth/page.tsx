"use client";
import { Bismillah, EndMark } from "@/components/PageHeader";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { signIn, signUp } from "@/lib/auth";

export default function AuthPage() {
  const router = useRouter();
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [nom, setNom] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const { error } =
      mode === "login"
        ? await signIn(email, password)
        : await signUp(email, password, nom);

    setLoading(false);

    if (error) {
      setError(error.message);
      return;
    }

    if (mode === "signup") {
      setError("Vérifie ton email pour confirmer ton compte.");
      return;
    }

    // 🔥 REDIRECTION VERS DASHBOARD APRÈS CONNEXION
    router.push("/dashboard");
    router.refresh();
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-[6%] py-24
                    bg-gradient-to-br from-cream to-[#f0e9d9]">
      <div className="w-full max-w-md bg-white rounded-[28px] p-8
                      shadow-[0_30px_60px_rgba(13,92,74,0.15)]
                      relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1.5
                        bg-gradient-to-r from-emerald via-gold to-terracotta" />

        <h1 className="font-amiri font-bold text-emerald-dark text-3xl text-center mb-2">
          AL BASIRAH
        </h1>
        <p className="text-center text-gray-500 text-sm mb-8">
          {mode === "login" ? "Connexion à votre compte" : "Créer votre compte"}
        </p>

        <div className="flex bg-emerald/8 p-1 rounded-full mb-6">
          <button
            onClick={() => setMode("login")}
            className={`flex-1 py-2 rounded-full text-sm font-semibold transition
              ${mode === "login" ? "bg-emerald text-white" : "text-emerald"}`}
          >
            Connexion
          </button>
          <button
            onClick={() => setMode("signup")}
            className={`flex-1 py-2 rounded-full text-sm font-semibold transition
              ${mode === "signup" ? "bg-emerald text-white" : "text-emerald"}`}
          >
            Inscription
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {mode === "signup" && (
            <input
              type="text"
              placeholder="Nom complet"
              value={nom}
              onChange={(e) => setNom(e.target.value)}
              required
              className="w-full px-5 py-3.5 rounded-2xl border-2 border-emerald/10
                         focus:border-gold outline-none text-sm"
            />
          )}

          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full px-5 py-3.5 rounded-2xl border-2 border-emerald/10
                       focus:border-gold outline-none text-sm"
          />

          <input
            type="password"
            placeholder="Mot de passe"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={6}
            className="w-full px-5 py-3.5 rounded-2xl border-2 border-emerald/10
                       focus:border-gold outline-none text-sm"
          />

          {error && (
            <p className="text-sm text-terracotta text-center">{error}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 rounded-2xl bg-emerald text-white font-semibold
                       hover:bg-emerald-dark transition disabled:opacity-50"
          >
            {loading ? "..." : mode === "login" ? "Se connecter" : "S'inscrire"}
          </button>
        </form>
      </div>
    </div>
  );
}
