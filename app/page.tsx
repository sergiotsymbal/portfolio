import { toCardData } from "@/components/blog/ArticleCard";
import Blog from "@/components/blog/Blog";
import { articles } from "@/data/articles";
import ScrollReveal from "@/components/ScrollReveal";
import About from "@/components/sections/About";
import Book from "@/components/sections/Book";
import Contacts from "@/components/sections/Contacts";
import Gallery from "@/components/sections/Gallery";
import Hero from "@/components/sections/Hero";
import Instagram from "@/components/sections/Instagram";
import Specializations from "@/components/sections/Specializations";
import TastingEvent from "@/components/sections/TastingEvent";

export default function Home() {
  return (
    <>
      {/* Clip horizontally: reveal-left/right start 70px off-axis and would otherwise widen the mobile viewport. */}
      <main className="overflow-x-clip">
        <Hero />
        <About />
        <Specializations />
        <Instagram />
        <TastingEvent />
        <Book />
        <Blog cards={articles.map(toCardData)} />
        <Gallery />
        <Contacts />
      </main>
      <ScrollReveal />
    </>
  );
}
