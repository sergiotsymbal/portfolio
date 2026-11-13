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

test("buttons whose text turns dark on hover also get the gold background (text stays visible)", async ({ page }, info) => {
  test.skip(info.project.name !== "desktop", "hover needs a mouse");
  await gotoHome(page);
  const buttons = page.locator('[class*="hover:text-gaudi-dark"]:visible');
  const count = await buttons.count();
  expect(count).toBeGreaterThan(3);
  for (let i = 0; i < count; i++) {
    const b = buttons.nth(i);
    await b.scrollIntoViewIfNeeded();
    await b.hover();
    await expect
      .poll(() => b.evaluate((el) => {
        const cs = getComputedStyle(el);
        return cs.backgroundImage.includes("gradient") || cs.backgroundColor === "rgb(229, 193, 88)";
      }))
      .toBe(true);
  }
});

test("contact links come from data/contacts.json", async ({ page }) => {
  const { contacts } = await import("../data/contacts");
  await gotoHome(page);
  const section = page.locator("#contacts");
  for (const c of [contacts.phone, contacts.telegram, contacts.email]) {
    await expect(section.getByRole("link", { name: c.text })).toHaveAttribute("href", c.href);
  }
  expect(contacts.telegram.href).toMatch(/^https:\/\/t\.me\/[A-Za-z]/);
  expect(contacts.phone.href).toMatch(/^tel:\+?\d+$/);
});
