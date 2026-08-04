import type { Metadata, Viewport } from "next";
import { Inter, Fraunces, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { CartProvider } from "@/components/cart/cart-provider";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { TopComplianceBar } from "@/components/compliance/ruo-notice";
import { ResearchGate } from "@/components/compliance/research-gate";
import { siteConfig } from "@/config/site";

const sans = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-sans",
});

/** Editorial serif used for the largest headlines and article titles. */
const display = Fraunces({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-display",
  axes: ["SOFT", "WONK"],
});

const mono = JetBrains_Mono({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-mono",
});

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  alternates: { canonical: "/" },
  title: {
    default: `${siteConfig.name} — Research-Grade Peptides for Laboratories`,
    template: `%s · ${siteConfig.name}`,
  },
  description: siteConfig.description,
  applicationName: siteConfig.name,
  keywords: [
    "research peptides",
    "peptides Canada",
    "research use only",
    "RUO peptides",
    "BPC-157",
    "TB-500",
    "GLP-1 research peptide",
    "NAD+ research",
    "high purity peptides",
    "COA peptides",
    "peptide reconstitution calculator",
    "Canadian lab supplies",
  ],
  openGraph: {
    type: "website",
    url: siteConfig.url,
    locale: "en_CA",
    siteName: siteConfig.name,
    title: `${siteConfig.name} — Research-Grade Peptides`,
    description: siteConfig.description,
  },
  twitter: {
    card: "summary_large_image",
    title: `${siteConfig.name} — Research-Grade Peptides`,
    description: siteConfig.description,
  },
  robots: { index: true, follow: true },
  category: "science",
};

export const viewport: Viewport = {
  themeColor: "#141f18",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en-CA" className={`${sans.variable} ${display.variable} ${mono.variable}`}>
      <body className="flex min-h-screen flex-col font-sans">
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[100] focus:rounded-lg focus:bg-ink-950 focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-white"
        >
          Skip to content
        </a>
        <CartProvider>
          <TopComplianceBar />
          <Header />
          <main id="main" className="flex-1">
            {children}
          </main>
          <Footer />
          <ResearchGate />
        </CartProvider>
      </body>
    </html>
  );
}
