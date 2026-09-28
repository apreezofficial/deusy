"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

const targets = ".reveal, .reveal-edge";

/**
 * Progress-driven reveals would need `animation-timeline: view()`, which is not
 * everywhere, so the entrance animation runs off one observer instead. Elements
 * already on screen are left alone, which keeps the first paint stable and means
 * content is never hidden when the script has not run.
 */
export function ScrollReveal() {
  const pathname = usePathname();

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const nodes = Array.from(document.querySelectorAll<HTMLElement>(targets)).filter(
      (node) => !node.dataset.reveal,
    );

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          (entry.target as HTMLElement).dataset.reveal = "shown";
          observer.unobserve(entry.target);
        }
      },
      { rootMargin: "0px 0px -10% 0px", threshold: 0.04 },
    );

    for (const node of nodes) {
      const rect = node.getBoundingClientRect();
      if (rect.top < window.innerHeight * 0.92 && rect.bottom > 0) continue;
      node.dataset.reveal = "pending";
      observer.observe(node);
    }

    return () => observer.disconnect();
  }, [pathname]);

  return null;
}
