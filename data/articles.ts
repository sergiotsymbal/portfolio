/**
 * Blog articles are loaded from data/articles.json — edit only that file to add or change articles
 * (see README → "Blog articles"). This module types and validates it: a mistake in the JSON
 * fails `npm run build` with a message saying which article and field are wrong.
 */
import raw from "./articles.json";

/** Inline text supports **bold**, *italic* and [links](https://...). */
export type ContentBlock =
  | { type: "paragraph"; text: string }
  | { type: "heading"; text: string }
  | { type: "subheading"; text: string }
  | { type: "list"; items: string[]; ordered?: boolean }
  | { type: "quote"; text: string; author?: string }
  | { type: "callout"; text: string }
  | { type: "image"; src: string; alt?: string; caption?: string }
  | { type: "cta"; service: string; label?: string; text?: string }
  | { type: "divider" };

/** A photo: just the URL, or with alt text / caption. */
export type ArticleImage = string | { src: string; alt?: string; caption?: string };

export type Article = {
  /** URL: /blog/<slug>/ — lowercase latin letters, digits and dashes. */
  slug: string;
  tag: string;
  /** YYYY-MM-DD — shown as "28 Вересня 2026" and used for SEO. */
  date: string;
  /** YYYY-MM-DD of the last meaningful update (optional, SEO). */
  updated?: string;
  readTime: string;
  title: string;
  /** Card text; also the default meta description. */
  summary: string;
  /** Cover photo: card, social share, and first photo on the article page. */
  image: string;
  /** Extra photos for the article page. With 2+ photos in total the header becomes a carousel. */
  images?: ArticleImage[];
  seo?: {
    title?: string;
    description?: string;
    keywords?: string[];
    /** Social-share image, if different from `image`. */
    ogImage?: string;
  };
  content: ContentBlock[];
};

const BLOCK_FIELDS: Record<ContentBlock["type"], string[]> = {
  paragraph: ["text"],
  heading: ["text"],
  subheading: ["text"],
  list: ["items"],
  quote: ["text"],
  callout: ["text"],
  image: ["src"],
  cta: ["service"],
  divider: [],
};

function validate(data: unknown): Article[] {
  const list = (data as { articles?: unknown })?.articles;
  if (!Array.isArray(list)) throw new Error('articles.json: expected { "articles": [ ... ] }');

  const seen = new Map<string, number>(); // slug → article number
  list.forEach((a: Record<string, unknown>, i) => {
    const where = `articles.json → article #${i + 1}${typeof a?.slug === "string" ? ` ("${a.slug}")` : ""}`;
    const fail = (msg: string) => {
      throw new Error(`${where}: ${msg}`);
    };

    for (const f of ["slug", "tag", "date", "readTime", "title", "summary", "image"]) {
      if (typeof a[f] !== "string" || !(a[f] as string).trim()) fail(`"${f}" is required (text)`);
    }
    const slug = a.slug as string;
    if (!/^[a-z0-9]+(-[a-z0-9]+)*$/.test(slug)) fail(`"slug" may contain only a-z, 0-9 and single dashes`);
    if (seen.has(slug)) {
      fail(
        `slug "${slug}" is already used by article #${seen.get(slug)} — every article needs its own slug ` +
          `(it becomes the URL /blog/<slug>/). If you copied an article as a template, change its "slug".`,
      );
    }
    seen.set(slug, i + 1);

    for (const f of ["date", "updated"] as const) {
      if (a[f] === undefined) continue;
      const v = a[f];
      if (typeof v !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(v) || Number.isNaN(Date.parse(v))) {
        fail(`"${f}" must be a date like 2026-09-28`);
      }
    }

    if (a.images !== undefined) {
      if (!Array.isArray(a.images)) fail(`"images" must be a list`);
      (a.images as unknown[]).forEach((img, j) => {
        const src = typeof img === "string" ? img : (img as { src?: unknown })?.src;
        if (typeof src !== "string" || !src.trim()) {
          fail(`images #${j + 1}: must be a URL or { "src": "...", "alt": "...", "caption": "..." }`);
        }
      });
    }

    if (!Array.isArray(a.content) || a.content.length === 0) fail(`"content" must be a non-empty list of blocks`);
    (a.content as Record<string, unknown>[]).forEach((b, j) => {
      const type = b?.type as ContentBlock["type"];
      if (!(type in BLOCK_FIELDS)) {
        fail(`content block #${j + 1}: unknown "type" "${String(type)}" (allowed: ${Object.keys(BLOCK_FIELDS).join(", ")})`);
      }
      for (const f of BLOCK_FIELDS[type]) {
        const v = b[f];
        const ok = f === "items" ? Array.isArray(v) && v.length > 0 && v.every((x) => typeof x === "string") : typeof v === "string" && v.trim();
        if (!ok) fail(`content block #${j + 1} (${type}): "${f}" is required`);
      }
    });
  });

  return list as Article[];
}

/** Newest first. */
export const articles: Article[] = validate(raw).sort((a, b) => b.date.localeCompare(a.date));

/** Cover + extra photos, normalized for the carousel. */
export function getArticlePhotos(article: Article) {
  const extra = (article.images ?? []).map((img) => (typeof img === "string" ? { src: img } : img));
  return [{ src: article.image, alt: article.title }, ...extra].map((p) => ({
    image: p.src,
    alt: ("alt" in p && p.alt) || article.title,
    caption: "caption" in p ? p.caption : undefined,
  }));
}

export function getArticle(slug: string) {
  return articles.find((a) => a.slug === slug);
}

export { formatDate } from "@/lib/formatDate";
