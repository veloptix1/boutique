import "./globals.css";
import type { Metadata, Viewport } from "next";
import { Amiri, Poppins } from "next/font/google";
import { LangProvider } from "@/components/LangProvider";
import ClientLayoutWrapper from "@/components/ClientLayoutWrapper";
import { ThemeProvider, themeInitScript } from "@/components/ThemeProvider";

// Polices embarquées au build : fonctionnent hors ligne dans l'app Android
const amiri = Amiri({ subsets: ["arabic", "latin"], weight: ["400", "700"], variable: "--font-amiri", display: "swap" });
const poppins = Poppins({ subsets: ["latin"], weight: ["400", "500", "600", "700"], variable: "--font-poppins", display: "swap" });

export const metadata: Metadata = {
  title: "AL BASIRAH — La vision intérieure",
  description: "Application islamique audio : savants, hadiths authentiques.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#0d5c4a",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr" className={`${amiri.variable} ${poppins.variable}`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
      </head>
      <body>
        <ThemeProvider>
          <LangProvider>
            <ClientLayoutWrapper>{children}</ClientLayoutWrapper>
          </LangProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
