"use client";

import { useState } from "react";
import { PhoneInput } from "@/components/ui/PhoneInput";
import { getRefParams } from "@/components/ux/VisitTracker";

interface CarInfo {
  name: string;
  trim: string;
  price: number;
  img: string;
  slug: string;
}

interface LeadModalProps {
  car: CarInfo;
  onClose: () => void;
}

const fmt = (v: number) => v.toLocaleString("ru-RU");

export function LeadModal({ car, onClose }: LeadModalProps) {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [sent, setSent] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!phone) return;
    setSending(true);
    setError(null);
    try {
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name || "—",
          phone,
          source: "WEBSITE",
          carId: `${car.name} ${car.trim}`.trim(),
          message: `/catalog/${car.slug}`,
          ...getRefParams(),
        }),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => null);
        throw new Error(body?.error || "Ошибка отправки");
      }
      setSent(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Произошла ошибка");
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
            <h3 style={{ fontSize: 22, fontWeight: 500 }}>Заявка принята!</h3>
            <p style={{ color: "var(--ink-2)", marginTop: 8, fontSize: 15 }}>
              Менеджер перезвонит в течение 15 минут
            </p>
          </div>
        ) : (
          <>
            {/* Car info */}
            <div style={{ display: "flex", gap: 14, alignItems: "center" }}>
              <img
                src={car.img}
                alt={car.name}
                draggable={false}
                style={{ width: 80, height: 56, objectFit: "cover", borderRadius: 10, flexShrink: 0 }}
              />
              <div style={{ minWidth: 0 }}>
                <div style={{ fontSize: 15, fontWeight: 500 }}>{car.name}</div>
                <div className="mono" style={{ fontSize: 12, color: "var(--ink-2)", marginTop: 2 }}>{car.trim}</div>
                <div style={{ fontSize: 15, fontWeight: 600, color: "var(--orange)", marginTop: 2 }}>{fmt(car.price)} ₽</div>
              </div>
            </div>

            <h3 style={{ fontSize: 20, fontWeight: 500, letterSpacing: "-0.02em", lineHeight: 1.2 }}>
              Оставить заявку
            </h3>
            <p style={{ fontSize: 14, color: "var(--ink-2)", lineHeight: 1.5 }}>
              Менеджер свяжется и подготовит персональное предложение
            </p>

            <form onSubmit={submit} style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              <input
                type="text"
                placeholder="Ваше имя"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="exit-popup__input"
              />
              <PhoneInput
                placeholder="+7 (___) ___-__-__"
                value={phone}
                onChange={setPhone}
                required
                className="exit-popup__input"
              />
              {error && (
                <p style={{ fontSize: 13, color: "#f87171", margin: 0 }}>{error}</p>
              )}
              <button type="submit" className="exit-popup__submit" disabled={sending}>
                {sending ? "Отправка..." : "Отправить заявку"}
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
