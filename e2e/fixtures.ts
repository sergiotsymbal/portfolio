import { test as base, expect, type Page } from "@playwright/test";
import { TEST_FORM_ENDPOINT } from "../playwright.config";

type FormMock = {
  /** Payloads received by the fake form endpoint, in order. */
  requests: Record<string, string>[];
  /** Make the next submissions fail with this HTTP status. */
  failWith: (status: number) => void;
};

export const test = base.extend<{ formMock: FormMock }>({
  // `auto`: every test runs offline with the mocked endpoint, even if it doesn't use `formMock` directly.
  formMock: [
    async ({ page }, use) => {
      const requests: Record<string, string>[] = [];
      let failStatus = 0;

      // Keep tests offline and fast: block external images, mock the form endpoint.
      await page.route("**/*", (route) => {
        const url = route.request().url();
        if (url.startsWith(TEST_FORM_ENDPOINT)) {
          requests.push(route.request().postDataJSON());
          return failStatus
            ? route.fulfill({ status: failStatus, body: "fail" })
            : route.fulfill({ status: 200, contentType: "application/json", body: '{"ok":true}' });
        }
        if (url.startsWith("http://localhost")) return route.continue();
        return route.abort();
      });

      await use({ requests, failWith: (s) => (failStatus = s) });
    },
    { auto: true },
  ],
});

export { expect };

export async function gotoHome(page: Page) {
  await page.goto("/");
  await expect(page.locator("#hero h1")).toBeVisible();
}
