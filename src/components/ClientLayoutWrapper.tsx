"use client";
import { usePathname } from "next/navigation";
import Navbar from "./Navbar";
import BottomNav from "./BottomNav";
import AudioPlayerFull from "./AudioPlayerFull";
import UpdateChecker from "./UpdateChecker";

export default function ClientLayoutWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAdmin = pathname?.startsWith("/admin");

  if (isAdmin) return <>{children}</>;

  return (
    <>
      <Navbar />
      {/* 56px de barre + zone sûre (encoche) */}
      <div style={{ paddingTop: "calc(56px + var(--safe-top))" }}>{children}</div>
      <AudioPlayerFull />
      <BottomNav />
      <UpdateChecker />
    </>
  );
}
