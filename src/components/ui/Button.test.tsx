import React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { Button } from "./Button";

describe("Button", () => {
  it("renders a <button> by default", () => {
    render(<Button>Click</Button>);
    const el = screen.getByRole("button", { name: "Click" });
    expect(el.tagName.toLowerCase()).toBe("button");
  });

  it("renders a Next.js Link (<a>) when href is provided", () => {
    render(<Button href="/about">About</Button>);
    const el = screen.getByRole("link", { name: "About" });
    expect(el).toHaveAttribute("href", "/about");
  });

  it("applies focus ring classes for accessibility", () => {
    render(<Button>Focus</Button>);
    const el = screen.getByRole("button", { name: "Focus" });
    expect(el).toHaveClass(
      "focus:ring-2",
      "focus:ring-accent",
      "focus:ring-offset-2",
    );
  });

  it("applies primary variant classes (including hover + transition)", () => {
    render(<Button variant="primary">Primary</Button>);
    const el = screen.getByRole("button", { name: "Primary" });
    expect(el).toHaveClass(
      "bg-accent",
      "text-white",
      "px-6",
      "py-3",
      "min-h-[44px]",
      "rounded-lg",
      "hover:bg-accent-dark",
      "hover:shadow-md",
      "transition-all",
      "duration-200",
    );
  });

  it("applies secondary variant classes", () => {
    render(<Button variant="secondary">Secondary</Button>);
    const el = screen.getByRole("button", { name: "Secondary" });
    expect(el).toHaveClass(
      "border-2",
      "border-accent",
      "text-accent",
      "hover:bg-accent",
      "hover:text-white",
    );
  });

  it("applies ghost variant classes", () => {
    render(<Button variant="ghost">Ghost</Button>);
    const el = screen.getByRole("button", { name: "Ghost" });
    expect(el).toHaveClass("text-accent", "underline", "hover:text-accent-dark");
  });

  it("applies nav variant classes", () => {
    render(<Button variant="nav">Nav</Button>);
    const el = screen.getByRole("button", { name: "Nav" });
    expect(el).toHaveClass(
      "bg-accent",
      "text-white",
      "px-4",
      "py-2",
      "min-h-[44px]",
      "rounded-md",
      "text-sm",
    );
  });

  it("supports size prop (sm, md, lg) for non-nav variants", () => {
    const { rerender } = render(
      <Button variant="primary" size="sm">
        Size
      </Button>,
    );
    expect(screen.getByRole("button", { name: "Size" })).toHaveClass(
      "px-4",
      "py-2",
      "text-sm",
    );

    rerender(
      <Button variant="primary" size="md">
        Size
      </Button>,
    );
    expect(screen.getByRole("button", { name: "Size" })).toHaveClass(
      "px-6",
      "py-3",
      "text-base",
    );

    rerender(
      <Button variant="primary" size="lg">
        Size
      </Button>,
    );
    expect(screen.getByRole("button", { name: "Size" })).toHaveClass(
      "px-8",
      "py-4",
      "text-lg",
    );
  });

  it("respects type prop for <button>", () => {
    render(
      <Button type="submit" variant="primary">
        Submit
      </Button>,
    );
    expect(screen.getByRole("button", { name: "Submit" })).toHaveAttribute(
      "type",
      "submit",
    );
  });

  it("applies disabled styles and blocks clicks for <button>", async () => {
    const user = userEvent.setup();
    const onClick = jest.fn();
    render(
      <Button disabled onClick={onClick}>
        Disabled
      </Button>,
    );

    const el = screen.getByRole("button", { name: "Disabled" });
    expect(el).toBeDisabled();
    expect(el).toHaveClass("opacity-50", "cursor-not-allowed");

    await user.click(el);
    expect(onClick).not.toHaveBeenCalled();
  });

  it("applies disabled styles and blocks clicks for Link variant", async () => {
    const user = userEvent.setup();
    const onClick = jest.fn();
    render(
      <Button href="/docs" disabled onClick={onClick}>
        Docs
      </Button>,
    );

    const el = screen.getByRole("link", { name: "Docs" });
    expect(el).toHaveClass("opacity-50", "cursor-not-allowed");
    expect(el).toHaveAttribute("aria-disabled", "true");
    expect(el).toHaveAttribute("tabindex", "-1");

    await user.click(el);
    expect(onClick).not.toHaveBeenCalled();
  });

  it("merges custom className", () => {
    render(<Button className="my-custom">Custom</Button>);
    expect(screen.getByRole("button", { name: "Custom" })).toHaveClass(
      "my-custom",
    );
  });
});

