import LivreClient from "./LivreClient";

export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  return <LivreClient slug={slug} />;
}
