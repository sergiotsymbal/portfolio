import FallbackImg from "../FallbackImg";

const features = [
  { icon: "fa-gem", text: "15+ років досвіду", radius: 1 },
  { icon: "fa-wine-bottle", text: "Підбір гастропоєднань", radius: 2 },
  { icon: "fa-masks-theater", text: "Шоу-подача та гастро-історії", radius: 2 },
  { icon: "fa-truck-fast", text: "Виїздне обслуговування", radius: 1 },
];

export default function About() {
  return (
    <section id="about" className="py-24 bg-gaudi-card/40 relative border-t border-b border-gold/20 overflow-hidden">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 pt-6">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 items-center">
          {/* Photo */}
          <div className="md:col-span-5 flex flex-col items-center relative reveal-left">
            <div className="relative w-full max-w-md pt-4">
              <div className="gaudi-organic-radius-1 overflow-hidden border-2 border-gold/40 shadow-2xl p-2 bg-gaudi-card">
                <FallbackImg
                  src="https://i.postimg.cc/c40P1pHD/5791.jpg"
                  fallback="https://images.unsplash.com/photo-1528605248644-14dd04022da1?q=80&w=800&auto=format&fit=crop"
                  alt="Сервіс гастроексперта"
                  className="w-full h-[420px] object-cover gaudi-organic-radius-1 hover:scale-105 transition duration-700"
                />
              </div>
              <div className="absolute -bottom-6 -right-2 bg-gaudi-dark border-2 border-gold gaudi-organic-radius-2 p-5 max-w-xs shadow-2xl hidden sm:block">
                <p className="font-serif italic text-sm text-gold">&quot;Світ розкривається через смаки&quot;</p>
              </div>
            </div>
          </div>

          {/* Text */}
          <div className="md:col-span-7 space-y-6 relative pt-4 reveal-right">
            <div className="inline-flex items-center gap-2 px-3 py-1 gaudi-organic-radius-1 border border-gold/40 bg-gaudi-card text-gold text-xs tracking-widest uppercase font-semibold mt-2">
              <i className="fa-solid fa-feather-pointed text-gold"></i>
              <span>ПРО МЕНЕ</span>
            </div>

            <h2 className="text-3xl sm:text-4xl font-serif font-bold text-neutral-100">
              Культура сиру та вина у гармонії з іспанською пристрастю
            </h2>
            <p className="text-neutral-300 font-light leading-relaxed">
              Гастрономія не обмежується географією, а цікавість до хороших продуктів не має національності. Я
              досліджую світ сирів, м&apos;ясних делікатесів та вина, знайомлюся з виробниками, вивчаю традиції й
              відкриваю нові можливості їх поєднання. Мені подобається виходити за межі звичного, руйнувати стереотипи
              та доводити, що справжня гастрономічна культура починається не з місця народження, а з бажання
              пізнавати.
            </p>
            <p className="text-neutral-300 font-light leading-relaxed">
              Як <strong className="text-gold font-normal">Фромаж&apos;є</strong>, я створюю ексклюзивні сирні карти,
              підбираю рідкісні сири з Франції, Італії, Швейцарії та України, та поєдную їх із винами за принципами
              тонкого пейрингу.
            </p>
            <p className="text-neutral-300 font-light leading-relaxed">
              Як <strong className="text-gold font-normal">досвідчений Кортадор</strong>, я володію класичною
              іспанською технікою професійної нарізки хамону (Jamón Ibérico &amp; Serrano). Його шоу-нарізка у
              присутності гостей перетворює будь-яку подію на яскравий перформанс.
            </p>

            <div className="pt-4 grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs text-neutral-300">
              {features.map((f) => (
                <div
                  key={f.text}
                  className={`flex items-center gap-3 bg-gaudi-dark/80 p-3 gaudi-organic-radius-${f.radius} border border-gold/30`}
                >
                  <i className={`fa-solid ${f.icon} text-gold`}></i>
                  <span>{f.text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
