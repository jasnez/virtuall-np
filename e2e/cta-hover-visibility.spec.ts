import { expect, test, type Locator } from "@playwright/test";

function parseRgbColor(color: string): { r: number; g: number; b: number; a: number } | null {
  // Examples:
  // - "rgb(255, 255, 255)"
  // - "rgba(255, 255, 255, 0.9)"
  const m = color.match(/rgba?\(([^)]+)\)/i);
  if (!m) return null;
  const parts = m[1].split(",").map((p) => p.trim());
  const r = Number(parts[0]);
  const g = Number(parts[1]);
  const b = Number(parts[2]);
  const a = parts.length >= 4 ? Number(parts[3]) : 1;
  if ([r, g, b, a].some((v) => Number.isNaN(v))) return null;
  return { r, g, b, a };
}

function relativeLuminance(r: number, g: number, b: number): number {
  // WCAG relative luminance
  const srgbToLinear = (c: number) => {
    const v = c / 255;
    return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
  };
  const R = srgbToLinear(r);
  const G = srgbToLinear(g);
  const B = srgbToLinear(b);
  return 0.2126 * R + 0.7152 * G + 0.0722 * B;
}

async function getComputedColors(locator: Locator) {
  const { color, backgroundColor } = await locator.evaluate((el) => {
    const cs = window.getComputedStyle(el);
    return { color: cs.color, backgroundColor: cs.backgroundColor };
  });
  return { color, backgroundColor };
}

function contrastRatio(
  text: { r: number; g: number; b: number; a: number },
  background: { r: number; g: number; b: number; a: number },
): number | null {
  if (text.a < 0.5 || background.a < 0.5) return null;
  const Lt = relativeLuminance(text.r, text.g, text.b);
  const Lb = relativeLuminance(background.r, background.g, background.b);
  const lighter = Math.max(Lt, Lb);
  const darker = Math.min(Lt, Lb);
  return (lighter + 0.05) / (darker + 0.05);
}

function isLightColor(color: string): boolean {
  const parsed = parseRgbColor(color);
  if (!parsed) return false;
  // If fully transparent, treat as not light.
  if (parsed.a <= 0.05) return false;
  const lum = relativeLuminance(parsed.r, parsed.g, parsed.b);
  // Threshold chosen to catch "white text on light/white background".
  return lum > 0.75;
}

function assertNotLightTextOnLightBackground(color: string, backgroundColor: string) {
  const textIsLight = isLightColor(color);
  const bgIsLight = isLightColor(backgroundColor);
  expect(textIsLight && bgIsLight).toBe(false);
}

function assertCtaReadable(color: string, backgroundColor: string, label: string) {
  // Keep the previous “light-on-light” guardrail.
  assertNotLightTextOnLightBackground(color, backgroundColor);

  const parsedText = parseRgbColor(color);
  const parsedBg = parseRgbColor(backgroundColor);
  if (!parsedText || !parsedBg) return;

  const cr = contrastRatio(parsedText, parsedBg);
  if (cr === null) return;

  // CTA text should be readable; enforce a conservative AA-ish contrast target.
  expect(
    cr,
    `${label}: expected contrast ratio >= 4.5, got ${cr.toFixed(2)} (text=${color}, bg=${backgroundColor})`,
  ).toBeGreaterThanOrEqual(4.5);
}

async function assertCtaHoverReadable(cta: Locator) {
  const before = await getComputedColors(cta);
  assertCtaReadable(before.color, before.backgroundColor, "CTA default state");

  await cta.hover({ force: true });
  const after = await getComputedColors(cta);
  assertCtaReadable(after.color, after.backgroundColor, "CTA hover state");
}

