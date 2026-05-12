"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

interface BannerSettings {
  bannerEnabled?: boolean;
  bannerBadge?: string;
  bannerText?: string;
  bannerLink?: string;
  bannerButtonText?: string;
}

export function ToyotaBanner() {
  const [hidden, setHidden] = useState(false);
  const [cfg, setCfg] = useState<BannerSettings>({
    bannerEnabled: true,
    bannerBadge: "В наличии",
    bannerText: "6 автомобилей Toyota Camry IX (XV80) — 2025 год, гибрид, от 5 100 000 ₽",
    bannerLink: "/catalog",
    bannerButtonText: "Смотреть каталог",
  });

  useEffect(() => {
    fetch("/api/settings")
      .then((r) => r.json())
      .then((s: BannerSettings) => setCfg((prev) => ({ ...prev, ...s })))
      .catch(() => {});
  }, []);

  useEffect(() => {
    const onScroll = () => setHidden(window.scrollY > 30);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  if (!cfg.bannerEnabled) return null;

  return (
    <div className={`toyota-banner ${hidden ? "is-hidden" : ""}`}>
      <div className="container toyota-banner__inner">
        <div className="toyota-banner__content">
          {cfg.bannerBadge && <div className="toyota-banner__badge mono">{cfg.bannerBadge}</div>}
          <div className="toyota-banner__text">
            <strong>{cfg.bannerText}</strong>
          </div>
        </div>
        <Link href={cfg.bannerLink || "/catalog"} className="toyota-banner__btn">
          {cfg.bannerButtonText || "Смотреть каталог"}
          <svg width="14" height="10" viewBox="0 0 16 12" fill="none">
            <path d="M9 1l5 5-5 5M14 6H2" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </Link>
      </div>
    </div>
  );
}
