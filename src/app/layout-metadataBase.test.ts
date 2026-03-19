import fs from "node:fs";
import path from "node:path";

describe("Root layout metadataBase", () => {
  it("sets metadataBase so OG/Twitter URLs resolve without Next warning", () => {
    const layoutPath = path.join(process.cwd(), "src", "app", "layout.tsx");
    const tsx = fs.readFileSync(layoutPath, "utf8");

    // We expect metadataBase to be defined using siteConfig.url.
    // Example: metadataBase: new URL(siteConfig.url),
    expect(tsx).toMatch(/metadataBase\s*:\s*new\s+URL\(\s*siteConfig\.url\s*\)/);
  });
});

