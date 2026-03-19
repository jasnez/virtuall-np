import fs from "node:fs";
import path from "node:path";

describe("next.config turbopack root", () => {
  it("defines turbopack.root to avoid workspace-root inference warning", () => {
    const nextConfigPath = path.join(process.cwd(), "next.config.ts");
    const tsx = fs.readFileSync(nextConfigPath, "utf8");

    expect(tsx).toMatch(/turbopack\s*:\s*\{[\s\S]*root\s*:\s*__dirname/);
  });
});

