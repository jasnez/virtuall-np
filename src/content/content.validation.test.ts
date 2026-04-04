import fs from "node:fs";
import path from "node:path";
import { z } from "zod";

const readJson = (relativePath: string) => {
  const fullPath = path.join(process.cwd(), "src", "content", relativePath);
  const raw = fs.readFileSync(fullPath, "utf8");
  return JSON.parse(raw);
};

const AddressSchema = z.object({
  street: z.string().min(1),
  city: z.string().min(1),
  country: z.string().min(1),
  zip: z.string().min(1),
});

const ContactInfoSchema = z.object({
  email: z.string().email(),
  phone: z.string().min(1),
  address: AddressSchema,
});

const SeoDefaultsSchema = z.object({
  title: z.string().min(1),
  description: z.string().min(1),
  ogTitle: z.string().min(1),
  ogDescription: z.string().min(1),
  /** Exact `content` value from Search Console → HTML tag (optional). */
  googleSiteVerification: z.string().min(1).optional(),
});

const SiteConfigSchema = z.object({
  siteName: z.string().min(1),
  tagline: z.string().min(1),
  url: z.string().url(),
  contact: ContactInfoSchema,
  social: z.record(z.string(), z.string()),
  seo: SeoDefaultsSchema,
});

const ServiceSchema = z.object({
  id: z.string().min(1),
  slug: z.string().min(1),
  title: z.string().min(1),
  icon: z.string().min(1),
  positioning: z.string().min(1),
  shortDescription: z.string().min(1),
  fullDescription: z.string().min(1),
  deliverables: z.array(z.string().min(1)).min(1),
  useCases: z.array(z.string().min(1)).min(1),
  ctaText: z.string().min(1),
});

const PriceRangeSchema = z.object({
  min: z.number().nonnegative(),
  max: z.number().nonnegative(),
  currency: z.string().min(1),
});

const PackageSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  featured: z.boolean(),
  targetClient: z.string().min(1),
  priceRange: PriceRangeSchema,
  wordLimit: z.number().int().positive(),
  turnaround: z.string().min(1),
  revisions: z.number().int().nonnegative(),
  researchDepth: z.string().min(1),
  includes: z.array(z.string().min(1)).min(1),
  ctaText: z.string().min(1),
});

const AddOnSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  price: z.number().nonnegative(),
  description: z.string().min(1),
});

const RetainerSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  monthlyRate: z.number().nonnegative(),
  wordVolume: z.number().nonnegative(),
  discount: z.number().nonnegative(),
  benefits: z.array(z.string().min(1)).min(1),
});

const ProjectPricingSchema = z.object({
  type: z.string().min(1),
  scope: z.string().min(1),
  priceRange: PriceRangeSchema,
});

const PackagesFileSchema = z.object({
  packages: z.array(PackageSchema).length(3),
  addOns: z.array(AddOnSchema).length(5),
  retainers: z.array(RetainerSchema).length(3),
  projectPricing: z.array(ProjectPricingSchema).length(4),
});

const ProcessStepSchema = z.object({
  step: z.number().int().positive(),
  title: z.string().min(1),
  description: z.string().min(1),
  icon: z.string().min(1),
});

const FaqItemSchema = z.object({
  question: z.string().min(1),
  answer: z.string().min(1),
});

const HomepageSchema = z.object({
  hero: z.object({
    headline: z.string().min(1),
    subheadline: z.string().min(1),
    primaryCtaText: z.string().min(1),
    secondaryCtaText: z.string().min(1),
  }),
  valueProps: z.array(
    z.object({
      title: z.string().min(1),
      description: z.string().min(1),
      icon: z.string().min(1),
    }),
  ).length(4),
  trust: z.object({
    headline: z.string().min(1),
    narrative: z.array(z.string().min(1)).min(2),
  }),
  cta: z.object({
    headline: z.string().min(1),
    description: z.string().min(1),
    ctaText: z.string().min(1),
  }),
});

const PageMetaSchema = z.object({
  title: z.string().min(1),
  description: z.string().min(1),
  ogTitle: z.string().min(1),
  ogDescription: z.string().min(1),
});

const MetadataSchema = z.object({
  home: PageMetaSchema,
  services: PageMetaSchema,
  pricing: PageMetaSchema,
  process: PageMetaSchema,
  faq: PageMetaSchema,
  contact: PageMetaSchema,
});

describe("src/content JSON", () => {
  it("site-config.json is valid and complete", () => {
    SiteConfigSchema.parse(readJson("site-config.json"));
  });

  it("services.json contains 4 complete services", () => {
    z.array(ServiceSchema).length(4).parse(readJson("services.json"));
  });

  it("packages.json contains packages, add-ons, retainers and project pricing", () => {
    PackagesFileSchema.parse(readJson("packages.json"));
  });

  it("process-steps.json contains 5 steps", () => {
    z.array(ProcessStepSchema).length(5).parse(readJson("process-steps.json"));
  });

  it("faq.json contains 8 items", () => {
    z.array(FaqItemSchema).length(8).parse(readJson("faq.json"));
  });

  it("homepage.json contains hero, value props, trust and CTA", () => {
    HomepageSchema.parse(readJson("homepage.json"));
  });

  it("metadata.json defines per-page SEO metadata", () => {
    MetadataSchema.parse(readJson("metadata.json"));
  });
});

