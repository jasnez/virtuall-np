jest.mock("next/og", () => ({
  // We only validate exports like `size` in this unit test.
  ImageResponse: jest.fn(),
}));

describe("OpenGraph image assets", () => {
  it("opengraph-image route exports size 1200x630", () => {
    // eslint-disable-next-line global-require
    const mod = require("./opengraph-image");
    expect(mod.size).toEqual({ width: 1200, height: 630 });
  });

  it('opengraph-image route does not use edge runtime', () => {
    // eslint-disable-next-line global-require
    const mod = require("./opengraph-image");
    // Next warning is triggered by `runtime = "edge"`.
    expect(mod.runtime).not.toBe("edge");
  });
});

