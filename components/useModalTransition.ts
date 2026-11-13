"use client";

import { useEffect, useRef, useState } from "react";

/** Mirrors the original open/close animation: mount → fade in; fade out → unmount after 300ms. */
export function useModalTransition(open: boolean) {
  const [mounted, setMounted] = useState(open);
  const [visible, setVisible] = useState(open);
  // Only release the body scroll lock if this modal took it (two modals share the page).
  const lockedByMe = useRef(false);

  useEffect(() => {
    if (open) {
      document.body.classList.add("overflow-hidden");
      lockedByMe.current = true;
      const t = setTimeout(() => {
        setMounted(true);
        setVisible(true);
      }, 10);
      return () => clearTimeout(t);
    }
    if (!lockedByMe.current) return;
    const t = setTimeout(() => {
      setVisible(false);
      setMounted(false);
      document.body.classList.remove("overflow-hidden");
      lockedByMe.current = false;
    }, 300);
    return () => clearTimeout(t);
  }, [open]);

  useEffect(
    () => () => {
      if (lockedByMe.current) document.body.classList.remove("overflow-hidden");
    },
    [],
  );

  // Mounted as soon as `open` flips; visible only after the 10ms tick, and hidden immediately on close.
  return { mounted: open || mounted, visible: open && visible };
}

export function useEscape(onEscape: () => void) {
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onEscape();
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [onEscape]);
}
