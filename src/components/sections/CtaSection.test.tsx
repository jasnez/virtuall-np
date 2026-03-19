import React from "react";
import { render, screen } from "@testing-library/react";

jest.mock("@/components/ui/AnimateIn", () => {
  const React = require("react");
  return {
    __esModule: true,
    AnimateIn: ({
      children,
      className,
    }: {
      children: React.ReactNode;
      className?: string;
    }) => (
      <div data-testid="animatein" className={className}>
        {children}
      </div>
    ),
  };
});

import { CtaSection } from "./CtaSection";

describe("CtaSection", () => {
  it("renders inside a navy SectionWrapper with centered white text and default CTA", () => {
    render(
      <CtaSection
        title="Ready to get started?"
        description="Tell us what you're building and we'll follow up with next steps."
      />,
    );

    const section = screen.getByTestId("section-wrapper");
    expect(section).toHaveStyle({ backgroundColor: "#1B3A5C" });

    expect(section).toHaveClass("border-t", "border-white/10");

    const inner = screen.getByTestId("section-inner");
    expect(inner.firstChild).toHaveClass(
      "mx-auto",
      "max-w-[38rem]",
      "text-center",
      "text-white",
    );

    expect(
      screen.getByRole("heading", {
        level: 2,
        name: "Ready to get started?",
      }),
    ).toHaveClass("text-3xl", "font-semibold", "max-w-[35rem]", "mb-4");

    const desc = screen.getByText(
      "Tell us what you're building and we'll follow up with next steps.",
    );
    expect(desc).toHaveClass(
      "text-white/90",
      "mb-6",
      "max-w-[32.5rem]",
      "mx-auto",
    );

    const button = screen.getByRole("link", { name: "Start a Project" });
    expect(button).toHaveAttribute("href", "/contact");
    expect(button).toHaveClass("rounded-xl");
  });

  it("supports overriding CTA label and href", () => {
    render(
      <CtaSection
        title="Custom CTA"
        description="Something custom."
        ctaLabel="Talk to Sales"
        ctaHref="/contact/sales"
      />,
    );

    const button = screen.getByRole("link", { name: "Talk to Sales" });
    expect(button).toHaveAttribute("href", "/contact/sales");
  });
});

