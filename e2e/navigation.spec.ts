import { expect, gotoHome, test } from "./fixtures";

test("mobile menu opens, links close it, CTA opens booking", async ({ page }, info) => {
  test.skip(info.project.name !== "mobile", "mobile only");
  await gotoHome(page);
  const toggle = page.getByRole("button", { name: "Відкрити меню" });

  await toggle.click();
  await expect(toggle).toHaveAttribute("aria-expanded", "true");
  await page.locator("#navbar").getByRole("link", { name: "Блог" }).click();
  await expect(toggle).toHaveAttribute("aria-expanded", "false");
  await expect(page).toHaveURL(/#blog$/);

  await toggle.click();
  await page.locator("#navbar").getByRole("button", { name: "Замовити послугу" }).click();
  await expect(page.getByRole("dialog", { name: "Швидке замовлення" })).toContainText("Мобільне меню");
});

test("desktop nav links jump to sections; CTA opens booking", async ({ page }, info) => {
  test.skip(info.project.name !== "desktop", "desktop only");
  await gotoHome(page);
  await page.locator("#navbar").getByRole("link", { name: "Контакти" }).click();
  await expect(page).toHaveURL(/#contacts$/);
  await page.locator("#navbar").getByRole("button", { name: "Замовити послугу" }).click();
  await expect(page.getByRole("dialog", { name: "Швидке замовлення" })).toContainText("Загальний виїзний запит");
});

test("page fits the device width (no zoom-out from horizontal overflow)", async ({ page }) => {
  await gotoHome(page);
  const deviceWidth = page.viewportSize()!.width;
  // On mobile, overflowing content widens the layout viewport, so innerWidth grows past the device width.
  expect(await page.evaluate(() => window.innerWidth)).toBe(deviceWidth);
  expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBe(deviceWidth);
});
