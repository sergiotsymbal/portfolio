import { formatEventDate, type EventItem } from "@/data/events";
import BookButton from "../booking/BookButton";

const ctaClass =
  "inline-block px-8 py-4 gaudi-organic-radius-1 gaudi-gold-bg text-gaudi-dark font-extrabold uppercase text-xs tracking-widest hover:brightness-110 transition shadow-xl shadow-gold/20 whitespace-nowrap";

export default function EventCard({ event, badge }: { event: EventItem; badge: string }) {
  return (
    <div className="bg-gaudi-card border-2 border-gold/50 gaudi-organic-radius-1 p-8 sm:p-12 shadow-2xl gaudi-glow-hover transition duration-500 relative overflow-hidden h-full">
      <div className="absolute -right-10 -bottom-10 text-gold/5 text-9xl font-serif pointer-events-none">
        <i className="fa-solid fa-wine-glass"></i>
      </div>

      <div className="flex flex-col md:flex-row items-center justify-between gap-8 pt-6">
        <div className="space-y-4 text-center md:text-left flex-grow">
          <div className="inline-flex items-center gap-2 px-3 py-1 gaudi-organic-radius-1 bg-amber-500/20 text-gold border border-gold/40 text-[11px] font-bold uppercase tracking-widest">
            <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping"></span>
            <span>{badge}</span>
          </div>

          <h3 className="text-2xl sm:text-3xl font-serif font-bold text-neutral-100 gaudi-gold-gradient">{event.title}</h3>

          <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 text-xs text-neutral-300 font-medium">
            <div className="flex items-center gap-2 bg-gaudi-dark px-3 py-1.5 gaudi-organic-radius-1 border border-gold/30">
              <i className="fa-regular fa-calendar-check text-gold"></i>
              <time dateTime={event.time ? `${event.date}T${event.time}` : event.date}>{formatEventDate(event)}</time>
            </div>
            <div className="flex items-center gap-2 bg-gaudi-dark px-3 py-1.5 gaudi-organic-radius-2 border border-gold/30">
              <i className="fa-solid fa-location-dot text-gold"></i>
              <span>
                {event.city}
                <br />
                {event.venue}
              </span>
            </div>
          </div>

          <p className="text-neutral-300 text-xs font-light leading-relaxed max-w-2xl">
            {event.description.map((line, i) => (
              <span key={i}>
                {i > 0 && <br />}
                {line}
              </span>
            ))}
          </p>
        </div>

        <div className="flex-shrink-0 text-center">
          {event.ticketUrl ? (
            <a href={event.ticketUrl} target="_blank" rel="noopener nofollow" className={ctaClass}>
              {event.ticketLabel ?? "Придбати квиток"}
              <i className="fa-solid fa-arrow-right ml-2"></i>
            </a>
          ) : event.ticketsSoon ? (
            <button type="button" disabled className={`${ctaClass} opacity-50 cursor-not-allowed`}>
              {event.ticketLabel ?? "Квитки незабаром"}
            </button>
          ) : (
            <BookButton service={`Подія: ${event.title}, ${formatEventDate(event)}`} className={ctaClass}>
              {event.ticketLabel ?? "Записатися"}
              <i className="fa-solid fa-arrow-right ml-2"></i>
            </BookButton>
          )}
          {event.note && <span className="block text-[10px] text-neutral-400 mt-2 font-light">{event.note}</span>}
        </div>
      </div>
    </div>
  );
}
