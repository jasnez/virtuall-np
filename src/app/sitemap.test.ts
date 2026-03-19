import sitemap from "./sitemap";

describe("sitemap (metadata route)", () => {
  it("exports array of url objects with correct priorities", () => {
    const entries = sitemap();

    expect(Array.isArray(entries)).toBe(true);
    expect(entries.length).toBe(6);

    const byUrl = new Map(entries.map((e: any) => [e.url, e]));

    expect(byUrl.get("https://virtuall-np.com/")?.priority).toBe(1.0);

    expect(byUrl.get("https://virtuall-np.com/services/")?.priority).toBe(
      0.9,
    );
    expect(byUrl.get("https://virtuall-np.com/packages/")?.priority).toBe(0.8);
    expect(byUrl.get("https://virtuall-np.com/how-we-work/")?.priority).toBe(
      0.8,
    );
    expect(byUrl.get("https://virtuall-np.com/contact/")?.priority).toBe(0.7);
    expect(
      byUrl.get("https://virtuall-np.com/privacy-policy/")?.priority,
    ).toBe(0.3);

    for (const e of entries) {
      expect(typeof e.url).toBe("string");
      expect(e.changeFrequency).toBe("monthly");
      expect(e.priority).toEqual(expect.any(Number));
      expect(e.lastModified instanceof Date).toBe(true);
    }
  });
});

