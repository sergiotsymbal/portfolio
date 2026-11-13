import { defineConfig, devices } from "@playwright/test";

const PORT = 3100;
const E2E_DIST = ".e2e-build";
/** Fake Apps Script endpoint baked into the test build; tests intercept it with page.route(). */
export const TEST_FORM_ENDPOINT = "https://script.google.com/macros/s/e2e-test/exec";

export default defineConfig({
  testDir: "./e2e",
  fullyParallel: true,
  retries: process.env.CI ? 1 : 0,
  reporter: [["list"], ["html", { open: "never" }]],
  use: {
    baseURL: `http://localhost:${PORT}`,
    // Use the locally installed Google Chrome (no browser download needed).
    channel: "chrome",
    trace: "retain-on-failure",
  },
  projects: [
    { name: "desktop", use: { ...devices["Desktop Chrome"], channel: "chrome", viewport: { width: 1440, height: 900 } } },
    { name: "mobile", use: { ...devices["Pixel 7"], channel: "chrome" } },
  ],
  // Tests run against a real production build, made in its own folder with the fake form endpoint baked in,
  // so they don't clash with a running `npm run dev` and never touch .next/ or out/.
  webServer: {
    command: `next build && serve ${E2E_DIST} -l ${PORT}`,
    url: `http://localhost:${PORT}`,
    reuseExistingServer: false,
    timeout: 180_000,
    env: { NEXT_DIST_DIR: E2E_DIST, NEXT_PUBLIC_FORM_ENDPOINT: TEST_FORM_ENDPOINT },
  },
});
