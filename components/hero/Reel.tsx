"use client";

import { useRef, useEffect, useState } from "react";
import { Icon } from "@/components/ui/Icons";

export function Reel() {
  const ref = useRef<HTMLElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const m = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(m.matches);
    const onChange = () => setReduced(m.matches);
    m.addEventListener?.("change", onChange);
    return () => m.removeEventListener?.("change", onChange);
  }, []);

  useEffect(() => {
    const v = videoRef.current;
    const el = ref.current;
    if (!v || !el) return;
    if (reduced) { v.pause(); return; }
    const io = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) v.play().catch(() => {});
        else v.pause();
      });
    }, { threshold: 0.15 });
    io.observe(el);
    return () => io.disconnect();
  }, [reduced]);

  return (
    <section className="reel" ref={ref} aria-label="Toyota Camry IX в движении">
      <div className="reel__video-wrap">
        <video
          ref={videoRef}
          className="reel__video"
          src="/images/cars/camry-reel.mp4"
          muted
          loop
          playsInline
          preload="metadata"
          aria-hidden="true"
        />
        <div className="reel__scrim" aria-hidden="true" />
      </div>

      <div className="reel__inner container">
        {/* Left: specs panel */}
        <div className="reel__specs-panel">
          <h2 className="reel__model">Toyota Camry IX</h2>
          <div className="reel__gen mono">XV80 · 2025 · China Market</div>

          <div className="reel__specs-grid">
            <div className="reel__spec">
              <span className="reel__spec-label mono">Двигатель</span>
              <span className="reel__spec-value">2.0 л · Гибрид</span>
            </div>
            <div className="reel__spec">
              <span className="reel__spec-label mono">Мощность</span>
              <span className="reel__spec-value">197 л.с.</span>
            </div>
            <div className="reel__spec">
              <span className="reel__spec-label mono">КПП</span>
              <span className="reel__spec-value">CVT (вариатор)</span>
            </div>
            <div className="reel__spec">
              <span className="reel__spec-label mono">Привод</span>
              <span className="reel__spec-value">Передний</span>
            </div>
            <div className="reel__spec">
              <span className="reel__spec-label mono">Кузов</span>
              <span className="reel__spec-value">Седан</span>
            </div>
            <div className="reel__spec">
              <span className="reel__spec-label mono">Лизинг от</span>
              <span className="reel__spec-value" style={{ color: "var(--orange)" }}>101 200 ₽/мес</span>
            </div>
          </div>

          <a href="#catalog" className="reel__cta-btn">
            <span>Смотреть в наличии</span>
            <span className="reel__cta-icon"><Icon.Arrow /></span>
          </a>
        </div>
      </div>
    </section>
  );
}