test.describe("CTA hover visibility", () => {
  const breakpoints = [
    { name: "iPhoneSE", width: 375, height: 812 },
    { name: "iPad", width: 768, height: 1024 },
    { name: "Laptop", width: 1024, height: 768 },
    { name: "Desktop", width: 1440, height: 900 },
  ];

  test("Home hero CTAs are readable on hover (all breakpoints)", async ({
    page,
  }) => {
    for (const bp of breakpoints) {
      await page.setViewportSize({ width: bp.width, height: bp.height });
      await page.goto("/", { waitUntil: "domcontentloaded" });

      const hero = page.getByTestId("hero");
      const seeServices = hero.getByRole("link", { name: "See Our Services" });
      const getQuote = hero.getByRole("link", { name: "Get a Quote" });

      await expect(seeServices).toBeVisible();
      await expect(getQuote).toBeVisible();

      // eslint-disable-next-line no-await-in-loop
      await assertCtaHoverReadable(seeServices);
      // eslint-disable-next-line no-await-in-loop
      await assertCtaHoverReadable(getQuote);
    }
  });

  test("Home CTA section button is readable on hover (all breakpoints)", async ({
    page,
  }) => {
    for (const bp of breakpoints) {
      await page.setViewportSize({ width: bp.width, height: bp.height });
      await page.goto("/", { waitUntil: "domcontentloaded" });

      const cta = page.getByRole("link", { name: "Contact VirtuALL NP" });
      await expect(cta).toBeVisible();

      // eslint-disable-next-line no-await-in-loop
      await assertCtaHoverReadable(cta);
    }
  });

  test("Packages CTAs are readable on hover (all breakpoints)", async ({
    page,
  }) => {
    for (const bp of breakpoints) {
      await page.setViewportSize({ width: bp.width, height: bp.height });
      await page.goto("/packages", { waitUntil: "domcontentloaded" });

      const ctaStarter = page.getByRole("link", { name: "Choose Starter" });
      const ctaProfessional = page.getByRole("link", {
        name: "Choose Professional",
      });
      const ctaPremium = page.getByRole("link", { name: "Choose Premium" });

      await expect(ctaStarter).toBeVisible();
      await expect(ctaProfessional).toBeVisible();
      await expect(ctaPremium).toBeVisible();

      // eslint-disable-next-line no-await-in-loop
      await assertCtaHoverReadable(ctaStarter);
      // eslint-disable-next-line no-await-in-loop
      await assertCtaHoverReadable(ctaProfessional);
      // eslint-disable-next-line no-await-in-loop
      await assertCtaHoverReadable(ctaPremium);
    }
  });

  test("Services CTAs are readable on hover (all breakpoints)", async ({
    page,
  }) => {
    for (const bp of breakpoints) {
      await page.setViewportSize({ width: bp.width, height: bp.height });
      await page.goto("/services", { waitUntil: "domcontentloaded" });

      const ctas = page.locator('a[href*="/contact?service="]');
      const count = await ctas.count();
      expect(count).toBeGreaterThan(0);

      for (let i = 0; i < count; i += 1) {
        // eslint-disable-next-line no-await-in-loop
        await assertCtaHoverReadable(ctas.nth(i));
      }
    }
  });

  test("HowWeWork CTA button is readable on hover (all breakpoints)", async ({
    page,
  }) => {
    for (const bp of breakpoints) {
      await page.setViewportSize({ width: bp.width, height: bp.height });
      await page.goto("/how-we-work", { waitUntil: "domcontentloaded" });

      const cta = page
        .getByRole("link", { name: "Contact VirtuALL NP" })
        .first();
      await expect(cta).toBeVisible();

      // eslint-disable-next-line no-await-in-loop
      await assertCtaHoverReadable(cta);
    }
  });

  test("Contact submit button is readable on hover (all breakpoints)", async ({
    page,
  }) => {
    for (const bp of breakpoints) {
      await page.setViewportSize({ width: bp.width, height: bp.height });
      await page.goto("/contact", { waitUntil: "domcontentloaded" });

      const submit = page
        .getByRole("button", { name: "Send Message" })
        .first();
      await expect(submit).toBeVisible();

      // eslint-disable-next-line no-await-in-loop
      await assertCtaHoverReadable(submit);
    }
  });
});

