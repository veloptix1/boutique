"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { signIn, signUp } from "@/lib/auth";
import { authErrorMessage } from "@/lib/security";

export default function AuthPage() {
  const router = useRouter();
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [nom, setNom] = useState("");
  const [showPwd, setShowPwd] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [info, setInfo] = useState("");

  const switchMode = (m: "login" | "signup") => { setMode(m); setError(""); setInfo(""); };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(""); setInfo(""); setLoading(true);

    const { error } = mode === "login"
      ? await signIn(email.trim(), password)
      : await signUp(email.trim(), password, nom);

    setLoading(false);
    if (error) { setError(authErrorMessage(error.message)); return; }

    if (mode === "signup") {
      setInfo("Compte créé. Vérifiez votre email pour le confirmer, puis connectez-vous.");
      return;
    }
    router.push("/dashboard");
    router.refresh();
  };

  return (
    <main className="page flex min-h-[calc(100dvh-160px)] items-center">
      <div className="card mx-auto w-full max-w-md p-6 sm:p-8">
        <h1 className="h-page text-center">
          {mode === "login" ? "Connexion" : "Créer un compte"}
        </h1>
        <p className="mb-6 mt-1 text-center text-sm text-muted">
          {mode === "login" ? "Retrouvez votre espace AL BASIRAH." : "Quelques secondes suffisent."}
        </p>

        <div role="tablist" aria-label="Mode" className="mb-6 grid grid-cols-2 rounded-xl bg-emerald/10 p-1">
          {(["login", "signup"] as const).map((m) => (
            <button key={m} type="button" role="tab" aria-selected={mode === m} onClick={() => switchMode(m)}
              className={`h-10 rounded-lg text-sm font-semibold transition-colors
                          ${mode === m ? "bg-white text-emerald-dark shadow-sm" : "text-emerald"}`}>
              {m === "login" ? "Connexion" : "Inscription"}
            </button>
          ))}
        </div>

        <form onSubmit={handleSubmit} className="space-y-4" noValidate={false}>
          {mode === "signup" && (
            <div>
              <label htmlFor="nom" className="mb-1.5 block text-sm font-medium text-emerald-dark">Nom complet</label>
              <input id="nom" type="text" autoComplete="name" required maxLength={80}
                     value={nom} onChange={(e) => setNom(e.target.value)} className="field" />
            </div>
          )}

          <div>
            <label htmlFor="email" className="mb-1.5 block text-sm font-medium text-emerald-dark">Email</label>
            <input id="email" type="email" inputMode="email" autoComplete="email" autoCapitalize="none" required
                   value={email} onChange={(e) => setEmail(e.target.value)} className="field" />
          </div>

          <div>
            <label htmlFor="password" className="mb-1.5 block text-sm font-medium text-emerald-dark">Mot de passe</label>
            <div className="relative">
              <input id="password" type={showPwd ? "text" : "password"} required minLength={8}
                     autoComplete={mode === "login" ? "current-password" : "new-password"}
                     value={password} onChange={(e) => setPassword(e.target.value)} className="field pr-20" />
              <button type="button" onClick={() => setShowPwd(!showPwd)}
                      className="absolute right-0 top-0 h-12 px-4 text-sm font-medium text-emerald">
                {showPwd ? "Masquer" : "Afficher"}
              </button>
            </div>
            {mode === "signup" && <p className="mt-1.5 text-xs text-muted">8 caractères minimum.</p>}
          </div>

          {error && <p role="alert" className="rounded-xl bg-terracotta/10 px-4 py-3 text-sm text-terracotta-deep">{error}</p>}
          {info && <p role="status" className="rounded-xl bg-emerald/10 px-4 py-3 text-sm text-emerald-dark">{info}</p>}

          <button type="submit" disabled={loading} className="btn-primary w-full">
            {loading ? "Patientez…" : mode === "login" ? "Se connecter" : "Créer mon compte"}
          </button>
        </form>
      </div>
    </main>
  );
}
