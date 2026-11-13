import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import ArticleCard, { toCardData } from "@/components/blog/ArticleCard";
import ArticleContent from "@/components/blog/ArticleContent";
import BookButton from "@/components/booking/BookButton";
import FallbackImg from "@/components/FallbackImg";
import Carousel from "@/components/Carousel";
import { articles, formatDate, getArticle, getArticlePhotos } from "@/data/articles";
import { SITE_NAME, SITE_URL } from "@/lib/site";

type Params = { params: Promise<{ slug: string }> };

// Only the slugs in articles.json exist; anything else is a 404.
export const dynamicParams = false;

export function generateStaticParams() {
  return articles.map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const article = getArticle((await params).slug);
  if (!article) return {};
  const title = article.seo?.title ?? article.title;
  const description = article.seo?.description ?? article.summary;
  const image = article.seo?.ogImage ?? article.image;
  const url = `/blog/${article.slug}/`;
  return {
    title,
    description,
    keywords: article.seo?.keywords,
    alternates: { canonical: url },
    openGraph: {
      type: "article",
      url,
      title,
      description,
      siteName: SITE_NAME,
      locale: "uk_UA",
      publishedTime: article.date,
      modifiedTime: article.updated ?? article.date,
      section: article.tag,
      images: [{ url: image, alt: article.title }],
    },
    twitter: { card: "summary_large_image", title, description, images: [image] },
  };
}

export default async function ArticlePage({ params }: Params) {
  const article = getArticle((await params).slug);
  if (!article) notFound();

  const photos = getArticlePhotos(article);
  const index = articles.indexOf(article);
  const newer = articles[index - 1];
  const older = articles[index + 1];
  const related = [
    ...articles.filter((a) => a !== article && a.tag === article.tag),
    ...articles.filter((a) => a !== article && a.tag !== article.tag),
  ].slice(0, 3);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: article.title,
    description: article.seo?.description ?? article.summary,
    image: [...new Set([article.seo?.ogImage ?? article.image, ...photos.map((p) => p.image)])],
    datePublished: article.date,
    dateModified: article.updated ?? article.date,
    inLanguage: "uk",
    articleSection: article.tag,
    keywords: article.seo?.keywords?.join(", "),
    author: { "@type": "Person", name: "Don Sergio" },
    publisher: { "@type": "Person", name: "Don Sergio" },
    mainEntityOfPage: `${SITE_URL}/blog/${article.slug}/`,
  };

  return (
    <main className="overflow-x-clip pt-36 pb-24">
      <script
        type="application/ld+json"
        // JSON.stringify output with "<" escaped cannot break out of the script tag.
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }}
      />

      <article className="max-w-3xl mx-auto px-4 sm:px-6">
        <nav aria-label="Навігація" className="mb-8 text-xs uppercase tracking-widest font-semibold">
          <Link href="/#blog" className="text-gold hover:brightness-125 inline-flex items-center gap-2">
            <i className="fa-solid fa-arrow-left text-[10px]"></i> Усі статті
          </Link>
        </nav>

        <header className="space-y-5">
          <div className="flex flex-wrap items-center gap-3 text-xs text-gold/70">
            <span className="bg-gaudi-dark/90 text-gold border border-gold/40 font-bold px-3 py-1 gaudi-organic-radius-1 uppercase tracking-wider">
              {article.tag}
            </span>
            <time dateTime={article.date}>
              <i className="fa-regular fa-calendar mr-1"></i>
              {formatDate(article.date)}
            </time>
            <span>•</span>
            <span>
              <i className="fa-regular fa-clock mr-1"></i>
              {article.readTime}
            </span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-serif font-bold leading-tight gaudi-gold-gradient">{article.title}</h1>
          <p className="text-neutral-300 font-light leading-relaxed text-base sm:text-lg">{article.summary}</p>
        </header>

        <div className="my-10">
          {photos.length > 1 ? (
            <Carousel items={photos} variant="hero" label="Фото до статті" />
          ) : (
            <figure className="space-y-2">
              <div className="h-64 sm:h-96 overflow-hidden gaudi-organic-radius-1 border-2 border-gold/40 shadow-2xl gaudi-glow">
                <FallbackImg src={photos[0].image} alt={photos[0].alt} className="w-full h-full object-cover" />
              </div>
              {photos[0].caption && <figcaption className="text-xs text-neutral-400 text-center">{photos[0].caption}</figcaption>}
            </figure>
          )}
        </div>

        <div className="border-t border-gold/20 pt-8">
          <ArticleContent blocks={article.content} />
        </div>

        {/* Call to action */}
        <aside className="mt-14 bg-gaudi-card border-2 border-gold/50 gaudi-organic-radius-1 p-8 sm:p-10 shadow-2xl gaudi-glow text-center space-y-4">
          <span className="text-gold text-xs uppercase tracking-widest font-bold font-cinzel">Виїзні гастро-події</span>
          <h2 className="text-2xl sm:text-3xl font-serif font-bold text-neutral-100">Хочете такий досвід на вашій події?</h2>
          <p className="text-neutral-300 text-sm font-light">
            Дегустації сиру й вина, шоу-нарізка хамону та комплексні гастро-шоу по всій Україні.
          </p>
          <BookButton
            service={`Стаття: ${article.title}`}
            className="px-8 py-4 gaudi-organic-radius-1 gaudi-gold-bg text-gaudi-dark font-bold uppercase text-xs tracking-widest hover:brightness-110 transition shadow-xl shadow-gold/20"
          >
            Замовити послугу
          </BookButton>
        </aside>

        {/* Previous / next */}
        {(newer || older) && (
          <nav aria-label="Інші статті" className="mt-12 grid grid-cols-1 sm:grid-cols-2 gap-4">
            {newer ? (
              <Link
                href={`/blog/${newer.slug}/`}
                rel="prev"
                className="group bg-gaudi-card border border-gold/30 hover:border-gold gaudi-organic-radius-1 p-5 transition"
              >
                <span className="text-[10px] uppercase tracking-widest text-gold/70">
                  <i className="fa-solid fa-chevron-left mr-1"></i> Попередня стаття
                </span>
                <span className="block mt-2 font-serif text-lg text-neutral-100 group-hover:text-gold transition">{newer.title}</span>
              </Link>
            ) : (
              <span />
            )}
            {older && (
              <Link
                href={`/blog/${older.slug}/`}
                rel="next"
                className="group bg-gaudi-card border border-gold/30 hover:border-gold gaudi-organic-radius-2 p-5 transition sm:text-right"
              >
                <span className="text-[10px] uppercase tracking-widest text-gold/70">
                  Наступна стаття <i className="fa-solid fa-chevron-right ml-1"></i>
                </span>
                <span className="block mt-2 font-serif text-lg text-neutral-100 group-hover:text-gold transition">{older.title}</span>
              </Link>
            )}
          </nav>
        )}
      </article>

      {related.length > 0 && (
        <section aria-labelledby="related-title" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-24">
          <h2 id="related-title" className="text-2xl sm:text-3xl font-serif font-bold text-neutral-100 text-center mb-10">
            Читайте також
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {related.map((a) => (
              <ArticleCard key={a.slug} article={toCardData(a)} />
            ))}
          </div>
        </section>
      )}
    </main>
  );
}
