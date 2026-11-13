import { test as base, expect, type Page } from "@playwright/test";
import { TEST_FORM_ENDPOINT } from "../playwright.config";

type FormMock = {
  /** Payloads received by the fake form endpoint, in order. */
  requests: Record<string, string>[];
  /** Make the next submissions fail with this HTTP status. */
  failWith: (status: number) => void;
  /** Make the next submissions return HTTP 200 with { ok: false } (how Apps Script reports errors). */
  rejectWith: (error: string) => void;
  /** Content-Type headers of the received requests. */
  contentTypes: string[];
};

export const test = base.extend<{ formMock: FormMock }>({
  // `auto`: every test runs offline with the mocked endpoint, even if it doesn't use `formMock` directly.
  formMock: [
    async ({ page }, use) => {
      const requests: Record<string, string>[] = [];
      const contentTypes: string[] = [];
      let failStatus = 0;
      let rejectError = "";

      // Keep tests offline and fast: block external images, mock the form endpoint.
      await page.route("**/*", (route) => {
        const url = route.request().url();
        if (url.startsWith(TEST_FORM_ENDPOINT)) {
          requests.push(JSON.parse(route.request().postData() ?? "{}"));
          contentTypes.push(route.request().headers()["content-type"] ?? "");
          if (failStatus) return route.fulfill({ status: failStatus, body: "fail" });
          const body = rejectError ? { ok: false, error: rejectError } : { ok: true };
          return route.fulfill({ status: 200, contentType: "application/json", body: JSON.stringify(body) });
        }
        if (url.startsWith("http://localhost")) return route.continue();
        return route.abort();
      });

      await use({
        requests,
        contentTypes,
        failWith: (s) => (failStatus = s),
        rejectWith: (e) => (rejectError = e),
      });
    },
    { auto: true },
  ],
});

export { expect };

export async function gotoHome(page: Page) {
  await page.goto("/");
  await expect(page.locator("#hero h1")).toBeVisible();
}
