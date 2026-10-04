import Navbar from "@/components/Navbar";
import BottomNav from "@/components/BottomNav";

export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Navbar />
      <div className="pt-[72px]">{children}</div>
      <BottomNav />
    </>
  );
}