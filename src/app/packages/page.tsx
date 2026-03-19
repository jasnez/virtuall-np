import type { Metadata } from "next";
import { Check } from "lucide-react";

import pricing from "@/content/packages.json";
import homepage from "@/content/homepage.json";
import pageMetadata from "@/content/metadata.json";
import siteConfig from "@/content/site-config.json";
import { SectionWrapper } from "@/components/ui/SectionWrapper";
import { Button } from "@/components/ui/Button";
import { AnimateIn } from "@/components/ui/AnimateIn";
import { CtaSection } from "@/components/sections/CtaSection";
import StructuredData from "@/components/StructuredData";
import { PAGE_CONTAINER_X } from "@/lib/page-layout";

const ogImageUrl = "/opengraph-image";

export const metadata: Metadata = {
  title: pageMetadata.pricing.title,
  description: pageMetadata.pricing.description,
  alternates: {
    canonical: `${siteConfig.url}/packages`,
  },
  openGraph: {
    title: pageMetadata.pricing.ogTitle,
    description: pageMetadata.pricing.ogDescription,
    url: `${siteConfig.url}/packages`,
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
    title: pageMetadata.pricing.ogTitle,
    description: pageMetadata.pricing.ogDescription,
    images: [ogImageUrl],
  },
};

export default function PackagesPage() {
  const { packages, addOns, retainers, projectPricing } = pricing;

  return (
    <main className="min-h-screen">
      <StructuredData page="packages" />
      <AnimateIn delay={0}>
        <section className="py-24 bg-gradient-to-br from-primary to-[#0F2440] text-white">
          <div className={PAGE_CONTAINER_X}>
            <div className="max-w-4xl mx-auto text-center">
              <h1 className="text-4xl md:text-5xl font-bold leading-[1.1] tracking-tight">
                Packages &amp; Pricing
              </h1>
              <p className="mt-4 text-white/90 max-w-2xl mx-auto leading-[1.62]">
                Choose the level of depth that fits your project—from fast,
                focused deliverables to fully researched, strategy-backed content.
              </p>
            </div>
          </div>
        </section>
      </AnimateIn>

      <AnimateIn delay={0}>
        <SectionWrapper bgColor="white" padding="lg">
        <div className="text-center">
          <h2 className="text-3xl font-semibold text-text-main mb-4">
            Our Packages
          </h2>
          <p className="text-text-light mb-8">
            Three simple options for different stages of growth. Every package
            includes clear scope, revisions, and expectations.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {packages.map((pkg, index) => {
            const isFeatured = pkg.featured;
            return (
              <AnimateIn key={pkg.id} delay={index * 0.1}>
                <div data-testid="pricing-card" className="h-full">
                <div
                  data-testid={`pricing-card-${pkg.id}`}
                  className={`p-8 rounded-2xl bg-white border border-gray-200/80 hover:border-gray-300/80 transition-colors duration-200 ease-out flex flex-col h-full ${
                    isFeatured ? "relative ring-2 ring-accent ring-offset-2 ring-offset-white" : ""
                  }`}
                >
                  {isFeatured && (
                    <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-accent-dark text-white text-sm px-4 py-1 rounded-full border border-white/20">
                      Most Popular
                    </div>
                  )}

                  <h3 className="text-xl font-bold text-text-main">
                    {pkg.name}
                  </h3>
                  <p className="mt-1 text-sm text-text-light">
                    {pkg.targetClient}
                  </p>

                  <div className="mt-4 text-3xl font-bold text-primary">
                    €{pkg.priceRange.min}–€{pkg.priceRange.max}
                  </div>
                  <p className="mt-2 text-sm text-text-light">
                    Up to {pkg.wordLimit.toLocaleString()} words ·{" "}
                    {pkg.turnaround}
                  </p>
                  <p className="mt-1 text-sm text-text-light">
                    {pkg.revisions} revision cycle{pkg.revisions > 1 ? "s" : ""}{" "}
                    · {pkg.researchDepth}
                  </p>

                  <ul className="mt-6 space-y-2 flex-1">
                    {pkg.includes.map((item) => (
                      <li
                        key={item}
                        className="flex items-start gap-2 text-sm text-text-main"
                      >
                        <Check
                          className="w-4 h-4 text-accent mt-0.5"
                          aria-hidden="true"
                          focusable="false"
                        />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>

                  <div className="mt-8">
                    <Button
                      href={`/contact?package=${encodeURIComponent(pkg.id)}`}
                      variant={isFeatured ? "primary" : "secondary"}
                      className="w-full justify-center"
                    >
                      {pkg.ctaText}
                    </Button>
                  </div>
                </div>
              </div>
              </AnimateIn>
            );
          })}
        </div>
        </SectionWrapper>
      </AnimateIn>

      <AnimateIn delay={0}>
        <SectionWrapper bgColor="alt" padding="lg">
          <div className="text-center">
            <h2 className="text-3xl font-semibold text-text-main mb-4">
              Enhance Your Order
            </h2>
            <p className="text-text-light mb-8">
              Add focused upgrades for speed, depth, or reuse—without changing
              your whole package.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {addOns.map((addon, index) => (
              <AnimateIn key={addon.id} delay={index * 0.1}>
                <div
                  data-testid="addon-card"
                  className="p-6 rounded-xl bg-white border border-gray-200/80 hover:border-gray-300/80 transition-colors duration-200 ease-out h-full flex flex-col"
                >
                  <h3 className="text-lg font-semibold text-text-main">
                    {addon.name}
                  </h3>
                  <p className="mt-2 text-sm text-text-light flex-1">
                    {addon.description}
                  </p>
                  <div className="mt-4 font-semibold text-accent">
                    +€{addon.price}
                  </div>
                </div>
              </AnimateIn>
            ))}
          </div>
        </SectionWrapper>
      </AnimateIn>

      <AnimateIn delay={0}>
      <SectionWrapper bgColor="white" padding="lg">
        <div className="text-center">
          <h2 className="text-3xl font-semibold text-text-main mb-4">
            Monthly Retainers
          </h2>
          <p className="text-text-light mb-8">
            For teams who want a reliable content engine with ongoing support.
          </p>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm border-collapse">
            <thead>
              <tr className="bg-primary text-white">
                <th className="px-4 py-3 text-left">Tier</th>
                <th className="px-4 py-3 text-left">Monthly Rate</th>
                <th className="px-4 py-3 text-left">Word Volume</th>
                <th className="px-4 py-3 text-left">Discount</th>
                <th className="px-4 py-3 text-left">Benefits</th>
              </tr>
            </thead>
            <tbody>
              {retainers.map((r, index) => (
                <AnimateIn
                  as="tr"
                  key={r.id}
                  delay={index * 0.1}
                  data-testid="retainer-row"
                  className="border-b last:border-b-0"
                >
                  <td className="px-4 py-3 font-medium text-text-main">
                    {r.name}
                  </td>
                  <td className="px-4 py-3 text-text-main">
                    €{r.monthlyRate.toLocaleString()}
                  </td>
                  <td className="px-4 py-3 text-text-main">
                    {r.wordVolume.toLocaleString()} words
                  </td>
                  <td className="px-4 py-3 text-text-main">
                    {r.discount}%
                  </td>
                  <td className="px-4 py-3 text-text-light">
                    {r.benefits.join(" · ")}
                  </td>
                </AnimateIn>
              ))}
            </tbody>
          </table>
        </div>
      </SectionWrapper>
      </AnimateIn>

      <AnimateIn delay={0}>
      <SectionWrapper bgColor="alt" padding="lg">
        <div className="text-center">
          <h2 className="text-3xl font-semibold text-text-main mb-4">
            Project-Based Pricing
          </h2>
          <p className="text-text-light mb-8">
            Transparent ranges for common project scopes. We&apos;ll confirm a
            final quote after discovery.
          </p>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm border-collapse">
            <thead>
              <tr className="bg-primary text-white">
                <th className="px-4 py-3 text-left">Scope</th>
                <th className="px-4 py-3 text-left">Price Range</th>
              </tr>
            </thead>
            <tbody>
              {projectPricing.map((p, index) => (
                <AnimateIn
                  as="tr"
                  key={p.scope}
                  delay={index * 0.1}
                  data-testid="project-row"
                  className="border-b last:border-b-0"
                >
                  <td className="px-4 py-3 text-text-main">{p.scope}</td>
                  <td className="px-4 py-3 text-text-main">
                    €{p.priceRange.min}–€{p.priceRange.max}
                  </td>
                </AnimateIn>
              ))}
            </tbody>
          </table>
        </div>
      </SectionWrapper>
      </AnimateIn>

      <AnimateIn delay={0}>
      <SectionWrapper bgColor="white" padding="lg">
        <div className="text-center">
          <h2 className="text-3xl font-semibold text-text-main mb-4">
            How We Compare
          </h2>
          <p className="text-text-light mb-8">
            A quick, oversimplified view—so you can sanity-check fit.
          </p>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm border-collapse">
            <thead>
              <tr className="bg-primary text-white">
                <th className="px-4 py-3 text-left">Provider</th>
                <th className="px-4 py-3 text-left">Cost</th>
                <th className="px-4 py-3 text-left">VirtuALL NP</th>
              </tr>
            </thead>
            <tbody>
              <AnimateIn as="tr" delay={0} className="border-b">
                <td className="px-4 py-3 text-text-main">Content mills</td>
                <td className="px-4 py-3 text-text-light">
                  Low per-word rates, high volume
                </td>
                <td className="px-4 py-3 text-text-main">
                  Fewer pieces, higher depth, built for trust and reuse
                </td>
              </AnimateIn>
              <AnimateIn as="tr" delay={0.1} className="border-b">
                <td className="px-4 py-3 text-text-main">Generic agencies</td>
                <td className="px-4 py-3 text-text-light">
                  Higher retainers, broad services
                </td>
                <td className="px-4 py-3 text-text-main">
                  Focused scope on complex offers and research-backed content
                </td>
              </AnimateIn>
              <AnimateIn as="tr" delay={0.2}>
                <td className="px-4 py-3 text-text-main">Solo freelancers</td>
                <td className="px-4 py-3 text-text-light">
                  Varies widely by experience
                </td>
                <td className="px-4 py-3 text-text-main">
                  Clear structure, documented process, and LLM-aware delivery
                </td>
              </AnimateIn>
            </tbody>
          </table>
        </div>
      </SectionWrapper>
      </AnimateIn>

      <CtaSection
        title={homepage.cta.headline}
        description={homepage.cta.description}
        ctaLabel={homepage.cta.ctaText}
        ctaHref="/contact"
      />
    </main>
  );
}

