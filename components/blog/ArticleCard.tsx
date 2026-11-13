import Link from "next/link";
import type { Article } from "@/data/articles";
import { formatDate } from "@/lib/formatDate";

/** What a card needs — keeps article bodies out of the client bundle. */
export type ArticleCardData = Pick<Article, "slug" | "tag" | "date" | "readTime" | "title" | "summary" | "image">;

export function toCardData({ slug, tag, date, readTime, title, summary, image }: Article): ArticleCardData {
  return { slug, tag, date, readTime, title, summary, image };
}

type Props = { article: ArticleCardData; className?: string; style?: React.CSSProperties };

export default function ArticleCard({ article, className = "", style }: Props) {
  return (
    <Link
      href={`/blog/${article.slug}/`}
      style={style}
      className={`bg-gaudi-card border-2 border-gold/30 gaudi-organic-radius-1 overflow-hidden flex flex-col justify-between hover:border-gold transition duration-500 shadow-2xl gaudi-glow-hover relative cursor-pointer group ${className}`}
    >
      <article className="contents">
        <div>
          <div className="h-48 overflow-hidden relative">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={article.image}
              alt={article.title}
              loading="lazy"
              className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
            />
            <span className="absolute top-3 right-3 bg-gaudi-dark/90 text-gold border border-gold/40 text-[10px] uppercase font-bold px-3 py-1 gaudi-organic-radius-1 z-10">
              {article.tag}
            </span>
          </div>
          <div className="p-6 space-y-3">
            <div className="flex items-center gap-3 text-[11px] text-gold/70">
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
            <h3 className="text-xl font-serif font-bold text-neutral-100 group-hover:text-gold transition">{article.title}</h3>
            <p className="text-neutral-300 text-xs font-light leading-relaxed">{article.summary}</p>
          </div>
        </div>
        <div className="p-6 pt-0">
          <span className="text-xs font-bold text-gold uppercase tracking-wider group-hover:brightness-125 inline-flex items-center gap-2">
            <span>Читати повністю</span>
            <i className="fa-solid fa-arrow-right text-[10px] group-hover:translate-x-1 transition duration-300"></i>
          </span>
        </div>
      </article>
    </Link>
  );
}
