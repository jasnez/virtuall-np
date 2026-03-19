import React from "react";
import { render, screen } from "@testing-library/react";

jest.mock("lucide-react", () => {
  const React = require("react");
  const Icon = (props: React.SVGProps<SVGSVGElement>) => (
    // eslint-disable-next-line react/jsx-props-no-spreading
    <svg data-testid="mock-check-icon" {...props} />
  );

  return {
    __esModule: true,
    CheckCircle2: Icon,
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

import homepage from "@/content/homepage.json";
import processSteps from "@/content/process-steps.json";

import { TrustSection } from "./TrustSection";

describe("TrustSection", () => {
  it("renders inside a white SectionWrapper", () => {
    render(<TrustSection />);

    const section = screen.getByTestId("section-wrapper");
    expect(section).toHaveStyle({ backgroundColor: "#FFF" });
  });

  it("renders two-column responsive grid layout", () => {
    render(<TrustSection />);

    const grid = screen.getByTestId("trust-grid");
    expect(grid).toHaveClass(
      "grid",
      "grid-cols-1",
      "lg:grid-cols-2",
      "gap-12",
      "items-start",
    );
  });

  it("renders trust narrative heading and paragraphs from homepage.json", () => {
    render(<TrustSection />);

    expect(
      screen.getByRole("heading", { level: 2, name: "Why Work With Us" }),
    ).toBeInTheDocument();

    homepage.trust.narrative.forEach((line) => {
      expect(screen.getByText(line)).toBeInTheDocument();
    });
  });

  it("renders a guarantee badge with icon and bold text", () => {
    render(<TrustSection />);

    const badge = screen.getByTestId("guarantee-badge");
    expect(badge).toBeInTheDocument();
    const icon = screen.getByTestId("mock-check-icon");
    expect(icon).toBeInTheDocument();
    expect(icon).toHaveAttribute("aria-hidden", "true");

    const strong = badge.querySelector("strong");
    expect(strong).not.toBeNull();
  });

  it("renders a 5-step process preview with numbered circles and descriptions", () => {
    render(<TrustSection />);

    const steps = screen.getAllByTestId("process-step");
    expect(steps).toHaveLength(processSteps.length);

    processSteps.forEach((step, index) => {
      const item = steps[index];
      expect(item.textContent).toContain(step.title);
      expect(item.textContent).toContain(step.description.slice(0, 10));

      const badge = item.querySelector("[data-testid='step-number']");
      expect(badge).not.toBeNull();
      expect(badge).toHaveTextContent(String(step.step));
    });
  });

  it("stagger process steps by 0.15s", () => {
    render(<TrustSection />);

    const steps = screen.getAllByTestId("process-step");
    expect(steps).toHaveLength(processSteps.length);

    processSteps.forEach((_, index) => {
      const wrapper = steps[index].closest('[data-testid="animatein-mock"]');
      expect(wrapper).not.toBeNull();
      expect(parseFloat(wrapper!.getAttribute("data-delay")!)).toBeCloseTo(
        index * 0.15,
        5,
      );
    });
  });
});

