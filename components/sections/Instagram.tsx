const profiles = [
  {
    id: "fromagier",
    href: "https://www.instagram.com/don_sergio91?exln=YjdiMDNpdGdzenc3",
    handle: "@don_sergio91",
    tag: "Сир & Вино",
    description: [
      "Огляди рідкісних сирів, гайди з винно-сирного пейрингу, поради по поєднанню продуктів гастрономії, естетичні фото та звіти з дегустацій.",
    ],
    cta: "Підписатися на сирний профіль",
    radius: 1,
    delay: "delay-100",
  },
  {
    id: "cortador",
    href: "https://www.instagram.com/jamon.kyiv?psln=cHUwaGRhY2R0Zzd3",
    handle: "@jamon.kyiv",
    tag: "Кортадор",
    description: [
      "Поради щодо вибору м'ясних делікатесів",
      "Нарізка хамона, атмосферні моменти з весіль, свят та івентів",
    ],
    cta: "Підписатися на профіль кортадора",
    radius: 2,
    delay: "delay-200",
  },
];

export default function Instagram() {
  return (
    <section id="instagram" className="py-24 bg-gaudi-dark border-t border-b border-gold/20 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 pt-6">
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-3 reveal-element">
          <span className="text-gold text-xs uppercase tracking-widest font-bold font-cinzel">Соціальні мережі</span>
          <h2 className="text-3xl sm:text-4xl font-serif font-bold text-neutral-100">
            Слідкуйте за обома блогами в Інстаграм
          </h2>
          <p className="text-neutral-400 text-sm font-light">
            Окремі профілі, присвячені культурі сиру та вина і мистецтву нарізки хамону.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {profiles.map((p) => {
            const iconRadius = p.radius === 1 ? 2 : 1;
            return (
              <a
                key={p.id}
                href={p.href}
                target="_blank"
                rel="noopener nofollow"
                className={`bg-gaudi-card border-2 border-gold/30 p-8 gaudi-organic-radius-${p.radius} hover:border-gold transition duration-500 flex flex-col sm:flex-row items-center sm:items-start gap-6 shadow-2xl gaudi-glow-hover relative reveal-element ${p.delay} block group`}
              >
                <div className={`w-20 h-20 gaudi-organic-radius-${iconRadius} border-2 border-gold p-1 flex-shrink-0 mt-4 sm:mt-2`}>
                  <div
                    className={`w-full h-full gaudi-organic-radius-${iconRadius} bg-amber-950/80 flex items-center justify-center text-gold text-3xl group-hover:scale-105 transition duration-300`}
                  >
                    <i className="fa-brands fa-instagram"></i>
                  </div>
                </div>
                <div className="text-center sm:text-left space-y-3 flex-grow pt-4 sm:pt-2">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <h3 className="text-lg font-bold text-neutral-100 font-cinzel group-hover:text-gold transition duration-300">
                      {p.handle}
                    </h3>
                    <span className="px-3 py-1 bg-amber-500/20 text-gold text-[10px] uppercase tracking-wider rounded-full border border-gold/40 self-center sm:self-auto">
                      {p.tag}
                    </span>
                  </div>
                  <p className="text-xs text-neutral-300 font-light leading-relaxed">
                    {p.description.map((line, i) => (
                      <span key={i}>
                        {i > 0 && <br />}
                        {line}
                      </span>
                    ))}
                  </p>
                  <div className="inline-flex items-center gap-2 text-xs font-bold text-gold uppercase tracking-wider group-hover:brightness-125 pt-2">
                    <span>{p.cta}</span>
                    <i className="fa-solid fa-arrow-up-right-from-square text-[10px] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition duration-300"></i>
                  </div>
                </div>
              </a>
            );
          })}
        </div>
      </div>
    </section>
  );
}
