"use client";

import { useEffect } from "react";

/** Adds `.revealed` to `.reveal-element/.reveal-left/.reveal-right` as they scroll into view. */
export default function ScrollReveal() {
  useEffect(() => {
    const targets = document.querySelectorAll(".reveal-element, .reveal-left, .reveal-right");

    if (!("IntersectionObserver" in window)) {
      targets.forEach((el) => el.classList.add("revealed"));
      return;
    }

    const observer = new IntersectionObserver(
      (entries, obs) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("revealed");
            obs.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" },
    );

    targets.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return null;
}
