import { expect, gotoHome, test } from "./fixtures";

test("contact form sends all fields", async ({ page, formMock }) => {
  await gotoHome(page);
  const form = page.locator("#contacts");
  await form.getByLabel("Ім'я *").fill("Андрій");
  await form.getByLabel("Телефон *").fill("+380671234567");
  await form.getByLabel("Обрати послугу *").selectOption("Послуги Кортадора");
  await form.getByLabel("Дата та місто події").fill("20 Грудня, Львів");
  await form.getByLabel("Коментар / Кількість гостей").fill("40 гостей");
  await form.getByRole("button", { name: "Надіслати запит" }).click();

  await expect(form.getByRole("status")).toContainText("Дякуємо");
  // Apps Script can't handle CORS preflight → must be a "simple" text/plain request.
  expect(formMock.contentTypes[0]).toMatch(/^text\/plain/);
  expect(formMock.requests).toEqual([
    {
      form: "contact",
      name: "Андрій",
      phone: "+380671234567",
      service: "Послуги Кортадора",
      dateCity: "20 Грудня, Львів",
      comment: "40 гостей",
    },
  ]);
});

test("contact form shows an error when sending fails", async ({ page, formMock }) => {
  formMock.failWith(503);
  await gotoHome(page);
  const form = page.locator("#contacts");
  await form.getByLabel("Ім'я *").fill("Андрій");
  await form.getByLabel("Телефон *").fill("+380671234567");
  await form.getByRole("button", { name: "Надіслати запит" }).click();
  await expect(form.getByRole("alert")).toBeVisible();
  await expect(form.getByRole("button", { name: "Надіслати запит" })).toBeEnabled();
});

test("book pre-order form sends name, phone and optional email", async ({ page, formMock }) => {
  await gotoHome(page);
  const section = page.locator("#book");
  await section.getByLabel("Ім'я *").fill("Ірина");
  await section.getByLabel("Телефон / Telegram *").fill("@irina");
  await section.getByLabel("Email (необов'язково)").fill("irina@example.com");
  await section.getByRole("button", { name: "Залишити заявку на книгу" }).click();

  await expect(section.getByRole("status")).toContainText("Вашу заявку прийнято");
  expect(formMock.requests).toEqual([
    { form: "book-preorder", name: "Ірина", phone: "@irina", email: "irina@example.com" },
  ]);
});

test("an { ok: false } reply from the script shows the error", async ({ page, formMock }) => {
  formMock.rejectWith("phone is required");
  await gotoHome(page);
  const section = page.locator("#book");
  await section.getByLabel("Ім'я *").fill("Ірина");
  await section.getByLabel("Телефон / Telegram *").fill("@irina");
  await section.getByRole("button", { name: "Залишити заявку на книгу" }).click();
  await expect(section.getByRole("alert")).toContainText("Не вдалося надіслати");
  await expect(section.getByLabel("Ім'я *")).toHaveValue("Ірина");
});

test("the hidden spam-trap field is not sent by real users", async ({ page, formMock }) => {
  await gotoHome(page);
  const form = page.locator("#contacts");
  await expect(form.locator('input[name="website"]')).not.toBeInViewport();
  await form.getByLabel("Ім'я *").fill("Андрій");
  await form.getByLabel("Телефон *").fill("+380671234567");
  await form.getByRole("button", { name: "Надіслати запит" }).click();
  await expect(form.getByRole("status")).toBeVisible();
  expect(formMock.requests[0]).not.toHaveProperty("website");
});
