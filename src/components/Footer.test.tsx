import React from "react";
import { render, screen } from "@testing-library/react";

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

import siteConfig from "@/content/site-config.json";
import { Footer } from "./Footer";

describe("Footer", () => {
  it("renders basic layout and headings", () => {
    render(<Footer />);

    expect(screen.getByText("VirtuALL NP")).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Quick Links" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Contact" })).toBeInTheDocument();

    const footer = screen.getByTestId("site-footer");
    expect(footer).toHaveClass(
      "bg-gradient-to-br",
      "from-primary",
      "to-[#0F2440]",
      "text-white",
    );

    const footerGrid = footer.querySelector("div.grid");
    expect(footerGrid).not.toBeNull();
    expect(footerGrid).toHaveClass("grid-cols-1");
    expect(footerGrid).toHaveClass("md:grid-cols-3");
  });

  it("renders quick links to all pages", () => {
    render(<Footer />);

    expect(screen.getByRole("link", { name: "Home" })).toHaveAttribute("href", "/");
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
  });

  it("renders contact info from site-config.json", () => {
    render(<Footer />);

    expect(
      screen.getByRole("link", { name: siteConfig.contact.email }),
    ).toHaveAttribute("href", `mailto:${siteConfig.contact.email}`);

    const telHref = `tel:${siteConfig.contact.phone.replace(/\s+/g, "")}`;
    expect(screen.getByRole("link", { name: siteConfig.contact.phone })).toHaveAttribute(
      "href",
      telHref,
    );

    const address = `${siteConfig.contact.address.street}, ${siteConfig.contact.address.zip} ${siteConfig.contact.address.city}, ${siteConfig.contact.address.country}`;
    expect(screen.getByText(address)).toBeInTheDocument();
  });

  it("renders copyright and Privacy Policy link", () => {
    render(<Footer />);

    expect(
      screen.getByText("© 2026 VirtuALL NP. All rights reserved."),
    ).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Privacy Policy" })).toHaveAttribute(
      "href",
      "/privacy-policy",
    );
  });
});

