import Link from "next/link";
import { Fragment } from "react";

const TOKEN = /(\*\*[^*]+\*\*|\*[^*]+\*|\[[^\]]+\]\([^)\s]+\))/g;
const SAFE_URL = /^(https?:\/\/|\/|#|mailto:|tel:)/;
const linkClass = "text-gold underline underline-offset-4 hover:brightness-125";

/** Renders inline **bold**, *italic* and [links](url) from article JSON text. No raw HTML. */
export default function RichText({ text }: { text: string }) {
  return (
    <>
      {text.split(TOKEN).map((part, i) => {
        if (part.startsWith("**") && part.endsWith("**")) {
          return <strong key={i} className="font-semibold text-neutral-100">{part.slice(2, -2)}</strong>;
        }
        if (part.startsWith("*") && part.endsWith("*") && part.length > 2) {
          return <em key={i}>{part.slice(1, -1)}</em>;
        }
        const link = /^\[([^\]]+)\]\(([^)\s]+)\)$/.exec(part);
        if (link) {
          const [, label, href] = link;
          if (!SAFE_URL.test(href)) return <Fragment key={i}>{label}</Fragment>;
          return href.startsWith("/") || href.startsWith("#") ? (
            <Link key={i} href={href} className={linkClass}>{label}</Link>
          ) : (
            <a key={i} href={href} target="_blank" rel="noopener nofollow" className={linkClass}>{label}</a>
          );
        }
        return <Fragment key={i}>{part}</Fragment>;
      })}
    </>
  );
}
