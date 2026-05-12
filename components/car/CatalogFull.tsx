"use client";

import { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import { Icon } from "@/components/ui/Icons";
import type { CarData } from "@/lib/cars-data";

function decline(n: number, forms: [string, string, string]) {
  const m100 = n % 100, m10 = n % 10;
  if (m100 >= 11 && m100 <= 14) return forms[2];
  if (m10 === 1) return forms[0];
  if (m10 >= 2 && m10 <= 4) return forms[1];
  return forms[2];
}

const fmt = (v: number) => v.toLocaleString("ru-RU");

/* ── Sidebar filter ── */
function Sidebar({ cars, filters, setFilters }: {
  cars: CarData[];
  filters: Filters;
  setFilters: (f: Filters) => void;
}) {
  const brands = [...new Set(cars.map(c => c.brand))].sort();
  const bodies = [...new Set(cars.map(c => c.body))].sort();
  const fuels = [...new Set(cars.map(c => c.fuel))].sort();
  const drives = [...new Set(cars.map(c => c.drive))].sort();
  const txs = [...new Set(cars.map(c => c.tx))].sort();

  const s: React.CSSProperties = {
    width: "100%", padding: "8px 12px", borderRadius: 8,
    border: "1px solid var(--line)", background: "var(--bg-3)",
    color: "var(--ink)", fontSize: 13, fontFamily: "inherit",
  };

  const labelS: React.CSSProperties = {
    fontSize: 11, color: "var(--ink-3)", fontFamily: "var(--mono)",
    letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 6,
  };

  const groupS: React.CSSProperties = { display: "flex", flexDirection: "column", gap: 4 };

  return (
    <aside className="catalog-sidebar">
      <div style={{ fontSize: 16, fontWeight: 500 }}>Фильтры</div>

      {/* НДС */}
      <div style={groupS}>
        <div style={labelS}>НДС</div>
        <div style={{ display: "flex", gap: 4 }}>
          {([["all", "Все"], ["nds", "С НДС"], ["no-nds", "Без НДС"]] as const).map(([v, l]) => (
            <button key={v} onClick={() => setFilters({ ...filters, nds: v })}
              style={{
                flex: 1, padding: "6px 0", borderRadius: 6, fontSize: 11, fontWeight: 500,
                border: `1px solid ${filters.nds === v ? "var(--orange)" : "var(--line)"}`,
                background: filters.nds === v ? "rgba(251,191,36,0.1)" : "transparent",
                color: filters.nds === v ? "var(--orange)" : "var(--ink-2)",
                cursor: "pointer",
              }}
            >{l}</button>
          ))}
        </div>
      </div>

      {/* Марка */}
      <div style={groupS}>
        <div style={labelS}>Марка</div>
        <select style={s} value={filters.brand} onChange={e => setFilters({ ...filters, brand: e.target.value })}>
          <option value="">Все марки</option>
          {brands.map(b => <option key={b} value={b}>{b}</option>)}
        </select>
      </div>

      {/* Кузов */}
      <div style={groupS}>
        <div style={labelS}>Кузов</div>
        <select style={s} value={filters.body} onChange={e => setFilters({ ...filters, body: e.target.value })}>
          <option value="">Любой</option>
          {bodies.map(b => <option key={b} value={b}>{b}</option>)}
        </select>
      </div>

      {/* Двигатель */}
      <div style={groupS}>
        <div style={labelS}>Двигатель</div>
        <select style={s} value={filters.fuel} onChange={e => setFilters({ ...filters, fuel: e.target.value })}>
          <option value="">Любой</option>
          {fuels.map(f => <option key={f} value={f}>{f}</option>)}
        </select>
      </div>

      {/* КПП */}
      <div style={groupS}>
        <div style={labelS}>КПП</div>
        <select style={s} value={filters.tx} onChange={e => setFilters({ ...filters, tx: e.target.value })}>
          <option value="">Любая</option>
          {txs.map(t => <option key={t} value={t}>{t}</option>)}
        </select>
      </div>

      {/* Привод */}
      <div style={groupS}>
        <div style={labelS}>Привод</div>
        <select style={s} value={filters.drive} onChange={e => setFilters({ ...filters, drive: e.target.value })}>
          <option value="">Любой</option>
          {drives.map(d => <option key={d} value={d}>{d}</option>)}
        </select>
      </div>

      {/* Цена */}
      <div style={groupS}>
        <div style={labelS}>Цена, ₽</div>
        <div style={{ display: "flex", gap: 6 }}>
          <input style={{ ...s, width: "50%" }} type="text" placeholder="от" value={filters.priceFrom} onChange={e => setFilters({ ...filters, priceFrom: e.target.value.replace(/\D/g, "") })} />
          <input style={{ ...s, width: "50%" }} type="text" placeholder="до" value={filters.priceTo} onChange={e => setFilters({ ...filters, priceTo: e.target.value.replace(/\D/g, "") })} />
        </div>
      </div>

      {/* Reset */}
      <button onClick={() => setFilters({ nds: "all", brand: "", body: "", fuel: "", tx: "", drive: "", priceFrom: "", priceTo: "" })}
        style={{ padding: "8px 0", borderRadius: 8, border: "1px solid var(--line)", background: "transparent", color: "var(--ink-3)", fontSize: 12, cursor: "pointer" }}
      >
        Сбросить фильтры
      </button>
    </aside>
  );
}

interface Filters {
  nds: string;
  brand: string;
  body: string;
  fuel: string;
  tx: string;
  drive: string;
  priceFrom: string;
  priceTo: string;
}

/* ── Grid card ── */
function GridCard({ c }: { c: CarData }) {
  return (
    <article className="grid-card">
      <div className="grid-card__media">
        <img src={c.img} alt={c.name} draggable={false} />
        {c.tag && <span className="grid-card__tag mono">{c.tag}</span>}
        <span className="grid-card__status is-on"><span className="dot" />{c.status}</span>
      </div>
      <div className="grid-card__body">
        <h3 className="grid-card__title">{c.name}</h3>
        <div className="grid-card__sub mono">{c.trim} · {c.color} · {c.year}</div>
        <div className="grid-card__specs mono">{c.engine} · {c.power} л.с. · {c.fuel} · {c.tx}</div>
        <div className="grid-card__price">
          <span className="grid-card__price-v">от {fmt(c.price)} ₽</span>
          <span className="grid-card__price-monthly mono">{fmt(c.monthly)} ₽/мес</span>
        </div>
        <div className="list-row__features" style={{ marginTop: 4 }}>
          {c.features.slice(0, 3).map(f => <span key={f} className="list-row__feat">{f}</span>)}
        </div>
        <Link href={`/catalog/${c.slug}`} className="btn btn--primary grid-card__cta">Подробнее <Icon.Arrow /></Link>
      </div>
    </article>
  );
}

/* ── Main catalog ── */
export function CatalogFull({ cars: allCars }: { cars: CarData[] }) {
  const [sort, setSort] = useState("relevance");
  const [mobileFilters, setMobileFilters] = useState(false);
  const [filters, setFilters] = useState<Filters>({
    nds: "all", brand: "", body: "", fuel: "", tx: "", drive: "", priceFrom: "", priceTo: "",
  });

  const activeCount = [filters.brand, filters.body, filters.fuel, filters.tx, filters.drive, filters.priceFrom, filters.priceTo].filter(Boolean).length + (filters.nds !== "all" ? 1 : 0);

  useEffect(() => {
    if (mobileFilters) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "";
    return () => { document.body.style.overflow = ""; };
  }, [mobileFilters]);

  const cars = useMemo(() => {
    let list = allCars.filter(c => {
      if (filters.nds === "nds" && !c.nds) return false;
      if (filters.nds === "no-nds" && c.nds) return false;
      if (filters.brand && c.brand !== filters.brand) return false;
      if (filters.body && c.body !== filters.body) return false;
      if (filters.fuel && c.fuel !== filters.fuel) return false;
      if (filters.tx && c.tx !== filters.tx) return false;
      if (filters.drive && c.drive !== filters.drive) return false;
      if (filters.priceFrom && c.price < Number(filters.priceFrom)) return false;
      if (filters.priceTo && c.price > Number(filters.priceTo)) return false;
      return true;
    });
    if (sort === "price-asc") list.sort((a, b) => a.price - b.price);
    if (sort === "price-desc") list.sort((a, b) => b.price - a.price);
    return list;
  }, [allCars, filters, sort]);

  return (
    <section className="section catalog" id="catalog" style={{ paddingTop: 40 }}>
      <div className="container">
        <div style={{ display: "flex", gap: 32, alignItems: "flex-start" }}>
          {/* Desktop sidebar */}
          <Sidebar cars={allCars} filters={filters} setFilters={setFilters} />

          {/* Mobile filter bottom sheet */}
          {mobileFilters && (
            <div className="mobile-filter-overlay" onClick={() => setMobileFilters(false)}>
              <div className="mobile-filter-sheet" onClick={e => e.stopPropagation()}>
                <div className="mobile-filter-sheet__head">
                  <span style={{ fontSize: 18, fontWeight: 600 }}>Фильтры</span>
                  <button onClick={() => setMobileFilters(false)} className="mobile-filter-sheet__close">&times;</button>
                </div>
                <div className="mobile-filter-sheet__body">
                  <Sidebar cars={allCars} filters={filters} setFilters={setFilters} />
                </div>
                <div className="mobile-filter-sheet__footer">
                  <button
                    onClick={() => { setFilters({ nds: "all", brand: "", body: "", fuel: "", tx: "", drive: "", priceFrom: "", priceTo: "" }); }}
                    className="mobile-filter-sheet__reset"
                  >Сбросить</button>
                  <button onClick={() => setMobileFilters(false)} className="mobile-filter-sheet__apply">
                    Показать {cars.length} {decline(cars.length, ["авто", "авто", "авто"])}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Main content */}
          <div style={{ flex: 1, minWidth: 0 }}>
            {/* Top bar */}
            <div className="catalog-topbar">
              <div className="mono" style={{ fontSize: 14, color: "var(--ink-2)" }}>
                <b style={{ color: "var(--ink)", fontSize: 16 }}>{cars.length}</b>{" "}
                {decline(cars.length, ["предложение", "предложения", "предложений"])}
              </div>
              <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                {/* Mobile filter button */}
                <button className="catalog-filter-btn" onClick={() => setMobileFilters(true)}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="4" y1="6" x2="20" y2="6"/><line x1="8" y1="12" x2="20" y2="12"/><line x1="12" y1="18" x2="20" y2="18"/><circle cx="6" cy="12" r="1.5" fill="currentColor"/><circle cx="10" cy="18" r="1.5" fill="currentColor"/></svg>
                  Фильтры{activeCount > 0 && <span className="catalog-filter-btn__badge">{activeCount}</span>}
                </button>
                <select
                  value={sort}
                  onChange={(e) => setSort(e.target.value)}
                  className="catalog-sort"
                >
                  <option value="relevance">По актуальности</option>
                  <option value="price-asc">Сначала дешевле</option>
                  <option value="price-desc">Сначала дороже</option>
                </select>
              </div>
            </div>

            {/* Grid */}
            <div className="results__grid">
              {cars.map(c => <GridCard key={c.id} c={c} />)}
            </div>

            {cars.length === 0 && (
              <div style={{ textAlign: "center", padding: 60, color: "var(--ink-3)" }}>
                Нет автомобилей по выбранным фильтрам
              </div>
            )}

            <footer className="results__footer">
              <span className="mono">Toyota Camry IX (XV80) · China Market · 2025</span>
              <Link href="/#cta" className="results__cta">Нужна другая модель? Поставим под заказ <Icon.Arrow /></Link>
            </footer>
          </div>
        </div>
      </div>
    </section>
  );
}
