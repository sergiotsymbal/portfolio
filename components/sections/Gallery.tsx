import { galleryItems } from "@/data/gallery";
import Carousel from "../Carousel";

const delays = ["delay-100", "delay-200", "delay-300"];

/** Auto-scrolling carousel from 3 photos up; fewer than that stay a static grid. */
export const CAROUSEL_MIN_ITEMS = 3;

export default function Gallery() {
  return (
    <section id="gallery" className="py-24 border-b border-gold/20 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-3 reveal-element">
          <span className="text-gold text-xs uppercase tracking-widest font-bold font-cinzel">Атмосферні моменти</span>
          <h2 className="text-3xl sm:text-4xl font-serif font-bold text-neutral-100">Естетика сиру, хамону та подачі</h2>
        </div>

        {galleryItems.length >= CAROUSEL_MIN_ITEMS ? (
          <Carousel items={galleryItems} />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {galleryItems.map((item, i) => (
              <div
                key={item.image}
                className={`relative group overflow-hidden border-2 border-gold/40 gaudi-organic-radius-${i % 2 === 0 ? 1 : 2} h-80 shadow-xl reveal-element ${delays[i % 3]}`}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={item.image} alt={item.alt} className="w-full h-full object-cover group-hover:scale-110 transition duration-700" />
                <div className="absolute inset-0 bg-gaudi-dark/70 opacity-0 group-hover:opacity-100 transition duration-300 flex items-center justify-center p-6 text-center">
                  <span className="text-gold font-serif text-xl">{item.caption}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
