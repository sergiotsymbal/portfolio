import { expect, gotoHome, test } from "./fixtures";

test("renders every section without runtime errors", async ({ page }) => {
  const errors: string[] = [];
  page.on("pageerror", (e) => errors.push(e.message));
  page.on("console", (m) => {
    // External images are blocked in tests, so ignore resource-load errors.
    if (m.type() === "error" && !m.text().includes("Failed to load resource")) errors.push(m.text());
  });

  await gotoHome(page);
  for (const id of ["hero", "about", "specializations", "instagram", "tasting-event", "book", "blog", "gallery", "contacts"]) {
    await expect(page.locator(`section#${id}`)).toHaveCount(1);
  }
  await expect(page.locator("footer")).toContainText("GASTRO EXPERT");
  await expect(page).toHaveTitle(/Гастроексперт/);
  expect(errors).toEqual([]);
});

test("hero heading keeps the space before the highlighted phrase", async ({ page }) => {
  await gotoHome(page);
  await expect(page.locator("#hero h1")).toContainText("цілий світ сиру");
});

test("scroll reveal animates sections in", async ({ page }) => {
  await gotoHome(page);
  const header = page.locator("#gallery .reveal-element").first();
  await header.scrollIntoViewIfNeeded();
  await expect(header).toHaveClass(/revealed/);
});

test("external links open in a new tab", async ({ page }) => {
  await gotoHome(page);
  for (const link of await page.locator('a[href^="https://www.instagram.com"], a[href^="https://badboy.ua"]').all()) {
    await expect(link).toHaveAttribute("target", "_blank");
  }
});

test("book cover is the local optimized image and loads", async ({ page }) => {
  await gotoHome(page);
  const img = page.locator("#book picture img");
  await img.scrollIntoViewIfNeeded();
  await expect(img).toHaveJSProperty("complete", true);
  expect(await img.evaluate((el: HTMLImageElement) => el.naturalWidth)).toBeGreaterThan(0);
  expect(await img.evaluate((el: HTMLImageElement) => el.currentSrc)).toMatch(/\/images\/book-cover(@2x)?\.webp$/);
});
