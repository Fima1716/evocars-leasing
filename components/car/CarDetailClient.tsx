"use client";

import { useState } from "react";
import Link from "next/link";
import type { CarData } from "@/lib/cars-data";
import { Icon } from "@/components/ui/Icons";
import { PhoneInput } from "@/components/ui/PhoneInput";
import { getRefParams } from "@/components/ux/VisitTracker";

const fmt = (v: number) => v.toLocaleString("ru-RU");

export function CarDetailClient({ car }: { car: CarData }) {
  const images = car.gallery.length > 0 ? car.gallery : [car.img];
  const [activeImg, setActiveImg] = useState(0);
  const [formSent, setFormSent] = useState(false);
  const [phone, setPhone] = useState("");
  const [name, setName] = useState("");

  const submitLead = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!phone) return;
    try {
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: name || "—", phone, source: "WEBSITE", carId: `${car.name} ${car.trim}`.trim(), message: `/catalog/${car.slug}`, ...getRefParams() }),
      });
      if (!res.ok) console.error("[Lead] Error:", res.status, await res.text());
    } catch (err) {
      console.error("[Lead] Network error:", err);
    }
    setFormSent(true);
  };

  return (
    <div className="container" style={{ paddingBottom: 80 }}>
      <div className="cd">
        {/* Left: gallery */}
        <div className="cd__gallery">
          <div className="cd__main-img">
            <img src={images[activeImg]} alt={car.name} draggable={false} />
            {car.tag && <span className="cd__tag mono">{car.tag}</span>}
            <span className="cd__counter mono">{activeImg + 1} / {images.length}</span>
            {images.length > 1 && (
              <>
                <button className="cd__nav cd__nav--prev" onClick={() => setActiveImg(i => (i - 1 + images.length) % images.length)} aria-label="Назад">
                  <svg width="18" height="14" viewBox="0 0 18 14" fill="none"><path d="M7 1L1 7L7 13M1 7H17" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/></svg>
                </button>
                <button className="cd__nav cd__nav--next" onClick={() => setActiveImg(i => (i + 1) % images.length)} aria-label="Далее">
                  <svg width="18" height="14" viewBox="0 0 18 14" fill="none"><path d="M11 1L17 7L11 13M17 7H1" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/></svg>
                </button>
              </>
            )}
          </div>
          {images.length > 1 && (
            <div className="cd__thumbs">
              {images.map((src, i) => (
                <button key={i} className={`cd__thumb ${i === activeImg ? "is-active" : ""}`} onClick={() => setActiveImg(i)}>
                  <img src={src} alt="" draggable={false} />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right: info */}
        <div className="cd__info">
          <div className="cd__badges">
            {car.features.map(f => (
              <span key={f} className="cd__badge">{f}</span>
            ))}
          </div>

          <h1 className="cd__title">{car.name}</h1>
          <div className="cd__sub mono">{car.trim} · {car.year} · {car.color}</div>

          <div className="cd__price-row">
            <div className="cd__price">{fmt(car.price)} ₽</div>
            <div className="cd__monthly mono">от {fmt(car.monthly)} ₽/мес</div>
          </div>

          {/* Quick specs */}
          <div className="cd__quick">
            {[
              { l: "Двигатель", v: `${car.engine} · ${car.fuel}` },
              { l: "Мощность", v: `${car.power} л.с.` },
              { l: "КПП", v: car.tx },
              { l: "Привод", v: car.drive },
              { l: "Кузов", v: car.body },
              { l: "Пробег", v: `${car.mileage} км` },
            ].map(s => (
              <div key={s.l} className="cd__quick-item">
                <span className="cd__quick-label mono">{s.l}</span>
                <span className="cd__quick-value">{s.v}</span>
              </div>
            ))}
          </div>

          {/* CTA form */}
          {formSent ? (
            <div className="cd__sent">
              <span style={{ fontSize: 24 }}>&#10003;</span>
              <div>
                <div style={{ fontWeight: 500 }}>Заявка принята</div>
                <div style={{ fontSize: 14, color: "var(--ink-2)", marginTop: 4 }}>Перезвоним в течение 15 минут</div>
              </div>
            </div>
          ) : (
            <form className="cd__form" onSubmit={submitLead}>
              <input type="text" placeholder="Ваше имя" value={name} onChange={e => setName(e.target.value)} className="cd__input" />
              <PhoneInput placeholder="+7 (___) ___-__-__" required value={phone} onChange={setPhone} className="cd__input" />
              <button type="submit" className="cd__submit">
                Получить предложение <Icon.Arrow />
              </button>
            </form>
          )}

          <Link href={`/testdrive?car=${car.slug}`} className="cmcard__btn-td" style={{ marginTop: 12, display: "inline-flex", padding: "12px 20px", fontSize: 14 }}>
            Записаться на тест-драйв
          </Link>

          {car.kpFile && (
            <a href={car.kpFile} target="_blank" rel="noopener noreferrer" className="cd__kp-btn">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M8 2v8m0 0l-3-3m3 3l3-3M3 12h10" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/></svg>
              Скачать КП (PDF)
            </a>
          )}

          {car.autoruUrl && (
            <a href={car.autoruUrl} target="_blank" rel="noopener noreferrer" className="cd__autoru mono">
              Смотреть на Авто.ру <Icon.Arrow />
            </a>
          )}
        </div>
      </div>

      {/* Full specs table */}
      {Object.keys(car.specs).length > 0 && (
        <div className="cd__specs-section">
          <h2 style={{ fontSize: 22, fontWeight: 500, marginBottom: 24 }}>Характеристики</h2>
          <div className="cd__specs-grid">
            {Object.entries(car.specs).map(([k, v]) => (
              <div key={k} className="cd__spec-row">
                <span className="cd__spec-key">{k}</span>
                <span className="cd__spec-dots" />
                <span className="cd__spec-val">{v}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Description */}
      {car.description && (
        <div style={{ marginTop: 48, maxWidth: 720 }}>
          <h2 style={{ fontSize: 22, fontWeight: 500, marginBottom: 16 }}>Описание</h2>
          <p style={{ fontSize: 16, lineHeight: 1.65, color: "var(--ink-2)" }}>{car.description}</p>
        </div>
      )}
    </div>
  );
}
