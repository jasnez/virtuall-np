import React from "react";
import { render, screen } from "@testing-library/react";

import pricing from "@/content/packages.json";
import metadataJson from "@/content/metadata.json";

jest.mock("framer-motion", () => {
  const React = require("react");
  return {
    __esModule: true,
    useInView: () => true,
    motion: {
      div: ({ children, className }: any) => (
        <div data-testid="motion-div" className={className}>
          {children}
        </div>
      ),
    },
  };
});

jest.mock("lucide-react", () => {
  const React = require("react");
  const Icon = (props: React.SVGProps<SVGSVGElement>) => (
    // eslint-disable-next-line react/jsx-props-no-spreading
    <svg data-testid="mock-icon" {...props} />
  );

  return {
    __esModule: true,
    Check: Icon,
  };
});

jest.mock("@/components/ui/AnimateIn", () => {
  const React = require("react");
  return {
    __esModule: true,
    AnimateIn: ({
      children,
      delay = 0,
      direction = "up",
      as = "div",
      className,
      ...rest
    }: any) => {
      const Tag = as ?? "div";
      const testId = rest["data-testid"] ?? "animatein-mock";
      return (
        <Tag
          data-testid={testId}
          data-delay={delay ?? 0}
          data-direction={direction}
          className={className}
          {...rest}
        >
          {children}
        </Tag>
      );
    },
  };
});

import PackagesPage, { metadata } from "./page";

describe("Packages page", () => {
  it("exports metadata with packages in title", () => {
    expect(metadata.title).toBe(metadataJson.pricing.title);
  });

  it("renders mini hero heading", () => {
    render(<PackagesPage />);

    expect(
      screen.getByRole("heading", { level: 1, name: "Packages & Pricing" }),
    ).toBeInTheDocument();
  });

  it("renders all pricing cards with correct highlighting and CTAs", () => {
    render(<PackagesPage />);

    const { packages } = pricing;

    const cards = screen.getAllByTestId("pricing-card");
    expect(cards).toHaveLength(packages.length);

    packages.forEach((pkg) => {
      const card = screen.getByTestId(`pricing-card-${pkg.id}`);
      expect(card).toBeInTheDocument();

      expect(
        screen.getByRole("heading", { name: pkg.name, level: 3 }),
      ).toBeInTheDocument();

      if (pkg.featured) {
        expect(card).toHaveClass("ring-2", "ring-accent", "relative");
        expect(screen.getByText(/Most Popular/i)).toBeInTheDocument();
      }

      const priceText = `€${pkg.priceRange.min}–€${pkg.priceRange.max}`;
      expect(screen.getByText(priceText)).toBeInTheDocument();

      const cta = screen.getByRole("link", {
        name: new RegExp(pkg.ctaText, "i"),
      });
      expect(cta).toHaveAttribute(
        "href",
        `/contact?package=${encodeURIComponent(pkg.id)}`,
      );

      // CTA color sanity checks:
      if (pkg.featured) {
        expect(cta).toHaveClass("bg-accent-dark", "text-white");
        expect(cta).toHaveClass("hover:bg-accent-dark/90");
      } else {
        expect(cta).toHaveClass("border-2", "border-accent");
        expect(cta).toHaveClass("text-accent");
        expect(cta).toHaveClass("hover:bg-accent", "hover:text-white");
      }
    });
  });

  it("renders add-ons grid with prices", () => {
    render(<PackagesPage />);

    const { addOns } = pricing;

    expect(
      screen.getByRole("heading", { name: "Enhance Your Order", level: 2 }),
    ).toBeInTheDocument();

    const addonCards = screen.getAllByTestId("addon-card");
    expect(addonCards).toHaveLength(addOns.length);

    addOns.forEach((addon) => {
      expect(
        screen.getByRole("heading", { name: addon.name, level: 3 }),
      ).toBeInTheDocument();
      expect(
        screen.getByText(addon.description, { exact: false }),
      ).toBeInTheDocument();
      expect(screen.getByText(`+€${addon.price}`)).toBeInTheDocument();
    });
  });

  it("renders retainers table with all tiers", () => {
    render(<PackagesPage />);

    const { retainers } = pricing;

    expect(
      screen.getByRole("heading", { name: "Monthly Retainers", level: 2 }),
    ).toBeInTheDocument();

    const rows = screen.getAllByTestId("retainer-row");
    expect(rows).toHaveLength(retainers.length);

    retainers.forEach((r) => {
      expect(screen.getByText(r.name)).toBeInTheDocument();
    });
  });

  it("renders project-based pricing table with all entries", () => {
    render(<PackagesPage />);

    const { projectPricing } = pricing;

    expect(
      screen.getByRole("heading", { name: "Project-Based Pricing", level: 2 }),
    ).toBeInTheDocument();

    const rows = screen.getAllByTestId("project-row");
    expect(rows).toHaveLength(projectPricing.length);
  });

  it("stagger pricing cards and table rows", () => {
    render(<PackagesPage />);

    const { packages, retainers, projectPricing } = pricing;

    const cards = screen.getAllByTestId("pricing-card");
    expect(cards).toHaveLength(packages.length);
    cards.forEach((card, index) => {
      const wrapper = card.closest('[data-testid="animatein-mock"]');
      expect(wrapper).not.toBeNull();
      expect(parseFloat(wrapper!.getAttribute("data-delay")!)).toBeCloseTo(
        index * 0.1,
        5,
      );
    });

    const retainerRows = screen.getAllByTestId("retainer-row");
    expect(retainerRows).toHaveLength(retainers.length);
    retainerRows.forEach((row, index) => {
      expect(parseFloat(row.getAttribute("data-delay")!)).toBeCloseTo(
        index * 0.1,
        5,
      );
    });

    const projectRows = screen.getAllByTestId("project-row");
    expect(projectRows).toHaveLength(projectPricing.length);
    projectRows.forEach((row, index) => {
      expect(parseFloat(row.getAttribute("data-delay")!)).toBeCloseTo(
        index * 0.1,
        5,
      );
    });
  });

  it("stacks cards and keeps tables horizontally scrollable on breakpoints", () => {
    const breakpoints = [375, 768, 1024, 1440];

    // eslint-disable-next-line no-restricted-syntax
    for (const width of breakpoints) {
      Object.defineProperty(window, "innerWidth", { value: width, writable: true });
      window.dispatchEvent(new Event("resize"));

      const { unmount } = render(<PackagesPage />);

      expect(document.querySelector(".text-xs")).toBeNull();

      // pricing cards grid should be single-column on mobile
      const firstCard = screen.getAllByTestId("pricing-card")[0];
      const pricingGrid = firstCard.parentElement?.parentElement;
      expect(pricingGrid).toHaveClass("grid-cols-1");

      // add-ons grid should be single-column on mobile
      const firstAddon = screen.getAllByTestId("addon-card")[0];
      const addonsGrid = firstAddon.parentElement?.parentElement;
      expect(addonsGrid).toHaveClass("grid-cols-1");

      // tables should have overflow-x-auto wrapper
      const tables = Array.from(document.querySelectorAll("table"));
      expect(tables.length).toBeGreaterThan(0);
      tables.forEach((table) => {
        const wrapper = table.closest(".overflow-x-auto");
        expect(wrapper).not.toBeNull();
      });

      // CTA buttons meet touch target min height
      const pkg = pricing.packages[0];
      const cta = screen.getByRole("link", { name: new RegExp(pkg.ctaText, "i") });
      expect(cta).toHaveClass("min-h-[44px]");

      unmount();
    }
  });
});

