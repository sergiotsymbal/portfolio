import { articles } from "../data/articles";
import { expect, test } from "./fixtures";

const first = articles[0];
const second = articles[1];
const last = articles[articles.length - 1];

test("every article has its own page with SEO metadata and structured data", async ({ page }) => {
  for (const a of articles) {
    await page.goto(`/blog/${a.slug}/`);
    await expect(page.locator("h1")).toHaveText(a.title);
    await expect(page).toHaveTitle(`${a.seo?.title ?? a.title} | Don Sergio`);
    await expect(page.locator('meta[name="description"]')).toHaveAttribute("content", a.seo?.description ?? a.summary);
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute("href", new RegExp(`/blog/${a.slug}/$`));
    await expect(page.locator('meta[property="og:type"]')).toHaveAttribute("content", "article");
    await expect(page.locator('meta[property="og:image"]').first()).toHaveAttribute("content", a.seo?.ogImage ?? a.image);

    const ld = JSON.parse((await page.locator('script[type="application/ld+json"]').textContent()) ?? "{}");
    expect(ld).toMatchObject({ "@type": "BlogPosting", headline: a.title, datePublished: a.date });
  }
});

test("renders content blocks from JSON", async ({ page }) => {
  await page.goto(`/blog/${first.slug}/`);
  const headings = first.content.filter((b) => b.type === "heading");
  for (const h of headings) await expect(page.getByRole("heading", { level: 2, name: h.text })).toBeVisible();
});

test("previous / next navigation between articles", async ({ page }) => {
  await page.goto(`/blog/${first.slug}/`);
  await expect(page.getByRole("link", { name: /Попередня стаття/ })).toHaveCount(0);
  await page.getByRole("link", { name: /Наступна стаття/ }).click();
  await expect(page).toHaveURL(new RegExp(`/blog/${second.slug}/$`));
  await expect(page.locator("h1")).toHaveText(second.title);

  await page.goto(`/blog/${last.slug}/`);
  await expect(page.getByRole("link", { name: /Наступна стаття/ })).toHaveCount(0);
});

test("related articles, back link, booking CTA and site nav work on article pages", async ({ page }) => {
  await page.goto(`/blog/${first.slug}/`);
  await expect(page.getByRole("region", { name: "Читайте також" }).locator('a[href^="/blog/"]')).toHaveCount(3);

  await page.getByRole("button", { name: "Замовити послугу" }).last().click();
  const dialog = page.getByRole("dialog", { name: "Швидке замовлення" });
  await expect(dialog).toContainText(`Стаття: ${first.title}`);
  await page.keyboard.press("Escape");
  await expect(dialog).toBeHidden();

  await page.getByRole("link", { name: "Усі статті" }).click();
  await expect(page).toHaveURL(/\/#blog$/);
  await expect(page.locator("#blog")).toBeInViewport();
});

test("site nav from an article page goes to the home page section", async ({ page }, info) => {
  test.skip(info.project.name !== "desktop", "desktop nav");
  await page.goto(`/blog/${first.slug}/`);
  await page.locator("#navbar").getByRole("link", { name: "Контакти" }).click();
  await expect(page).toHaveURL(/\/#contacts$/);
  await expect(page.locator("#contacts")).toBeVisible();
});

test("unknown article slug is a 404", async ({ page }) => {
  const res = await page.goto("/blog/does-not-exist/");
  expect(res?.status()).toBe(404);
});

test("sitemap lists the home page and every article", async ({ request }) => {
  const xml = await (await request.get("/sitemap.xml")).text();
  for (const a of articles) expect(xml).toContain(`/blog/${a.slug}/`);
  expect(await (await request.get("/robots.txt")).text()).toContain("Sitemap:");
});

test("articles with several photos get a header carousel; single-photo articles don't", async ({ page }) => {
  const multi = articles.find((a) => (a.images?.length ?? 0) > 0);
  const single = articles.find((a) => !a.images?.length);
  test.skip(!multi || !single, "needs one article with and one without extra photos");

  await page.goto(`/blog/${multi!.slug}/`);
  const carousel = page.getByRole("region", { name: "Фото до статті" });
  const total = 1 + multi!.images!.length;
  const dots = carousel.getByRole("button", { name: /^Фото \d+$/ });
  await expect(dots).toHaveCount(total);
  await expect(carousel.locator('button[aria-current="true"]')).toHaveAttribute("aria-label", "Фото 1");
  await carousel.getByRole("button", { name: "Наступне фото" }).click();
  await expect(carousel.locator('button[aria-current="true"]')).toHaveAttribute("aria-label", "Фото 2");
  // The first slide is the cover image.
  await expect(carousel.locator('[aria-roledescription="slide"] img').first()).toHaveAttribute("src", multi!.image);

  await page.goto(`/blog/${single!.slug}/`);
  await expect(page.getByRole("region", { name: "Фото до статті" })).toHaveCount(0);
  await expect(page.locator(`main img[src="${single!.image}"]`).first()).toBeVisible();
});
