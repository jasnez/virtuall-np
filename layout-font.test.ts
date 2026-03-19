import fs from "node:fs";
import path from "node:path";

describe("Root layout font", () => {
  it("uses Inter from next/font/google and applies inter.className on <html>", () => {
    const layoutPath = path.join(process.cwd(), "src", "app", "layout.tsx");
    const tsx = fs.readFileSync(layoutPath, "utf8");

    expect(tsx).toMatch(/from\s+["']next\/font\/google["']/);
    expect(tsx).toMatch(/\bInter\b/);
    expect(tsx).toMatch(/subsets:\s*\[\s*["']latin["']\s*\]/);
    expect(tsx).toMatch(/weight:\s*\[\s*["']400["']\s*,\s*["']700["']\s*\]/);
    expect(tsx).not.toMatch(/variable:\s*["']--font-inter["']/);

    expect(tsx).toMatch(/<html[^>]*className=\{inter\.className\}/);
  });
});

