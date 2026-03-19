import siteConfig from "@/content/site-config.json";
import services from "@/content/services.json";
import packages from "@/content/packages.json";

export type StructuredDataPage = "home" | "services" | "packages";

const schemaOrgContext = "https://schema.org";

function buildPostalAddress() {
  const addr = siteConfig.contact.address;
  return {
    "@type": "PostalAddress",
    streetAddress: addr.street,
    addressLocality: addr.city,
    postalCode: addr.zip,
    addressCountry: addr.country,
  };
}

function buildProviderOrg() {
  return {
    "@type": "Organization",
    name: siteConfig.siteName,
    url: siteConfig.url,
  };
}

export function generateJsonLd(page: StructuredDataPage) {
  const logoUrl = siteConfig.logoUrl ?? "/og.png";
  const openingHours = siteConfig.openingHours ?? "Mo-Fr 09:00-17:00";

  const organization = {
    "@type": "Organization",
    name: siteConfig.siteName,
    url: siteConfig.url,
    logo: logoUrl,
    contactPoint: {
      "@type": "ContactPoint",
      telephone: siteConfig.contact.phone,
      email: siteConfig.contact.email,
      contactType: "customer support",
    },
    address: buildPostalAddress(),
    sameAs: [siteConfig.social.linkedin, siteConfig.social.x],
  };

  const localBusiness = {
    "@type": "LocalBusiness",
    name: siteConfig.siteName,
    url: siteConfig.url,
    telephone: siteConfig.contact.phone,
    email: siteConfig.contact.email,
    address: buildPostalAddress(),
    openingHours,
  };

  if (page === "home") {
    return {
      "@context": schemaOrgContext,
      "@graph": [organization, localBusiness],
    };
  }

  if (page === "services") {
    const graph = services.map((svc) => ({
      "@type": "Service",
      name: svc.title,
      description: svc.fullDescription,
      provider: buildProviderOrg(),
    }));

    return {
      "@context": schemaOrgContext,
      "@graph": graph,
    };
  }

  // packages
  const graph = packages.packages.map((pkg) => ({
    "@type": "Offer",
    name: pkg.name,
    price: pkg.priceRange.min,
    priceCurrency: pkg.priceRange.currency,
    description: pkg.researchDepth,
  }));

  return {
    "@context": schemaOrgContext,
    "@graph": graph,
  };
}

