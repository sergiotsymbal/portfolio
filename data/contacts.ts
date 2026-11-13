/**
 * Contact details are edited in data/contacts.json — the only place they live. This module validates the file
 * (a typo fails `npm run build` with a clear message) and builds the links:
 *
 *   "phone":    as it should be shown, e.g. "+380 67 123 45 67"   → tel:+380671234567
 *   "telegram": username, with or without @ (or a t.me link)       → https://t.me/username
 *   "email":    address                                            → mailto:address
 */
import raw from "./contacts.json";

export type ContactLink = { text: string; href: string };

function fail(field: string, msg: string): never {
  throw new Error(`contacts.json → "${field}": ${msg}`);
}

function phone(value: unknown): ContactLink {
  if (typeof value !== "string" || !value.trim()) fail("phone", "is required, e.g. \"+380 67 123 45 67\"");
  const digits = value.replace(/[^\d+]/g, "");
  if (!/^\+?\d{9,15}$/.test(digits)) fail("phone", `"${value}" doesn't look like a phone number`);
  return { text: value.trim(), href: `tel:${digits}` };
}

function telegram(value: unknown): ContactLink {
  if (typeof value !== "string" || !value.trim()) fail("telegram", 'is required — the username, e.g. "don_sergio"');
  const username = value.trim().replace(/^(https?:\/\/)?(t\.me|telegram\.me)\//i, "").replace(/^@/, "").replace(/\/$/, "");
  if (!/^[A-Za-z][A-Za-z0-9_]{3,31}$/.test(username)) {
    fail("telegram", `"${value}" isn't a valid Telegram username (5–32 letters, digits or _, starting with a letter)`);
  }
  return { text: `@${username}`, href: `https://t.me/${username}` };
}

function email(value: unknown): ContactLink {
  if (typeof value !== "string" || !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(value.trim())) {
    fail("email", `"${String(value)}" isn't a valid e-mail address`);
  }
  return { text: value.trim(), href: `mailto:${value.trim()}` };
}

export const contacts = {
  phone: phone(raw.phone),
  telegram: telegram(raw.telegram),
  email: email(raw.email),
};
