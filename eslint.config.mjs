import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const config = [
  ...nextVitals,
  ...nextTs,
  {
    // Playwright's fixture `use()` is not a React hook.
    files: ["e2e/**"],
    rules: { "react-hooks/rules-of-hooks": "off" },
  },
  {
    ignores: [
      ".next/**",
      "out/**",
      ".e2e-build/**",
      "node_modules/**",
      "next-env.d.ts",
      "index.html",
      "playwright-report/**",
      "test-results/**",
    ],
  },
];

export default config;
