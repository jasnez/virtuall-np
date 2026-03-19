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
      "rounded-xl",
      "border",
      "border-gray-200/80",
    );
  });

  it("defaults to hover effects enabled", () => {
    render(<Card>Hover</Card>);
    const el = screen.getByTestId("card");
    expect(el).toHaveClass(
      "hover:border-gray-300/80",
      "hover:bg-gray-50/50",
      "transition-colors",
      "duration-200",
      "ease-out",
    );
  });

  it("can disable hover effects", () => {
    render(<Card hover={false}>NoHover</Card>);
    const el = screen.getByTestId("card");
    expect(el).not.toHaveClass("hover:border-gray-300/80");
    expect(el).not.toHaveClass("hover:bg-gray-50/50");
    expect(el).not.toHaveClass("transition-colors");
    expect(el).not.toHaveClass("duration-200");
  });

  it("applies padding variants", () => {
    const { rerender } = render(<Card padding="sm">P</Card>);
    expect(screen.getByTestId("card")).toHaveClass("p-4");

    rerender(<Card padding="md">P</Card>);
    expect(screen.getByTestId("card")).toHaveClass("p-6");

    rerender(<Card padding="lg">P</Card>);
    expect(screen.getByTestId("card")).toHaveClass("p-8");
  });

  it("merges custom className", () => {
    render(<Card className="my-card">C</Card>);
    expect(screen.getByTestId("card")).toHaveClass("my-card");
  });
});

