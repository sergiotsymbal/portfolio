const event = {
  title: 'Сир і Вино: "Ігриста Вакханалія"',
  date: "25 Листопада 2026, 19:00",
  city: "м. Київ",
  venue: "Бар BAD BOY, Дніпровська набережна, 14к",
  ticketUrl:
    "https://badboy.ua/product/%D1%81%D0%B8%D1%80-%D1%96-%D0%B2%D0%B8%D0%BD%D0%BE-%D1%96%D0%B3%D1%80%D0%B8%D1%81%D1%82%D0%B0-%D0%B2%D0%B0%D0%BA%D1%85%D0%B0%D0%BD%D0%B0%D0%BB%D1%96%D1%8F/",
  description: [
    "Сир та ігристе — це те, що змушує відчувати мурахи по всьому тілу. Якщо, звичайно, ти ще щось відчуваєш. Тому приходь на дегустацію і перевіримо, чи ми можемо ще тебе здивувати. Чи може ти здивуєш нас",
    "У програмі 6 видів виняткових сирів у парі з різними видами ігристих вин.",
    "Будемо дегустувати, насолоджуватися, розбиратися у смаках та оцінювати що з цього найсмачніше",
  ],
};

export default function TastingEvent() {
  return (
    <section id="tasting-event" className="py-28 relative overflow-hidden border-b border-gold/20">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 pt-6 reveal-element">
        <div className="bg-gaudi-card border-2 border-gold/50 gaudi-organic-radius-1 p-8 sm:p-12 shadow-2xl gaudi-glow-hover transition duration-500 relative overflow-hidden">
          <div className="absolute -right-10 -bottom-10 text-gold/5 text-9xl font-serif pointer-events-none">
            <i className="fa-solid fa-wine-glass"></i>
          </div>

          <div className="flex flex-col md:flex-row items-center justify-between gap-8 pt-6">
            <div className="space-y-4 text-center md:text-left flex-grow">
              <div className="inline-flex items-center gap-2 px-3 py-1 gaudi-organic-radius-1 bg-amber-500/20 text-gold border border-gold/40 text-[11px] font-bold uppercase tracking-widest">
                <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping"></span>
                <span>Анонс події • Найближча дегустація</span>
              </div>

              <h3 className="text-2xl sm:text-3xl font-serif font-bold text-neutral-100 gaudi-gold-gradient">
                {event.title}
              </h3>

              <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 text-xs text-neutral-300 font-medium">
                <div className="flex items-center gap-2 bg-gaudi-dark px-3 py-1.5 gaudi-organic-radius-1 border border-gold/30">
                  <i className="fa-regular fa-calendar-check text-gold"></i>
                  <span>{event.date}</span>
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
              <a
                href={event.ticketUrl}
                target="_blank"
                rel="noopener nofollow"
                className="inline-block px-8 py-4 gaudi-organic-radius-1 gaudi-gold-bg text-gaudi-dark font-extrabold uppercase text-xs tracking-widest hover:brightness-110 transition shadow-xl shadow-gold/20 whitespace-nowrap"
              >
                Придбати квиток<i className="fa-solid fa-arrow-right ml-2"></i>
              </a>
              <span className="block text-[10px] text-neutral-400 mt-2 font-light">Кількість місць обмежена</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
