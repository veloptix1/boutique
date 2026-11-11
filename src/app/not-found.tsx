import Link from "next/link";
import StatusPage from "@/components/StatusPage";

export default function NotFound() {
  return (
    <StatusPage code="404" title="Page introuvable" text="Cette page n'existe pas ou n'existe plus. Vérifiez le lien ou revenez à l'accueil.">
      <Link href="/" className="btn-primary">Retour à l'accueil</Link>
      <Link href="/audio" className="btn-secondary">Parcourir l'audio</Link>
    </StatusPage>
  );
}
