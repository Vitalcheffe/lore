import type { Metadata, Viewport } from "next";
import { Inter, Geist_Mono, Playfair_Display, Cormorant_Garamond } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";
import { Providers } from "@/components/providers";
import { CookieConsent } from "@/components/app/cookie-consent";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800", "900"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  weight: ["400", "700", "900"],
  display: "swap",
});

const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  weight: ["300", "400", "600"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Couleur de l'Espoir — Fondation TGCC",
  description: "Vente aux enchères caritative pour la construction d'un pensionnat pour jeunes filles. 1er juillet 2025, Casablanca.",
  keywords: ["Fondation TGCC", "Couleur de l'Espoir", "charité", "enchères", "pensionnat", "Casablanca", "Maroc"],
  authors: [{ name: "Fondation TGCC" }],
  icons: {
    icon: "/favicon.ico",
    apple: "/favicon.ico",
  },
  openGraph: {
    title: "Couleur de l'Espoir — Fondation TGCC",
    description: "Vente aux enchères caritative pour la construction d'un pensionnat pour jeunes filles.",
    type: "website",
  },
};

export const viewport: Viewport = {
  themeColor: "#0D0A07",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" suppressHydrationWarning>
      <body
        className={`${inter.variable} ${geistMono.variable} ${playfair.variable} ${cormorant.variable} antialiased bg-background text-foreground`}
        style={{ fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, system-ui, sans-serif" }}
      >
        <a href="#main-content" className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-[9999] focus:px-4 focus:py-2 focus:bg-emerald-600 focus:text-white focus:rounded-lg focus:text-sm focus:font-semibold">
          Skip to main content
        </a>
        <Providers>
          {children}
        </Providers>
        <Toaster />
        <CookieConsent />
      </body>
    </html>
  );
}
