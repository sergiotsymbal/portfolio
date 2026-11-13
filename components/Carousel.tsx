"use client";

import { useCallback, useEffect, useRef, useState } from "react";

export type CarouselItem = { image: string; alt: string; caption?: string };

/**
 * "gallery": 1 / 2 / 3 photos per view (mobile / sm / lg), captions on hover — the home page gallery.
 * "hero":    one large photo per view, caption bar at the bottom — the article page header.
 */
type Variant = "gallery" | "hero";

const VARIANTS = {
  gallery: {
    viewport: "-mx-4",
    track: "[--slide:100%] sm:[--slide:50%] lg:[--slide:33.3333%]",
    slide: "px-4",
    frame: (i: number) =>
      `relative group overflow-hidden border-2 border-gold/40 gaudi-organic-radius-${i % 2 === 0 ? 1 : 2} h-80 shadow-xl`,
    prev: "left-0 sm:-left-5",
    next: "right-0 sm:-right-5",
  },
  hero: {
    viewport: "gaudi-organic-radius-1 border-2 border-gold/40 shadow-2xl gaudi-glow",
    track: "[--slide:100%]",
    slide: "",
    frame: () => "relative group overflow-hidden h-64 sm:h-96",
    prev: "left-3",
    next: "right-3",
  },
} satisfies Record<Variant, unknown>;

const AUTOPLAY_MS = 3500;
const SLIDE_MS = 700;
const SWIPE_PX = 40;

/**
 * Infinite, auto-advancing carousel. Shows 1 / 2 / 3 slides (mobile / sm / lg), moves one slide at a time.
 * The list is rendered three times; after sliding into a copy we jump back by whole laps without animation,
 * so it loops seamlessly — and rapid clicks never hit the end of the strip mid-animation.
 */
type Props = { items: CarouselItem[]; variant?: Variant; label?: string };

export default function Carousel({ items, variant = "gallery", label = "Галерея" }: Props) {
  const v = VARIANTS[variant];
  const n = items.length;
  const slides = [...items, ...items, ...items];

  const [index, setIndex] = useState(0);
  const [animate, setAnimate] = useState(true);
  const [paused, setPaused] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  const pointerStart = useRef<number | null>(null);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReducedMotion(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  const next = useCallback(() => {
    setAnimate(true);
    setIndex((i) => Math.min(i + 1, 2 * n));
  }, [n]);

  const prev = useCallback(() => {
    if (index > 0) {
      setAnimate(true);
      setIndex(index - 1);
      return;
    }
    // At the start: jump (no animation) to the identical position in the copy, then slide back one.
    setAnimate(false);
    setIndex(n);
    requestAnimationFrame(() =>
      requestAnimationFrame(() => {
        setAnimate(true);
        setIndex(n - 1);
      }),
    );
  }, [index, n]);

  const goTo = (i: number) => {
    setAnimate(true);
    setIndex(i);
  };

  // Slid into a copy → snap back to the same photo in the first lap, without animation.
  const onTransitionEnd = (e: React.TransitionEvent) => {
    // Ignore transitions bubbling up from the slides (e.g. the image hover zoom).
    if (e.target !== e.currentTarget) return;
    if (index >= n) {
      setAnimate(false);
      setIndex(index % n);
    }
  };

  // Autoplay (off when paused, hidden tab, or reduced motion).
  useEffect(() => {
    if (paused || reducedMotion) return;
    const t = setInterval(() => {
      if (!document.hidden) next();
    }, AUTOPLAY_MS);
    return () => clearInterval(t);
  }, [paused, reducedMotion, next]);

  const active = index % n;

  return (
    <div
      className={variant === "gallery" ? "reveal-element" : ""}
      role="region"
      aria-roledescription="carousel"
      aria-label={label}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
    >
      <div className="relative">
        <div
          className={`overflow-hidden touch-pan-y ${v.viewport}`}
          onPointerDown={(e) => (pointerStart.current = e.clientX)}
          onPointerUp={(e) => {
            if (pointerStart.current === null) return;
            const dx = e.clientX - pointerStart.current;
            pointerStart.current = null;
            if (dx <= -SWIPE_PX) next();
            else if (dx >= SWIPE_PX) prev();
          }}
        >
          <div
            data-testid="carousel-track"
            onTransitionEnd={onTransitionEnd}
            className={`flex ${v.track}`}
            style={{
              transform: `translateX(calc(var(--slide) * ${-index}))`,
              transition: animate ? `transform ${SLIDE_MS}ms cubic-bezier(0.16, 1, 0.3, 1)` : "none",
            }}
          >
            {slides.map((item, i) => {
              const isClone = i >= n;
              return (
                <div
                  key={i}
                  className={`shrink-0 basis-[var(--slide)] ${v.slide}`}
                  role="group"
                  aria-roledescription="slide"
                  aria-label={`${(i % n) + 1} з ${n}`}
                  aria-hidden={isClone || undefined}
                  inert={isClone || undefined}
                >
                  <div className={v.frame(i)}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={item.image}
                      alt={isClone ? "" : item.alt}
                      draggable={false}
                      loading={i < 3 ? "eager" : "lazy"}
                      className={`w-full h-full object-cover select-none ${variant === "gallery" ? "group-hover:scale-110 transition duration-700" : ""}`}
                    />
                    {item.caption && variant === "gallery" && (
                      <div className="absolute inset-0 bg-gaudi-dark/70 opacity-0 group-hover:opacity-100 transition duration-300 flex items-center justify-center p-6 text-center">
                        <span className="text-gold font-serif text-xl">{item.caption}</span>
                      </div>
                    )}
                    {item.caption && variant === "hero" && (
                      <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-gaudi-dark/90 to-transparent px-6 pt-10 pb-4 text-sm text-neutral-200 font-light">
                        {item.caption}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <button
          onClick={prev}
          aria-label="Попереднє фото"
          className={`absolute ${v.prev} top-1/2 -translate-y-1/2 z-10 w-11 h-11 gaudi-organic-radius-1 border border-gold/50 bg-gaudi-card/90 text-gold hover:bg-gold hover:text-gaudi-dark flex items-center justify-center transition shadow-2xl`}
        >
          <i className="fa-solid fa-chevron-left"></i>
        </button>
        <button
          onClick={next}
          aria-label="Наступне фото"
          className={`absolute ${v.next} top-1/2 -translate-y-1/2 z-10 w-11 h-11 gaudi-organic-radius-2 border border-gold/50 bg-gaudi-card/90 text-gold hover:bg-gold hover:text-gaudi-dark flex items-center justify-center transition shadow-2xl`}
        >
          <i className="fa-solid fa-chevron-right"></i>
        </button>
      </div>

      <div className={`flex items-center justify-center gap-2 ${variant === "hero" ? "mt-5" : "mt-8"}`}>
        {items.map((_, i) => (
          <button
            key={i}
            onClick={() => goTo(i)}
            aria-label={`Фото ${i + 1}`}
            aria-current={i === active ? "true" : undefined}
            className={`h-2.5 rounded-full transition-all duration-300 ${i === active ? "w-8 bg-gold" : "w-2.5 bg-gold/30 hover:bg-gold/60"}`}
          />
        ))}
      </div>
    </div>
  );
}
