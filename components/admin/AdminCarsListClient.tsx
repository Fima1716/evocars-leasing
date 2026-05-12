"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

interface Car {
  id: number;
  slug: string;
  name: string;
  trim: string;
  price: number;
  year: number;
  img: string;
  status: string;
  createdAt?: string;
}

const fmt = (v: number) => v.toLocaleString("ru-RU");

export function AdminCarsListClient() {
  const [cars, setCars] = useState<Car[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState<number | null>(null);

  useEffect(() => {
    fetch("/api/cars/save")
      .then(r => r.json())
      .then(d => setCars(d.cars || []))
      .finally(() => setLoading(false));
  }, []);

  const deleteCar = async (id: number, name: string) => {
    if (!confirm(`Удалить «${name}»?`)) return;
    setDeleting(id);
    try {
      const res = await fetch("/api/cars/save", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      if (!res.ok) throw new Error("Ошибка");
      setCars(c => c.filter(car => car.id !== id));
    } catch {
      alert("Не удалось удалить");
    } finally {
      setDeleting(null);
    }
  };

  if (loading) return <div style={{ padding: 40, textAlign: "center", color: "var(--ink-3)" }}>Загрузка...</div>;

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
        <h1 className="admin-h1" style={{ marginBottom: 0 }}>Автомобили</h1>
        <Link href="/admin/cars/new" className="admin-btn admin-btn--primary">+ Добавить</Link>
      </div>

      {cars.length === 0 ? (
        <div className="admin-card" style={{ textAlign: "center", padding: 48 }}>
          <div style={{ fontSize: 15, color: "var(--ink-3)", marginBottom: 16 }}>Добавленных через админку автомобилей пока нет</div>
          <div style={{ fontSize: 13, color: "var(--ink-3)" }}>6 машин из каталога загружены из кода и не отображаются здесь</div>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {cars.map(car => (
            <div key={car.id} className="admin-card" style={{ padding: 16, display: "flex", alignItems: "center", gap: 16 }}>
              <div style={{
                width: 80, height: 60, borderRadius: 8, overflow: "hidden",
                background: "var(--bg-3)", border: "1px solid var(--line)", flexShrink: 0,
              }}>
                {car.img && <img src={car.img} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />}
              </div>

              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 15, fontWeight: 500 }}>{car.name}</div>
                <div className="mono" style={{ fontSize: 12, color: "var(--ink-3)", marginTop: 2 }}>
                  {[car.trim, car.year].filter(Boolean).join(" · ")}
                </div>
              </div>

              <div style={{ fontSize: 16, fontWeight: 500, whiteSpace: "nowrap" }}>
                {fmt(car.price)} ₽
              </div>

              <div style={{ display: "flex", gap: 8, flexShrink: 0 }}>
                <Link href={`/catalog/${car.slug}`} className="admin-btn admin-btn--ghost" style={{ fontSize: 13, padding: "6px 12px" }}>
                  Открыть
                </Link>
                <button
                  onClick={() => deleteCar(car.id, car.name)}
                  disabled={deleting === car.id}
                  className="admin-btn admin-btn--ghost"
                  style={{ fontSize: 13, padding: "6px 12px", color: "#ff6b6b", borderColor: "rgba(255,107,107,0.3)" }}
                >
                  {deleting === car.id ? "..." : "Удалить"}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
