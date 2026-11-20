import { eventStartIso, events, formatEventDate, kyivToday, upcomingEvents, type EventItem } from "../data/events";
import { expect, test } from "./fixtures";

const ev = (date: string, title = date, time?: string): EventItem => ({ title, date, time, city: "Київ", venue: "V", description: ["d"] });

test.describe("event logic (unit)", () => {
  test.skip(({ isMobile }) => isMobile, "pure logic — run once");

  test("upcoming: drops past days, keeps today, sorts closest first (by date, then time)", () => {
    const list = [ev("2026-12-01"), ev("2026-11-10"), ev("2026-11-13", "late", "21:00"), ev("2026-11-13", "early", "18:00")];
    expect(upcomingEvents(list, "2026-11-13").map((e) => e.title)).toEqual(["early", "late", "2026-12-01"]);
    expect(upcomingEvents(list, "2026-12-02")).toEqual([]);
  });

  test("Kyiv date and UTC offsets", () => {
    expect(kyivToday(new Date("2026-11-25T22:30:00Z"))).toBe("2026-11-26"); // already the 26th in Kyiv
    expect(eventStartIso({ date: "2026-11-25", time: "19:00" })).toBe("2026-11-25T19:00:00+02:00");
    expect(eventStartIso({ date: "2026-07-01", time: "19:00" })).toBe("2026-07-01T19:00:00+03:00");
    expect(formatEventDate({ date: "2026-11-25", time: "19:00" })).toBe("25 Листопада 2026, 19:00");
    expect(formatEventDate({ date: "2026-11-05" })).toBe("5 Листопада 2026");
  });
});

/** Fake "today" in the browser (noon Kyiv time on that date). */
async function openOn(page: import("@playwright/test").Page, date: string) {
  await page.clock.setFixedTime(new Date(`${date}T10:00:00Z`));
  await page.goto("/");
  await expect(page.locator("#hero h1")).toBeVisible();
}

test("before the event: it's announced, with the menu link", async ({ page }, info) => {
  const first = upcomingEvents(events, kyivToday())[0];
  test.skip(!first, "no events in events.json");
  await openOn(page, first.date);
  const section = page.locator("#tasting-event");
  await expect(section).toBeVisible();
  await expect(section).toContainText(first.title);
  await expect(section).toContainText(formatEventDate(first));
  if (info.project.name === "desktop") {
    await expect(page.locator("#navbar").getByRole("link", { name: "Анонс події" })).toBeVisible();
  }
  const ld = JSON.parse((await page.locator('script[type="application/ld+json"]').first().textContent()) ?? "[]");
  expect(ld[0]).toMatchObject({ "@type": "Event", name: first.title });
});

test("after the last event: section and menu link disappear without a redeploy", async ({ page }) => {
  const last = upcomingEvents(events, "0000-01-01").at(-1);
  test.skip(!last, "no events in events.json");
  const dayAfter = new Date(Date.parse(last!.date) + 86_400_000).toISOString().slice(0, 10);
  await openOn(page, dayAfter);
  await expect(page.locator("#tasting-event")).toHaveCount(0);
  await expect(page.locator("#navbar").getByRole("link", { name: /Анонс події|Найближча/ })).toHaveCount(0);
});

test("several upcoming events: slider, closest first", async ({ page }) => {
  const all = upcomingEvents(events, kyivToday());
  test.skip(all.length < 2, "needs 2+ events in events.json");
  await openOn(page, all[0].date);
  const slider = page.getByRole("region", { name: "Анонси подій" });
  await expect(slider.locator('[aria-roledescription="slide"]:not([aria-hidden])')).toContainText(all[0].title);
  await expect(slider.getByRole("button", { name: "Попередня подія" })).toBeDisabled();
  await slider.getByRole("button", { name: "Наступна подія" }).click();
  await expect(slider.locator('[aria-roledescription="slide"]:not([aria-hidden])')).toContainText(all[1].title);
  await expect(slider).toContainText(`2 / ${all.length}`);
});

test("an event without a ticket link opens the booking popup", async ({ page }) => {
  const all = upcomingEvents(events, kyivToday());
  const i = all.findIndex((e) => !e.ticketUrl && !e.ticketsSoon);
  test.skip(i < 0, "every event has a ticket link");
  await openOn(page, all[0].date);
  const section = page.locator("#tasting-event");
  for (let n = 0; n < i; n++) await section.getByRole("button", { name: "Наступна подія" }).click();
  // Hidden slides are aria-hidden, so this only finds the button on the visible one.
  await section.getByRole("button", { name: all[i].ticketLabel ?? "Записатися" }).click();
  await expect(page.getByRole("dialog", { name: "Швидке замовлення" })).toContainText(`Подія: ${all[i].title}, ${formatEventDate(all[i])}`);
});
