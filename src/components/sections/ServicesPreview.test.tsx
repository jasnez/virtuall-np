import React from "react";
import { render, screen } from "@testing-library/react";

jest.mock("lucide-react", () => {
  const React = require("react");
  const Icon = (props: React.SVGProps<SVGSVGElement>) => (
    // eslint-disable-next-line react/jsx-props-no-spreading
    <svg data-testid="mock-lucide-icon" {...props} />
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

  const AnimateIn = ({
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
  };

  return {
    __esModule: true,
    AnimateIn,
    StaggerChildren: ({
      children,
      className,
      direction = "up",
      delay = 0,
      stagger = 0.1,
    }: any) => {
      const array = React.Children.toArray(children);
      return (
        <div data-testid="stagger" className={className}>
          {array.map((child: React.ReactNode, idx: number) => (
            <AnimateIn
              // eslint-disable-next-line react/no-array-index-key
              key={idx}
              direction={direction}
              delay={delay + idx * stagger}
            >
              {child}
            </AnimateIn>
          ))}
        </div>
      );
    },
  };
});

import services from "@/content/services.json";

import { ServicesPreview } from "./ServicesPreview";

describe("ServicesPreview", () => {
  it("renders in a SectionWrapper with alt background", () => {
    render(<ServicesPreview />);

    const section = screen.getByTestId("section-wrapper");
    expect(section).toHaveStyle({ backgroundColor: "#F5F5F0" });
  });

  it("renders heading and intro text", () => {
    render(<ServicesPreview />);

    expect(
      screen.getByRole("heading", { level: 2, name: "What We Do" }),
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        /We help brands communicate clearly through thoughtful writing/i,
      ),
    ).toBeInTheDocument();
  });

  it("renders services in a responsive grid with 4 cards", () => {
    render(<ServicesPreview />);

    const grid = screen.getByTestId("services-grid");
    expect(grid).toHaveClass("grid", "grid-cols-1", "md:grid-cols-2", "gap-6");

    const cards = screen.getAllByTestId("service-card");
    expect(cards).toHaveLength(services.length);
  });

  it("renders icon, title, description, and Learn More link for each service", () => {
    render(<ServicesPreview />);

    services.forEach((svc) => {
      const card = screen
        .getByRole("heading", {
          name: svc.title,
          level: 3,
        })
        .closest("[data-testid='service-card']") as HTMLElement | null;

      expect(card).not.toBeNull();

      expect(card!.textContent).toContain(svc.shortDescription);

      expect(card).toHaveAttribute("href", `/services#${svc.slug}`);
    });
  });

  it("stagger service cards by 0.1s", () => {
    render(<ServicesPreview />);

    const cards = screen.getAllByTestId("service-card");
    expect(cards).toHaveLength(services.length);

    cards.forEach((card, index) => {
      const wrapper = card.closest('[data-testid="animatein-mock"]');
      expect(wrapper).not.toBeNull();
      expect(parseFloat(wrapper!.getAttribute("data-delay")!)).toBeCloseTo(
        index * 0.1,
        5,
      );
    });
  });
});

