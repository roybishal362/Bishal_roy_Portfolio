import type { Metadata, Viewport } from "next";
import { Sora, Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const sora = Sora({ subsets: ["latin"], weight: ["400", "600", "700", "800"], variable: "--font-display", display: "swap" });
const inter = Inter({ subsets: ["latin"], weight: ["400", "500"], variable: "--font-body", display: "swap" });
const mono = JetBrains_Mono({ subsets: ["latin"], weight: ["400", "500"], variable: "--font-mono", display: "swap" });

export const metadata: Metadata = {
  title: "Bishal Roy — Ask my AI",
  description:
    "Applied ML / AI Engineer. Don't read my résumé — ask my AI. A grounded assistant trained on my real work that cites its sources and runs my models live.",
  metadataBase: new URL("https://bishal-roypy.vercel.app"),
  openGraph: {
    title: "Bishal Roy — Ask my AI",
    description: "Applied ML / AI Engineer. Talk to a grounded AI trained on my real work.",
    type: "website",
  },
};

export const viewport: Viewport = { themeColor: "#060609", width: "device-width", initialScale: 1 };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${sora.variable} ${inter.variable} ${mono.variable}`}>
      <body>{children}</body>
    </html>
  );
}
