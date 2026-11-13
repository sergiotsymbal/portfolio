"use client";

import { useState } from "react";

type Props = React.ImgHTMLAttributes<HTMLImageElement> & { src: string; fallback?: string };

/** Plain <img> that swaps to a fallback URL once if the primary fails to load. */
export default function FallbackImg({ src, fallback, alt = "", ...rest }: Props) {
  const [current, setCurrent] = useState(src);
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      {...rest}
      src={current}
      alt={alt}
      onError={() => {
        if (fallback && current !== fallback) setCurrent(fallback);
      }}
    />
  );
}
