import robots from "./robots";

describe("robots (metadata route)", () => {
  it("allows all and points to sitemap.xml", () => {
    const r: any = robots();

    expect(r).toBeTruthy();
    expect(r.sitemap).toBe("https://virtuall-np.com/sitemap.xml");

    // Expected Next.js metadata route shape:
    // { rules: [{ userAgent: '*', allow: '/' }], sitemap: '...' }
    expect(Array.isArray(r.rules)).toBe(true);

    const rule = r.rules.find((x: any) => x.userAgent === "*");
    expect(rule).toBeTruthy();
    expect(rule.allow).toBe("/");
  });
});

