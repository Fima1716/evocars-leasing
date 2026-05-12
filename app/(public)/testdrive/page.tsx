"use client";

import { useState, useEffect, Suspense, useMemo } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { PhoneInput } from "@/components/ui/PhoneInput";
import { getRefParams } from "@/components/ux/VisitTracker";

interface Car {
  slug: string;
  brand: string;
  name: string;
  trim: string;
  img: string;
  price: number;
  nds: boolean;
  engine: string;
  power: number;
  tx: string;
  drive: string;
  photos?: string[];
  gallery?: string[];
}

const brandLogos: Record<string, string> = {
  Toyota: "/images/brands/toyota.png",
  BMW: "/images/brands/bmw.png",
  Audi: "/images/brands/audi.png",
  Mercedes: "/images/brands/mercedes.png",
  Lexus: "/images/brands/lexus.png",
  Genesis: "/images/brands/genesis.png",
  Geely: "/images/brands/geely.png",
  Hyundai: "/images/brands/hyundai.png",
  Kia: "/images/brands/kia.png",
  Exeed: "/images/brands/exeed.png",
  Haval: "/images/brands/haval.png",
  Chery: "/images/brands/chery.png",
  Volkswagen: "/images/brands/volkswagen.png",
  Volvo: "/images/brands/volvo.png",
};

const timeSlots = ["09:00", "10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00", "17:00", "18:00", "19:00", "20:00"];

function generateDates() {
  const dates: { label: string; value: string; weekday: string; day: number; disabled: boolean }[] = [];
  const today = new Date();
  for (let i = 1; i <= 21; i++) {
    const d = new Date(today);
    d.setDate(today.getDate() + i);
    const weekday = d.toLocaleDateString("ru-RU", { weekday: "short" });
    const disabled = d.getDay() === 0;
    dates.push({
      label: d.toLocaleDateString("ru-RU", { day: "numeric", month: "short" }),
      value: d.toISOString().slice(0, 10),
      weekday,
      day: d.getDate(),
      disabled,
    });
  }
  return dates;
}

const fmt = (v: number) => v.toLocaleString("ru-RU");

export default function TestDrivePageWrapper() {
  return (
    <Suspense>
      <TestDrivePage />
    </Suspense>
  );
}

