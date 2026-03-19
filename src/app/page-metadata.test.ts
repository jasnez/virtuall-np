import type { Metadata } from "next";

import metadataJson from "@/content/metadata.json";
import siteConfig from "@/content/site-config.json";

import homePage, { metadata as homeMetadata } from "./page";
import servicesPage, {
  metadata as servicesMetadata,
} from "./services/page";
import packagesPage, {
  metadata as pricingMetadata,
} from "./packages/page";
import processPage, {
  metadata as processMetadata,
} from "./how-we-work/page";
import contactPage, {
  metadata as contactMetadata,
} from "./contact/page";

const baseUrl = siteConfig.url;
const ogImageUrl = "/og-image.jpg";

type PageKey = keyof typeof metadataJson;

type PageMetaCase = {
  routePath: string;
  metadataKey: PageKey;
  metadata: Metadata;
};

const urlForRoute = (routePath: string) => {
  // Next metadata expects a fully qualified URL.
  if (routePath === "/") return baseUrl;
  return `${baseUrl}${routePath}`;
};

const cases: PageMetaCase[] = [
  {
    routePath: "/",
    metadataKey: "home",
    metadata: homeMetadata as Metadata,
  },
  {
    routePath: "/services",
    metadataKey: "services",
    metadata: servicesMetadata as Metadata,
  },
  {
    routePath: "/packages",
    metadataKey: "pricing",
    metadata: pricingMetadata as Metadata,
  },
  {
    routePath: "/how-we-work",
    metadataKey: "process",
    metadata: processMetadata as Metadata,
  },
  {
    routePath: "/contact",
    metadataKey: "contact",
    metadata: contactMetadata as Metadata,
  },
];

describe("Page metadata (title/description + OG/twitter)", () => {
  it("exports unique title and description across pages", () => {
    const titles = cases.map((c) => c.metadata.title as string);
    const descriptions = cases.map((c) => c.metadata.description as string);

    expect(new Set(titles).size).toBe(titles.length);
    expect(new Set(descriptions).size).toBe(descriptions.length);
  });

  it("matches metadata.json and includes openGraph + twitter fields", () => {
    cases.forEach((c) => {
      const expected = metadataJson[c.metadataKey];

      expect(c.metadata.title).toBe(expected.title);
      expect(c.metadata.description).toBe(expected.description);

      expect(c.metadata.openGraph).toBeDefined();
      expect(c.metadata.openGraph?.title).toBe(expected.ogTitle);
      expect(c.metadata.openGraph?.description).toBe(expected.ogDescription);
      expect(c.metadata.openGraph?.url).toBe(urlForRoute(c.routePath));

      const images = c.metadata.openGraph?.images;
      expect(images).toBeDefined();
      expect(Array.isArray(images)).toBe(true);
      expect(images?.[0]?.url).toBe(ogImageUrl);

      expect(c.metadata.twitter).toBeDefined();
      expect(c.metadata.twitter?.card).toBe("summary_large_image");
      expect(c.metadata.twitter?.title).toBe(expected.ogTitle);
      expect(c.metadata.twitter?.description).toBe(expected.ogDescription);
      expect(c.metadata.twitter?.images).toEqual([ogImageUrl]);
    });
  });

  // Ensure imports above don't get tree-shaken away in certain Jest setups.
  it("imports pages successfully", () => {
    expect(homePage).toBeTruthy();
    expect(servicesPage).toBeTruthy();
    expect(packagesPage).toBeTruthy();
    expect(processPage).toBeTruthy();
    expect(contactPage).toBeTruthy();
  });
});

