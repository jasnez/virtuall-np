import React from "react";
import { render, screen } from "@testing-library/react";

import PrivacyPolicyPage, { metadata } from "./page";

describe("Privacy Policy page", () => {
  it("exports metadata", () => {
    expect(metadata.title).toMatch(/privacy policy/i);
    expect(metadata.description).toMatch(/privacy/i);
  });

  it("renders all required sections and key details", () => {
    render(<PrivacyPolicyPage />);

    expect(
      screen.getByRole("heading", { level: 1, name: /privacy policy/i }),
    ).toBeInTheDocument();

    const sections = [
      "Introduction",
      "Data We Collect",
      "How We Use Your Data",
      "Cookies",
      "Third-Party Services",
      "Data Retention",
      "Your Rights",
      "Contact Us",
    ] as const;

    sections.forEach((name) => {
      expect(
        screen.getByRole("heading", { level: 2, name }),
      ).toBeInTheDocument();
    });

    // Controller identity + contact
    expect(screen.getAllByText(/VirtuALL NP/i).length).toBeGreaterThan(0);
    const emailLinks = screen.getAllByRole("link", {
      name: /office@virtuall-np\.com/i,
    });
    expect(emailLinks.length).toBeGreaterThan(0);
    emailLinks.forEach((a) => {
      expect(a).toHaveAttribute("href", "mailto:office@virtuall-np.com");
    });

    // Data we collect: contact form fields + analytics
    expect(
      screen.getByText(
        (_, el) => {
          const t = el?.textContent ?? "";
          return (
            /Contact form data:/i.test(t) &&
            /name,\s*email,\s*service interest,\s*and\s*message content/i.test(t)
          );
        },
        { selector: "li" },
      ),
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        (_, el) => {
          const t = el?.textContent ?? "";
          return /Analytics data:/i.test(t) && /cookies,\s*page views/i.test(t);
        },
        { selector: "li" },
      ),
    ).toBeInTheDocument();

    // Retention periods
    expect(screen.getByText(/12 months/i)).toBeInTheDocument();
    expect(screen.getByText(/26 months/i)).toBeInTheDocument();

    // Third parties
    expect(screen.getAllByText(/Google Analytics/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/Vercel/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/Resend/i).length).toBeGreaterThan(0);
  });
});

