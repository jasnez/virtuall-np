import siteConfig from "@/content/site-config.json";

export default function robots() {
  return {
    rules: [{ userAgent: "*", allow: "/" }],
    sitemap: `${siteConfig.url}/sitemap.xml`,
  };
}

