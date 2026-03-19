import type { PlaywrightTestConfig } from "@playwright/test";

const baseURL = process.env.E2E_BASE_URL ?? "http://localhost:3001";
const skipWebServer = process.env.E2E_SKIP_WEB_SERVER === "1";

const config: PlaywrightTestConfig = {
  testDir: "./e2e",
  timeout: 60_000,
  retries: 1,
  use: {
    baseURL,
    actionTimeout: 10_000,
  },
  webServer: skipWebServer
    ? undefined
    : {
        command: "npm run dev -- -p 3001",
        port: 3001,
        reuseExistingServer: !process.env.CI,
        timeout: 120_000,
      },
};

export default config;

