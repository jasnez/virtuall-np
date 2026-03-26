import { render, screen } from "@testing-library/react";

jest.mock("next/dynamic", () => {
  return (_loader: any) => {
    // In tests, avoid async/dynamic loading; render the real implementation directly.
    // eslint-disable-next-line global-require
    const mod = require("@/components/ui/AnimateInMotion");
    return mod.AnimateInMotion;
  };
});

jest.mock("framer-motion", () => ({
  __esModule: true,
  useInView: () => true,
  motion: {
    div: ({ children, className }: any) => (
      <div data-testid="motion-div" className={className}>
        {children}
      </div>
    ),
  },
}));

import homepage from "@/content/homepage.json";
import metadataJson from "@/content/metadata.json";
import Page, { metadata } from "./page";

describe("Home page", () => {
  it("exports correct metadata", () => {
    expect(metadata.title).toBe(metadataJson.home.title);
    expect(metadata.description).toBe(metadataJson.home.description);
  });

  it("renders all main sections", () => {
    render(<Page />);

    expect(
      screen.getByRole("heading", { name: homepage.hero.headline }),
    ).toBeInTheDocument();

    expect(
      screen.getByRole("heading", {
        name: homepage.valueProps[0].title,
        level: 3,
      }),
    ).toBeInTheDocument();

    expect(
      screen.getByRole("heading", { name: "What We Do", level: 2 }),
    ).toBeInTheDocument();

    expect(
      screen.getByRole("heading", { name: "Why Work With Us", level: 2 }),
    ).toBeInTheDocument();

    expect(
      screen.getByRole("heading", {
        name: /Ready for content that sounds like your brand and reads like it was written with care\?/i,
        level: 2,
      }),
    ).toBeInTheDocument();
  });

  it("is usable and readable on common breakpoints", () => {
    const breakpoints = [375, 768, 1024, 1440];

    // eslint-disable-next-line no-restricted-syntax
    for (const width of breakpoints) {
      Object.defineProperty(window, "innerWidth", { value: width, writable: true });
      window.dispatchEvent(new Event("resize"));

      const { unmount } = render(<Page />);

      // text readability: no tiny text sizes
      expect(document.querySelector(".text-xs")).toBeNull();

      // hero text width constraint
      const hero = screen.getByTestId("hero");
      const heroContent = hero.querySelector("[data-testid='hero-content']");
      expect(heroContent).not.toBeNull();
      expect(heroContent).toHaveClass("max-w-[680px]");

      // value props should stack on mobile
      const valueGrid = screen.getByTestId("value-props-grid");
      expect(valueGrid).toHaveClass("grid-cols-1");

      // touch targets: hero CTAs
      const cta1 = screen.getByRole("link", { name: "See Our Services" });
      const cta2 = screen.getByRole("link", { name: "Get a Quote" });
      expect(cta1).toHaveClass("min-h-[48px]");
      expect(cta2).toHaveClass("min-h-[48px]");

      // CTA color sanity checks (avoid white text on light backgrounds).
      expect(cta1).toHaveClass("text-[#0F2440]");
      expect(cta1).not.toHaveClass("text-white");
      expect(cta1).toHaveClass("hover:bg-white/95");

      expect(cta2).toHaveClass("text-white");
      expect(cta2).toHaveClass("hover:text-white");

      const ctaSectionButton = screen.getByRole("link", {
        name: homepage.cta.ctaText,
      });
      expect(ctaSectionButton).toHaveClass("bg-accent-dark", "text-white");
      expect(ctaSectionButton).toHaveClass("hover:bg-accent-dark/92");
      unmount();
    }
  });
})

