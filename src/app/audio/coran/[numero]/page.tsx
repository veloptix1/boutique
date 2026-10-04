import SourateClient from "./SourateClient";

export default async function Page({
  params,
}: {
  params: Promise<{ numero: string }>;
}) {
  const { numero } = await params;
  return <SourateClient numero={numero} />;
}
