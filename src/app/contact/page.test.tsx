import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

jest.mock("lucide-react", () => {
  const React = require("react");
  const Icon = (props: React.SVGProps<SVGSVGElement>) => (
    // eslint-disable-next-line react/jsx-props-no-spreading
    <svg data-testid="mock-icon" {...props} />
  );

  return {
    __esModule: true,
    Mail: Icon,
    Phone: Icon,
    MapPin: Icon,
  };
});

jest.mock("next/navigation", () => ({
  __esModule: true,
  useSearchParams: () => ({
    get: (key: string) =>
      key === "service" ? "research" : key === "package" ? "pkg_starter" : null,
  }),
}));

jest.mock("@/components/ui/AnimateIn", () => {
  const React = require("react");
  return {
    __esModule: true,
    AnimateIn: ({ children }: { children: React.ReactNode }) => (
      <div data-testid="animatein-stub">{children}</div>
    ),
  };
});

import ContactPage from "./page";

describe("Contact page", () => {
  jest.setTimeout(20000);
  it("renders mini hero and contact form with fields", () => {
    render(<ContactPage />);

    expect(
      screen.getByRole("heading", { level: 1, name: "Contact" }),
    ).toBeInTheDocument();

    expect(
      screen.getByRole("heading", { level: 2, name: "Get in Touch" }),
    ).toBeInTheDocument();

    expect(screen.getByLabelText("Name")).toBeInTheDocument();
    expect(screen.getByLabelText("Email")).toBeInTheDocument();
    expect(screen.getByLabelText("Service interest")).toBeInTheDocument();
    expect(screen.getByLabelText("Budget (optional)")).toBeInTheDocument();
    expect(screen.getByLabelText("Project details")).toBeInTheDocument();

    const website = screen.getByTestId("honeypot-website");
    expect(website).toHaveAttribute("type", "text");
    expect(website).toHaveAttribute("tabindex", "-1");
  });

  it("renders contact information with mailto and tel links", () => {
    render(<ContactPage />);

    expect(
      screen.getByRole("heading", { level: 2, name: "Contact Information" }),
    ).toBeInTheDocument();

    const emailLink = screen.getByRole("link", { name: /hello@virtuallnp\.com/i });
    expect(emailLink).toHaveAttribute("href", "mailto:hello@virtuallnp.com");

    const phoneLink = screen.getByRole("link", { name: /\+49 123 456 7890/i });
    expect(phoneLink).toHaveAttribute("href", "tel:+491234567890");

    expect(
      screen.getByText(/We respond within 24 hours on business days./i),
    ).toBeInTheDocument();
  });

  it("marks decorative contact icons as aria-hidden", () => {
    render(<ContactPage />);

    const icons = screen.getAllByTestId("mock-icon");
    expect(icons.length).toBeGreaterThan(0);
    icons.forEach((icon) => {
      expect(icon).toHaveAttribute("aria-hidden", "true");
    });
  });

  it("preselects service based on URL query", () => {
    render(<ContactPage />);

    const serviceSelect = screen.getByLabelText("Service interest") as HTMLSelectElement;
    expect(serviceSelect.value).toBe("research");
  });

  it("shows validation errors when submitting empty form", async () => {
    const user = userEvent.setup();
    render(<ContactPage />);

    await user.click(
      screen.getByRole("button", { name: /send message/i }),
    );

    expect(
      await screen.findByText(/Please enter your name/i),
    ).toBeInTheDocument();
    expect(
      screen.getByText(/Please enter a valid email/i),
    ).toBeInTheDocument();
    expect(
      screen.getByText(/Please tell us a bit more/i),
    ).toBeInTheDocument();
  });

  it("submits successfully and shows success message when data is valid", async () => {
    const user = userEvent.setup();
    render(<ContactPage />);

    await user.type(screen.getByLabelText("Name"), "John Doe");
    await user.type(screen.getByLabelText("Email"), "john@example.com");
    await user.selectOptions(
      screen.getByLabelText("Service interest"),
      "research",
    );
    await user.type(
      screen.getByLabelText("Project details"),
      "This is a detailed message.",
    );

    await user.click(screen.getByRole("button", { name: /send message/i }));

    await waitFor(() => {
      expect(
        screen.getByText(/Share a bit about your product/i),
      ).toBeInTheDocument();
    });
  });

  it("is usable on mobile: stacked form, readable text, touch target submit", () => {
    const breakpoints = [375, 768, 1024, 1440];

    // eslint-disable-next-line no-restricted-syntax
    for (const width of breakpoints) {
      Object.defineProperty(window, "innerWidth", { value: width, writable: true });
      window.dispatchEvent(new Event("resize"));

      const { unmount } = render(<ContactPage />);

      // no tiny text
      expect(document.querySelector(".text-xs")).toBeNull();

      // stacked on mobile
      const grid = document.querySelector('div.grid.grid-cols-1');
      expect(grid).not.toBeNull();
      expect(grid).toHaveClass("lg:grid-cols-2");

      const submit = screen.getByRole("button", { name: /send message/i });
      expect(submit).toHaveClass("min-h-[44px]");

      unmount();
    }
  });
});

