import { Suspense } from "react";
import SahabaDetail from "./SahabaDetail";

export default function Page() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center bg-cream"><p className="text-emerald">Chargement...</p></div>}>
      <SahabaDetail />
    </Suspense>
  );
}
