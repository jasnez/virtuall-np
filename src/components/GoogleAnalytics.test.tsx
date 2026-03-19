import React from "react";
import { render, screen, waitFor } from "@testing-library/react";

import { GoogleAnalytics } from "./GoogleAnalytics";

jest.mock("next/script", () => ({
  __esModule: true,
  default: ({ id, src, dangerouslySetInnerHTML, strategy }: any) => {
    return (
      <script
        data-testid={id ?? "next-script"}
        data-strategy={strategy}
        src={src}
      >
        {dangerouslySetInnerHTML?.__html ?? null}
      </script>
    );
  },
}));

function setConsentCookie(value: string) {
  document.cookie = `cookie-consent=${value}; path=/`;
}

describe("GoogleAnalytics", () => {
  const originalEnv = process.env;

  beforeEach(() => {
    process.env = { ...originalEnv };
    document.cookie =
      "cookie-consent=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
  });

  afterAll(() => {
    process.env = originalEnv;
  });

  it("renders nothing when cookie consent is not accepted", async () => {
    process.env.NEXT_PUBLIC_GA_ID = "G-TEST123";
    setConsentCookie("declined");
    render(<GoogleAnalytics />);

    await waitFor(() => {
      expect(screen.queryByTestId("ga4-loader")).not.toBeInTheDocument();
      expect(screen.queryByTestId("ga4-init")).not.toBeInTheDocument();
    });
  });

  it("renders GA4 loader + init scripts after consent is accepted", async () => {
    process.env.NEXT_PUBLIC_GA_ID = "G-TEST123";
    setConsentCookie("accepted");
    render(<GoogleAnalytics />);

    const loader = await screen.findByTestId("ga4-loader");
    expect(loader).toHaveAttribute("data-strategy", "afterInteractive");
    expect(loader).toHaveAttribute(
      "src",
      "https://www.googletagmanager.com/gtag/js?id=G-TEST123",
    );

    const init = await screen.findByTestId("ga4-init");
    expect(init).toHaveAttribute("data-strategy", "afterInteractive");
    expect(init.textContent).toContain("G-TEST123");
    expect(init.textContent).toContain("gtag(");
  });

  it("renders nothing if env var is missing (even if consent accepted)", async () => {
    delete process.env.NEXT_PUBLIC_GA_ID;
    setConsentCookie("accepted");
    render(<GoogleAnalytics />);

    await waitFor(() => {
      expect(screen.queryByTestId("ga4-loader")).not.toBeInTheDocument();
      expect(screen.queryByTestId("ga4-init")).not.toBeInTheDocument();
    });
  });
});

