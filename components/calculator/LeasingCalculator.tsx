"use client";

import { useState, useEffect } from "react";
import { Icon } from "@/components/ui/Icons";
import { PhoneInput } from "@/components/ui/PhoneInput";
import { getRefParams } from "@/components/ux/VisitTracker";

interface CalcSettings {
  annualRate: number;
  minDown: number;
  maxDown: number;
  terms: number[];
  defaultTerm: number;
  defaultDown: number;
  minPrice: number;
  maxPrice: number;
  priceStep: number;
  defaultPrice: number;
}

const DEFAULTS: CalcSettings = {
  annualRate: 15, minDown: 10, maxDown: 49,
  terms: [12, 24, 36, 48, 60], defaultTerm: 36, defaultDown: 20,
  minPrice: 3000000, maxPrice: 8000000, priceStep: 50000, defaultPrice: 5200000,
};

export function LeasingCalculator() {
  const [cfg, setCfg] = useState<CalcSettings>(DEFAULTS);
  const [price, setPrice] = useState(DEFAULTS.defaultPrice);
  const [down, setDown] = useState(DEFAULTS.defaultDown);
  const [term, setTerm] = useState(DEFAULTS.defaultTerm);
  const [showModal, setShowModal] = useState(false);
  const [enabled, setEnabled] = useState(true);

  useEffect(() => {
    fetch("/api/settings")
      .then((r) => r.json())
      .then((s: CalcSettings & { calculatorEnabled?: boolean }) => {
        setCfg(s);
        setPrice(s.defaultPrice);
        setDown(s.defaultDown);
        setTerm(s.defaultTerm);
        if (s.calculatorEnabled === false) setEnabled(false);
      })
      .catch(() => {});
  }, []);

  if (!enabled) return null;

  const rate = cfg.annualRate / 100;
  const downAmount = Math.round(price * down / 100);
  const principal = price - downAmount;
  const r = rate / 12;
  const n = term;
  const monthly = r > 0 ? Math.round(principal * (r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1)) : Math.round(principal / n);
  const total = monthly * n + downAmount;
  const overpay = total - price;

  const fmt = (v: number) => v.toLocaleString("ru-RU");

  const radius = 90;
  const circumference = 2 * Math.PI * radius;
  const paidRatio = price / total;
  const offset = circumference * (1 - paidRatio);

  return (
    <section className="section calc-section" id="calc">
      <div className="calc-road" aria-hidden="true">
        <div className="calc-road__lane">
          {Array.from({ length: 14 }).map((_, i) => <span key={i} className="calc-road__dash" />)}
        </div>
        <div className="calc-road__lane calc-road__lane--alt">
          {Array.from({ length: 14 }).map((_, i) => <span key={i} className="calc-road__dash" />)}
        </div>
      </div>

      <div className="container">
        <div className="section__head">
          <h2 className="section-title reveal reveal-delay-1">
            Рассчитайте платёж <span className="o">за 30 секунд</span>
          </h2>
        </div>

        <div className="calc reveal">
          <div className="calc__left">
            <div className="calc__row">
              <div className="calc__row-head">
                <span>Стоимость авто</span>
                <b className="mono">{fmt(price)} ₽</b>
              </div>
              <input
                className="calc__slider"
                type="range" min={cfg.minPrice} max={cfg.maxPrice} step={cfg.priceStep}
                value={price}
                style={{ "--p": `${((price - cfg.minPrice) / (cfg.maxPrice - cfg.minPrice)) * 100}%` } as React.CSSProperties}
                onChange={(e) => setPrice(+e.target.value)}
              />
              <div className="calc__ticks"><span>{fmt(cfg.minPrice)} ₽</span><span>{fmt(cfg.maxPrice)} ₽</span></div>
            </div>

            <div className="calc__row">
              <div className="calc__row-head">
                <span>Аванс</span>
                <b className="mono">{down}% &middot; {fmt(downAmount)} ₽</b>
              </div>
              <input
                className="calc__slider"
                type="range" min={cfg.minDown} max={cfg.maxDown} step={1}
                value={down}
                style={{ "--p": `${((down - cfg.minDown) / (cfg.maxDown - cfg.minDown)) * 100}%` } as React.CSSProperties}
                onChange={(e) => setDown(+e.target.value)}
              />
              <div className="calc__ticks"><span>{cfg.minDown}%</span><span>{cfg.maxDown}%</span></div>
            </div>

            <div className="calc__row">
              <div className="calc__row-head">
                <span>Срок лизинга</span>
                <b className="mono">{term} мес.</b>
              </div>
              <div className="calc__choices">
                {cfg.terms.map((t) => (
                  <button key={t} className={`calc__chip ${term === t ? "is-active" : ""}`} onClick={() => setTerm(t)}>
                    {t} мес
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="calc__right">
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", position: "relative", margin: "0 auto", width: 220, height: 220 }}>
              <svg viewBox="0 0 220 220" width="220" height="220">
                <circle cx="110" cy="110" r={radius} fill="none"
                  stroke="rgba(244,245,247,0.07)" strokeWidth="14"
                  transform="rotate(-90 110 110)"
                />
                <circle cx="110" cy="110" r={radius} fill="none"
                  stroke="rgba(244,245,247,0.15)" strokeWidth="14"
                  strokeDasharray={circumference}
                  strokeDashoffset={0}
                  strokeLinecap="round"
                  transform="rotate(-90 110 110)"
                />
                <circle cx="110" cy="110" r={radius} fill="none"
                  stroke="var(--orange)" strokeWidth="14"
                  strokeDasharray={circumference}
                  strokeDashoffset={offset}
                  strokeLinecap="round"
                  transform="rotate(-90 110 110)"
                  style={{ transition: "stroke-dashoffset 600ms cubic-bezier(.2,.9,.3,1)" }}
                />
              </svg>
              <div style={{ position: "absolute", textAlign: "center" }}>
                <div style={{ fontFamily: "var(--mono)", fontSize: 10, letterSpacing: "0.18em", textTransform: "uppercase", color: "var(--ink-3)" }}>
                  ₽ / месяц
                </div>
                <div className="mono" style={{ fontSize: 32, fontWeight: 500, letterSpacing: "-0.025em", lineHeight: 1, color: "var(--ink)", marginTop: 4, transition: "all 300ms ease" }}>
                  {fmt(monthly)}
                </div>
                <div style={{ fontFamily: "var(--mono)", fontSize: 10, color: "var(--ink-3)", marginTop: 6 }}>
                  {cfg.annualRate}% годовых
                </div>
              </div>
            </div>

            <div className="calc__breakdown">
              <div className="calc__bd"><span className="l">Аванс</span><span className="v mono">{fmt(downAmount)} ₽</span></div>
              <div className="calc__bd"><span className="l">Переплата</span><span className="v mono">{fmt(overpay)} ₽</span></div>
              <div className="calc__bd"><span className="l">Сумма договора</span><span className="v mono">{fmt(total)} ₽</span></div>
              <div className="calc__bd"><span className="l">Срок</span><span className="v mono">{term} мес.</span></div>
            </div>

            <button type="button" className="btn btn--primary calc__cta" onClick={() => setShowModal(true)}>
              Зафиксировать условия
              <Icon.Arrow />
            </button>
          </div>
        </div>
      </div>

      {showModal && (
        <CalcModal
          price={price} down={down} term={term} monthly={monthly}
          downAmount={downAmount} total={total}
          onClose={() => setShowModal(false)}
        />
      )}
    </section>
  );
}

function CalcModal({ price, down, term, monthly, downAmount, total, onClose }: {
  price: number; down: number; term: number; monthly: number;
  downAmount: number; total: number; onClose: () => void;
}) {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [sent, setSent] = useState(false);
  const [sending, setSending] = useState(false);
  const fmt = (v: number) => v.toLocaleString("ru-RU");

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!phone) return;
    setSending(true);
    try {
      await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name || "—", phone, source: "CALCULATOR",
          calcTerm: term, calcDown: down, calcPayment: monthly,
          message: `Расчёт: ${fmt(price)} ₽, аванс ${down}% (${fmt(downAmount)} ₽), ${term} мес., платёж ${fmt(monthly)} ₽/мес`,
          ...getRefParams(),
        }),
      });
      setSent(true);
    } catch {
      alert("Ошибка сети. Позвоните: +7 495 150-05-45");
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="exit-overlay" onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="exit-popup" style={{ maxWidth: 480 }}>
        <button className="exit-popup__close" onClick={onClose} aria-label="Закрыть">
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path d="M4 4l12 12M4 16L16 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
        </button>

        {sent ? (
          <div style={{ textAlign: "center", padding: "20px 0" }}>
            <div style={{ fontSize: 32, marginBottom: 16 }}>&#10003;</div>
            <h3 style={{ fontSize: 22, fontWeight: 500 }}>Условия зафиксированы!</h3>
            <p style={{ color: "var(--ink-2)", marginTop: 8, fontSize: 15 }}>
              Менеджер перезвонит в течение 1 часа и подготовит КП
            </p>
          </div>
        ) : (
          <>
            <h3 style={{ fontSize: 20, fontWeight: 500, letterSpacing: "-0.02em" }}>
              Зафиксировать условия
            </h3>

            <div style={{ padding: "14px 18px", background: "color-mix(in oklab, var(--orange) 8%, transparent)", border: "1px solid color-mix(in oklab, var(--orange) 20%, transparent)", borderRadius: 12, display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px 16px", fontSize: 13 }}>
              <div><span style={{ color: "var(--ink-3)" }}>Стоимость</span><br/><b>{fmt(price)} ₽</b></div>
              <div><span style={{ color: "var(--ink-3)" }}>Аванс</span><br/><b>{down}% · {fmt(downAmount)} ₽</b></div>
              <div><span style={{ color: "var(--ink-3)" }}>Срок</span><br/><b>{term} мес.</b></div>
              <div><span style={{ color: "var(--ink-3)" }}>Платёж</span><br/><b style={{ color: "var(--orange)" }}>{fmt(monthly)} ₽/мес</b></div>
            </div>

            <form onSubmit={submit} style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              <input
                type="text" placeholder="Ваше имя" value={name}
                onChange={(e) => setName(e.target.value)}
                className="exit-popup__input"
              />
              <PhoneInput
                placeholder="+7 (___) ___-__-__" value={phone}
                onChange={setPhone} required className="exit-popup__input"
              />
              <button type="submit" className="exit-popup__submit" disabled={sending}>
                {sending ? "Отправка..." : "Зафиксировать и получить КП"}
              </button>
            </form>
            <span className="exit-popup__legal mono">
              Нажимая кнопку, вы принимаете политику обработки данных
            </span>
          </>
        )}
      </div>
    </div>
  );
}
