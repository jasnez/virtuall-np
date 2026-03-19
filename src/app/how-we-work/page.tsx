import type { Metadata } from "next";
import pageMetadata from "@/content/metadata.json";
import siteConfig from "@/content/site-config.json";
import HowWeWorkClient from "./HowWeWorkClient";

const ogImageUrl = "/og-image.jpg";

export const metadata: Metadata = {
  title: pageMetadata.process.title,
  description: pageMetadata.process.description,
  alternates: {
    canonical: `${siteConfig.url}/how-we-work`,
  },
  openGraph: {
    title: pageMetadata.process.ogTitle,
    description: pageMetadata.process.ogDescription,
    url: `${siteConfig.url}/how-we-work`,
    type: "website",
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
    title: pageMetadata.process.ogTitle,
    description: pageMetadata.process.ogDescription,
    images: [ogImageUrl],
  },
};

export default function HowWeWorkPage() {
  return <HowWeWorkClient />;
}
