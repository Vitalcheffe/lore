import type { Metadata } from "next";
import { Inter, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { AuthProvider } from "@/components/providers/AuthProvider";

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
  icons: {
    icon: "/logo.svg",
  },
  openGraph: {
    title: "LORE — Your Team's Memory, Alive",
    description: "Inconsistent memory is misinformation. Lore gives your team a memory that's always consistent, everywhere.",
    type: "website",
  },
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
        <AuthProvider>
          {children}
        </AuthProvider>
        <Toaster />
      </body>
    </html>
  );
}
