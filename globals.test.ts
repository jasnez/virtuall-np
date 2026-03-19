import fs from "node:fs";
import path from "node:path";

describe("globals.css base styles", () => {
  it("includes required CSS variables and base styles", () => {
    const globalsPath = path.join(process.cwd(), "src", "app", "globals.css");
    const css = fs.readFileSync(globalsPath, "utf8");

    expect(css).toMatch(/:root\s*\{/);
    expect(css).toMatch(/--primary:\s*#1B3A5C/i);
    expect(css).toMatch(/--accent:\s*#2E8B8B/i);
    expect(css).toMatch(/--text-main:\s*#1A1A2E/i);

    expect(css).toMatch(
      /html\s*\{[\s\S]*scroll-behavior:\s*smooth\s*;[\s\S]*\}/i,
    );
    expect(css).toMatch(
      /body\s*\{[\s\S]*font-family:\s*inherit[\s\S]*color:\s*#1A1A2E[\s\S]*line-height:\s*1\.7[\s\S]*\}/i,
    );
  });
});

