"use client";
import Link from "next/link";
import { useOnline } from "@/lib/useOnline";
import OfflineScreen from "@/components/OfflineScreen";
import StatusPage from "@/components/StatusPage";

export default function HorsLignePage() {
  const { online, recheck } = useOnline();
  if (!online) return <OfflineScreen onRetry={recheck} />;
  return (
    <StatusPage title="Connexion rétablie" text="Vous êtes de nouveau en ligne.">
      <Link href="/dashboard" className="btn-primary">Continuer</Link>
    </StatusPage>
  );
}
