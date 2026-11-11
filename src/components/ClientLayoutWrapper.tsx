"use client";
import { usePathname } from "next/navigation";
import Navbar from "./Navbar";
import BottomNav from "./BottomNav";
import AudioPlayerFull from "./AudioPlayerFull";
import UpdateChecker from "./UpdateChecker";
import OfflineScreen from "./OfflineScreen";
import { useOnline } from "@/lib/useOnline";

// Pages utilisables sans connexion
const OFFLINE_OK = ["/hors-ligne", "/profil", "/telechargements"];
const clean = (p: string) => (p.length > 1 ? p.replace(/\/+$/, "") : p);

export default function ClientLayoutWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAdmin = pathname?.startsWith("/admin");
  const { online, recheck } = useOnline();
  const path = clean(pathname || "/");
  const offlineOk = OFFLINE_OK.some((p) => path === p || path.startsWith(p + "/"));

  if (isAdmin) return <>{children}</>;

  return (
    <>
      <Navbar />
      {/* 56px de barre + zone sûre (encoche) */}
      <div style={{ paddingTop: "calc(56px + var(--safe-top))" }}>
        {!online && offlineOk && (
          <p role="status" className="bg-gold/20 px-4 py-2 text-center text-sm text-heading">
            Vous êtes hors ligne.
          </p>
        )}
        {!online && !offlineOk ? <OfflineScreen onRetry={recheck} /> : children}
      </div>
      <AudioPlayerFull />
      <BottomNav />
      <UpdateChecker />
    </>
  );
}
