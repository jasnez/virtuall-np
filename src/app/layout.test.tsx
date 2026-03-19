import React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

jest.mock("next/font/google", () => ({
  __esModule: true,
  Inter: () => ({ className: "inter-class" }),
}));

jest.mock("@/components/Header", () => ({
  __esModule: true,
  Header: () => <div data-testid="site-header-mock" />,
}));

jest.mock("@/components/Footer", () => ({
  __esModule: true,
  Footer: () => <div data-testid="site-footer" />,
}));

import RootLayout, { metadata, viewport } from "./layout";

describe("RootLayout", () => {
  it("renders Header and Footer on all pages and wraps children in main", () => {
    render(
      <RootLayout>
        <button type="button">After</button>
      </RootLayout>,
    );

    expect(screen.getByTestId("site-header-mock")).toBeInTheDocument();
    expect(screen.getByTestId("site-footer")).toBeInTheDocument();

    const main = screen.getByRole("main");
    expect(main).toHaveClass("min-h-screen");

    const skip = screen.getByRole("link", { name: /skip to content/i });
    expect(skip).toHaveAttribute("href", "#main-content");
    expect(skip).toHaveClass("focus:ring-2");

    expect(main).toHaveAttribute("id", "main-content");

    // Images should always have alt (if any exist)
    screen.queryAllByRole("img").forEach((img) => {
      expect(img).toHaveAttribute("alt");
    });

    expect(screen.getByRole("button", { name: "After" })).toBeInTheDocument();
  });

  it("supports keyboard navigation with skip link", async () => {
    const user = userEvent.setup();

    render(
      <RootLayout>
        <button type="button">After</button>
      </RootLayout>,
    );

    await user.tab();
    const skip = screen.getByRole("link", { name: /skip to content/i });
    expect(skip).toHaveFocus();

    // Forward tab should move focus into page content
    const after = screen.getByRole("button", { name: "After" });
    await user.tab();
    expect(after).toHaveFocus();

    // Shift+Tab should bring focus back to skip link
    await user.tab({ shift: true });
    expect(skip).toHaveFocus();
  });

  it("exports default metadata and viewport", () => {
    expect(metadata.title).toEqual({
      default: "VirtuALL NP",
      template: "%s | VirtuALL NP",
    });
    expect(typeof metadata.description).toBe("string");

    expect(metadata.openGraph).toEqual(
      expect.objectContaining({
        url: expect.any(String),
        siteName: "VirtuALL NP",
        images: expect.any(Array),
      }),
    );

    expect(metadata.openGraph?.images?.[0]?.url).toBe("/og-image.jpg");
    expect(metadata.twitter?.images?.[0]).toBe("/og-image.jpg");
    expect(metadata.twitter).toEqual(
      expect.objectContaining({ card: "summary_large_image" }),
    );

    expect(viewport).toEqual(
      expect.objectContaining({
        width: "device-width",
        initialScale: 1,
        themeColor: expect.any(String),
      }),
    );
  });
});

