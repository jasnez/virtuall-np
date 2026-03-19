import fs from "node:fs";
import path from "node:path";

describe("Performance: lazy framer-motion animations", () => {
  it("AnimateIn uses next/dynamic with ssr:false", () => {
    const animateInPath = path.join(
      process.cwd(),
      "src",
      "components",
      "ui",
      "AnimateIn.tsx",
    );
    const tsx = fs.readFileSync(animateInPath, "utf8");

    expect(tsx).toMatch(/from\s+["']next\/dynamic["']/);
    // We expect AnimateInMotion to be lazily loaded via next/dynamic.
    // `ssr` can be false (if animations must be client-only) or true (for better LCP).
    expect(tsx).toMatch(/ssr:\s*(false|true)/);
    // We expect a lazy loaded implementation chunk
    expect(tsx).toMatch(/import\(\s*["']\.\/AnimateInMotion["']\s*\)/);
  });
});

