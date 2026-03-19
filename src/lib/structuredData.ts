import siteConfig from "@/content/site-config.json";
import services from "@/content/services.json";
import packages from "@/content/packages.json";

export type StructuredDataPage = "home" | "services" | "packages";

const schemaOrgContext = "https://schema.org";
const orgId = `${siteConfig.url}#organization`;
const localBusinessId = `${siteConfig.url}#local-business`;

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
    "@id": orgId,
    "@type": "Organization",
    name: siteConfig.siteName,
    url: siteConfig.url,
  };
}

export function generateJsonLd(page: StructuredDataPage) {
  const logoUrl = new URL(siteConfig.logoUrl ?? "/og-image.jpg", siteConfig.url).toString();
  const openingHours = siteConfig.openingHours ?? "Mo-Fr 09:00-17:00";

  const organization = {
    "@id": orgId,
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
    sameAs: [siteConfig.social.linkedin, siteConfig.social.x].filter(Boolean),
  };

  const localBusiness = {
    "@id": localBusinessId,
    "@type": "LocalBusiness",
    name: siteConfig.siteName,
    url: siteConfig.url,
    image: logoUrl,
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
    const graph = services.map((svc) => {
      const serviceUrl = `${siteConfig.url}/services#${svc.slug}`;
      return {
        "@id": serviceUrl,
        "@type": "Service",
        name: svc.title,
        serviceType: svc.title,
        description: svc.fullDescription,
        url: serviceUrl,
        areaServed: siteConfig.contact.address.country,
        provider: buildProviderOrg(),
      };
    });

    return {
      "@context": schemaOrgContext,
      "@graph": graph,
    };
  }

  // packages
  const graph = packages.packages.map((pkg) => ({
    "@id": `${siteConfig.url}/packages#${pkg.id}`,
    "@type": "Offer",
    name: pkg.name,
    url: `${siteConfig.url}/packages#${pkg.id}`,
    price: pkg.priceRange.min,
    priceCurrency: pkg.priceRange.currency,
    availability: "https://schema.org/InStock",
    description: pkg.researchDepth,
    seller: buildProviderOrg(),
  }));

  return {
    "@context": schemaOrgContext,
    "@graph": graph,
  };
}

