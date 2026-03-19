import React from "react";
import type { Metadata } from "next";
import { Bot, PenLine, Search, Sparkles } from "lucide-react";

import services from "@/content/services.json";
import pageMetadata from "@/content/metadata.json";
import siteConfig from "@/content/site-config.json";
import { SectionWrapper } from "@/components/ui/SectionWrapper";
import { Button } from "@/components/ui/Button";
import { AnimateIn } from "@/components/ui/AnimateIn";
import StructuredData from "@/components/StructuredData";

const ogImageUrl = "/opengraph-image";

const iconMap: Record<string, React.ComponentType<React.SVGProps<SVGSVGElement>>> =
  {
    "pen-line": PenLine,
    search: Search,
    sparkles: Sparkles,
    bot: Bot,
  };

export const metadata: Metadata = {
  title: pageMetadata.services.title,
  description: pageMetadata.services.description,
  alternates: {
    canonical: `${siteConfig.url}/services`,
  },
  openGraph: {
    title: pageMetadata.services.ogTitle,
    description: pageMetadata.services.ogDescription,
    url: `${siteConfig.url}/services`,
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
    title: pageMetadata.services.ogTitle,
    description: pageMetadata.services.ogDescription,
    images: [ogImageUrl],
  },
};

export default function ServicesPage() {
  return (
    <main className="min-h-screen">
      <StructuredData page="services" />
      <AnimateIn delay={0}>
        <section className="py-24 md:py-32 bg-gradient-to-br from-primary to-[#0F2440] text-white">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-4xl md:text-5xl font-bold">Our Services</h1>
            <p className="mt-4 text-white/80 max-w-2xl mx-auto">
              Deep work, clear outcomes, and content that’s built to earn trust—
              not just clicks.
            </p>
          </div>
        </section>
      </AnimateIn>

      {services.map((svc, index) => {
        const Icon = iconMap[svc.icon as keyof typeof iconMap] ?? Sparkles;
        const isOdd = index % 2 === 1;

        return (
          <AnimateIn
            key={svc.id ?? index}
            delay={0}
            direction={index % 2 === 0 ? "left" : "right"}
          >
            <SectionWrapper
              bgColor={isOdd ? "alt" : "white"}
              padding="lg"
              className="border-t border-gray-100"
            >
              <div
                data-testid={`service-section-${svc.slug}`}
                className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center"
              >
                <div id={svc.slug}>
                  <h2 className="text-3xl font-semibold text-text-main">
                    {svc.title}
                  </h2>
                  <p className="mt-3 italic text-text-light">
                    {svc.positioning}
                  </p>
                  <p className="mt-4 text-text-light leading-relaxed">
                    {svc.fullDescription}
                  </p>

                  <ul className="mt-6 space-y-2">
                    {svc.deliverables.map((item) => (
                      <li
                        key={item}
                        className="flex items-start gap-2 text-sm text-accent"
                      >
                        <span className="mt-0.5">✓</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>

                  <div className="mt-8">
                    <Button
                      href={`/contact?service=${encodeURIComponent(svc.slug)}`}
                    >
                      {`Get a Quote for ${svc.title}`}
                    </Button>
                  </div>
                </div>

                <div
                  data-testid="service-icon"
                  className={
                    isOdd
                      ? "lg:order-last flex justify-center"
                      : "flex justify-center"
                  }
                >
                <Icon
                  className="w-48 h-48 text-accent/10"
                  aria-hidden="true"
                  focusable="false"
                />
                </div>
              </div>
            </SectionWrapper>
          </AnimateIn>
        );
      })}
    </main>
  );
}

