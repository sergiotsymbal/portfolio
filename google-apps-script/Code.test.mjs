// Runs Code.gs against in-memory fakes of the Google Apps Script services.
// Run: npm run test:sheets
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";
import vm from "node:vm";

const code = readFileSync(new URL("./Code.gs", import.meta.url), "utf8");

function makeEnv(props = {}) {
  const sheets = new Map();
  const mails = [];
  const fetches = [];
  const cache = new Map();

  const makeSheet = (name) => {
    const rows = [];
    const sheet = {
      name,
      rows,
      frozen: 0,
      validations: {},
      formats: {},
      getRange(r, c, ...size) {
        const nc = size[1] ?? 1;
        const range = {
          setValues(v) {
            v.forEach((row, i) => {
              rows[r - 1 + i] ??= [];
              row.forEach((val, j) => (rows[r - 1 + i][c - 1 + j] = val));
            });
            return range;
          },
          setNumberFormat(f) {
            for (let j = 0; j < nc; j++) sheet.formats[`${r},${c + j}`] = f;
            return range;
          },
          setDataValidation(rule) {
            sheet.validations[`${r},${c}`] = rule;
            return range;
          },
          setFontWeight: () => range,
          setBackground: () => range,
          setFontColor: () => range,
        };
        return range;
      },
      insertRowAfter(i) {
        rows.splice(i, 0, []);
        // shift formats/validations is unnecessary for these tests
      },
      getLastRow: () => rows.length,
      setFrozenRows: (n) => (sheet.frozen = n),
      setColumnWidth: () => {},
    };
    return sheet;
  };

  const ctx = {
    console,
    SpreadsheetApp: {
      getActiveSpreadsheet: () => ({
        getSheetByName: (n) => sheets.get(n) ?? null,
        insertSheet: (n) => {
          const s = makeSheet(n);
          sheets.set(n, s);
          return s;
        },
        getUrl: () => "https://docs.google.com/spreadsheets/d/test",
      }),
      newDataValidation: () => ({ requireValueInList: (list) => ({ build: () => ({ list }) }) }),
    },
    ContentService: {
      MimeType: { JSON: "json" },
      createTextOutput: (text) => ({ text, setMimeType() { return this; } }),
    },
    LockService: { getScriptLock: () => ({ waitLock() {}, releaseLock() {} }) },
    CacheService: { getScriptCache: () => ({ get: (k) => cache.get(k) ?? null, put: (k, v) => cache.set(k, v) }) },
    PropertiesService: { getScriptProperties: () => ({ getProperty: (k) => props[k] ?? null }) },
    MailApp: { sendEmail: (m) => mails.push(m) },
    UrlFetchApp: { fetch: (url, opts) => fetches.push({ url, body: JSON.parse(opts.payload) }) },
    Utilities: { formatDate: () => "13.11.2026 17:30" },
  };
  vm.createContext(ctx);
  vm.runInContext(code, ctx);

  const post = (body) => JSON.parse(ctx.doPost({ postData: { contents: JSON.stringify(body) } }).text);
  return { ctx, sheets, mails, fetches, post };
}

test("each form goes to its own tab, created with headers", () => {
  const env = makeEnv();
  assert.deepEqual(env.post({ form: "booking", service: "Нарізка хамона", name: "Олена", contact: "+380501112233" }), { ok: true });
  assert.deepEqual(env.post({ form: "contact", name: "Андрій", phone: "+380671234567", service: "Консультація", dateCity: "20 Грудня, Львів", comment: "40 гостей" }), { ok: true });
  assert.deepEqual(env.post({ form: "book-preorder", name: "Ірина", phone: "@irina", email: "i@x.ua" }), { ok: true });

  assert.deepEqual([...env.sheets.keys()], ["Замовлення", "Контакти", "Книга"]);
  assert.deepEqual(env.sheets.get("Замовлення").rows, [
    ["Дата", "Послуга", "Ім'я", "Телефон / Messenger", "Статус"],
    ["13.11.2026 17:30", "Нарізка хамона", "Олена", "+380501112233", "Новий"],
  ]);
  assert.deepEqual(env.sheets.get("Контакти").rows[1], ["13.11.2026 17:30", "Консультація", "Андрій", "+380671234567", "20 Грудня, Львів", "40 гостей", "Новий"]);
  assert.deepEqual(env.sheets.get("Книга").rows[1], ["13.11.2026 17:30", "Ірина", "@irina", "i@x.ua", "Новий"]);
  assert.equal(env.sheets.get("Книга").frozen, 1);
});

test("newest row goes on top; cells are plain text; status has a dropdown", () => {
  const env = makeEnv();
  env.post({ form: "booking", service: "A", name: "First", contact: "1" });
  env.post({ form: "booking", service: "B", name: "Second", contact: "2" });
  const s = env.sheets.get("Замовлення");
  assert.equal(s.rows[1][2], "Second");
  assert.equal(s.rows[2][2], "First");
  assert.equal(s.formats["2,4"], "@");
  assert.deepEqual([...s.validations["2,5"].list], ["Новий", "Передзвонив", "Домовились", "Відмова"]);
});

test("honeypot submissions are silently dropped", () => {
  const env = makeEnv();
  assert.deepEqual(env.post({ form: "contact", name: "Bot", phone: "1", website: "http://spam" }), { ok: true });
  assert.equal(env.sheets.size, 0);
});

test("invalid submissions are rejected with ok:false", () => {
  const env = makeEnv();
  assert.equal(env.post({ form: "nope", name: "a", phone: "1" }).ok, false);
  assert.equal(env.post({ form: "contact", phone: "1" }).ok, false);
  assert.equal(env.post({ form: "contact", name: "a" }).ok, false);
  assert.equal(env.post({ form: "contact", name: "a".repeat(1001), phone: "1" }).ok, false);
  assert.equal(JSON.parse(env.ctx.doPost({ postData: { contents: "not json" } }).text).ok, false);
  assert.equal(env.sheets.size, 0);
});

test("unknown fields are ignored", () => {
  const env = makeEnv();
  env.post({ form: "book-preorder", name: "a", phone: "1", evil: "=HYPERLINK(...)" });
  assert.equal(env.sheets.get("Книга").rows[1].includes("=HYPERLINK(...)"), false);
});

test("flood protection kicks in after 20 per minute", () => {
  const env = makeEnv();
  for (let i = 0; i < 20; i++) assert.equal(env.post({ form: "booking", name: "a", contact: "1" }).ok, true);
  assert.deepEqual(env.post({ form: "booking", name: "a", contact: "1" }), { ok: false, error: "too many requests" });
});

test("optional e-mail and Telegram alerts", () => {
  const none = makeEnv();
  none.post({ form: "booking", service: "S", name: "N", contact: "1" });
  assert.equal(none.mails.length + none.fetches.length, 0);

  const env = makeEnv({ NOTIFY_EMAIL: "owner@x.ua", TELEGRAM_BOT_TOKEN: "T", TELEGRAM_CHAT_ID: "111, 222" });
  env.post({ form: "book-preorder", name: "Ірина", phone: "@irina" });
  assert.equal(env.mails.length, 1);
  assert.match(env.mails[0].subject, /Нова заявка на книгу/);
  assert.match(env.mails[0].body, /Ім'я: Ірина/);
  assert.deepEqual(env.fetches.map((f) => f.body.chat_id), ["111", "222"]);
  assert.match(env.fetches[0].url, /botT\/sendMessage$/);
});

test("doGet answers for a quick deployment check", () => {
  assert.deepEqual(JSON.parse(makeEnv().ctx.doGet().text), { ok: true, service: "donsergio.org forms" });
});
