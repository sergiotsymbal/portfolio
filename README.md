# Don Sergio — Фромаж'є & Кортадор

Landing site built with Next.js (static export) + Tailwind CSS, ported from the original single-file `index.html`
(kept in the repo as the visual reference).

## Requirements

- Node.js 24 (see `.nvmrc`; the deploy uses the same version)
- Google Chrome installed (used by the end-to-end tests — no extra browser download)

## Run locally

```bash
npm install
npm run dev          # http://localhost:3000
```

## Test

```bash
npm run check        # typecheck + lint + production build + e2e tests (everything below)

npm run typecheck
npm run lint
npm run test:e2e     # Playwright, desktop (1440px) + mobile (Pixel 7)
npm run test:sheets  # Google Apps Script (forms → Google Sheets)
npx playwright show-report   # HTML report of the last run
```

The e2e tests run offline: external images are blocked and the form endpoint is mocked, so they check the
exact payload each form sends, and the error state when sending fails.

### Manual test checklist

- [ ] Every "Замовити…" button opens the quick-order popup with the right service name
- [ ] Popup closes with ✕, Escape and a click outside; page scroll is locked while it's open
- [ ] Quick order, contact form and book pre-order show the thank-you message after sending
- [ ] Clicking an article opens its own page; previous/next and «Читайте також» links work; «Усі статті» goes back
- [ ] «Завантажити ще статті» shows 9 articles; the new ones slide down
- [ ] Gallery scrolls by itself, pauses on hover; arrows, dots and swipe work; it loops endlessly
- [ ] Mobile: ☰ opens the menu, a link closes it and scrolls to the section
- [ ] Sections fade/slide in while scrolling
- [ ] Instagram links and "Придбати квиток" open in a new tab

## Configuration

Copy `.env.example` to `.env.local` and fill in:

| Variable | Purpose |
| --- | --- |
| `NEXT_PUBLIC_FORM_ENDPOINT` | Where all three forms are sent — the Google Apps Script web-app URL (see "Forms → Google Sheets"); any JSON endpoint like Formspree also works. **Empty = demo mode**: nothing is sent, the thank-you message is shown. |
| `NEXT_PUBLIC_FORM_ACCESS_KEY` | Only for services that need a public key in the body (e.g. Web3Forms). |
| `NEXT_PUBLIC_SITE_URL` | Production URL, e.g. `https://donsergio.com.ua`. **Set it before the production build** — used for canonical links, `sitemap.xml`, `robots.txt` and social-share previews. |

Every submission includes a `form` field (`booking`, `contact` or `book-preorder`) so you can tell them apart.

## Editing content

| What | Where |
| --- | --- |
| Blog articles | `data/articles.json` — see below |
| Services (cards + contact form options) | `data/services.ts` |
| Phone / Telegram / e-mail | `data/contacts.json` — see below |
| Gallery (auto-scrolling carousel from 3 photos up) | `data/gallery.ts` |
| Event announcement | `components/sections/TastingEvent.tsx` |
| Any section's layout/text | `components/sections/*.tsx` |
| Local images | put the original in `assets/images/`, add a job in `scripts/optimize-images.mjs`, run `npm run images` → web-ready WebP/JPEG in `public/images/` |

## Contact details

Phone, Telegram and e-mail live only in **`data/contacts.json`**; the contacts section and the form error message
read them from there.

```json
{
  "phone": "+380 67 123 45 67",
  "telegram": "don_sergio",
  "email": "hello@donsergio.org"
}
```

- `phone` — written the way it should be shown; the call link is built from its digits.
- `telegram` — the username (`don_sergio`, `@don_sergio` or `https://t.me/don_sergio` all work).
- `email` — the address.

A typo (no digits in the phone, invalid username or e-mail) stops `npm run build` with a message naming the field.

## Blog articles

All articles live in **`data/articles.json`** — adding one never requires code changes. Each article gets its own
page at `/blog/<slug>/` with its own SEO tags, is listed on the home page (newest first, by `date`) and in
`sitemap.xml`.

```json
{
  "slug": "yak-vybraty-khamon",
  "tag": "Кортадор",
  "date": "2026-11-20",
  "readTime": "5 хв читання",
  "title": "Як вибрати хамон на свято",
  "summary": "Короткий опис для картки та пошуковиків.",
  "image": "https://…/cover.jpg",
  "images": [
    "https://…/photo-2.jpg",
    { "src": "https://…/photo-3.jpg", "alt": "Опис фото", "caption": "Підпис під фото" }
  ],
  "seo": {
    "title": "Як вибрати хамон — поради кортадора",
    "description": "Опис для Google, до ~160 символів.",
    "keywords": ["хамон", "кортадор"],
    "ogImage": "https://…/share.jpg"
  },
  "content": [
    { "type": "paragraph", "text": "Текст з **жирним**, *курсивом* і [посиланням](https://example.com)." },
    { "type": "heading", "text": "Заголовок розділу" },
    { "type": "subheading", "text": "Підзаголовок" },
    { "type": "list", "items": ["Пункт 1", "Пункт 2"] },
    { "type": "list", "ordered": true, "items": ["Крок 1", "Крок 2"] },
    { "type": "quote", "text": "Цитата", "author": "Автор" },
    { "type": "callout", "text": "Порада у рамці" },
    { "type": "image", "src": "https://…/photo.jpg", "caption": "Підпис" },
    { "type": "cta", "service": "Нарізка хамона", "label": "Замовити кортадора", "text": "Хочете так само?" },
    { "type": "divider" }
  ]
}
```

