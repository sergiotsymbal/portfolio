/**
 * Form validation: small composable rules + one schema per form.
 * Pure functions (no React) — shared by the forms and the tests.
 */
import type { FormName } from "./submitForm";

/** Returns an error message, or null when the value is fine. Values are already trimmed. */
export type Rule = ((value: string) => string | null) & { max?: number };
export type Schema = Record<string, Rule[]>;
export type Errors = Record<string, string>;

// A pragmatic e-mail check: something@domain.tld, no spaces, one @, a dot in the domain, 2+ letter TLD.
const EMAIL = /^[^\s@]+@[^\s@.]+(\.[^\s@.]+)*\.[a-zа-яіїєґ]{2,}$/i;

export const rules = {
  required:
    (message: string): Rule =>
    (v) =>
      v ? null : message,
  minLength:
    (n: number, message: string): Rule =>
    (v) =>
      !v || v.length >= n ? null : message,
  maxLength: (n: number): Rule =>
    Object.assign((v: string) => (v.length <= n ? null : `Занадто довго — максимум ${n} символів`), { max: n }),
  email:
    (message = "Перевірте email — схоже, в адресі помилка"): Rule =>
    (v) =>
      !v || EMAIL.test(v) ? null : message,
};

const name = [
  rules.required("Вкажіть ваше ім'я"),
  rules.minLength(2, "Ім'я занадто коротке"),
  rules.maxLength(100),
];

export const schemas: Record<FormName, Schema> = {
  booking: {
    name,
    contact: [rules.required("Вкажіть телефон або месенджер, щоб я міг з вами зв'язатися"), rules.maxLength(100)],
  },
  contact: {
    name,
    phone: [rules.required("Вкажіть номер телефону"), rules.maxLength(100)],
    service: [rules.required("Оберіть послугу")],
    dateCity: [rules.maxLength(200)],
    comment: [rules.maxLength(1000)],
  },
  "book-preorder": {
    name,
    phone: [rules.required("Вкажіть телефон або Telegram"), rules.maxLength(100)],
    email: [rules.email(), rules.maxLength(254)],
  },
};

/** Max length per field, for the inputs' maxLength attribute. */
export function maxLengthOf(form: FormName, field: string): number | undefined {
  return schemas[form][field]?.find((r) => r.max !== undefined)?.max;
}

export function validateField(schema: Schema, field: string, value: string): string | null {
  for (const rule of schema[field] ?? []) {
    const error = rule(value.trim());
    if (error) return error;
  }
  return null;
}

export function validateAll(schema: Schema, values: Record<string, string>): Errors {
  const errors: Errors = {};
  for (const field of Object.keys(schema)) {
    const error = validateField(schema, field, values[field] ?? "");
    if (error) errors[field] = error;
  }
  return errors;
}
