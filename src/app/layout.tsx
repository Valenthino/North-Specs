import type { Metadata, Viewport } from "next";
import "./globals.css";
import { CartProvider } from "@/components/cart/cart-provider";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { TopComplianceBar } from "@/components/compliance/ruo-notice";
import { ResearchGate } from "@/components/compliance/research-gate";
import { siteConfig } from "@/config/site";

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: `${siteConfig.name} — Research-Grade Peptides for Canadian Labs`,
    template: `%s · ${siteConfig.name}`,
  },
  description: siteConfig.description,
  keywords: [
    "research peptides",
    "peptides Canada",
    "research use only",
    "BPC-157",
    "TB-500",
    "semaglutide research",
    "high purity peptides",
    "COA peptides",
    "Canadian lab supplies",
  ],
  openGraph: {
    type: "website",
    locale: "en_CA",
    siteName: siteConfig.name,
    title: `${siteConfig.name} — Research-Grade Peptides`,
    description: siteConfig.description,
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: "#0a1b34",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en-CA">
      <body className="flex min-h-screen flex-col">
        <CartProvider>
          <TopComplianceBar />
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
          <ResearchGate />
        </CartProvider>
      </body>
    </html>
  );
}
