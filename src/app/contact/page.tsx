import type { Metadata } from "next";
import { Suspense } from "react";
import pageMetadata from "@/content/metadata.json";
import siteConfig from "@/content/site-config.json";
import ContactClient from "./ContactClient";

const ogImageUrl = "/og-image.jpg";

export const metadata: Metadata = {
  title: pageMetadata.contact.title,
  description: pageMetadata.contact.description,
  alternates: {
    canonical: `${siteConfig.url}/contact`,
  },
  openGraph: {
    title: pageMetadata.contact.ogTitle,
    description: pageMetadata.contact.ogDescription,
    url: `${siteConfig.url}/contact`,
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
    title: pageMetadata.contact.ogTitle,
    description: pageMetadata.contact.ogDescription,
    images: [ogImageUrl],
  },
};

export default function ContactPage() {
  return (
    <Suspense fallback={null}>
      <ContactClient />
    </Suspense>
  );
}
