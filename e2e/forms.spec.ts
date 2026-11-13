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
