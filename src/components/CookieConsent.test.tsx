import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { CookieConsent } from "./CookieConsent";

const initGA4 = jest.fn();

jest.mock("@/lib/ga4", () => ({
  __esModule: true,
  initGA4: (...args: any[]) => initGA4(...args),
}));

function clearConsent() {
  localStorage.removeItem("cookie-consent");
  // jsdom cookie handling: overwrite to expire
  document.cookie =
    "cookie-consent=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
}

describe("CookieConsent", () => {
  beforeEach(() => {
    initGA4.mockReset();
    clearConsent();
  });

  it("renders on first visit (no stored consent)", async () => {
    render(<CookieConsent />);
    expect(
      await screen.findByText(
        "We use cookies to analyze site traffic and improve your experience. By clicking Accept, you consent to our use of cookies.",
      ),
    ).toBeInTheDocument();

    expect(screen.getByRole("button", { name: "Accept" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Decline" })).toBeInTheDocument();
  });

  it("does not render when consent already accepted (localStorage)", async () => {
    localStorage.setItem("cookie-consent", "accepted");
    render(<CookieConsent />);

    await waitFor(() => {
      expect(
        screen.queryByText(/We use cookies to analyze site traffic/i),
      ).not.toBeInTheDocument();
    });
  });

  it("Accept stores consent, initializes GA4, and hides banner", async () => {
    const user = userEvent.setup();
    render(<CookieConsent />);

    await user.click(await screen.findByRole("button", { name: "Accept" }));

    expect(localStorage.getItem("cookie-consent")).toBe("accepted");
    expect(document.cookie).toMatch(/cookie-consent=accepted/);
    expect(initGA4).toHaveBeenCalledTimes(1);

    await waitFor(() => {
      expect(
        screen.queryByText(/We use cookies to analyze site traffic/i),
      ).not.toBeInTheDocument();
    });
  });

  it("Decline stores consent, does not initialize GA4, and hides banner", async () => {
    const user = userEvent.setup();
    render(<CookieConsent />);

    await user.click(await screen.findByRole("button", { name: "Decline" }));

    expect(localStorage.getItem("cookie-consent")).toBe("declined");
    expect(document.cookie).toMatch(/cookie-consent=declined/);
    expect(initGA4).not.toHaveBeenCalled();

    await waitFor(() => {
      expect(
        screen.queryByText(/We use cookies to analyze site traffic/i),
      ).not.toBeInTheDocument();
    });
  });

  it("respects cookie value (does not render when cookie set)", async () => {
    document.cookie = "cookie-consent=declined; path=/";
    render(<CookieConsent />);

    await waitFor(() => {
      expect(
        screen.queryByText(/We use cookies to analyze site traffic/i),
      ).not.toBeInTheDocument();
    });
  });
});

