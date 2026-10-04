import OustazDetailClient from "./OustazDetailClient";

export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  return <OustazDetailClient slug={slug} />;
}