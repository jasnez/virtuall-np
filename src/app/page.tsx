import type { Metadata } from "next";

import homepage from "@/content/homepage.json";
import pageMetadata from "@/content/metadata.json";
import siteConfig from "@/content/site-config.json";
import { Hero } from "@/components/sections/Hero";
import { ValueProps } from "@/components/sections/ValueProps";
import { ServicesPreview } from "@/components/sections/ServicesPreview";
import { TrustSection } from "@/components/sections/TrustSection";
import { CtaSection } from "@/components/sections/CtaSection";
import StructuredData from "@/components/StructuredData";

const ogImageUrl = "/og-image.jpg";

export const metadata: Metadata = {
  title: pageMetadata.home.title,
  description: pageMetadata.home.description,
  openGraph: {
    title: pageMetadata.home.ogTitle,
    description: pageMetadata.home.ogDescription,
    url: siteConfig.url,
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
    title: pageMetadata.home.ogTitle,
    description: pageMetadata.home.ogDescription,
    images: [ogImageUrl],
  },
};

export default function Home() {
  return (
    <main className="min-h-screen">
      <StructuredData page="home" />
      <Hero />
      <ValueProps />
      <ServicesPreview />
      <TrustSection />
      <CtaSection
        title={homepage.cta.headline}
        description={homepage.cta.description}
        ctaLabel={homepage.cta.ctaText}
        ctaHref="/contact"
      />
    </main>
  );
}
