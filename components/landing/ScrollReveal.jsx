"use client";

/**
 * ScrollReveal — wraps any section and fades+slides it in when it enters the viewport.
 * Usage: <ScrollReveal delay={0.1}><YourSection /></ScrollReveal>
 */
import { useEffect, useRef, useState } from "react";

export default function ScrollReveal({
  children,
  delay = 0,
  distance = 32,        // px to slide from
  direction = "up",     // "up" | "down" | "left" | "right"
  className = "",
  style = {},
}) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.unobserve(el); // fire once
        }
      },
      { threshold: 0.08, rootMargin: "0px 0px -40px 0px" }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const offsetMap = {
    up:    { transform: visible ? "translateY(0)" : `translateY(${distance}px)` },
    down:  { transform: visible ? "translateY(0)" : `translateY(-${distance}px)` },
    left:  { transform: visible ? "translateX(0)" : `translateX(${distance}px)` },
    right: { transform: visible ? "translateX(0)" : `translateX(-${distance}px)` },
  };

  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: visible ? 1 : 0,
        ...offsetMap[direction],
        transition: `opacity 0.7s cubic-bezier(0.4,0,0.2,1) ${delay}s, transform 0.7s cubic-bezier(0.4,0,0.2,1) ${delay}s`,
        ...style,
      }}
    >
      {children}
    </div>
  );
}