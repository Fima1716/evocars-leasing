"use client";

import { useState, useEffect, useRef } from "react";

export function ScrollToTop() {
  const [displayPct, setDisplayPct] = useState(0);
  const [visible, setVisible] = useState(false);
  const targetPct = useRef(0);
  const currentPct = useRef(0);
  const raf = useRef(0);

  useEffect(() => {
    const onScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      targetPct.current = docHeight > 0 ? Math.min(scrollTop / docHeight, 1) : 0;
      setVisible(scrollTop > 400);
    };

    const animate = () => {
      const diff = targetPct.current - currentPct.current;
      // Lerp towards target
      currentPct.current += diff * 0.08;
      // Snap if close enough
      if (Math.abs(diff) < 0.001) currentPct.current = targetPct.current;
      setDisplayPct(currentPct.current);
      raf.current = requestAnimationFrame(animate);
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    raf.current = requestAnimationFrame(animate);
    return () => {
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(raf.current);
    };
  }, []);

  const R = 22;
  const circumference = 2 * Math.PI * R;
  const offset = circumference * (1 - displayPct);

  return (
    <button
      type="button"
      className={`scroll-top ${visible ? "is-visible" : ""}`}
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      aria-label="Наверх"
    >
      <svg className="scroll-top__ring" viewBox="0 0 52 52">
        <circle cx="26" cy="26" r={R} fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="3" />
        <circle cx="26" cy="26" r={R} fill="none"
          stroke="var(--orange)" strokeWidth="3"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          transform="rotate(-90 26 26)"
        />
      </svg>
      <svg className="scroll-top__arrow" width="16" height="16" viewBox="0 0 16 16" fill="none">
        <path d="M8 12V4M8 4L4 8M8 4l4 4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    </button>
  );
}
