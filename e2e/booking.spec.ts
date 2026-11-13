import { expect, gotoHome, test } from "./fixtures";

test.describe("booking modal", () => {
  test("opens with the chosen service, closes with Escape and backdrop", async ({ page }) => {
    await gotoHome(page);
    const dialog = page.getByRole("dialog", { name: "Швидке замовлення" });

    await page.locator("#hero").getByRole("button", { name: "Нарізка хамона" }).click();
    await expect(dialog).toBeVisible();
    await expect(dialog).toContainText("Нарізка хамона");
    await expect(page.locator("body")).toHaveClass(/overflow-hidden/);

    await page.keyboard.press("Escape");
    await expect(dialog).toBeHidden();
    await expect(page.locator("body")).not.toHaveClass(/overflow-hidden/);

    await page.locator("#spec-cortador").getByRole("button").click();
    await expect(dialog).toContainText("Послуги кортадора (Нарізка хамону)");
    await dialog.click({ position: { x: 5, y: 5 } }); // backdrop
    await expect(dialog).toBeHidden();
  });

  test("submits name, contact and service, then auto-closes", async ({ page, formMock }) => {
    await gotoHome(page);
    await page.locator("#spec-complex").getByRole("button").click();
    const dialog = page.getByRole("dialog", { name: "Швидке замовлення" });

    await dialog.getByLabel("Ваше ім'я *").fill("Олена");
    await dialog.getByLabel("Телефон / Messenger *").fill("+380501112233");
    await dialog.getByRole("button", { name: "Підтвердити заявку" }).click();

    await expect(dialog.getByRole("status")).toContainText("Дякуємо");
    expect(formMock.requests).toEqual([
      { form: "booking", service: "Комплексне шоу (Фромаж'є + Кортадор)", name: "Олена", contact: "+380501112233" },
    ]);
    await expect(dialog).toBeHidden({ timeout: 4000 });

    // Re-opening shows a fresh form, not the success message.
    await page.locator("#spec-complex").getByRole("button").click();
    await expect(dialog.getByLabel("Ваше ім'я *")).toHaveValue("");
  });

  test("requires both fields", async ({ page, formMock }) => {
    await gotoHome(page);
    await page.locator("#spec-fromagier").getByRole("button").click();
    const dialog = page.getByRole("dialog", { name: "Швидке замовлення" });
    await dialog.getByRole("button", { name: "Підтвердити заявку" }).click();
    await expect(dialog.getByLabel("Ваше ім'я *")).toBeFocused();
    expect(formMock.requests).toHaveLength(0);
  });

  test("shows an error and keeps the form when sending fails", async ({ page, formMock }) => {
    formMock.failWith(500);
    await gotoHome(page);
    await page.locator("#spec-fromagier").getByRole("button").click();
    const dialog = page.getByRole("dialog", { name: "Швидке замовлення" });
    await dialog.getByLabel("Ваше ім'я *").fill("Олена");
    await dialog.getByLabel("Телефон / Messenger *").fill("+380501112233");
    await dialog.getByRole("button", { name: "Підтвердити заявку" }).click();

    await expect(dialog.getByRole("alert")).toContainText("Не вдалося надіслати");
    await expect(dialog.getByLabel("Ваше ім'я *")).toHaveValue("Олена");
  });
});
