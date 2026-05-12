"use client";

import { useState, useEffect } from "react";
import { PhoneInput } from "@/components/ui/PhoneInput";
import { getRefParams } from "@/components/ux/VisitTracker";

export function ExitPopup() {
  const [show, setShow] = useState(false);
  const [sent, setSent] = useState(false);
  const [phone, setPhone] = useState("");

  useEffect(() => {
    let fired = false;

    const onLeave = (e: MouseEvent) => {
      if (fired || e.clientY > 10) return;
      if (sessionStorage.getItem("evo_exit_shown")) return;
      fired = true;
      sessionStorage.setItem("evo_exit_shown", "1");
      setShow(true);
    };

    // Desktop: mouseleave at top
    document.addEventListener("mouseout", onLeave);

    // Mobile: after 45 seconds
    const timer = setTimeout(() => {
      if (fired) return;
      if (sessionStorage.getItem("evo_exit_shown")) return;
      fired = true;
      sessionStorage.setItem("evo_exit_shown", "1");
      setShow(true);
    }, 45000);

    return () => {
      document.removeEventListener("mouseout", onLeave);
      clearTimeout(timer);
    };
  }, []);

  if (!show) return null;

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!phone) return;
    try {
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: "—", phone, source: "EXIT_POPUP", ...getRefParams() }),
      });
      if (!res.ok) console.error("[Lead] Error:", res.status, await res.text());
    } catch (err) {
      console.error("[Lead] Network error:", err);
    }
    setSent(true);
  };

  return (
    <div className="exit-overlay" onClick={(e) => { if (e.target === e.currentTarget) setShow(false); }}>
      <div className="exit-popup">
        <button className="exit-popup__close" onClick={() => setShow(false)} aria-label="Закрыть">
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M4 4l12 12M4 16L16 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>
        </button>

        {sent ? (
          <div style={{ textAlign: "center", padding: "20px 0" }}>
            <div style={{ fontSize: 32, marginBottom: 16 }}>&#10003;</div>
            <h3 style={{ fontSize: 22, fontWeight: 500 }}>Спасибо!</h3>
            <p style={{ color: "var(--ink-2)", marginTop: 8, fontSize: 15 }}>Перезвоним в течение 15 минут</p>
          </div>
        ) : (
          <>
            <div className="exit-popup__badge mono">Специальное предложение</div>
            <h3 className="exit-popup__title">
              Зафиксируйте выгоду до 1 200 000 ₽ на&nbsp;авто в лизинг
            </h3>
            <p className="exit-popup__text">
              Оставьте номер — менеджер перезвонит и рассчитает персональные условия
            </p>
            <form className="exit-popup__form" onSubmit={submit}>
              <PhoneInput
                placeholder="+7 (___) ___-__-__"
                value={phone}
                onChange={setPhone}
                required
                className="exit-popup__input"
              />
              <button type="submit" className="exit-popup__submit">
                Получить расчёт
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
