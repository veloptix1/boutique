"use client";
import { usePathname } from "next/navigation";
import Navbar from "./Navbar";
import BottomNav from "./BottomNav";
import AudioPlayer from "./AudioPlayer";

export default function ClientLayoutWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAdmin = pathname?.startsWith("/admin");

  if (isAdmin) return <>{children}</>;

  return (
    <>
      <Navbar />
      <div className="pt-[72px]">{children}</div>
      <AudioPlayer />
      <BottomNav />
    </>
  );
}