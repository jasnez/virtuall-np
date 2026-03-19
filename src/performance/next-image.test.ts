import fs from "node:fs";
import path from "node:path";

describe("Performance: next/image usage", () => {
  it("does not use raw <img> tags (prefer next/image)", () => {
    const srcDir = path.join(process.cwd(), "src");
    // Shallow heuristic: scan all TS/TSX files for <img
    // This project currently seems to not render images directly.
    // Better: just read the entire src tree quickly for the substring.
    // (This test is a guardrail, not a full HTML parser.)
    const walker = (dir: string): string[] => {
      const entries = fs.readdirSync(dir, { withFileTypes: true });
      return entries.flatMap((e) => {
        const full = path.join(dir, e.name);
        if (e.isDirectory()) return walker(full);
        if (e.isFile() && full.match(/\\.(tsx|ts|jsx|js)$/)) return [full];
        return [];
      });
    };

    const all = walker(srcDir);
    const hasImg = all.some((f) => fs.readFileSync(f, "utf8").includes("<img"));
    expect(hasImg).toBe(false);
  });
});

