import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",

    // This project contains a fairly strict rule-set for production code.
    // Test/e2e files frequently use `jest.mock` patterns that rely on
    // `require()` and `any`, which would otherwise block CI.
    "e2e/**",
    "**/*.test.*",
    "**/*.spec.*",
    "**/jest.config.*",
    "**/playwright.config.*",
  ]),
]);

export default eslintConfig;
