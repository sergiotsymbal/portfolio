# Don Sergio — Фромаж'є & Кортадор

Landing site built with Next.js (static export) + Tailwind CSS, ported from the original single-file `index.html`
(kept in the repo as the visual reference).

## Requirements

- Node.js 20+ (developed on Node 24)
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
| `NEXT_PUBLIC_FORM_ENDPOINT` | Where all three forms POST JSON (e.g. Formspree `https://formspree.io/f/…`). **Empty = demo mode**: nothing is sent, the thank-you message is shown. |
| `NEXT_PUBLIC_FORM_ACCESS_KEY` | Only for services that need a public key in the body (e.g. Web3Forms). |
| `NEXT_PUBLIC_SITE_URL` | Production URL, e.g. `https://donsergio.com.ua`. **Set it before the production build** — used for canonical links, `sitemap.xml`, `robots.txt` and social-share previews. |

Every submission includes a `form` field (`booking`, `contact` or `book-preorder`) so you can tell them apart.

## Editing content

| What | Where |
| --- | --- |
| Blog articles | `data/articles.json` — see below |
| Services (cards + contact form options) | `data/services.ts` |
| Phone / Telegram / e-mail | `data/site.ts` |
| Gallery (auto-scrolling carousel from 3 photos up) | `data/gallery.ts` |
| Event announcement | `components/sections/TastingEvent.tsx` |
| Any section's layout/text | `components/sections/*.tsx` |
| Local images | put the original in `assets/images/`, add a job in `scripts/optimize-images.mjs`, run `npm run images` → web-ready WebP/JPEG in `public/images/` |

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

## Deploy

```bash
npm run build        # static site in out/
npm start            # preview out/ locally
```

Upload `out/` to any static host (Netlify, Vercel, Cloudflare Pages, GitHub Pages, plain nginx).
`NEXT_PUBLIC_*` variables are baked in at build time — set them before `npm run build`.

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
e2e/                 Playwright tests
```
