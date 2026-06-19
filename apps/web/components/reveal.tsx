"use client";

import { useEffect, useRef, type CSSProperties, type ReactNode } from "react";

/**
 * Scroll-triggered entrance that enhances an already-visible default.
 *
 * Content renders visible. On the client we "arm" the element (hide + offset
 * via CSS) only when motion is allowed, IntersectionObserver exists, and the
 * element actually starts below the fold — then reveal it when it scrolls in.
 * If any of those aren't true, the content simply stays visible, so it never
 * ships blank on SSR, headless renders, or for reduced-motion users.
 */
export function Reveal({
  children,
  className,
  style,
}: {
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (!("IntersectionObserver" in window)) return;

    // Only animate content that starts below the fold; on-screen content stays
    // put (avoids a hide-then-show flash on first paint).
    if (el.getBoundingClientRect().top < window.innerHeight * 0.85) return;

    el.dataset.armed = "true";
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            el.dataset.visible = "true";
            io.unobserve(el);
          }
        }
      },
      { threshold: 0.2 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div ref={ref} className={["reveal", className].filter(Boolean).join(" ")} style={style}>
      {children}
    </div>
  );
}
