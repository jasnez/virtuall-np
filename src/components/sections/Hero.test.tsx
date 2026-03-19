import React from "react";
import { render, screen } from "@testing-library/react";

import homepage from "@/content/homepage.json";

const animateInCalls: Array<{ delay?: number }> = [];

jest.mock("@/components/ui/AnimateIn", () => {
  return {
    __esModule: true,
    AnimateIn: ({
      children,
      delay,
    }: {
      children: React.ReactNode;
      delay?: number;
    }) => {
      animateInCalls.push({ delay });
      return (
        <div data-testid="animatein" data-delay={delay ?? 0}>
          {children}
        </div>
      );
    },
  };
});

import { Hero } from "./Hero";

describe("Hero", () => {
  beforeEach(() => {
    animateInCalls.splice(0, animateInCalls.length);
  });

  it("renders full-width hero section with gradient and layout classes", () => {
    render(<Hero />);

    const section = screen.getByTestId("hero");
    expect(section).toHaveClass(
      "w-full",
      "min-h-[80vh]",
      "flex",
      "items-center",
      "justify-center",
      "bg-gradient-to-br",
      "from-primary",
      "to-[#0F2440]",
    );
  });

  it("loads headline and subheadline from homepage.json and applies responsive typography", () => {
    render(<Hero />);

    const h1 = screen.getByRole("heading", {
      level: 1,
      name: homepage.hero.headline,
    });
    expect(h1).toHaveClass(
      "text-4xl",
      "md:text-5xl",
      "lg:text-6xl",
      "font-bold",
      "leading-tight",
    );

    const sub = screen.getByText(homepage.hero.subheadline);
    expect(sub).toHaveClass(
      "text-lg",
      "md:text-xl",
      "text-white/80",
      "mt-6",
      "max-w-2xl",
      "mx-auto",
    );
  });

  it("renders CTA links with correct hrefs", () => {
    render(<Hero />);

    expect(
      screen.getByRole("link", { name: "See Our Services" }),
    ).toHaveAttribute("href", "/services");

    expect(screen.getByRole("link", { name: "Get a Quote" })).toHaveAttribute(
      "href",
      "/contact",
    );
  });

  it("wraps headline, subheadline, and CTA with AnimateIn staggered delays", () => {
    render(<Hero />);

    const delays = animateInCalls.map((c) => c.delay ?? 0);
    // Hero H1 is not wrapped in AnimateIn to keep LCP fast.
    expect(delays).toEqual([0, 0.2, 0.4]);
  });
});

