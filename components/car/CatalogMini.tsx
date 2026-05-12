"use client";

import { useState } from "react";
import { Icon } from "@/components/ui/Icons";
import Link from "next/link";
import { LeadModal } from "@/components/forms/LeadModal";

const cars = [
  { id: 1, slug: "camry-sport-plus-1", name: "Toyota Camry IX", trim: "Sport PLUS · Без НДС", year: 2025, price: 5100000, monthly: 126000, tag: "",    img: "/images/cars/car1/camry-1.jpg" },
  { id: 2, slug: "camry-sport-plus-2", name: "Toyota Camry IX", trim: "Sport PLUS · С НДС",   year: 2025, price: 5100000, monthly: 126000, tag: "TOP", img: "/images/cars/car2/1.jpg" },
  { id: 3, slug: "camry-sport-plus-3", name: "Toyota Camry IX", trim: "Sport PLUS · С НДС",   year: 2025, price: 5100000, monthly: 126000, tag: "",    img: "/images/cars/car2/3.jpg" },
  { id: 4, slug: "camry-sport-plus-4", name: "Toyota Camry IX", trim: "Sport PLUS · Без НДС", year: 2025, price: 5100000, monthly: 126000, tag: "",    img: "/images/cars/car1/camry-5.jpg" },
];

const fmt = (v: number) => v.toLocaleString("ru-RU");

type ModalCar = { name: string; trim: string; price: number; img: string; slug: string };

export function CatalogMini() {
  const [modalCar, setModalCar] = useState<ModalCar | null>(null);

  return (
    <section className="section catalog-mini" id="catalog">
      <div className="container">
        <div className="catalog-mini__head">
          <div className="reveal">
            <h2 className="section-title">
              Toyota Camry IX <span className="o">(XV80)</span> — 6 авто в наличии
            </h2>
          </div>
          <div className="catalog-mini__head-right reveal reveal-delay-1">
            <p>
              2025 год, China Market, 2.0 Гибрид 197 л.с., CVT, передний привод. Новые, пробег до 5 км. Прямая поставка, ЭПТС, полное оформление.
            </p>
            <Link href="/catalog" className="catalog-mini__all">
              Перейти к каталогу
              <Icon.Arrow />
            </Link>
          </div>
        </div>

        <div className="catalog-mini__grid reveal">
          {cars.map((c, i) => (
            <article key={c.id} className="cmcard">
              <div className="cmcard__media">
                <img src={c.img} alt={c.name} draggable={false} />
                {c.tag && <span className="cmcard__tag mono">{c.tag}</span>}
              </div>
              <div className="cmcard__body">
                <div className="cmcard__row">
                  <h3 className="cmcard__title">{c.name}</h3>
                  <span className="cmcard__year mono">{c.year}</span>
                </div>
                <div className="cmcard__sub mono">{c.trim}</div>
                <div className="cmcard__price">
                  <span className="cmcard__price-v">от {fmt(c.price)} ₽</span>
                  <span className="cmcard__price-m mono">{fmt(c.monthly)} ₽/мес</span>
                </div>
              </div>
              <div className="cmcard__actions">
                <Link href={`/catalog/${c.slug}`} className="cmcard__btn-detail">
                  Подробнее <Icon.Arrow />
                </Link>
                <button
                  type="button"
                  className="cmcard__btn-cta"
                  onClick={() => setModalCar({ name: c.name, trim: c.trim, price: c.price, img: c.img, slug: c.slug })}
                >
                  Оставить заявку
                </button>
                <Link href={`/testdrive?car=${c.slug}`} className="cmcard__btn-td">
                  Тест-драйв
                </Link>
              </div>
            </article>
          ))}
        </div>

        <div className="catalog-mini__footer reveal">
          <Link href="/catalog" className="btn btn--primary catalog-mini__big-cta">
            <span>Все 6 автомобилей в наличии</span>
            <Icon.Arrow />
          </Link>
          <span className="catalog-mini__hint mono">наличие подтверждается менеджером</span>
        </div>
      </div>

      {modalCar && <LeadModal car={modalCar} onClose={() => setModalCar(null)} />}
    </section>
  );
}
