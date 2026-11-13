import BookButton from "../booking/BookButton";
import FallbackImg from "../FallbackImg";

const FALLBACK = "https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?q=80&w=800&auto=format&fit=crop";
const heroBtn =
  "px-8 py-4 gaudi-organic-radius-1 gaudi-gold-bg text-gaudi-dark font-bold uppercase text-xs tracking-widest hover:brightness-110 transition shadow-xl shadow-gold/20";

export default function Hero() {
  return (
    <section
      id="hero"
      className="relative min-h-screen flex items-center justify-start pt-32 pb-20 overflow-hidden border-b border-gold/20"
    >
      <div
        className="absolute inset-0 z-0 opacity-20 bg-cover bg-center filter brightness-50"
        style={{ backgroundImage: "url('https://i.postimg.cc/tJCMh8dP/jpeg-optimizer-IMG-6476.jpg')" }}
      ></div>

      {/* Ambient Glow */}
      <div className="absolute w-[500px] h-[500px] bg-gold/10 rounded-full blur-3xl -top-20 -left-20 pointer-events-none"></div>
      <div className="absolute w-[400px] h-[400px] bg-amber-600/10 rounded-full blur-3xl bottom-10 right-10 pointer-events-none"></div>

      {/* Small floating U-arch photo — overlaps the lower-left of the large photo.
          Only from 1440px: on narrower screens it would sit behind the heading and buttons. */}
      <div className="hidden min-[1440px]:block absolute z-[10] pointer-events-none w-[258px] h-[354px] max-h-[45vh] right-[360px] bottom-[120px] animate-hero-float">
        <div
          className="h-full w-full overflow-hidden shadow-2xl border border-gold/30"
          style={{ borderBottomLeftRadius: 500, borderBottomRightRadius: 500 }}
        >
          <FallbackImg
            src="https://i.postimg.cc/d38zBGgK/jpeg-optimizer-bb-vinoman-51.jpg"
            fallback={FALLBACK}
            alt="Гастроексперт Don Sergio"
            className="h-full w-full object-cover object-center opacity-95"
          />
        </div>
      </div>

      {/* Large arch photo — stands on the bottom edge of the section; height capped so it always clears the fixed navbar.
          From 1280px; its width shrinks (100vw - 880px) so it never slides under the text column. */}
      <div className="absolute pointer-events-none hidden xl:block z-[6] w-[min(479px,calc(100vw-880px))] h-[min(646px,calc(100%-8rem))] right-12 bottom-0">
        <div
          className="h-full w-full overflow-hidden shadow-2xl border-l border-t border-r border-gold/30"
          style={{ borderTopLeftRadius: 360 }}
        >
          <FallbackImg
            src="https://i.postimg.cc/MKq0HyZw/jpeg-optimizer-jpeg-optimizer-bb-vinoman-71.jpg"
            fallback={FALLBACK}
            alt="Гастроексперт Don Sergio"
            className="h-full w-full object-cover object-top opacity-95"
          />
        </div>
      </div>

      {/* Main content */}
      <div className="max-w-3xl lg:ml-24 lg:mr-auto px-6 sm:px-10 lg:px-12 relative z-30 w-full flex flex-col items-start justify-center">
        <div className="w-full text-left space-y-8 pt-4">
          <div className="inline-flex items-center gap-3 px-5 py-2 gaudi-organic-radius-1 bg-gaudi-card border border-gold/40 text-gold text-xs tracking-[0.2em] uppercase font-semibold shadow-lg">
            <i className="fa-solid fa-crown text-gold"></i>
            <span>Культура еногастрономічного мистецтва &amp; Виїздні дегустації</span>
          </div>

          <h1 className="font-serif text-3xl sm:text-5xl md:text-6xl font-bold tracking-tight text-neutral-100 leading-tight">
            У кожному смаку - цілий світ
            <br className="hidden sm:inline" />{" "}
            <span className="gaudi-gold-gradient font-serif italic font-normal">сиру, вина та хамонів</span>
          </h1>

          <p className="max-w-2xl text-sm sm:text-base text-neutral-300 font-light leading-relaxed">
            Дегустації вишуканих сирів з винним пейрингом
            <br />
            Професійний супровід вашого заходу від виїзного
            <br />
            кортадора та сирного сомельє.
            <br />
            Шоу-нарізка хамону Іберіко ножем на Вашій події.
            <br />
            Проведення навчання персоналу роботі з продуктів гастрономії.
          </p>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-start gap-4 pt-4">
            <BookButton service="Виїзна дегустація сиру з вином" className={heroBtn}>
              <i className="fa-solid fa-wine-glass mr-2"></i> Дегустація сиру &amp; вина
            </BookButton>
            <BookButton service="Нарізка хамона" className={heroBtn}>
              <i className="fa-solid fa-utensils mr-2"></i> Нарізка хамона
            </BookButton>
            <BookButton service="Курс по гастрономії" className={heroBtn}>
              <i className="fa-solid fa-graduation-cap mr-2"></i> Курс по гастрономії
            </BookButton>
          </div>
        </div>
      </div>
    </section>
  );
}
