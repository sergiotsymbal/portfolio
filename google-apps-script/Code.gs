/**
 * donsergio.org → Google Sheets
 *
 * Receives form submissions from the website and writes each one to a tab of this spreadsheet.
 * Setup: see README → "Forms → Google Sheets". After editing this code:
 *   Deploy → Manage deployments → ✏️ Edit → Version: New version → Deploy  (keeps the same URL).
 *
 * Optional alerts — Project Settings (⚙️) → Script properties:
 *   NOTIFY_EMAIL        e-mail address(es), comma-separated, to get an e-mail per request
 *   TELEGRAM_BOT_TOKEN  bot token from @BotFather   } to get a Telegram message per request
 *   TELEGRAM_CHAT_ID    chat id(s), comma-separated  }
 */

// ---------------------------------------------------------------------------------------------
// Settings
// ---------------------------------------------------------------------------------------------

/** Which tab each website form goes to, and its columns. `_date` / `_status` are filled by the script. */
var TABS = {
  booking: {
    sheet: "Замовлення",
    title: "🍷 Нове замовлення",
    columns: [
      ["Дата", "_date"],
      ["Послуга", "service"],
      ["Ім'я", "name"],
      ["Телефон / Messenger", "contact"],
      ["Статус", "_status"],
    ],
  },
  contact: {
    sheet: "Контакти", // set to "Замовлення" to keep all service requests in one tab
    title: "📩 Новий запит з контактів",
    columns: [
      ["Дата", "_date"],
      ["Послуга", "service"],
      ["Ім'я", "name"],
      ["Телефон", "phone"],
      ["Дата та місто", "dateCity"],
      ["Коментар", "comment"],
      ["Статус", "_status"],
    ],
  },
  "book-preorder": {
    sheet: "Книга",
    title: "📖 Нова заявка на книгу",
    columns: [
      ["Дата", "_date"],
      ["Ім'я", "name"],
      ["Телефон / Telegram", "phone"],
      ["Email", "email"],
      ["Статус", "_status"],
    ],
  },
};

var STATUSES = ["Новий", "Передзвонив", "Домовились", "Відмова"];
var NEWEST_ON_TOP = true;
var TIMEZONE = "Europe/Kyiv";
var MAX_FIELD_LENGTH = 1000;
var MAX_PER_MINUTE = 20; // flood protection across all visitors

// ---------------------------------------------------------------------------------------------
// Web app entry points
// ---------------------------------------------------------------------------------------------

/** Opening the web-app URL in a browser shows this — handy to check the deployment works. */
function doGet() {
  return json_({ ok: true, service: "donsergio.org forms" });
}

function doPost(e) {
  var body;
  try {
    body = JSON.parse((e && e.postData && e.postData.contents) || "");
  } catch (err) {
    return json_({ ok: false, error: "invalid json" });
  }

  var result = validate_(body);
  if (!result.ok) {
    // Pretend success to bots (honeypot) so they don't retry.
    return json_(result.spam ? { ok: true } : result);
  }
  if (tooManyRequests_()) return json_({ ok: false, error: "too many requests" });

  var lock = LockService.getScriptLock();
  lock.waitLock(10000);
  try {
    writeRow_(result.data);
  } finally {
    lock.releaseLock();
  }

  // Alerts must never make the submission fail — the row is already saved.
  try {
    notify_(result.data);
  } catch (err) {
    console.error("notification failed: " + err);
  }
  return json_({ ok: true });
}

// ---------------------------------------------------------------------------------------------
// Logic
// ---------------------------------------------------------------------------------------------

function validate_(body) {
  if (!body || typeof body !== "object" || Array.isArray(body)) return { ok: false, error: "invalid body" };
  var tab = TABS[body.form];
  if (!tab) return { ok: false, error: "unknown form" };
  if (typeof body.website === "string" && body.website.trim() !== "") return { ok: false, error: "spam", spam: true };

  var data = { form: body.form };
  for (var i = 0; i < tab.columns.length; i++) {
    var key = tab.columns[i][1];
    if (key.charAt(0) === "_") continue;
    var v = body[key];
    if (v === undefined || v === null || v === "") continue;
    if (typeof v !== "string") return { ok: false, error: "invalid " + key };
    if (v.length > MAX_FIELD_LENGTH) return { ok: false, error: key + " too long" };
    data[key] = v.trim();
  }
  if (!data.name) return { ok: false, error: "name is required" };
  if (!data.phone && !data.contact) return { ok: false, error: "phone is required" };
  return { ok: true, data: data };
}

