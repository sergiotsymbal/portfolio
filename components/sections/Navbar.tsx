"use client";

import Link from "next/link";
import { useState } from "react";
import { events, upcomingEvents } from "@/data/events";
import { useKyivToday } from "@/lib/useKyivToday";
import BookButton from "../booking/BookButton";

const desktopLink =
  "hover:text-gold transition duration-300 relative py-1 hover:border-b-2 hover:border-gold";
const mobileLink = "block text-neutral-200 hover:text-gold text-sm uppercase tracking-wider font-semibold";

const links = [
  { href: "/#about", label: "Про мене" },
  { href: "/#specializations", label: "Напрямки" },
  { href: "/#instagram", label: "Instagram" },
  { href: "/#tasting-event", label: "Анонс події", mobileLabel: "Найближча дегустація", event: true },
  { href: "/#blog", label: "Блог" },
  { href: "/#book", label: "Книга", mobileLabel: "Книга «Сир і вино»" },
  { href: "/#contacts", label: "Контакти" },
];

/** `hasEventsAtBuild`: whether there were upcoming events at build time (used until the browser checks today's date). */
export default function Navbar({ hasEventsAtBuild }: { hasEventsAtBuild: boolean }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const today = useKyivToday();
  const hasEvents = today ? upcomingEvents(events, today).length > 0 : hasEventsAtBuild;
  const visibleLinks = links.filter((l) => !l.event || hasEvents);

  return (
    <nav
      id="navbar"
      className="fixed top-0 left-0 w-full z-50 gaudi-trencadis-mosaic-header backdrop-blur-md border-b-2 border-gold/40 shadow-2xl transition-all duration-300"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-24 pt-2">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="flex items-center space-x-3 group bg-gaudi-dark/80 px-3 py-1.5 gaudi-organic-radius-1 border border-gold/40 backdrop-blur-sm"
            >
              <div className="w-12 h-12 gaudi-organic-radius-1 border-2 border-gold flex items-center justify-center text-gold font-serif text-xl font-bold bg-gaudi-dark/90 group-hover:gaudi-gold-bg group-hover:text-gaudi-dark transition duration-500 shadow-lg shadow-gold/20">
                DS
              </div>
              <div className="flex flex-col">
                <span className="font-vivaldi text-2xl sm:text-3xl font-normal tracking-wide gaudi-gold-gradient drop-shadow-md">
                  Don Sergio
                </span>
                <span className="text-[10px] sm:text-xs text-gold/90 uppercase tracking-widest font-semibold">
                  Fromagier &amp; Cortador
                </span>
              </div>
            </Link>
          </div>

          {/* Desktop Menu Links */}
          <div className="hidden lg:flex items-center space-x-5 text-xs uppercase tracking-widest font-semibold text-neutral-200 bg-gaudi-dark/85 px-6 py-2.5 gaudi-organic-radius-1 border border-gold/30 backdrop-blur-md shadow-lg">
            {visibleLinks.map((l) =>
              l.event ? (
                <Link
                  key={l.href}
                  href={l.href}
                  className="text-amber-300 flex items-center gap-2 hover:brightness-125 transition bg-amber-950/80 px-3 py-1.5 gaudi-organic-radius-1 border border-amber-500/50"
                >
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-ping"></span>
                  {l.label}
                </Link>
              ) : (
                <Link key={l.href} href={l.href} className={desktopLink}>
                  {l.label}
                </Link>
              ),
            )}
          </div>

          {/* CTA Button */}
          <div className="hidden lg:block">
            <BookButton
              service="Загальний виїзний запит"
              className="px-4 py-3 gaudi-organic-radius-1 border border-gold text-gold bg-gaudi-dark/90 hover:gaudi-gold-bg hover:text-gaudi-dark transition duration-500 font-bold text-[10px] tracking-wider uppercase shadow-md hover:shadow-gold/40"
            >
              Замовити послугу
            </BookButton>
          </div>

          {/* Mobile Hamburger Button */}
          <div className="block lg:hidden">
            <button
              onClick={() => setMobileOpen((v) => !v)}
              className="p-2 text-gold focus:outline-none"
              aria-label="Відкрити меню"
              aria-expanded={mobileOpen}
            >
              <i className="fa-solid fa-bars text-2xl"></i>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileOpen && (
        <div className="lg:hidden bg-gaudi-card border-b border-gold/30 px-6 py-6 pt-10 space-y-4 gaudi-organic-radius-2 mx-4 my-2 shadow-2xl relative">
          {visibleLinks.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              onClick={() => setMobileOpen(false)}
              className={l.event ? "block text-amber-300 text-sm uppercase tracking-wider font-bold" : mobileLink}
            >
              {l.mobileLabel ?? l.label}
            </Link>
          ))}
          <BookButton
            service="Мобільне меню"
            className="w-full mt-4 py-3 gaudi-organic-radius-1 border-2 border-gold text-gold bg-gaudi-dark uppercase text-xs tracking-widest font-bold hover:gaudi-gold-bg hover:text-gaudi-dark transition"
          >
            Замовити послугу
          </BookButton>
        </div>
      )}
    </nav>
  );
}
