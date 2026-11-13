import type { ContentBlock } from "@/data/articles";
import BookButton from "../booking/BookButton";
import FallbackImg from "../FallbackImg";
import RichText from "./RichText";

const paragraph = "text-neutral-300 font-light leading-relaxed";

function Block({ block }: { block: ContentBlock }) {
  switch (block.type) {
    case "paragraph":
      return <p className={paragraph}><RichText text={block.text} /></p>;
    case "heading":
      return <h2 className="text-2xl font-serif font-bold text-gold pt-6"><RichText text={block.text} /></h2>;
    case "subheading":
      return <h3 className="text-xl font-serif font-bold text-gold pt-4"><RichText text={block.text} /></h3>;
    case "list": {
      const Tag = block.ordered ? "ol" : "ul";
      return (
        <Tag className={`${block.ordered ? "list-decimal" : "list-disc"} pl-5 text-neutral-300 space-y-2 font-light marker:text-gold`}>
          {block.items.map((item, i) => (
            <li key={i}><RichText text={item} /></li>
          ))}
        </Tag>
      );
    }
    case "quote":
      return (
        <blockquote className="border-l-2 border-gold pl-5 py-1 space-y-2">
          <p className="font-serif italic text-xl text-gold/90"><RichText text={block.text} /></p>
          {block.author && <footer className="text-xs uppercase tracking-widest text-neutral-400">— {block.author}</footer>}
        </blockquote>
      );
    case "callout":
      return (
        <div className="bg-gaudi-dark/80 border border-gold/40 gaudi-organic-radius-2 p-5 text-sm text-neutral-200 leading-relaxed">
          <i className="fa-solid fa-wine-glass text-gold mr-2"></i>
          <RichText text={block.text} />
        </div>
      );
    case "image":
      return (
        <figure className="space-y-2">
          <FallbackImg
            src={block.src}
            alt={block.alt ?? block.caption ?? ""}
            loading="lazy"
            className="w-full gaudi-organic-radius-1 border border-gold/30"
          />
          {block.caption && <figcaption className="text-xs text-neutral-400 text-center">{block.caption}</figcaption>}
        </figure>
      );
    case "cta":
      return (
        <div className="bg-gaudi-card border-2 border-gold/40 gaudi-organic-radius-1 p-6 sm:p-8 flex flex-col sm:flex-row items-center gap-5 justify-between">
          {block.text && <p className="text-neutral-200 font-serif text-lg text-center sm:text-left"><RichText text={block.text} /></p>}
          <BookButton
            service={block.service}
            className="flex-shrink-0 px-8 py-4 gaudi-organic-radius-1 gaudi-gold-bg text-gaudi-dark font-bold uppercase text-xs tracking-widest hover:brightness-110 transition shadow-xl shadow-gold/20"
          >
            {block.label ?? "Замовити послугу"}
          </BookButton>
        </div>
      );
    case "divider":
      return <hr className="border-gold/20" />;
  }
}

export default function ArticleContent({ blocks }: { blocks: ContentBlock[] }) {
  return (
    <div className="space-y-5">
      {blocks.map((block, i) => (
        <Block key={i} block={block} />
      ))}
    </div>
  );
}
