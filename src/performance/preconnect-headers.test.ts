import fs from "node:fs";
import path from "node:path";

describe("Performance: preconnect headers", () => {
  it("adds preconnect links for GA and Google Fonts", () => {
    const layoutPath = path.join(process.cwd(), "src", "app", "layout.tsx");
    const tsx = fs.readFileSync(layoutPath, "utf8");

    expect(tsx).toMatch(/rel=["']preconnect["']/i);
    expect(tsx).toMatch(/fonts\.googleapis\.com/i);
    expect(tsx).toMatch(/fonts\.gstatic\.com/i);

    // Google Analytics preconnect
    expect(tsx).toMatch(/google-analytics\.com/i);
  });
});

