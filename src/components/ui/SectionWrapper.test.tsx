import React from "react";
import { render, screen } from "@testing-library/react";

import { SectionWrapper } from "./SectionWrapper";

describe("SectionWrapper", () => {
  it("renders a <section> with children", () => {
    render(
      <SectionWrapper>
        <h2>Title</h2>
      </SectionWrapper>,
    );

    const section = screen.getByTestId("section-wrapper");
    expect(section.tagName.toLowerCase()).toBe("section");
    expect(screen.getByRole("heading", { name: "Title" })).toBeInTheDocument();
  });

  it("applies id for anchor links when provided", () => {
    render(<SectionWrapper id="features">X</SectionWrapper>);
    expect(screen.getByTestId("section-wrapper")).toHaveAttribute(
      "id",
      "features",
    );
  });

  it("applies default padding (lg)", () => {
    render(<SectionWrapper>Y</SectionWrapper>);
    expect(screen.getByTestId("section-wrapper")).toHaveClass(
      "py-20",
      "lg:py-[120px]",
    );
  });

  it("applies sm and md padding classes", () => {
    const { rerender } = render(<SectionWrapper padding="sm">A</SectionWrapper>);
    expect(screen.getByTestId("section-wrapper")).toHaveClass("py-12");

    rerender(<SectionWrapper padding="md">B</SectionWrapper>);
    expect(screen.getByTestId("section-wrapper")).toHaveClass("py-16");
  });

  it("applies background colors via inline style", () => {
    const { rerender } = render(
      <SectionWrapper bgColor="white">W</SectionWrapper>,
    );
    expect(screen.getByTestId("section-wrapper")).toHaveStyle({
      backgroundColor: "#FFF",
    });

    rerender(<SectionWrapper bgColor="alt">A</SectionWrapper>);
    expect(screen.getByTestId("section-wrapper")).toHaveStyle({
      backgroundColor: "#F5F5F0",
    });

    rerender(<SectionWrapper bgColor="navy">N</SectionWrapper>);
    expect(screen.getByTestId("section-wrapper")).toHaveStyle({
      backgroundColor: "#1B3A5C",
    });
  });

  it("renders inner container div with fixed layout classes", () => {
    render(<SectionWrapper>Inner</SectionWrapper>);
    const container = screen.getByTestId("section-inner");
    expect(container).toHaveClass(
      "max-w-7xl",
      "mx-auto",
      "px-4",
      "sm:px-6",
      "lg:px-8",
    );
  });

  it("merges custom className onto section", () => {
    render(<SectionWrapper className="my-section">Z</SectionWrapper>);
    expect(screen.getByTestId("section-wrapper")).toHaveClass("my-section");
  });
});

