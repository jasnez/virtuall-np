import React from "react";
import { render, screen } from "@testing-library/react";

import services from "@/content/services.json";
import ServicesPage, { metadata } from "./page";

jest.mock("lucide-react", () => {
  const React = require("react");
  const Icon = (props: React.SVGProps<SVGSVGElement>) => (
    // eslint-disable-next-line react/jsx-props-no-spreading
    <svg data-testid="mock-service-icon" {...props} />
  );

  return {
    __esModule: true,
    Bot: Icon,
    PenLine: Icon,
    Search: Icon,
    Sparkles: Icon,
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

describe("Services page", () => {
  it("exports metadata", () => {
    expect(metadata.title).toMatch(/services/i);
  });

  it("renders mini hero with heading and intro", () => {
    render(<ServicesPage />);

    expect(
      screen.getByRole("heading", { level: 1, name: "Our Services" }),
    ).toBeInTheDocument();

    expect(
      screen.getByText(/Deep work, clear outcomes/i),
    ).toBeInTheDocument();
  });

  it("renders all services as alternating anchored sections with CTAs", () => {
    render(<ServicesPage />);

    services.forEach((svc, index) => {
      const section = screen.getByTestId(`service-section-${svc.slug}`);
      expect(section).toBeInTheDocument();

      const anchor = section.querySelector(`#${svc.slug}`);
      expect(anchor).not.toBeNull();

      const heading = screen.getByRole("heading", {
        name: svc.title,
        level: 2,
      });
      expect(heading).toBeInTheDocument();

      const cta = screen.getByRole("link", {
        name: svc.ctaText || `Get a Quote for ${svc.title}`,
      });
      expect(cta).toHaveAttribute(
        "href",
        `/contact?service=${encodeURIComponent(svc.slug)}`,
      );

      // check alternating order via lg:order-last class on icon column
      const iconColumn = section.querySelector("[data-testid='service-icon']");
      if (index % 2 === 1) {
        expect(iconColumn).toHaveClass("lg:order-last");
      } else {
        expect(iconColumn).not.toHaveClass("lg:order-last");
      }
    });
  });

  it("alternates AnimateIn direction for service blocks", () => {
    render(<ServicesPage />);

    services.forEach((svc, index) => {
      const section = screen.getByTestId(`service-section-${svc.slug}`);
      const wrapper = section.closest('[data-testid="animatein-mock"]');
      expect(wrapper).not.toBeNull();

      const expected = index % 2 === 0 ? "left" : "right";
      expect(wrapper).toHaveAttribute("data-direction", expected);
    });
  });

  it("stacks service blocks on mobile and stays readable on breakpoints", () => {
    const breakpoints = [375, 768, 1024, 1440];

    // eslint-disable-next-line no-restricted-syntax
    for (const width of breakpoints) {
      Object.defineProperty(window, "innerWidth", { value: width, writable: true });
      window.dispatchEvent(new Event("resize"));

      const { unmount } = render(<ServicesPage />);

      expect(document.querySelector(".text-xs")).toBeNull();

      services.forEach((svc, index) => {
        const section = screen.getByTestId(`service-section-${svc.slug}`);
        // grid should always become single-column on mobile
        expect(section).toHaveClass("grid-cols-1");
      });

      // touch target: CTA is large enough
      const cta = screen.getByRole("link", {
        name: services[0].ctaText || `Get a Quote for ${services[0].title}`,
      });
      expect(cta).toHaveClass("min-h-[48px]");

      unmount();
    }
  });
});

