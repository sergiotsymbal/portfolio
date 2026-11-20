"use client";

import { useRef, useState } from "react";
import { upcomingEvents, type EventItem } from "@/data/events";
import { useKyivToday } from "@/lib/useKyivToday";
import EventCard from "./EventCard";

const SWIPE_PX = 40;
const badgeFor = (i: number) => (i === 0 ? "Анонс події • Найближча подія" : "Анонс події • Наступна подія");

type Props = { all: EventItem[]; atBuild: EventItem[] };

/** Upcoming events, closest first: one card, or a slider when there are several. Hidden when there are none. */
export default function EventsSection({ all, atBuild }: Props) {
  const today = useKyivToday();
  const list = today ? upcomingEvents(all, today) : atBuild;
  const [index, setIndex] = useState(0);
  const pointerStart = useRef<number | null>(null);

  if (list.length === 0) return null;
  const current = Math.min(index, list.length - 1);
  const go = (i: number) => setIndex(Math.max(0, Math.min(list.length - 1, i)));

  return (
    <section id="tasting-event" className="py-28 relative overflow-hidden border-b border-gold/20">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 pt-6 reveal-element">
        {list.length === 1 ? (
          <EventCard event={list[0]} badge={badgeFor(0)} />
        ) : (
          <div role="region" aria-roledescription="carousel" aria-label="Анонси подій">
            <div className="relative">
              <div
                className="overflow-hidden -my-6 py-6 touch-pan-y"
                onPointerDown={(e) => (pointerStart.current = e.clientX)}
                onPointerUp={(e) => {
                  if (pointerStart.current === null) return;
                  const dx = e.clientX - pointerStart.current;
                  pointerStart.current = null;
                  if (dx <= -SWIPE_PX) go(current + 1);
                  else if (dx >= SWIPE_PX) go(current - 1);
                }}
              >
                <div
                  className="flex transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]"
                  style={{ transform: `translateX(${-current * 100}%)` }}
                >
                  {list.map((event, i) => (
                    <div
                      key={`${event.date}-${event.title}`}
                      className="shrink-0 basis-full px-1"
                      role="group"
                      aria-roledescription="slide"
                      aria-label={`${i + 1} з ${list.length}`}
                      aria-hidden={i !== current || undefined}
                      inert={i !== current || undefined}
                    >
                      <EventCard event={event} badge={badgeFor(i)} />
                    </div>
                  ))}
                </div>
              </div>

              <button
                onClick={() => go(current - 1)}
                disabled={current === 0}
                aria-label="Попередня подія"
                className="absolute left-0 sm:-left-6 xl:-left-16 top-1/2 -translate-y-1/2 z-10 w-11 h-11 gaudi-organic-radius-1 border border-gold/50 bg-gaudi-card/90 text-gold hover:bg-gold hover:text-gaudi-dark flex items-center justify-center transition shadow-2xl disabled:opacity-30 disabled:pointer-events-none"
              >
                <i className="fa-solid fa-chevron-left"></i>
              </button>
              <button
                onClick={() => go(current + 1)}
                disabled={current === list.length - 1}
                aria-label="Наступна подія"
                className="absolute right-0 sm:-right-6 xl:-right-16 top-1/2 -translate-y-1/2 z-10 w-11 h-11 gaudi-organic-radius-2 border border-gold/50 bg-gaudi-card/90 text-gold hover:bg-gold hover:text-gaudi-dark flex items-center justify-center transition shadow-2xl disabled:opacity-30 disabled:pointer-events-none"
              >
                <i className="fa-solid fa-chevron-right"></i>
              </button>
            </div>

            <div className="flex items-center justify-center gap-4 mt-8">
              <div className="flex items-center gap-2">
                {list.map((event, i) => (
                  <button
                    key={i}
                    onClick={() => go(i)}
                    aria-label={`Подія ${i + 1}: ${event.title}`}
                    aria-current={i === current ? "true" : undefined}
                    className={`h-2.5 rounded-full transition-all duration-300 ${i === current ? "w-8 bg-gold" : "w-2.5 bg-gold/30 hover:bg-gold/60"}`}
                  />
                ))}
              </div>
              <span className="text-xs text-neutral-400 tabular-nums" aria-live="polite">
                {current + 1} / {list.length}
              </span>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
