"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { signOut } from "@/lib/auth";
import PushNotificationManager from "@/components/PushNotificationManager";
import { FullLoader, PageHeader } from "@/components/ui";
import { useTheme, type ThemeChoice } from "@/components/ThemeProvider";

type Profile = { id: string; email: string; nom: string | null; role: string };

const liens = [
  { label: "Aide et support", href: "/support" },
  { label: "Questions fréquentes", href: "/faq" },
  { label: "Conditions d'utilisation", href: "/conditions" },
];

export default function ProfilPage() {
  const router = useRouter();
  const { choice, setChoice } = useTheme();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      // Session locale : le profil reste accessible hors ligne
      const { data: { session } } = await supabase.auth.getSession();
      const user = session?.user;
      if (!user) { router.push("/auth"); return; }
      const { data } = await supabase.from("profiles").select("id, email, nom, role").eq("id", user.id).single();
      setProfile(data ?? { id: user.id, email: user.email ?? "", nom: (user.user_metadata?.nom as string) ?? null, role: "user" });
      setLoading(false);
    })();
  }, [router]);

  const handleLogout = async () => {
    await signOut();
    router.push("/");
  };

  if (loading) return <FullLoader />;

  const initiale = (profile?.nom || profile?.email || "?").trim().charAt(0).toUpperCase();

  return (
    <main className="page max-w-md">
      <PageHeader title="Profil" />

      <section className="card mb-4 flex items-center gap-4 p-4">
        <span aria-hidden="true" className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-emerald font-amiri text-2xl font-bold text-gold">
          {initiale}
        </span>
        <div className="min-w-0">
          <p className="truncate font-semibold text-heading">{profile?.nom || "Utilisateur"}</p>
          <p className="truncate text-sm text-muted">{profile?.email}</p>
          <span className={`badge mt-1.5 ${profile?.role === "admin" ? "bg-gold/25 text-gold-deep" : "bg-emerald/10 text-link"}`}>
            {profile?.role === "admin" ? "Administrateur" : "Membre"}
          </span>
        </div>
      </section>

      {profile?.role === "admin" && (
        <Link href="/admin" className="btn-gold mb-4 w-full">Ouvrir l'espace administrateur</Link>
      )}

      <section className="card mb-4 p-4" aria-labelledby="apparence">
        <h2 id="apparence" className="mb-3 font-semibold text-heading">Apparence</h2>
        <div role="radiogroup" aria-labelledby="apparence" className="grid grid-cols-3 gap-2">
          {([["clair", "Clair"], ["sombre", "Sombre"], ["auto", "Auto"]] as [ThemeChoice, string][]).map(([v, label]) => (
            <button key={v} type="button" role="radio" aria-checked={choice === v} onClick={() => setChoice(v)}
              className={`h-11 rounded-xl border text-sm font-semibold transition-colors
                ${choice === v ? "border-emerald bg-emerald text-white" : "border-line bg-surface text-heading"}`}>
              {label}
            </button>
          ))}
        </div>
        {choice === "auto" && <p className="mt-2 text-xs text-muted">Suit le réglage de votre téléphone.</p>}
      </section>

      <div className="mb-4"><PushNotificationManager /></div>

      <ul className="card mb-6 divide-y divide-line overflow-hidden">
        {liens.map((l) => (
          <li key={l.href}>
            <Link href={l.href} className="flex h-14 items-center justify-between px-4 text-[0.95rem] font-medium text-heading no-underline active:bg-cream">
              {l.label}
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="text-muted" aria-hidden="true"><path d="M9 6l6 6-6 6" /></svg>
            </Link>
          </li>
        ))}
      </ul>

      <button onClick={handleLogout} className="btn-secondary w-full text-terracotta-deep">Se déconnecter</button>
    </main>
  );
}
