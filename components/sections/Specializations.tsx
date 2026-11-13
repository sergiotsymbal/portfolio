import { services } from "@/data/services";
import BookButton from "../booking/BookButton";

const delays = ["delay-100", "delay-200", "delay-300"];

export default function Specializations() {
  return (
    <section id="specializations" className="py-28 relative border-b border-gold/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-3 reveal-element">
          <span className="text-gold text-xs uppercase tracking-widest font-bold font-cinzel">Послуги та напрямки</span>
          <h2 className="text-3xl sm:text-4xl font-serif font-bold text-neutral-100">Ексклюзивні гастрономічні виїзди</h2>
          <p className="text-neutral-400 text-sm font-light">
            Оберіть бажаний формат для весілля, корпоративу, дня народження чи приватної вечірки.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {services.map((s, i) => {
            const otherRadius = s.radius === 1 ? 2 : 1;
            return (
              <div
                key={s.id}
                id={`spec-${s.id}`}
                className={`bg-gaudi-card border-2 ${s.featured ? "border-gold/50" : "border-gold/30"} gaudi-organic-radius-${s.radius} p-8 flex flex-col justify-between hover:border-gold transition duration-500 shadow-2xl gaudi-glow-hover relative ${s.featured ? "overflow-hidden " : ""}reveal-element ${delays[i] ?? ""}`}
              >
                {s.featured && (
                  <span className="absolute top-6 right-6 z-10 bg-gold text-gaudi-dark text-[9px] font-bold px-2 py-1 rounded uppercase tracking-wider">
                    VIP Преміум
                  </span>
                )}
                <div className="space-y-6 pt-4">
                  <div
                    className={`w-16 h-16 gaudi-organic-radius-${otherRadius} border border-gold flex items-center justify-center text-gold text-2xl bg-amber-950/40`}
                  >
                    <i className={`fa-solid ${s.icon}`}></i>
                  </div>
                  <div>
                    <span className="text-[10px] text-gold uppercase tracking-widest font-bold">{s.label}</span>
                    <h3 className="text-2xl font-serif font-bold text-neutral-100 mt-1">{s.title}</h3>
                  </div>
                  <p className="text-neutral-300 text-xs font-light leading-relaxed">{s.description}</p>
                  <ul className="text-xs text-neutral-400 space-y-2 pt-2">
                    {s.features.map((f) => (
                      <li key={f} className="flex items-center gap-2">
                        <i className="fa-solid fa-check text-gold"></i> {f}
                      </li>
                    ))}
                  </ul>
                </div>
                <BookButton
                  service={s.bookingName}
                  className={
                    s.featured
                      ? `w-full mt-8 py-3.5 gaudi-organic-radius-${s.radius} gaudi-gold-bg text-gaudi-dark font-extrabold text-xs uppercase tracking-widest hover:brightness-110 transition shadow-lg`
                      : `w-full mt-8 py-3.5 gaudi-organic-radius-${s.radius} border border-gold text-gold font-bold text-xs uppercase tracking-widest hover:gaudi-gold-bg hover:text-gaudi-dark transition`
                  }
                >
                  {s.cta}
                </BookButton>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
