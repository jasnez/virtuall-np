let ga4Initialized = false;

declare global {
  interface Window {
    dataLayer?: unknown[][];
    gtag?: (...args: unknown[]) => void;
  }
}

function getMeasurementId() {
  return (
    process.env.NEXT_PUBLIC_GA4_MEASUREMENT_ID ??
    process.env.NEXT_PUBLIC_GA4_ID ??
    ""
  );
}

export function initGA4() {
  if (ga4Initialized) return;
  const measurementId = getMeasurementId();
  if (!measurementId) return;
  if (typeof window === "undefined" || typeof document === "undefined") return;

  ga4Initialized = true;

  // gtag.js loader
  const existing = document.querySelector<HTMLScriptElement>(
    `script[src^="https://www.googletagmanager.com/gtag/js?id=${measurementId}"]`,
  );
  if (!existing) {
    const script = document.createElement("script");
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${measurementId}`;
    document.head.appendChild(script);
  }

  window.dataLayer = window.dataLayer ?? [];
  window.gtag =
    window.gtag ??
    function gtag(...args: unknown[]) {
      window.dataLayer?.push(args);
    };

  window.gtag("js", new Date());
  window.gtag("config", measurementId, { anonymize_ip: true });
}

