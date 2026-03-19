"use client";

import React from "react";

import { Button } from "@/components/ui/Button";
import { PAGE_CONTAINER_X } from "@/lib/page-layout";
import { initGA4 } from "@/lib/ga4";

const CONSENT_KEY = "cookie-consent";
type ConsentValue = "accepted" | "declined";

function readCookie(name: string) {
  if (typeof document === "undefined") return null;
  const cookies = document.cookie.split(";").map((c) => c.trim());
  const prefix = `${encodeURIComponent(name)}=`;
  const match = cookies.find((c) => c.startsWith(prefix));
  if (!match) return null;
  return decodeURIComponent(match.slice(prefix.length));
}

function writeCookie(name: string, value: string) {
  if (typeof document === "undefined") return;
  // 1 year
  const maxAge = 60 * 60 * 24 * 365;
  const secure =
    typeof window !== "undefined" &&
    (window.location.protocol === "https:" || window.location.hostname === "localhost");
  document.cookie = `${encodeURIComponent(name)}=${encodeURIComponent(
    value,
  )}; path=/; max-age=${maxAge}; samesite=lax${secure ? "; secure" : ""}`;
}

function getStoredConsent(): ConsentValue | null {
  const fromCookie = readCookie(CONSENT_KEY);
  if (fromCookie === "accepted" || fromCookie === "declined") return fromCookie;

  if (typeof window === "undefined") return null;
  const fromStorage = window.localStorage.getItem(CONSENT_KEY);
  if (fromStorage === "accepted" || fromStorage === "declined") {
    return fromStorage;
  }
  return null;
}

function setStoredConsent(value: ConsentValue) {
  if (typeof window !== "undefined") {
    window.localStorage.setItem(CONSENT_KEY, value);
  }
  writeCookie(CONSENT_KEY, value);
}

export function CookieConsent() {
  const [ready, setReady] = React.useState(false);
  const [visible, setVisible] = React.useState(false);
  const [slideIn, setSlideIn] = React.useState(false);

  React.useEffect(() => {
    const stored = getStoredConsent();
    if (stored) {
      setVisible(false);
      setReady(true);
      return;
    }

    setVisible(true);
    setReady(true);
    // Trigger slide-up transition on next paint
    requestAnimationFrame(() => setSlideIn(true));
  }, []);

  const onChoose = React.useCallback((value: ConsentValue) => {
    setStoredConsent(value);
    if (value === "accepted") {
      initGA4();
    }
    setVisible(false);
  }, []);

  if (!ready || !visible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-[60]">
      <div
        className={[
          PAGE_CONTAINER_X,
          "bg-white border-t border-gray-200/90 py-4",
          "transition-transform duration-200 ease-out",
          slideIn ? "translate-y-0" : "translate-y-full",
        ].join(" ")}
        role="dialog"
        aria-live="polite"
        aria-label="Cookie consent"
      >
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-text-light">
            We use cookies to analyze site traffic and improve your experience.
            By clicking Accept, you consent to our use of cookies.
          </p>

          <div className="flex items-center gap-3 shrink-0">
            <Button
              variant="primary"
              className="bg-teal-600 hover:bg-teal-700 focus:ring-teal-600"
              onClick={() => onChoose("accepted")}
            >
              Accept
            </Button>
            <Button variant="ghost" onClick={() => onChoose("declined")}>
              Decline
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

