import { Suspense } from "react";
import SavantDetail from "./SavantDetail";

export default function Page() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center bg-cream"><p className="text-emerald">Chargement...</p></div>}>
      <SavantDetail />
    </Suspense>
  );
}
