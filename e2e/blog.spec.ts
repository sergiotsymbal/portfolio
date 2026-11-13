import { articles } from "../data/articles";
import { expect, gotoHome, test } from "./fixtures";

test("load more expands to 9 per page; new cards slide down; collapse returns to 3", async ({ page }) => {
  await gotoHome(page);
  const blog = page.locator("#blog");
  const cards = blog.locator('a[href^="/blog/"]');

  await expect(cards).toHaveCount(3);
  await blog.getByRole("button", { name: "Завантажити ще статті" }).click();

  const expected = Math.min(9, articles.length);
  await expect(cards).toHaveCount(expected);
  // Only the newly added cards animate.
  for (let i = 0; i < expected; i++) {
    if (i < 3) await expect(cards.nth(i)).not.toHaveClass(/animate-slide-down/);
    else await expect(cards.nth(i)).toHaveClass(/animate-slide-down/);
  }
  await expect(cards.nth(3)).toContainText(articles[3].title);

  // Pagination only when there are more than 9 articles.
  await expect(blog.getByRole("navigation", { name: "Сторінки блогу" })).toHaveCount(articles.length > 9 ? 1 : 0);

  await blog.getByRole("button", { name: "Згорнути блог" }).click();
  await expect(cards).toHaveCount(3);
});

test("clicking a card opens the article page", async ({ page }) => {
  await gotoHome(page);
  await page.locator('#blog a[href^="/blog/"]').first().click();
  await expect(page).toHaveURL(new RegExp(`/blog/${articles[0].slug}/$`));
  await expect(page.locator("h1")).toHaveText(articles[0].title);
});
