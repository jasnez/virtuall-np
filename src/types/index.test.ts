import type {
  AddOn,
  Address,
  ContactFormData,
  ContactInfo,
  FaqItem,
  Package,
  PageMeta,
  PriceRange,
  ProcessStep,
  ProjectPricing,
  Retainer,
  Service,
  SiteConfig,
} from "@/types";

describe("@/types exports", () => {
  it("can import and use all declared interfaces", () => {
    const address: Address = {
      street: "Main St 1",
      city: "Novi Sad",
      country: "RS",
      zip: "21000",
    };

    const contact: ContactInfo = {
      email: "hello@example.com",
      phone: "+38160000000",
      address,
    };

    const siteConfig: SiteConfig = {
      siteName: "VitruALL NP",
      tagline: "Tagline",
      url: "https://example.com",
      contact,
      social: {
        linkedin: "https://linkedin.com/in/example",
      },
      seo: {
        title: "Default title",
        description: "Default description",
        ogTitle: "OG title",
        ogDescription: "OG desc",
      },
    };

    const service: Service = {
      id: "s1",
      slug: "copywriting",
      title: "Copywriting",
      icon: "pen",
      positioning: "Positioning text",
      shortDescription: "Short",
      fullDescription: "Full",
      deliverables: ["Landing page"],
      useCases: ["B2B"],
      ctaText: "Get started",
    };

    const priceRange: PriceRange = { min: 100, max: 300, currency: "EUR" };

    const pkg: Package = {
      id: "p1",
      name: "Starter",
      featured: false,
      targetClient: "Solo founder",
      priceRange,
      wordLimit: 1000,
      turnaround: "3 days",
      revisions: 2,
      researchDepth: "Basic",
      includes: ["Kickoff call"],
      ctaText: "Choose",
    };

    const addon: AddOn = {
      id: "a1",
      name: "Extra revision",
      price: 50,
      description: "One extra revision",
    };

    const retainer: Retainer = {
      id: "r1",
      name: "Monthly",
      monthlyRate: 1000,
      wordVolume: 8000,
      discount: 10,
      benefits: ["Priority"],
    };

    const projectPricing: ProjectPricing = {
      type: "fixed",
      scope: "landing-page",
      priceRange,
    };

    const step: ProcessStep = {
      step: 1,
      title: "Discovery",
      description: "We align",
      icon: "search",
    };

    const faq: FaqItem = {
      question: "Q?",
      answer: "A.",
    };

    const form: ContactFormData = {
      name: "John",
      email: "john@example.com",
      serviceInterest: "copywriting",
      message: "Hello",
    };

    const meta: PageMeta = {
      title: "Title",
      description: "Desc",
      ogTitle: "OG Title",
      ogDescription: "OG Desc",
    };

    expect(siteConfig.siteName).toBeTruthy();
    expect(service.id).toBeTruthy();
    expect(pkg.priceRange.currency).toBeTruthy();
    expect(addon.price).toBeGreaterThan(0);
    expect(retainer.monthlyRate).toBeGreaterThan(0);
    expect(projectPricing.priceRange.min).toBeGreaterThanOrEqual(0);
    expect(step.step).toBe(1);
    expect(faq.question).toBeTruthy();
    expect(form.email).toContain("@");
    expect(meta.title).toBeTruthy();
  });
});

