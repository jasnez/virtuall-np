import siteConfig from "@/content/site-config.json";

type ChangeFrequency = "monthly";

type SitemapUrl = {
  url: string;
  lastModified: Date;
  changeFrequency: ChangeFrequency;
  priority: number;
};

const lastModified = new Date();
const changeFrequency: ChangeFrequency = "monthly";

const withTrailingSlash = (path: string) =>
  path.endsWith("/") ? path : `${path}/`;

export default function sitemap(): SitemapUrl[] {
  const base = siteConfig.url;

  return [
    {
      url: withTrailingSlash(base),
      lastModified,
      changeFrequency,
      priority: 1.0,
    },
    {
      url: withTrailingSlash(`${base}/services`),
      lastModified,
      changeFrequency,
      priority: 0.9,
    },
    {
      url: withTrailingSlash(`${base}/packages`),
      lastModified,
      changeFrequency,
      priority: 0.8,
    },
    {
      url: withTrailingSlash(`${base}/how-we-work`),
      lastModified,
      changeFrequency,
      priority: 0.8,
    },
    {
      url: withTrailingSlash(`${base}/contact`),
      lastModified,
      changeFrequency,
      priority: 0.7,
    },
    {
      url: withTrailingSlash(`${base}/privacy-policy`),
      lastModified,
      changeFrequency,
      priority: 0.3,
    },
  ];
}

