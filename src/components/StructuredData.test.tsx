import { render } from "@testing-library/react";

import siteConfig from "@/content/site-config.json";
import services from "@/content/services.json";
import packages from "@/content/packages.json";

import StructuredData from "./StructuredData";
import { generateJsonLd } from "@/lib/structuredData";

describe("StructuredData (JSON-LD)", () => {
  it("home: generates Organization + LocalBusiness + WebSite", () => {
    const jsonLd = generateJsonLd("home");

    expect(jsonLd["@context"]).toBe("https://schema.org");
    expect(Array.isArray(jsonLd["@graph"])).toBe(true);

    const types = jsonLd["@graph"].map((n: any) => n["@type"]);
    expect(types).toContain("Organization");
    expect(types).toContain("LocalBusiness");
    expect(types).toContain("WebSite");

    const org = jsonLd["@graph"].find((n: any) => n["@type"] === "Organization");
    expect(org.name).toBe(siteConfig.siteName);
    expect(org.url).toBe(siteConfig.url);
    expect(org.logo).toBe(`${siteConfig.url}${siteConfig.logoUrl}`);
    expect(org["@id"]).toBe(`${siteConfig.url}#organization`);
    expect(org.contactPoint.telephone).toBe(siteConfig.contact.phone);
    expect(org.address.addressLocality).toBe(siteConfig.contact.address.city);
    expect(org.sameAs).toEqual([
      siteConfig.social.linkedin,
      siteConfig.social.x,
    ]);

    const localBusiness = jsonLd["@graph"].find(
      (n: any) => n["@type"] === "LocalBusiness",
    );
    expect(localBusiness["@id"]).toBe(`${siteConfig.url}#local-business`);
    expect(localBusiness.name).toBe(siteConfig.siteName);
    expect(localBusiness.url).toBe(siteConfig.url);
    expect(localBusiness.telephone).toBe(siteConfig.contact.phone);
    expect(localBusiness.email).toBe(siteConfig.contact.email);
    expect(localBusiness.openingHours).toBe(siteConfig.openingHours);

    const website = jsonLd["@graph"].find((n: any) => n["@type"] === "WebSite");
    expect(website["@id"]).toBe(`${siteConfig.url}#website`);
    expect(website.url).toBe(siteConfig.url);
    expect(website.publisher).toEqual({ "@id": `${siteConfig.url}#organization` });
  });

  it("home: StructuredData injects script into document.head", () => {
    render(<StructuredData page="home" />);

    const script = document.querySelector(
      'script[type="application/ld+json"]',
    );
    expect(script).toBeTruthy();

    const parsed = JSON.parse(script?.textContent ?? "{}");
    expect(parsed["@context"]).toBe("https://schema.org");
    expect(parsed["@graph"].length).toBeGreaterThan(0);
  });

  it("services: generates one Service schema per service", () => {
    const jsonLd = generateJsonLd("services");
    const graph = jsonLd["@graph"];

    expect(graph).toHaveLength(services.length);

    graph.forEach((node: any) => {
      expect(node["@type"]).toBe("Service");
      expect(node.url).toContain(`${siteConfig.url}/services#`);
      expect(node.areaServed).toBe(siteConfig.contact.address.country);
      expect(node.provider).toEqual({
        "@id": `${siteConfig.url}#organization`,
        "@type": "Organization",
        name: siteConfig.siteName,
        url: siteConfig.url,
      });
    });

    expect(graph[0].name).toBe(services[0].title);
    expect(graph[0].description).toBe(services[0].fullDescription);
  });

  it("packages: generates one Offer schema per package", () => {
    const jsonLd = generateJsonLd("packages");
    const graph = jsonLd["@graph"];

    expect(graph).toHaveLength(packages.packages.length);

    const first = graph[0] as any;
    expect(first["@type"]).toBe("Offer");
    expect(first.url).toContain(`${siteConfig.url}/packages#`);
    expect(first.price).toBe(packages.packages[0].priceRange.min);
    expect(first.priceCurrency).toBe(packages.packages[0].priceRange.currency);
    expect(first.availability).toBe("https://schema.org/InStock");
    expect(first.description).toBe(packages.packages[0].researchDepth);
  });
});

