import { expect, test, type Locator } from "@playwright/test";

type Breakpoint = { name: string; width: number; height: number };
type Route = { name: string; path: string };

const breakpoints: Breakpoint[] = [
  { name: "iPhoneSE", width: 375, height: 812 },
  { name: "iPad", width: 768, height: 1024 },
  { name: "Laptop", width: 1024, height: 768 },
  { name: "Desktop", width: 1440, height: 900 },
];

const routes: Route[] = [
  { name: "Home", path: "/" },
  { name: "Services", path: "/services" },
  { name: "HowWeWork", path: "/how-we-work" },
  { name: "Packages", path: "/packages" },
  { name: "Contact", path: "/contact" },
];

async function expectMinTouchTarget(locator: Locator) {
  await locator.scrollIntoViewIfNeeded();
  const box = await locator.boundingBox();
  expect(box, "Expected touch target to have a bounding box").not.toBeNull();
  expect(box!.height).toBeGreaterThanOrEqual(44);
  expect(box!.width).toBeGreaterThanOrEqual(44);
}

async function gridColumns(page: any, selector: string) {
  return page.evaluate((sel) => {
    const el = document.querySelector(sel) as HTMLElement | null;
    if (!el) return null;
    const cs = window.getComputedStyle(el);
    const val = cs.gridTemplateColumns;
    // Some browsers may return `repeat(4, 1fr)`
    const repeatMatch = val.match(/repeat\((\d+),/);
    if (repeatMatch) return parseInt(repeatMatch[1], 10);
    return val.split(" ").filter(Boolean).length;
  }, selector);
}

test.describe("Responsive + usability smoke", () => {
  for (const bp of breakpoints) {
    for (const route of routes) {
      test(`${route.name} @ ${bp.name}`, async ({ page }) => {
        await page.setViewportSize({ width: bp.width, height: bp.height });
        await page.goto(route.path, { waitUntil: "domcontentloaded" });
        await page.waitForTimeout(800);

        // (2) Readability: ensure we do not render tiny 12px text
        await expect(page.locator(".text-xs")).toHaveCount(0);
        await expect(page.locator('[class*="text-[12px]"]')).toHaveCount(0);

        // (1) Navigation works
        const siteHeader = page.getByTestId("site-header");
        const openMenu = siteHeader.getByRole("button", { name: /open menu/i });

        if (bp.width < 768) {
          await expect(openMenu).toBeVisible();
          await openMenu.click();
          const overlay = page.getByTestId("mobile-overlay");
          await expect(overlay).toBeVisible();
          // Clicking overlay close can be intercepted by the sticky header.
          // Close via the header toggle instead (aria-label switches to "Close menu").
          await siteHeader.getByRole("button", { name: /close menu/i }).click({ force: true });
          await expect(overlay).toHaveCount(0);
        } else {
          await expect(openMenu).toBeHidden();

          // Quick sanity: desktop nav links exist
          await expect(siteHeader.getByRole("link", { name: "Services" })).toBeVisible();
        }

        // (4,5,6,7,8) Page-specific checks
        if (route.path === "/") {
          // Hero text width heuristic
          const heroHeadline = page.getByTestId("hero").locator("h1");
          const box = await heroHeadline.boundingBox();
          expect(box).not.toBeNull();
          expect(box!.width).toBeGreaterThan(240);
          expect(box!.width).toBeLessThanOrEqual(bp.width - 20);

          // Cards stack: ValueProps grid columns
          const cols = await gridColumns(page, '[data-testid="value-props-grid"]');
          expect(cols).not.toBeNull();
          expect(cols).toBe( bp.width < 768 ? 1 : bp.width < 1024 ? 2 : 4);

          // CTA touch targets
          const hero = page.getByTestId("hero");
          await expectMinTouchTarget(hero.getByRole("link", { name: "See Our Services" }));
          await expectMinTouchTarget(hero.getByRole("link", { name: "Get a Quote" }));
        }

        if (route.path === "/services") {
          const cols = await gridColumns(page, '[data-testid^="service-section-"]');
          expect(cols).not.toBeNull();
          expect(cols).toBe(bp.width < 1024 ? 1 : 2);

          // CTA touch targets
          const cta = page.locator('a[href*="/contact?service="]').first();
          await expectMinTouchTarget(cta);
        }

        if (route.path === "/how-we-work") {
          // Timeline steps direction alternates stack on mobile
          const flexDir = await page.evaluate(() => {
            const step = document.querySelector('[data-testid="timeline-step"]') as HTMLElement | null;
            if (!step) return null;
            const relative = step.parentElement; // div.relative
            const wrapper = relative?.parentElement; // framer motion wrapper
            if (!wrapper) return null;
            return window.getComputedStyle(wrapper).flexDirection;
          });
          expect(flexDir).not.toBeNull();
          expect(flexDir).toBe(bp.width < 768 ? "column" : "row");

          await expectMinTouchTarget(
            page.getByRole("link", { name: "Contact VirtuALL NP" }),
          );
        }

        if (route.path === "/packages") {
          const pricingCard = page.getByTestId("pricing-card").first();
          const pricingGridCols = await pricingCard.evaluate((el: HTMLElement) => {
            const grid = el.closest("div.grid") as HTMLElement | null;
            if (!grid) return null;
            const cs = window.getComputedStyle(grid);
            const val = cs.gridTemplateColumns;
            const repeatMatch = val.match(/repeat\((\d+),/);
            if (repeatMatch) return parseInt(repeatMatch[1], 10);
            return val.split(" ").filter(Boolean).length;
          });
          expect(pricingGridCols).not.toBeNull();
          expect(pricingGridCols).toBe(bp.width < 768 ? 1 : 3);

          const addOnCard = page.getByTestId("addon-card").first();
          const addOnGridCols = await addOnCard.evaluate((el: HTMLElement) => {
            const grid = el.closest("div.grid") as HTMLElement | null;
            if (!grid) return null;
            const cs = window.getComputedStyle(grid);
            const val = cs.gridTemplateColumns;
            const repeatMatch = val.match(/repeat\((\d+),/);
            if (repeatMatch) return parseInt(repeatMatch[1], 10);
            return val.split(" ").filter(Boolean).length;
          });
          expect(addOnGridCols).not.toBeNull();
          expect(addOnGridCols).toBe(bp.width < 768 ? 1 : bp.width < 1024 ? 2 : 3);

          if (bp.width < 768) {
            // Tables horizontal scroll on mobile
            const tableWrapper = page.locator("div.overflow-x-auto").first();
            await expect(tableWrapper).toBeVisible();
            const overflowX = await tableWrapper.evaluate((el: HTMLElement) => window.getComputedStyle(el).overflowX);
            expect(overflowX === "auto" || overflowX === "scroll").toBeTruthy();
            const scroll = await tableWrapper.evaluate((el: HTMLElement) => el.scrollWidth > el.clientWidth);
            expect(scroll).toBeTruthy();
          }

          const pkgCta = page.locator('a[href*="/contact?package="]').first();
          await expectMinTouchTarget(pkgCta);
          await expectMinTouchTarget(
            page.getByRole("link", { name: "Contact VirtuALL NP" }),
          );
        }

        if (route.path === "/contact") {
          // Form stacked: grid cols should be 1 on mobile
          const formGridCols = await page.locator("form").first().evaluate((formEl: HTMLElement) => {
            const grid = formEl.closest("div.grid") as HTMLElement | null;
            if (!grid) return null;
            const cs = window.getComputedStyle(grid);
            const val = cs.gridTemplateColumns;
            const repeatMatch = val.match(/repeat\((\d+),/);
            if (repeatMatch) return parseInt(repeatMatch[1], 10);
            return val.split(" ").filter(Boolean).length;
          });
          expect(formGridCols).not.toBeNull();
          expect(formGridCols).toBe(bp.width < 1024 ? 1 : 2);

          // Submit touch target
          await expectMinTouchTarget(page.getByRole("button", { name: "Send Message" }));
        }

        // (7) Footer columns stack
        const footerCols = await page.evaluate(() => {
          const footer = document.querySelector("footer") as HTMLElement | null;
          if (!footer) return null;
          const grid = footer.querySelector("div.grid") as HTMLElement | null;
          if (!grid) return null;
          const cs = window.getComputedStyle(grid);
          const val = cs.gridTemplateColumns;
          const repeatMatch = val.match(/repeat\((\d+),/);
          if (repeatMatch) return parseInt(repeatMatch[1], 10);
          return val.split(" ").filter(Boolean).length;
        });
        expect(footerCols).not.toBeNull();
        if (bp.width < 768) expect(footerCols).toBe(1);
        else expect(footerCols).toBeGreaterThanOrEqual(3);
      });
    }
  }
});

