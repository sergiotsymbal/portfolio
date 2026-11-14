import type { Metadata, Viewport } from "next";
import { Cinzel, Cormorant_Garamond, Great_Vibes, Montserrat, Pinyon_Script } from "next/font/google";
import "@fortawesome/fontawesome-free/css/all.min.css";
import BookingProvider from "@/components/booking/BookingProvider";
import Footer from "@/components/sections/Footer";
import Navbar from "@/components/sections/Navbar";
import { events, kyivToday, upcomingEvents } from "@/data/events";
import { SITE_URL } from "@/lib/site";
import "./globals.css";

const cormorant = Cormorant_Garamond({
  subsets: ["latin", "cyrillic"],
  weight: ["400", "600", "700"],
  style: ["normal", "italic"],
  variable: "--font-cormorant",
});
const montserrat = Montserrat({
  subsets: ["latin", "cyrillic"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-montserrat",
});
// Cinzel has no Cyrillic glyphs; see tailwind.config.ts for how `font-cinzel` falls back.
const cinzel = Cinzel({ subsets: ["latin"], weight: ["600", "700", "800"], variable: "--font-cinzel" });
const greatVibes = Great_Vibes({ subsets: ["latin", "cyrillic"], weight: "400", variable: "--font-great-vibes" });
const pinyon = Pinyon_Script({ subsets: ["latin"], weight: "400", variable: "--font-pinyon" });

const description =
  "Виїзні дегустації сиру та вина, шоу-нарізка хамону кортадором, навчання персоналу. Don Sergio — фромаж'є та кортадор.";

export const metadata: Metadata = {
  // Set NEXT_PUBLIC_SITE_URL to the production domain so share links get absolute image URLs.
  metadataBase: new URL(SITE_URL),
  title: { default: "Гастроексперт | Фромаж'є & Кортадор", template: "%s | Don Sergio" },
  description,
  openGraph: {
    type: "website",
    locale: "uk_UA",
    title: "Don Sergio | Фромаж'є & Кортадор",
    description,
    images: ["https://i.postimg.cc/MKq0HyZw/jpeg-optimizer-jpeg-optimizer-bb-vinoman-71.jpg"],
  },
};

export const viewport: Viewport = { themeColor: "#0B0A0D" };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const fonts = [cormorant, montserrat, cinzel, greatVibes, pinyon].map((f) => f.variable).join(" ");
  return (
    <html lang="uk" className={`scroll-smooth ${fonts}`}>
      <body className="trencadis-bg text-neutral-200 font-sans antialiased selection:bg-gold selection:text-gaudi-dark overflow-x-hidden">
        <BookingProvider>
          <Navbar hasEventsAtBuild={upcomingEvents(events, kyivToday()).length > 0} />
          {children}
          <Footer />
        </BookingProvider>
      </body>
    </html>
  );
}
