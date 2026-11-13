import { galleryItems } from "../data/gallery";
import { expect, gotoHome, test } from "./fixtures";

test.skip(galleryItems.length < 3, "carousel only from 3 photos");

const activeDot = (page: import("@playwright/test").Page) =>
  page.locator('#gallery button[aria-current="true"]');

test("auto-advances on its own", async ({ page }) => {
  await gotoHome(page);
  await page.locator("#gallery").scrollIntoViewIfNeeded();
  await page.mouse.move(0, 0); // make sure we're not hovering (hover pauses it)
  await expect(activeDot(page)).toHaveAttribute("aria-label", "Фото 1");
  await expect(activeDot(page)).toHaveAttribute("aria-label", "Фото 2", { timeout: 6000 });
});

test("arrows move it and it loops in both directions", async ({ page }) => {
  await gotoHome(page);
  const gallery = page.locator("#gallery");
  await gallery.scrollIntoViewIfNeeded();
  const n = galleryItems.length;

  await gallery.getByRole("button", { name: "Попереднє фото" }).click();
  await expect(activeDot(page)).toHaveAttribute("aria-label", `Фото ${n}`);

  // Rapid clicks (faster than the slide animation) must all register.
  for (let i = 0; i < n; i++) await gallery.getByRole("button", { name: "Наступне фото" }).click();
  await expect(activeDot(page)).toHaveAttribute("aria-label", `Фото ${n}`);
  await gallery.getByRole("button", { name: "Наступне фото" }).click();
  await expect(activeDot(page)).toHaveAttribute("aria-label", "Фото 1");
});

test("dots jump to a photo; hovering pauses autoplay", async ({ page }) => {
  await gotoHome(page);
  const gallery = page.locator("#gallery");
  await gallery.scrollIntoViewIfNeeded();
  await gallery.getByRole("button", { name: "Фото 3" }).click();
  await expect(activeDot(page)).toHaveAttribute("aria-label", "Фото 3");

  await gallery.getByRole("region", { name: "Галерея" }).hover();
  await page.waitForTimeout(4500);
  await expect(activeDot(page)).toHaveAttribute("aria-label", "Фото 3");
});

test("loop copies are hidden from screen readers", async ({ page }) => {
  await gotoHome(page);
  const slides = page.locator('#gallery [aria-roledescription="slide"]');
  await expect(slides).toHaveCount(galleryItems.length * 3);
  await expect(page.locator('#gallery [aria-roledescription="slide"][aria-hidden="true"]')).toHaveCount(galleryItems.length * 2);
});
