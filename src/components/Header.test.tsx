import React from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { within } from "@testing-library/react";

const mockUsePathname = jest.fn<string, any>();

jest.mock("next/navigation", () => ({
  __esModule: true,
  usePathname: () => mockUsePathname(),
}));

jest.mock("next/link", () => {
  const React = require("react");
  return {
    __esModule: true,
    default: React.forwardRef(
      ({ href, children, ...props }: any, ref: any) => (
        <a ref={ref} href={href} {...props}>
          {children}
        </a>
      ),
    ),
  };
});

jest.mock("lucide-react", () => ({
  __esModule: true,
  Menu: (props: any) => <svg data-testid="icon-menu" {...props} />,
  X: (props: any) => <svg data-testid="icon-x" {...props} />,
}));

jest.mock("framer-motion", () => {
  const React = require("react");
  return {
    __esModule: true,
    AnimatePresence: ({ children }: any) => <>{children}</>,
    motion: {
      div: React.forwardRef(({ children, ...props }: any, ref: any) => (
        <div ref={ref} {...props}>
          {children}
        </div>
      )),
    },
  };
});

import { Header } from "./Header";

describe("Header", () => {
  jest.setTimeout(20000);
  beforeEach(() => {
    mockUsePathname.mockReset();
    mockUsePathname.mockReturnValue("/");
    document.body.style.overflow = "";
  });

  it("renders logo linking to home", () => {
    render(<Header />);
    const logo = screen.getByRole("link", { name: /virtuall np/i });
    expect(logo).toHaveAttribute("href", "/");
  });

  it("renders nav links and Get a Quote button link", () => {
    render(<Header />);
    expect(screen.getByRole("link", { name: "Home" })).toHaveAttribute(
      "href",
      "/",
    );
    expect(screen.getByRole("link", { name: "Services" })).toHaveAttribute(
      "href",
      "/services",
    );
    expect(screen.getByRole("link", { name: "How We Work" })).toHaveAttribute(
      "href",
      "/how-we-work",
    );
    expect(screen.getByRole("link", { name: "Packages" })).toHaveAttribute(
      "href",
      "/packages",
    );
    expect(screen.getByRole("link", { name: "Contact" })).toHaveAttribute(
      "href",
      "/contact",
    );

    expect(screen.getByRole("link", { name: "Get a Quote" })).toHaveAttribute(
      "href",
      "/contact",
    );
  });

  it("applies active state classes based on pathname", () => {
    mockUsePathname.mockReturnValue("/services");
    render(<Header />);

    expect(screen.getByRole("link", { name: "Services" })).toHaveClass(
      "text-primary",
      "font-semibold",
    );

    expect(screen.getByRole("link", { name: "Home" })).toHaveClass(
      "text-text-light",
      "font-medium",
    );
  });

  it("strengthens header border and background when scrolled past threshold", () => {
    render(<Header />);
    const header = screen.getByTestId("site-header");

    expect(header).toHaveClass("bg-white/95");
    expect(header).toHaveClass("border-gray-200/50");
    expect(header).not.toHaveClass("bg-white");

    Object.defineProperty(window, "scrollY", { value: 30, writable: true });
    fireEvent.scroll(window);

    expect(header).toHaveClass("border-gray-200/90");
    expect(header).toHaveClass("bg-white");
    expect(header).not.toHaveClass("bg-white/95");
  });

  it("opens and closes mobile overlay and locks body scroll", async () => {
    const user = userEvent.setup();
    render(<Header />);

    const openBtn = screen.getByRole("button", { name: /open menu/i });
    await user.click(openBtn);

    const overlay = screen.getByTestId("mobile-overlay");
    expect(overlay).toBeInTheDocument();
    expect(document.body.style.overflow).toBe("hidden");

    await user.click(within(overlay).getByRole("button", { name: /close menu/i }));

    expect(screen.queryByTestId("mobile-overlay")).not.toBeInTheDocument();
    expect(document.body.style.overflow).toBe("");
  });

  it("closes overlay when a mobile nav link is clicked", async () => {
    const user = userEvent.setup();
    render(<Header />);

    await user.click(screen.getByRole("button", { name: /open menu/i }));
    const overlay = screen.getByTestId("mobile-overlay");
    expect(overlay).toBeInTheDocument();

    await user.click(within(overlay).getByRole("link", { name: "Contact" }));
    expect(screen.queryByTestId("mobile-overlay")).not.toBeInTheDocument();
  });

  it("responsive navigation + CTA touch target on common breakpoints", async () => {
    const breakpoints = [375, 768, 1024, 1440];
    const user = userEvent.setup();

    // eslint-disable-next-line no-restricted-syntax
    for (const width of breakpoints) {
      // Set viewport width even though Tailwind media queries are CSS-based.
      // We mainly validate JS navigation/overlay behavior and presence of the expected classes.
      Object.defineProperty(window, "innerWidth", { value: width, writable: true });
      window.dispatchEvent(new Event("resize"));

      const { unmount } = render(<Header />);

      const mobileBtn = screen.getByRole("button", { name: /open menu/i });
      expect(mobileBtn).toHaveClass("md:hidden");

      const navContainer = document.querySelector('header nav');
      expect(navContainer).not.toBeNull();
      expect(navContainer).toHaveClass("hidden", "md:flex");

      const quoteLink = screen.getByRole("link", { name: "Get a Quote" });
      expect(quoteLink).toHaveClass("min-h-[44px]");

      // overlay toggles should work at any width
      // eslint-disable-next-line @typescript-eslint/no-floating-promises
      await user.click(mobileBtn);
      expect(screen.getByTestId("mobile-overlay")).toBeInTheDocument();

      // eslint-disable-next-line @typescript-eslint/no-floating-promises
      const overlay = screen.getByTestId("mobile-overlay");
      await user.click(within(overlay).getByRole("button", { name: /close menu/i }));
      expect(screen.queryByTestId("mobile-overlay")).not.toBeInTheDocument();

      unmount();
    }
  });

  it("exposes aria-expanded on mobile menu button", async () => {
    const user = userEvent.setup();
    render(<Header />);
    const menuButton = screen.getByRole("button", { name: /open menu/i });
    expect(menuButton).toHaveAttribute("aria-expanded", "false");
    await user.click(menuButton);
    expect(menuButton).toHaveAttribute("aria-expanded", "true");
  });

  it("marks decorative icons as aria-hidden", async () => {
    const user = userEvent.setup();
    render(<Header />);

    const menus = screen.getAllByTestId("icon-menu");
    menus.forEach((svg) => {
      expect(svg).toHaveAttribute("aria-hidden", "true");
    });

    await user.click(screen.getByRole("button", { name: /open menu/i }));
    const closes = screen.getAllByTestId("icon-x");
    expect(closes.length).toBeGreaterThan(0);
    closes.forEach((svg) => {
      expect(svg).toHaveAttribute("aria-hidden", "true");
    });
  });
});

