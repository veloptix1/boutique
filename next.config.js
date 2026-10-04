/** @type {import('next').NextConfig} */
const isCapacitor = process.env.CAPACITOR_BUILD === "true";

const nextConfig = {
  reactStrictMode: true,
  output: isCapacitor ? "export" : undefined,
  images: { unoptimized: isCapacitor },
  trailingSlash: true,
  eslint: { ignoreDuringBuilds: true },
  typescript: { ignoreBuildErrors: false },
  ...(isCapacitor && {
    // Exclure les pages dynamiques du build Capacitor
    // car elles nécessitent un serveur
    exportPathMap: async function () {
      return {
        "/": { page: "/" },
        "/auth": { page: "/auth" },
        "/dashboard": { page: "/dashboard" },
        "/audio": { page: "/audio" },
        "/audio/savants": { page: "/audio/savants" },
        "/audio/oustaz": { page: "/audio/oustaz" },
        "/audio/coran": { page: "/audio/coran" },
        "/livres": { page: "/livres" },
        "/hadiths": { page: "/hadiths" },
        "/profil": { page: "/profil" },
      };
    },
  }),
};

module.exports = nextConfig;