function tooManyRequests_() {
  var cache = CacheService.getScriptCache();
  var key = "rate-" + Math.floor(Date.now() / 60000);
  var count = Number(cache.get(key) || 0) + 1;
  cache.put(key, String(count), 120);
  return count > MAX_PER_MINUTE;
}

function getOrCreateSheet_(tab) {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName(tab.sheet);
  if (sheet) return sheet;

  sheet = ss.insertSheet(tab.sheet);
  var headers = tab.columns.map(function (c) { return c[0]; });
  sheet
    .getRange(1, 1, 1, headers.length)
    .setValues([headers])
    .setFontWeight("bold")
    .setBackground("#1C1924")
    .setFontColor("#E5C158");
  sheet.setFrozenRows(1);
  for (var i = 0; i < headers.length; i++) {
    var key = tab.columns[i][1];
    sheet.setColumnWidth(i + 1, key === "comment" ? 320 : key === "_date" ? 130 : 180);
  }
  return sheet;
}

function writeRow_(data) {
  var tab = TABS[data.form];
  var sheet = getOrCreateSheet_(tab);
  var now = Utilities.formatDate(new Date(), TIMEZONE, "dd.MM.yyyy HH:mm");

  var row = tab.columns.map(function (c) {
    var key = c[1];
    if (key === "_date") return now;
    if (key === "_status") return STATUSES[0];
    return data[key] || "";
  });

  var rowIndex;
  if (NEWEST_ON_TOP) {
    sheet.insertRowAfter(1);
    rowIndex = 2;
  } else {
    rowIndex = sheet.getLastRow() + 1;
  }
  var range = sheet.getRange(rowIndex, 1, 1, row.length);
  // Plain text: keeps "+380…" intact and stops "=…" from being run as a formula.
  range.setNumberFormat("@").setValues([row]).setFontWeight("normal").setBackground(null).setFontColor(null);

  var statusCol = tab.columns.map(function (c) { return c[1]; }).indexOf("_status");
  if (statusCol >= 0) {
    var rule = SpreadsheetApp.newDataValidation().requireValueInList(STATUSES, true).build();
    sheet.getRange(rowIndex, statusCol + 1).setDataValidation(rule);
  }
}

function notify_(data) {
  var props = PropertiesService.getScriptProperties();
  var tab = TABS[data.form];
  var lines = [];
  tab.columns.forEach(function (c) {
    if (c[1].charAt(0) !== "_" && data[c[1]]) lines.push(c[0] + ": " + data[c[1]]);
  });
  var sheetUrl = SpreadsheetApp.getActiveSpreadsheet().getUrl();

  var email = props.getProperty("NOTIFY_EMAIL");
  if (email) {
    MailApp.sendEmail({
      to: email,
      subject: tab.title + " — donsergio.org",
      body: lines.join("\n") + "\n\nТаблиця: " + sheetUrl,
    });
  }

  var token = props.getProperty("TELEGRAM_BOT_TOKEN");
  var chatIds = (props.getProperty("TELEGRAM_CHAT_ID") || "").split(",");
  if (token) {
    var text = tab.title + "\n\n" + lines.join("\n") + "\n\nТаблиця: " + sheetUrl;
    chatIds.forEach(function (id) {
      id = id.trim();
      if (!id) return;
      UrlFetchApp.fetch("https://api.telegram.org/bot" + token + "/sendMessage", {
        method: "post",
        contentType: "application/json",
        payload: JSON.stringify({ chat_id: id, text: text, disable_web_page_preview: true }),
        muteHttpExceptions: true,
      });
    });
  }
}

function json_(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
}
