"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { signOut } from "@/lib/auth";
import { IconUser } from "@/components/icons";
import PushNotificationManager from "@/components/PushNotificationManager";

type Profile = {
  email: string;
  nom: string | null;
  role: string;
};

export default function ProfilPage() {
  const router = useRouter();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push("/auth");
        return;
      }
      const { data } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();
      setProfile(data);
      setLoading(false);
    })();
  }, [router]);

  const handleLogout = async () => {
    await signOut();
    router.push("/");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-emerald">Chargement...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen px-[6%] pt-28 pb-40 bg-cream">
      <div className="max-w-md mx-auto space-y-4">

        {/* Carte profil */}
        <div className="bg-white rounded-[28px] p-8
                        shadow-[0_30px_60px_rgba(13,92,74,0.15)]">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-emerald to-emerald-dark
                            flex items-center justify-center">
              <span className="text-gold"><IconUser size={28} /></span>
            </div>
            <div>
              <h1 className="font-bold text-emerald-dark text-xl">
                {profile?.nom || "Utilisateur"}
              </h1>
              <p className="text-sm text-gray-500">{profile?.email}</p>
            </div>
          </div>

          <div className="space-y-2 text-sm text-gray-600 mb-6">
            <p><strong>Rôle :</strong> {profile?.role}</p>
          </div>

          {profile?.role === "admin" && (
            <Link href="/admin"
              className="block w-full py-3 rounded-2xl bg-gold text-emerald-dark
                         font-semibold text-center mb-3 hover:opacity-90 transition">
              Accéder au panel admin
            </Link>
          )}

          <button
            onClick={handleLogout}
            className="w-full py-3 rounded-2xl border-2 border-emerald/15
                       text-emerald-dark font-semibold hover:border-terracotta
                       hover:text-terracotta transition">
            Se déconnecter
          </button>
        </div>

        {/* Notifications */}
        <PushNotificationManager />

      </div>
    </div>
  );
}
