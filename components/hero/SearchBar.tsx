"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";

interface Car {
  slug: string;
  brand: string;
  model: string;
  name: string;
  year: number;
  price: number;
  img: string;
  gallery: string[];
}

const suggestions = [
  "Toyota Camry",
  "Toyota Camry Sport",
  "Лизинг без НДС",
  "Лизинг с НДС",
  "Гибрид",
];

export function SearchBar() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Car[]>([]);
  const [allCars, setAllCars] = useState<Car[]>([]);
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined);

  useEffect(() => {
    fetch("/api/cars")
      .then((r) => r.json())
      .then((d) => setAllCars(d.cars || []))
      .catch(() => {});
  }, []);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleChange = (val: string) => {
    setQuery(val);
    clearTimeout(timer.current);
    if (!val.trim()) {
      setResults([]);
      setOpen(true);
      return;
    }
    timer.current = setTimeout(() => {
      const q = val.toLowerCase();
      const filtered = allCars.filter(
        (c) =>
          c.brand?.toLowerCase().includes(q) ||
          c.model?.toLowerCase().includes(q) ||
          c.name?.toLowerCase().includes(q) ||
          `${c.brand} ${c.model}`.toLowerCase().includes(q) ||
          String(c.year).includes(q)
      );
      setResults(filtered);
      setOpen(true);
    }, 150);
  };

  const fmt = (v: number) => new Intl.NumberFormat("ru-RU").format(v);

  const showSuggestions = open && !query.trim();
  const showResults = open && query.trim() && results.length > 0;
  const showEmpty = open && query.trim() && results.length === 0;
  const topCars = allCars.slice(0, 4);

  return (
    <div className="search-bar" ref={ref}>
      <div className="container">
        <div className="search-bar__inner">
          <div className="search-bar__icon">
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none"><circle cx="7.5" cy="7.5" r="6" stroke="currentColor" strokeWidth="1.5"/><path d="M12 12l4.5 4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>
          </div>
          <input
            type="text"
            className="search-bar__input"
            placeholder="Найти автомобиль... Toyota Camry, BMW, Audi..."
            value={query}
            onChange={(e) => handleChange(e.target.value)}
            onFocus={() => setOpen(true)}
          />
          {query && (
            <button
              type="button"
              className="search-bar__clear"
              onClick={() => { setQuery(""); setResults([]); setOpen(true); }}
            >
              &times;
            </button>
          )}
          <button type="button" className="search-bar__btn" aria-label="Поиск">
            <svg viewBox="0 0 18 18" fill="none"><circle cx="7.5" cy="7.5" r="6" stroke="currentColor" strokeWidth="1.8"/><path d="M12 12l4.5 4.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/></svg>
          </button>
        </div>

        {/* Ozon-style dropdown: suggestions left, cars right */}
        {(showSuggestions || showResults || showEmpty) && (
          <div className="search-bar__dropdown">
            {showSuggestions && (
              <div className="search-bar__ozon">
                <div className="search-bar__ozon-left">
                  <div className="search-bar__ozon-cap mono">Популярные запросы</div>
                  {suggestions.map((s) => (
                    <button
                      key={s}
                      type="button"
                      className="search-bar__suggest"
                      onClick={() => handleChange(s)}
                    >
                      <svg width="14" height="14" viewBox="0 0 14 14" fill="none" style={{ flexShrink: 0 }}><circle cx="6" cy="6" r="4.5" stroke="currentColor" strokeWidth="1.2"/><path d="M9.5 9.5l3 3" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/></svg>
                      {s}
                    </button>
                  ))}
                </div>
                {topCars.length > 0 && (
                  <div className="search-bar__ozon-right">
                    <div className="search-bar__ozon-cap mono">В наличии</div>
                    <div className="search-bar__ozon-grid">
                      {topCars.map((c) => (
                        <Link
                          key={c.slug}
                          href={`/catalog/${c.slug}`}
                          className="search-bar__ozon-card"
                          onClick={() => setOpen(false)}
                        >
                          <div className="search-bar__ozon-img">
                            {(c.img || c.gallery?.[0]) && <img src={c.img || c.gallery[0]} alt={c.brand} />}
                          </div>
                          <div className="search-bar__ozon-price mono">{fmt(c.price)} ₽</div>
                          <div className="search-bar__ozon-name">{c.brand} {c.model}</div>
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {showResults && (
              <>
                {results.slice(0, 6).map((c) => (
                  <Link
                    key={c.slug}
                    href={`/catalog/${c.slug}`}
                    className="search-bar__result"
                    onClick={() => setOpen(false)}
                  >
                    <div className="search-bar__result-img">
                      {(c.img || c.gallery?.[0]) && <img src={c.img || c.gallery[0]} alt={c.brand} />}
                    </div>
                    <div className="search-bar__result-info">
                      <div className="search-bar__result-name">{c.brand} {c.model}</div>
                      <div className="search-bar__result-meta mono">{c.year} &middot; {fmt(c.price)} ₽</div>
                    </div>
                  </Link>
                ))}
                <Link href="/catalog" className="search-bar__all" onClick={() => setOpen(false)}>
                  Все результаты ({results.length}) &rarr;
                </Link>
              </>
            )}

            {showEmpty && (
              <div className="search-bar__empty">
                Ничего не найдено. <Link href="/catalog" onClick={() => setOpen(false)}>Перейти в каталог</Link>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
