"use client";

import { useRef, useState } from "react";
import ArticleCard, { type ArticleCardData } from "./ArticleCard";

const COLLAPSED_COUNT = 3;
const PER_PAGE = 9;
const STAGGER_MS = 70;

export default function Blog({ cards }: { cards: ArticleCardData[] }) {
  const [expanded, setExpanded] = useState(false);
  const [page, setPage] = useState(1);
  // After a page change every card animates in; after expanding only the newly added ones do.
  const [animateAll, setAnimateAll] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  const totalPages = Math.ceil(cards.length / PER_PAGE);
  const visible = expanded ? cards.slice((page - 1) * PER_PAGE, page * PER_PAGE) : cards.slice(0, COLLAPSED_COUNT);

  const scrollToTopOfSection = () => {
    const el = sectionRef.current;
    if (el && el.getBoundingClientRect().top < 0) el.scrollIntoView({ behavior: "smooth" });
  };

  const toggleExpand = () => {
    if (expanded) scrollToTopOfSection();
    setExpanded(!expanded);
    setPage(1);
    setAnimateAll(false);
  };

  const goToPage = (p: number) => {
    setPage(p);
    setAnimateAll(true);
    sectionRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section ref={sectionRef} id="blog" className="py-28 relative border-b border-gold/20 scroll-mt-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-3 reveal-element">
          <span className="text-gold text-xs uppercase tracking-widest font-bold font-cinzel">Гастрономічні статті</span>
          <h2 className="text-3xl sm:text-4xl font-serif font-bold text-neutral-100">Блог Гастроексперта</h2>
          <p className="text-neutral-400 text-sm font-light">
            Цікаві замітки про секрети хамону, мистецтво пейрингу та вибір артизанальних сирів.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {visible.map((article, i) => {
            const animate = expanded && (animateAll || i >= COLLAPSED_COUNT);
            const delay = (animateAll ? i : i - COLLAPSED_COUNT) * STAGGER_MS;
            return (
              <ArticleCard
                // Same key for the first 3 cards when expanding, so only the new ones mount (and animate).
                key={`${page}-${article.slug}`}
                article={article}
                className={animate ? "animate-slide-down" : ""}
                style={animate ? { animationDelay: `${delay}ms` } : undefined}
              />
            );
          })}
        </div>

        <div className="mt-12 flex flex-col items-center gap-6">
          {cards.length > COLLAPSED_COUNT && (
            <button
              onClick={toggleExpand}
              aria-expanded={expanded}
              className="px-8 py-4 gaudi-organic-radius-1 border-2 border-gold text-gold font-bold uppercase text-xs tracking-widest hover:gaudi-gold-bg hover:text-gaudi-dark transition duration-300 shadow-lg flex items-center gap-3"
            >
              <span>{expanded ? "Згорнути блог" : "Завантажити ще статті"}</span>
              <i className={`fa-solid fa-chevron-down transition-transform duration-300 ${expanded ? "rotate-180" : ""}`}></i>
            </button>
          )}

          {expanded && totalPages > 1 && (
            <nav aria-label="Сторінки блогу" className="flex items-center justify-center gap-2 pt-2">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                <button
                  key={p}
                  onClick={() => goToPage(p)}
                  aria-current={p === page ? "page" : undefined}
                  className={`w-9 h-9 gaudi-organic-radius-1 border ${p === page ? "bg-gold text-gaudi-dark border-gold font-bold" : "border-gold/40 text-gold bg-gaudi-dark hover:border-gold"} transition text-xs flex items-center justify-center`}
                >
                  {p}
                </button>
              ))}
            </nav>
          )}
        </div>
      </div>
    </section>
  );
}
