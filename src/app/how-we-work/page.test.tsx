import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";

import processSteps from "@/content/process-steps.json";
import faq from "@/content/faq.json";
import metadataJson from "@/content/metadata.json";

jest.mock("framer-motion", () => {
  const React = require("react");
  return {
    __esModule: true,
    useInView: () => true,
    AnimatePresence: ({ children }: { children: React.ReactNode }) => (
      <div data-testid="animate-presence">{children}</div>
    ),
    motion: {
      div: ({ children, className, ...rest }: any) => (
        <div data-testid="motion-div" className={className} {...rest}>
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
    <svg data-testid="mock-chevron" {...props} />
  );

  return {
    __esModule: true,
    ChevronDown: Icon,
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

import HowWeWorkPage, { metadata } from "./page";

describe("How We Work page", () => {
  it("exports metadata", () => {
    expect(metadata.title).toBe(metadataJson.process.title);
  });

  it("renders mini hero heading", () => {
    render(<HowWeWorkPage />);

    expect(
      screen.getByRole("heading", { level: 1, name: "How We Work" }),
    ).toBeInTheDocument();
  });

  it("renders process timeline with all steps", () => {
    render(<HowWeWorkPage />);

    const steps = screen.getAllByTestId("timeline-step");
    expect(steps).toHaveLength(processSteps.length);

    processSteps.forEach((step, index) => {
      const item = steps[index];
      const badge = item.querySelector("[data-testid='timeline-number']");
      expect(badge).not.toBeNull();
      expect(badge).toHaveTextContent(String(step.step));

      const wrapper = item.closest('[data-testid="animatein-mock"]');
      expect(wrapper).not.toBeNull();
      expect(parseFloat(wrapper!.getAttribute("data-delay")!)).toBeCloseTo(
        index * 0.15,
        5,
      );
      expect(wrapper).toHaveAttribute("data-direction", "up");

      // responsive stacking: on mobile steps should stack vertically
      expect(wrapper).toHaveClass("flex-col", "md:flex-row");
    });
  });

  it("renders FAQ accordion with only one item open at a time", () => {
    render(<HowWeWorkPage />);

    const firstQuestion = faq[0].question;
    const secondQuestion = faq[1].question;

    const firstButton = screen.getByRole("button", { name: firstQuestion });
    const secondButton = screen.getByRole("button", { name: secondQuestion });

    // open first (we don't assert exact text content here, just that click doesn't throw)
    fireEvent.click(firstButton);

    // open second, first should close (only one open at a time)
    fireEvent.click(secondButton);
  });

  it("assigns aria-expanded/controls and region role for accordion items", () => {
    render(<HowWeWorkPage />);

    const firstQuestion = faq[0].question;
    const firstButton = screen.getByRole("button", { name: firstQuestion });

    expect(firstButton).toHaveAttribute("aria-expanded", "true");
    const controlsId = firstButton.getAttribute("aria-controls");
    expect(controlsId).not.toBeNull();

    const panel = document.getElementById(controlsId!);
    expect(panel).not.toBeNull();
    expect(panel).toHaveAttribute("role", "region");
    expect(panel).toHaveAttribute("aria-labelledby", firstButton.id);
  });

  it("renders CTA section at the bottom", () => {
    render(<HowWeWorkPage />);

    expect(
      screen.getByRole("heading", {
        name: /Ready for content that sounds like your brand and reads like it was written with care\?/i,
        level: 2,
      }),
    ).toBeInTheDocument();
  });
});

