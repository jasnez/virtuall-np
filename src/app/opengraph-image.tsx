import { ImageResponse } from "next/og";

import siteConfig from "@/content/site-config.json";

export const runtime = "nodejs";
export const size = { width: 1200, height: 630 };

export default function OpenGraphImage() {
  const accent = "#2DD4BF";
  const navy = "#0F2440";

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          backgroundColor: navy,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: 72,
          boxSizing: "border-box",
          fontFamily: "Inter, system-ui, -apple-system, Segoe UI, Roboto, Arial",
        }}
      >
        <div
          style={{
            color: "#ffffff",
            fontSize: 86,
            fontWeight: 800,
            lineHeight: 1,
            letterSpacing: 1,
            marginBottom: 18,
          }}
        >
          VirtuALL NP
        </div>

        <div
          style={{
            width: 420,
            height: 10,
            backgroundColor: accent,
            borderRadius: 999,
            marginBottom: 22,
          }}
        />

        <div
          style={{
            color: "#ffffff",
            fontSize: 34,
            fontWeight: 500,
            textAlign: "center",
            lineHeight: 1.25,
            maxWidth: 980,
            opacity: 0.95,
          }}
        >
          {siteConfig.tagline}
        </div>
      </div>
    ),
    {
      ...size,
    },
  );
}

