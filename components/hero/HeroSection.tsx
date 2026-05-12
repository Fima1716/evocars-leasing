"use client";

import { useState } from "react";
import { Icon } from "@/components/ui/Icons";

const cars = [
  { brand: "TOYOTA CAMRY IX", year: "2025", price: "5 100 000 ₽", volume: "2.0 Гибрид", trim: "Sport PLUS" },
];

export function HeroSection() {
  const [idx, setIdx] = useState(0);
  const car = cars[idx];
  const next = () => setIdx((idx + 1) % cars.length);
  const prev = () => setIdx((idx - 1 + cars.length) % cars.length);

  return (
    <section className="hero">
      <div className="hero__grid-bg" />
      <div className="hero__glow" />

      <div className="container hero__inner">
        <div className="hero__left">
          <h1 className="hero__title">
            Автомобили для<br className="hide-narrow" /> бизнеса премиум<br className="hide-narrow" /> класса<br className="hide-narrow" />
            <span className="o">&mdash; до&nbsp;23%</span> экономии<br className="hide-narrow" /> на&nbsp;налогах
          </h1>
          <p className="hero__lede">
            Поставка, оформление и&nbsp;сопровождение автомобилей в&nbsp;лизинг для&nbsp;юридических лиц и&nbsp;ИП. Прозрачные условия, индивидуальные графики платежей, фиксированная стоимость в&nbsp;договоре.
          </p>
        </div>

        <div className="hero__right">
          <aside className="hero__card">
            <div className="hero__card-head">
              <div className="hero__card-brand">{car.brand}</div>
              <div className="hero__card-year mono">{car.year}</div>
            </div>
            <div className="hero__card-price">{car.price}</div>
            <div className="hero__card-tags">
              <span className="hero__chip">{car.volume}</span>
              <span className="hero__chip">{car.trim}</span>
            </div>
            <a href="#catalog" className="hero__card-more">
              Подробнее
              <Icon.Arrow />
            </a>
          </aside>
        </div>
      </div>

      <div className="hero__stage">
        <div className="hero__platform" aria-hidden="true">
          <div className="hero__platform-glow" />
        </div>
        <div className="hero__smoke" aria-hidden="true" />
        <img className="hero__car" src="/images/cars/camry-cutout.png" alt="Toyota Camry IX" draggable={false} />
      </div>

      <div className="container">
        <div className="hero__bar">
          <a href="#calc" className="btn btn--primary hero__bar-cta">
            Рассчитать стоимость
          </a>
          <p className="hero__bar-text">
            Прямые контракты с&nbsp;дилерами и&nbsp;дистрибьюторами. Фиксированная цена и&nbsp;сроки поставки.
          </p>
          <div className="hero__bar-nav">
            <button className="hero__nav-btn" onClick={prev} aria-label="Предыдущий">
              <svg width="18" height="14" viewBox="0 0 18 14" fill="none"><path d="M7 1L1 7L7 13M1 7H17" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/></svg>
            </button>
            <button className="hero__nav-btn" onClick={next} aria-label="Следующий">
              <svg width="18" height="14" viewBox="0 0 18 14" fill="none"><path d="M11 1L17 7L11 13M17 7H1" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/></svg>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
