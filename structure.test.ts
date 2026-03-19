import fs from "node:fs";
import path from "node:path";

const exists = (p: string) => fs.existsSync(path.join(process.cwd(), p));

describe("project placeholder structure", () => {
  it("has all requested directories and placeholder files", () => {
    const paths = [
      "src/components",
      "src/components/Header.tsx",
      "src/components/Footer.tsx",

      "src/components/ui",
      "src/components/ui/Button.tsx",
      "src/components/ui/Card.tsx",
      "src/components/ui/Input.tsx",
      "src/components/ui/SectionWrapper.tsx",

      "src/components/sections",
      "src/components/sections/Hero.tsx",
      "src/components/sections/ValueProps.tsx",
      "src/components/sections/ServicesPreview.tsx",
      "src/components/sections/TrustSection.tsx",
      "src/components/sections/CtaSection.tsx",

      "src/content",
      "src/content/site-config.json",
      "src/content/services.json",
      "src/content/packages.json",
      "src/content/process-steps.json",
      "src/content/faq.json",
      "src/content/homepage.json",
      "src/content/metadata.json",

      "src/lib",
      "src/lib/utils.ts",
      "src/lib/validations.ts",
      "src/lib/send-email.ts",

      "src/types",
      "src/types/index.ts",
    ] as const;

    for (const p of paths) {
      expect(exists(p)).toBe(true);
    }
  });
});

