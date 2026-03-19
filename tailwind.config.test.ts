import config from "./tailwind.config";

describe("tailwind.config.ts theme", () => {
  it("defines custom colors, fonts, and screens", () => {
    const theme = config.theme ?? {};
    const extend = (theme as any).extend ?? {};

    expect(extend.colors).toMatchObject({
      primary: "#1B3A5C",
      "primary-light": "#2A4F7A",
      accent: "#2E8B8B",
      "accent-dark": "#236B6B",
      "bg-alt": "#F5F5F0",
      "text-main": "#1A1A2E",
      "text-light": "#5B6472",
      success: "#10B981",
      error: "#EF4444",
    });

    expect(extend.fontFamily).toMatchObject({
      sans: ["Inter", "sans-serif"],
    });

    expect((theme as any).screens ?? extend.screens).toMatchObject({
      sm: "640px",
      md: "768px",
      lg: "1024px",
      xl: "1280px",
    });
  });
});

