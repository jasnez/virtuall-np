import React from "react";
import { render, screen, within } from "@testing-library/react";

jest.mock("lucide-react", () => {
  const React = require("react");
  const Icon = (props: React.SVGProps<SVGSVGElement>) => (
    // eslint-disable-next-line react/jsx-props-no-spreading
    <svg data-testid="mock-lucide-icon" {...props} />
  );

  return {
    __esModule: true,
    Bot: Icon,
    Circle: Icon,
    MessageCircle: Icon,
    Search: Icon,
    Sparkles: Icon,
  };
});

jest.mock("@/components/ui/AnimateIn", () => {
  const React = require("react");
  return {
    __esModule: true,
    AnimateIn: ({ children }: { children: React.ReactNode }) => (
      <div data-testid="animatein-stub">{children}</div>
    ),
    StaggerChildren: ({
      children,
      className,
    }: {
      children: React.ReactNode;
      className?: string;
    }) => (
      <div data-testid="stagger" className={className}>
        {children}
      </div>
    ),
  };
});

import homepage from "@/content/homepage.json";

import { ValueProps } from "./ValueProps";

describe("ValueProps", () => {
  it("renders a SectionWrapper with white background and md padding", () => {
    render(<ValueProps />);

    const section = screen.getByTestId("section-wrapper");
    expect(section).toHaveStyle({ backgroundColor: "#FFF" });
    expect(section).toHaveClass("py-16");
  });

  it("renders value props in a responsive 2x2 then 4-column grid", () => {
    render(<ValueProps />);

    const grid = screen.getByTestId("value-props-grid");
    expect(grid).toHaveClass(
      "grid",
      "grid-cols-1",
      "sm:grid-cols-2",
      "lg:grid-cols-4",
      "gap-6",
    );
  });

  it("renders all valueProps from homepage.json with titles and descriptions", () => {
    render(<ValueProps />);

    homepage.valueProps.forEach((item) => {
      const card = screen.getByRole("heading", {
        name: item.title,
        level: 3,
      }).closest("[data-testid='value-prop-item']");

      expect(card).not.toBeNull();
      const utils = within(card!);
      expect(utils.getByText(item.description)).toBeInTheDocument();
    });
  });

  it("renders an icon for each value prop", () => {
    render(<ValueProps />);

    const icons = screen.getAllByTestId("value-icon");
    expect(icons).toHaveLength(homepage.valueProps.length);

    icons.forEach((icon) => {
      expect(icon).toHaveAttribute("aria-hidden", "true");
    });
  });
});