- **Required:** `slug` (a-z, 0-9, dashes — it becomes the URL), `tag`, `date` (YYYY-MM-DD), `readTime`, `title`,
  `summary`, `image`, `content`. Optional: `updated` (YYYY-MM-DD), `seo` (each field falls back to title/summary/image),
  `images`.
- `image` is the cover (card on the home page, social share, first photo on the article page). Extra photos go in
  `images` — as plain URLs or `{ "src", "alt", "caption" }`. With 2+ photos in total, the top of the article page
  becomes an auto-scrolling carousel; with just the cover it's a single image.
- The JSON is validated on build: a typo, unknown block type or duplicate slug stops `npm run build` with a message
  naming the article and field.
- Changing a `slug` changes the article's URL (old links will 404).
- The home page shows 3 articles; «Завантажити ще статті» shows 9 per page, with pagination when there are more than 9.

## Forms → Google Sheets

All three forms (quick-order popup, contact form, book pre-order) are saved to one Google Sheet, each to its own tab:

| Form | Tab | Columns |
| --- | --- | --- |
| «Замовити послугу» popup | **Замовлення** | Дата · Послуга · Ім'я · Телефон / Messenger · Статус |
| Contact form | **Контакти** | Дата · Послуга · Ім'я · Телефон · Дата та місто · Коментар · Статус |
| Book pre-order | **Книга** | Дата · Ім'я · Телефон / Telegram · Email · Статус |

Tabs and headers are created automatically on the first request. Newest requests are on top; «Статус» is a
dropdown (Новий / Передзвонив / Домовились / Відмова). The script lives in `google-apps-script/Code.gs`
(tabs, columns, statuses are configured at the top of that file).

### One-time setup (≈15 min, in the browser)

1. Create a Google Sheet, e.g. «Заявки donsergio.org».
2. **Extensions → Apps Script**. Replace everything in `Code.gs` with the contents of
   `google-apps-script/Code.gs` from this repo. Save (💾).
3. **Deploy → New deployment** → ⚙️ type **Web app** →
   *Execute as:* **Me** · *Who has access:* **Anyone** → **Deploy** → allow the permissions Google asks for
   (it may warn "Google hasn't verified this app": **Advanced → Go to … (unsafe)** — it's your own script).
4. Copy the **Web app URL** (`https://script.google.com/macros/s/…/exec`). Opening it in a browser should show
   `{"ok":true,"service":"donsergio.org forms"}`.
5. GitHub → Settings → Secrets and variables → Actions → **Variables** → `NEXT_PUBLIC_FORM_ENDPOINT` = that URL,
   then redeploy (push, or Actions → Deploy → Run workflow).

Optional alerts — in Apps Script: **Project Settings (⚙️) → Script properties**:

| Property | Effect |
| --- | --- |
| `NOTIFY_EMAIL` | e-mail per request (comma-separate several addresses) |
| `TELEGRAM_BOT_TOKEN` + `TELEGRAM_CHAT_ID` | Telegram message per request (bot from @BotFather; several chat ids comma-separated) |

**Changing the script later:** paste the new code, then **Deploy → Manage deployments → ✏️ → Version: New version →
Deploy**. This keeps the same URL — creating a *new deployment* would give a new URL.

Spam protection: hidden honeypot field, basic validation, max 20 requests per minute. Tests for the script
(run against fakes of the Google services): `npm run test:sheets`.

## Deployment (automatic)

Every push to **`main`** builds the site and deploys it to Firebase Hosting — no CLI needed.
Progress and logs: GitHub → **Actions** → **Deploy**. A deploy takes ~2–3 minutes.
To redeploy without a code change: Actions → Deploy → **Run workflow**.

- Live site: https://donsergio.org (also https://fromage-jamon.web.app)
- Firebase project: `fromage-jamon` · workflow: `.github/workflows/deploy.yml` · hosting config: `firebase.json`

GitHub → Settings → Secrets and variables → Actions:

| Name | Kind | Value |
| --- | --- | --- |
| `FIREBASE_SERVICE_ACCOUNT` | secret | JSON key of the `github-deploy` service account (roles: Firebase Hosting Admin, API Keys Viewer, Cloud Run Viewer) |
| `NEXT_PUBLIC_SITE_URL` | variable | `https://donsergio.org` |
| `NEXT_PUBLIC_FORM_ENDPOINT` | variable | Google Apps Script web-app URL (see "Forms → Google Sheets") — without it the forms run in demo mode |
| `NEXT_PUBLIC_FORM_ACCESS_KEY` | variable, optional | only for services that need it (e.g. Web3Forms) |

Changing a variable takes effect on the next deploy (values are baked in at build time).

Caching: pages are always re-validated (new deploys show up immediately); hashed build files are cached for a year,
`/images/*` for 30 days — **when replacing an image, give the new file a new name**.

Local preview of the production build:

```bash
npm run build        # static site in out/
npm start            # serves out/ locally
```

## Project layout

```
app/                 layout (fonts, metadata), page, global styles, favicon
components/sections/ one component per page section
components/booking/  quick-order popup + context so any button can open it
app/blog/[slug]/     article pages (SEO metadata, JSON-LD, prev/next, related)
components/blog/     blog grid, cards, article content renderer
data/                editable content
assets/images/       original (unoptimized) images — not deployed
public/images/       generated, web-ready images (npm run images)
scripts/             image optimization
lib/                 form submission
google-apps-script/  Google Sheets script for the forms (pasted into Apps Script, not deployed by CI)
e2e/                 Playwright tests
```
