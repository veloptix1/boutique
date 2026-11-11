import Link from "next/link";
import StatusPage from "@/components/StatusPage";

export default function ForbiddenPage() {
  return (
    <StatusPage code="403" title="Accès refusé" text="Vous n'avez pas l'autorisation d'ouvrir cette page.">
      <Link href="/dashboard" className="btn-primary">Retour à l'accueil</Link>
    </StatusPage>
  );
}
