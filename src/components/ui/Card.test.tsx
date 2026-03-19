import React from "react";
import { render, screen } from "@testing-library/react";

import { Card } from "./Card";

describe("Card", () => {
  it("renders children", () => {
    render(
      <Card>
        <span>Content</span>
      </Card>,
    );
    expect(screen.getByText("Content")).toBeInTheDocument();
  });

  it("applies base card classes", () => {
    render(<Card>Base</Card>);
    const el = screen.getByTestId("card");
    expect(el).toHaveClass(
      "bg-white",
      "rounded-2xl",
      "border",
      "border-gray-200/80",
    );
  });

  it("defaults to hover effects enabled", () => {
    render(<Card>Hover</Card>);
    const el = screen.getByTestId("card");
    expect(el).toHaveClass(
      "hover:border-gray-400/50",
      "hover:bg-gray-50/55",
    );
    expect(el.className).toMatch(/duration-200/);
    expect(el.className).toMatch(/ease-out/);
  });

  it("can disable hover effects", () => {
    render(<Card hover={false}>NoHover</Card>);
    const el = screen.getByTestId("card");
    expect(el).not.toHaveClass("hover:border-gray-400/50");
    expect(el).not.toHaveClass("hover:bg-gray-50/55");
    expect(el.className).not.toMatch(/transition-\[border-color/);
  });

  it("applies padding variants", () => {
    const { rerender } = render(<Card padding="sm">P</Card>);
    expect(screen.getByTestId("card")).toHaveClass("p-4", "md:p-5");

    rerender(<Card padding="md">P</Card>);
    expect(screen.getByTestId("card")).toHaveClass("p-5", "md:p-6");

    rerender(<Card padding="lg">P</Card>);
    expect(screen.getByTestId("card")).toHaveClass("p-5", "md:p-6");
  });

  it("merges custom className", () => {
    render(<Card className="my-card">C</Card>);
    expect(screen.getByTestId("card")).toHaveClass("my-card");
  });
});
