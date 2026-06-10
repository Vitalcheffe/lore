import type { Metadata, Viewport } from "next";
import { Inter, Geist_Mono } from "next/font/google";
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

export const metadata: Metadata = {
  title: "LORE — Your Team's Memory, Alive",
  description: "Lore gives your team a shared memory that's structured, always consistent, and available everywhere. Powered by Aurora DSQL's multi-region architecture.",
  keywords: ["Lore", "team memory", "knowledge management", "Aurora DSQL", "AWS", "knowledge graph", "AI", "multi-region"],
  authors: [{ name: "Lore Team" }],
  manifest: "/manifest.json",
  icons: {
    icon: "/favicon.ico",
    apple: "/favicon.ico",
  },
  openGraph: {
    title: "LORE — Your Team's Memory, Alive",
    description: "Inconsistent memory is misinformation. Lore gives your team a memory that's always consistent, everywhere.",
    type: "website",
    images: [{ url: "/og-image.png", width: 1344, height: 768 }],
  },
};

export const viewport: Viewport = {
  themeColor: "#059669",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${inter.variable} ${geistMono.variable} antialiased bg-background text-foreground`}
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
