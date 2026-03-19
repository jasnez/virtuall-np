"use client";

import React from "react";
import Script from "next/script";

function readCookie(name: string) {
  if (typeof document === "undefined") return null;
  const cookies = document.cookie.split(";").map((c) => c.trim());
  const prefix = `${encodeURIComponent(name)}=`;
  const match = cookies.find((c) => c.startsWith(prefix));
  if (!match) return null;
  return decodeURIComponent(match.slice(prefix.length));
}

export function GoogleAnalytics() {
  const gaId = process.env.NEXT_PUBLIC_GA_ID ?? "";
  const [enabled, setEnabled] = React.useState(false);

  React.useEffect(() => {
    const consent = readCookie("cookie-consent");
    setEnabled(consent === "accepted");
  }, []);

  if (!gaId) return null;
  if (!enabled) return null;

  return (
    <>
      <Script
        id="ga4-loader"
        strategy="afterInteractive"
        src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`}
      />
      <Script
        id="ga4-init"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());
gtag('config', '${gaId}');
          `.trim(),
        }}
      />
    </>
  );
}

