import { Suspense } from "react";
import SahabaDetail from "./SahabaDetail";

export default function Page() {
  return (
    <Suspense fallback={<div className="min-h-dvh flex items-center justify-center bg-cream"><p className="text-link">Chargement...</p></div>}>
      <SahabaDetail />
    </Suspense>
  );
}
