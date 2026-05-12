"use client";

import { useState } from "react";
import { Icon } from "@/components/ui/Icons";

const segments = [
  {
    id: "legal", tag: "01", title: "Юридическим лицам",
    desc: "Налоговая оптимизация: возврат НДС, отнесение платежей на расходы. До 7 программ финансирования с разными графиками.",
    points: ["От 10% аванс", "До 60 месяцев", "Срок рассмотрения — 1 день"],
    cta: "Условия для ЮЛ",
  },
  {
    id: "ip", tag: "02", title: "Индивидуальным предпринимателям",
    desc: "Минимум документов и быстрое решение. Поддерживаем УСН, ОСНО, ПСН — подберём схему под ваш режим.",
    points: ["Без залога", "Госсубсидии до 10%", "Аванс от 0%"],
    cta: "Условия для ИП",
  },
  {
    id: "private", tag: "03", title: "Физическим лицам",
    desc: "Лизинг без скрытых платежей, фиксированный график. Подходит, если кредит невыгоден или нужен второй автомобиль.",
    points: ["Решение за 1 час", "Скрытый учёт владения", "Свободный пробег"],
    cta: "Условия для ФЛ",
  },
  {
    id: "self", tag: "04", title: "Самозанятым",
    desc: "Автомобиль — рабочий инструмент. Принимаем справку о доходах из «Мой налог», без поручителей и залогов.",
    points: ["Без 2-НДФЛ", "Без поручителей", "Подтверждение онлайн"],
    cta: "Условия для СЗ",
  },
];

export function Segments() {
  const [active, setActive] = useState(0);
  const seg = segments[active];

  return (
    <section className="section seg" id="segments">
      <div className="container">
        <div className="section__head">
          <h2 className="section-title reveal reveal-delay-1">
            Решения для юридических лиц, ИП и&nbsp;частных клиентов
          </h2>
        </div>

        <div className="seg__grid reveal">
          <div className="seg__rail" role="tablist">
            {segments.map((s, i) => (
              <button
                key={s.id}
                role="tab"
                aria-selected={active === i}
                className={`seg__tab ${active === i ? "is-active" : ""}`}
                onClick={() => setActive(i)}
              >
                <span className="seg__tab-num mono">{s.tag}</span>
                <span className="seg__tab-title">{s.title}</span>
                <span className="seg__tab-arrow" aria-hidden="true">
                  <svg width="16" height="12" viewBox="0 0 16 12" fill="none">
                    <path d="M9 1l5 5-5 5M14 6H2" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </span>
              </button>
            ))}
          </div>

          <div className="seg__panel" role="tabpanel" key={seg.id}>
            <div className="seg__panel-tag mono">&mdash; {seg.tag} / 04</div>
            <h3 className="seg__panel-title">{seg.title}</h3>
            <p className="seg__panel-desc">{seg.desc}</p>
            <ul className="seg__points">
              {seg.points.map((p, i) => (
                <li key={i} className="seg__point">
                  <span className="seg__point-bullet" aria-hidden="true"/>
                  <span>{p}</span>
                </li>
              ))}
            </ul>
            <div className="seg__panel-cta">
              <a href="#cta" className="btn btn--primary">
                {seg.cta}
                <Icon.Arrow />
              </a>
              <a href="#calc" className="seg__panel-link">Рассчитать платёж &rarr;</a>
            </div>
            <div className="seg__panel-deco" aria-hidden="true">
              <div className="seg__panel-deco-num">{seg.tag}</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
