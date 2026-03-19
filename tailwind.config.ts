import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    screens: {
      sm: "640px",
      md: "768px",
      lg: "1024px",
      xl: "1280px",
    },
    extend: {
      maxWidth: {
        page: "1200px",
      },
      colors: {
        primary: "#1B3A5C",
        "primary-light": "#2A4F7A",
        accent: "#2E8B8B",
        "accent-dark": "#236B6B",
        "bg-alt": "#F5F5F0",
        "text-main": "#1A1A2E",
        "text-light": "#5B6472",
        success: "#10B981",
        error: "#EF4444",
      },
      fontFamily: {
        sans: ["Inter", "sans-serif"],
      },
    },
  },
  plugins: [],
};

export default config;