function TestDrivePage() {
  const searchParams = useSearchParams();
  const carParam = searchParams.get("car");

  const [cars, setCars] = useState<Car[]>([]);
  const [selectedBrand, setSelectedBrand] = useState<string | null>(null);
  const [selectedCar, setSelectedCar] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [sent, setSent] = useState(false);
  const [sending, setSending] = useState(false);

  // Fetch cars
  useEffect(() => {
    fetch("/api/cars")
      .then((r) => r.json())
      .then((d) => {
        const list = (d.cars || []) as Car[];
        setCars(list);
        // Pre-select from query param
        if (carParam) {
          const found = list.find((c) => c.slug === carParam);
          if (found) {
            setSelectedBrand(found.brand);
            setSelectedCar(found.slug);
          }
        }
        // Default to first brand if nothing selected
        if (!carParam && list.length > 0) {
          const brands = [...new Set(list.map((c) => c.brand))];
          setSelectedBrand(brands[0]);
        }
      })
      .catch(() => {});
  }, [carParam]);

  const brands = useMemo(() => {
    const b = [...new Set(cars.map((c) => c.brand))];
    return b.sort();
  }, [cars]);

  const filteredCars = useMemo(() => {
    if (!selectedBrand) return cars;
    return cars.filter((c) => c.brand === selectedBrand);
  }, [cars, selectedBrand]);

  const dates = generateDates();

  const selectedCarData = cars.find((c) => c.slug === selectedCar);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !phone || !selectedCar) return;
    setSending(true);

    const car = selectedCarData;
    const dateLabel = dates.find((d) => d.value === selectedDate)?.label || "";
    const message = `Авто: ${car?.name} (${car?.trim})\nДата: ${dateLabel || "Не выбрана"}\nВремя: ${selectedTime || "Любое"}`;

    try {
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          phone,
          carId: car?.name || "Тест-драйв",
          message,
          source: "TESTDRIVE",
          ...getRefParams(),
        }),
      });
      if (res.ok) {
        setSent(true);
      } else {
        alert("Ошибка отправки. Позвоните: +7 495 150-05-45");
      }
    } catch {
      alert("Ошибка сети. Позвоните: +7 495 150-05-45");
    } finally {
      setSending(false);
    }
  };

  if (sent) {
    return (
      <div className="td-page">
        <div className="container">
          <div className="td-page__success">
            <div className="td-page__success-icon">
              <svg width="64" height="64" viewBox="0 0 64 64" fill="none"><circle cx="32" cy="32" r="30" stroke="var(--orange)" strokeWidth="2.5"/><path d="M20 33l8 8 16-18" stroke="var(--orange)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
            </div>
            <h2 className="td-page__success-title">Вы записаны на тест-драйв!</h2>
            <p className="td-page__success-text">
              Менеджер свяжется с вами в течение 30 минут для подтверждения времени.
              <br />Звоните: <a href="tel:+74951500545" style={{ color: "var(--orange)" }}>+7 495 150-05-45</a>
            </p>
            <Link href="/" className="btn btn--primary" style={{ marginTop: 24 }}>На главную</Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="td-page">
      <div className="container">
        <div className="td-page__header">
          <h1 className="td-page__title">Онлайн запись на <span className="o">тест-драйв</span></h1>
        </div>

        <div className="td-page__layout-3col">
          {/* Left: brands sidebar */}
          <aside className="td-page__brands">
            {brands.map((b) => (
              <button
                key={b}
                type="button"
                className={`td-page__brand ${selectedBrand === b ? "is-active" : ""}`}
                onClick={() => { setSelectedBrand(b); setSelectedCar(null); }}
              >
                <div className="td-page__brand-logo">
                  {brandLogos[b] ? (
                    <img src={brandLogos[b]} alt={b} draggable={false} />
                  ) : (
                    <span className="td-page__brand-letter">{b[0]}</span>
                  )}
                </div>
                <span className="td-page__brand-name">{b}</span>
              </button>
            ))}
          </aside>

          {/* Center: models */}
          <div className="td-page__models">
            <h2 className="td-page__models-title">Модель</h2>
            <div className="td-page__models-list">
              {filteredCars.map((c) => (
                <div key={c.slug}>
                  <button
                    type="button"
                    className={`td-page__model ${selectedCar === c.slug ? "is-active" : ""}`}
                    onClick={() => setSelectedCar(selectedCar === c.slug ? null : c.slug)}
                  >
                    <div className="td-page__model-img">
                      <img src={c.img || (c.gallery?.[0]) || (c.photos?.[0]) || ""} alt={c.name} draggable={false} />
                    </div>
                    <div className="td-page__model-info">
                      <div className="td-page__model-name">{c.name.replace(c.brand + " ", "")}</div>
                      <div className="td-page__model-spec mono">
                        {c.trim} {c.engine} {c.tx} ({c.power} л.с.)
                      </div>
                      <div className="td-page__model-price mono">
                        {fmt(c.price)} ₽ · {c.nds ? "С НДС" : "Без НДС"}
                      </div>
                    </div>
                    {selectedCar === c.slug && (
                      <div className="td-page__model-check">
                        <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><circle cx="10" cy="10" r="9" stroke="var(--orange)" strokeWidth="1.5"/><path d="M6 10.5l2.5 2.5 5-5.5" stroke="var(--orange)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                      </div>
                    )}
                  </button>

                  {/* Date & time dropdown right under selected car */}
                  {selectedCar === c.slug && (
                    <div className="td-page__datetime-dropdown">
                      <h3 className="td-page__datetime-title">Выберите дату</h3>
                      <div className="td-page__dates">
                        {dates.map((d) => (
                          <button
                            key={d.value}
                            type="button"
                            disabled={d.disabled}
                            className={`td-page__date ${selectedDate === d.value ? "is-active" : ""}`}
                            onClick={() => setSelectedDate(d.value)}
                          >
                            <span className="td-page__date-weekday mono">{d.weekday}</span>
                            <span className="td-page__date-day">{d.day}</span>
                          </button>
                        ))}
                      </div>
                      <h3 className="td-page__datetime-title" style={{ marginTop: 16 }}>Выберите время</h3>
                      <div className="td-page__times">
                        {timeSlots.map((t) => (
                          <button
                            key={t}
                            type="button"
                            className={`td-page__time mono ${selectedTime === t ? "is-active" : ""}`}
                            onClick={() => setSelectedTime(t)}
                          >
                            {t}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
              {filteredCars.length === 0 && (
                <div className="td-page__models-empty">Нет доступных моделей</div>
              )}
            </div>
          </div>

          {/* Right: summary + form */}
          <aside className="td-page__sidebar">
            <div className="td-page__sidebar-sticky">
              <h3 className="td-page__sidebar-title">Выбрано</h3>
              <div className="td-page__tags">
                {selectedBrand && (
                  <span className="td-page__tag">
                    {selectedBrand}
                    <button type="button" onClick={() => { setSelectedBrand(null); setSelectedCar(null); }} className="td-page__tag-x">&times;</button>
                  </span>
                )}
                {selectedCarData && (
                  <span className="td-page__tag">
                    {selectedCarData.name.replace(selectedCarData.brand + " ", "")}
                    <button type="button" onClick={() => setSelectedCar(null)} className="td-page__tag-x">&times;</button>
                  </span>
                )}
                {selectedDate && (
                  <span className="td-page__tag">
                    {dates.find((d) => d.value === selectedDate)?.label}
                    <button type="button" onClick={() => setSelectedDate(null)} className="td-page__tag-x">&times;</button>
                  </span>
                )}
                {selectedTime && (
                  <span className="td-page__tag">
                    {selectedTime}
                    <button type="button" onClick={() => setSelectedTime(null)} className="td-page__tag-x">&times;</button>
                  </span>
                )}
                {!selectedBrand && !selectedCar && !selectedDate && !selectedTime && (
                  <span style={{ fontSize: 13, color: "var(--ink-3)" }}>Ничего не выбрано</span>
                )}
              </div>

              <form className="td-page__form-section" onSubmit={submit}>
                <h3 className="td-page__sidebar-title">Заполните данные</h3>
                <div className="td-page__fields">
                  <input
                    type="text"
                    className="td-page__input"
                    placeholder="ФИО *"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                  <PhoneInput
                    className="td-page__input"
                    placeholder="+7 (___) ___-__-__"
                    value={phone}
                    onChange={setPhone}
                    required
                  />
                </div>
                <button
                  type="submit"
                  className="btn btn--primary td-page__submit-btn"
                  disabled={sending || !selectedCar || !name || !phone}
                >
                  {sending ? "Отправка..." : "Записаться на тест-драйв"}
                </button>
                <span className="td-page__legal mono">
                  Нажимая кнопку, вы соглашаетесь с условиями обработки персональных данных
                </span>
              </form>

              <div className="td-page__info-card">
                <svg width="18" height="18" viewBox="0 0 18 18" fill="none" style={{ flexShrink: 0 }}><circle cx="9" cy="9" r="8" stroke="var(--ink-3)" strokeWidth="1.2"/><path d="M9 8v4.5M9 5.5v.01" stroke="var(--ink-3)" strokeWidth="1.4" strokeLinecap="round"/></svg>
                <span>Тест-драйв бесплатный. Менеджер позвонит для подтверждения в течение 30 минут.</span>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
