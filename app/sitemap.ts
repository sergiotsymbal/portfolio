import type { MetadataRoute } from "next";
import { articles } from "@/data/articles";
import { SITE_URL } from "@/lib/site";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const latest = articles.map((a) => a.updated ?? a.date).sort().at(-1);
  return [
    { url: `${SITE_URL}/`, lastModified: latest, changeFrequency: "weekly", priority: 1 },
    ...articles.map((a) => ({
      url: `${SITE_URL}/blog/${a.slug}/`,
      lastModified: a.updated ?? a.date,
      changeFrequency: "monthly" as const,
      priority: 0.7,
    })),
  ];
}
