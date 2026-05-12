"use client";

import { useState, useEffect, useCallback } from "react";

export function Preloader() {
  const [progress, setProgress] = useState(0);
  const [done, setDone] = useState(false);
  const [hidden, setHidden] = useState(false);

  const animate = useCallback(() => {
    const start = performance.now();
    const DURATION = 2800;
    let raf: number;

    const tick = (t: number) => {
      const k = Math.min(1, (t - start) / DURATION);
      const eased = k < 0.7
        ? (k / 0.7) * (k / 0.7) * 0.9
        : 0.9 + (1 - Math.pow(1 - (k - 0.7) / 0.3, 2)) * 0.1;
      setProgress(Math.round(Math.min(eased, 1) * 100));

      if (k < 1) {
        raf = requestAnimationFrame(tick);
      } else {
        setProgress(100);
        setDone(true);
        document.body.style.removeProperty("overflow");
        setTimeout(() => setHidden(true), 700);
      }
    };
    raf = requestAnimationFrame(tick);
    document.body.style.overflow = "hidden";
    return () => {
      cancelAnimationFrame(raf);
      document.body.style.removeProperty("overflow");
    };
  }, []);

  useEffect(() => {
    return animate();
  }, [animate]);

  if (hidden) return null;

  const cx = 200, cy = 210, R = 150;
  const startAngle = 225;
  const sweep = 270;
  const toRad = (deg: number) => (deg * Math.PI) / 180;

  const arcPath = (from: number, to: number, r: number) => {
    const x1 = cx + r * Math.cos(toRad(from));
    const y1 = cy - r * Math.sin(toRad(from));
    const x2 = cx + r * Math.cos(toRad(to));
    const y2 = cy - r * Math.sin(toRad(to));
    const diff = Math.abs(from - to);
    return `M ${x1} ${y1} A ${r} ${r} 0 ${diff > 180 ? 1 : 0} 1 ${x2} ${y2}`;
  };

  const bgArc = arcPath(startAngle, startAngle - sweep, R);
  const progressEnd = startAngle - (progress / 100) * sweep;
  const progressArcPath = progress > 0 ? arcPath(startAngle, progressEnd, R) : "";

  // Needle
  const needleAngle = toRad(startAngle - (progress / 100) * sweep);
  const needleLen = R - 30;
  const nx = cx + needleLen * Math.cos(needleAngle);
  const ny = cy - needleLen * Math.sin(needleAngle);

  // Major ticks
  const majorTicks = Array.from({ length: 11 }, (_, i) => {
    const pct = i / 10;
    const angle = toRad(startAngle - pct * sweep);
    const r1 = R + 4;
    const r2 = R + 18;
    const labelR = R + 30;
    return {
      x1: cx + r1 * Math.cos(angle), y1: cy - r1 * Math.sin(angle),
      x2: cx + r2 * Math.cos(angle), y2: cy - r2 * Math.sin(angle),
      reached: pct <= progress / 100,
      label: Math.round(pct * 100),
      lx: cx + labelR * Math.cos(angle), ly: cy - labelR * Math.sin(angle),
    };
  });

  // Minor ticks
  const minorTicks = Array.from({ length: 51 }, (_, i) => {
    if (i % 5 === 0) return null;
    const pct = i / 50;
    const angle = toRad(startAngle - pct * sweep);
    const r1 = R + 4;
    const r2 = R + 10;
    return {
      x1: cx + r1 * Math.cos(angle), y1: cy - r1 * Math.sin(angle),
      x2: cx + r2 * Math.cos(angle), y2: cy - r2 * Math.sin(angle),
      reached: pct <= progress / 100,
    };
  }).filter(Boolean) as { x1: number; y1: number; x2: number; y2: number; reached: boolean }[];

  return (
    <div className={"preloader" + (done ? " is-done" : "")} style={{ background: "#ffffff" }}>
      <div style={{ display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", height: "100%", width: "100%" }}>
        {/* Logo badge */}
        <div style={{
          background: "#0e1726",
          borderRadius: 16,
          padding: "14px 24px",
          marginBottom: 32,
          boxShadow: "0 4px 24px rgba(14,23,38,0.15)",
        }}>
          <img
            src="/images/logo.png"
            alt="EVOCARS"
            style={{ width: 110, display: "block" }}
            draggable={false}
          />
        </div>

        <div style={{ position: "relative", width: 420, maxWidth: "90vw" }}>
          <svg viewBox="0 0 400 320" style={{ width: "100%", height: "auto" }}>
            <defs>
              <filter id="preloader-blur">
                <feGaussianBlur in="SourceGraphic" stdDeviation="4" />
              </filter>
            </defs>

            {/* Background arcs */}
            <path d={bgArc} fill="none" stroke="rgba(0,0,0,0.06)" strokeWidth="12" strokeLinecap="round" />
            <path d={bgArc} fill="none" stroke="rgba(0,0,0,0.08)" strokeWidth="3" strokeLinecap="round" />

            {/* Progress glow */}
            {progress > 0 && (
              <path d={progressArcPath} fill="none" stroke="var(--orange)" strokeWidth="14" strokeLinecap="round"
                style={{ filter: "url(#preloader-blur)", opacity: 0.3 }}
              />
            )}
            {/* Progress arc */}
            {progress > 0 && (
              <path d={progressArcPath} fill="none" stroke="var(--orange)" strokeWidth="6" strokeLinecap="round" />
            )}

            {/* Minor ticks */}
            {minorTicks.map((t, i) => (
              <line key={`m${i}`} x1={t.x1} y1={t.y1} x2={t.x2} y2={t.y2}
                stroke={t.reached ? "rgba(251,191,36,0.6)" : "rgba(0,0,0,0.1)"}
                strokeWidth="1"
                strokeLinecap="round"
              />
            ))}

            {/* Major ticks + labels */}
            {majorTicks.map((t, i) => (
              <g key={`M${i}`}>
                <line x1={t.x1} y1={t.y1} x2={t.x2} y2={t.y2}
                  stroke={t.reached ? "var(--orange)" : "rgba(0,0,0,0.15)"}
                  strokeWidth="2.5"
                  strokeLinecap="round"
                />
                <text x={t.lx} y={t.ly + 4}
                  textAnchor="middle"
                  fill={t.reached ? "rgba(0,0,0,0.6)" : "rgba(0,0,0,0.2)"}
                  fontSize="9"
                  fontFamily="'Geist Mono', ui-monospace, monospace"
                  fontWeight="500"
                >
                  {t.label}
                </text>
              </g>
            ))}

            {/* Needle shadow */}
            <line x1={cx} y1={cy} x2={nx} y2={ny}
              stroke="rgba(0,0,0,0.1)" strokeWidth="3" strokeLinecap="round"
              style={{ filter: "blur(3px)" }}
            />
            {/* Needle */}
            <line x1={cx} y1={cy} x2={nx} y2={ny}
              stroke="#1a1a2e" strokeWidth="2" strokeLinecap="round"
            />
            {/* Needle tip */}
            <circle cx={nx} cy={ny} r="4" fill="var(--orange)"
              style={{ filter: "drop-shadow(0 0 8px rgba(251,191,36,0.6))" }}
            />

            {/* Hub */}
            <circle cx={cx} cy={cy} r="12" fill="#fff" stroke="rgba(0,0,0,0.1)" strokeWidth="1.5" />
            <circle cx={cx} cy={cy} r="4" fill="var(--orange)" />
          </svg>
        </div>

        {/* Progress number below */}
        <div style={{
          marginTop: -20,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 8,
        }}>
          <div style={{
            fontFamily: "'Geist Mono', ui-monospace, monospace",
            fontSize: 56,
            fontWeight: 600,
            color: "#1a1a2e",
            letterSpacing: "-0.04em",
            lineHeight: 1,
          }}>
            {progress}
            <span style={{ fontSize: 22, color: "rgba(0,0,0,0.3)", marginLeft: 2 }}>%</span>
          </div>
        </div>
      </div>
    </div>
  );
}
