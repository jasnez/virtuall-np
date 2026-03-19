import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import siteConfig from "@/content/site-config.json";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { GoogleAnalytics } from "@/components/GoogleAnalytics";
import { CookieConsent } from "@/components/CookieConsent";

const inter = Inter({
  subsets: ["latin"],
  // For better LCP on above-the-fold content, load only weights we need most.
  // Hero uses `font-bold` (700) and most UI uses regular (400).
  weight: ["400", "700"],
  // Hint Next/font to preload the font for better LCP.
  preload: true,
  display: "swap",
});

const ogImageUrl = "/opengraph-image";

export const metadata: Metadata = {
  title: {
    default: "VirtuALL NP",
    template: "%s | VirtuALL NP",
  },
  metadataBase: new URL(siteConfig.url),
  description: siteConfig.seo.description,
  icons: {
    icon: [{ url: "/favicon.svg", type: "image/svg+xml" }],
  },
  openGraph: {
    url: siteConfig.url,
    siteName: siteConfig.siteName,
    images: [
      {
        url: ogImageUrl,
        width: 1200,
        height: 630,
        alt: siteConfig.siteName,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    images: [ogImageUrl],
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#ffffff",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={inter.className}>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link rel="preconnect" href="https://www.google-analytics.com" />
        <link rel="preconnect" href="https://www.googletagmanager.com" />
      </head>
      <body className="antialiased">
        <GoogleAnalytics />
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[60] focus:ring-2 focus:ring-accent focus:bg-white focus:text-text-main px-4 py-2 rounded-md"
        >
          Skip to content
        </a>
        <Header />
        <main id="main-content" className="min-h-screen">
          {children}
        </main>
        <Footer />
        <CookieConsent />
      </body>
    </html>
  );
}
