"use client";

import { useState, useEffect } from "react";
import { Icon } from "@/components/ui/Icons";
import { PhoneInput } from "@/components/ui/PhoneInput";
import { getRefParams } from "@/components/ux/VisitTracker";

function useCalcParams() {
  const [params, setParams] = useState<{ price?: string; down?: string; term?: string; payment?: string } | null>(null);
  useEffect(() => {
    const hash = window.location.hash;
    const q = hash.split("?")[1];
    if (!q) return;
    const p = new URLSearchParams(q);
    const price = p.get("calcPrice");
    const down = p.get("calcDown");
    const term = p.get("calcTerm");
    const payment = p.get("calcPayment");
    if (price && payment) setParams({ price, down: down || undefined, term: term || undefined, payment });
  }, []);
  return params;
}

const fmt = (v: string | number) => Number(v).toLocaleString("ru-RU");

export function CTASection() {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [company, setCompany] = useState("");
  const [sent, setSent] = useState(false);
  const [sending, setSending] = useState(false);
  const calcParams = useCalcParams();

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !phone) return;
    setSending(true);
    const calcData = calcParams ? {
      calcTerm: Number(calcParams.term),
      calcDown: Number(calcParams.down),
      calcPayment: Number(calcParams.payment),
    } : {};
    try {
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, phone, company, source: calcParams ? "CALCULATOR" : "WEBSITE", ...calcData, ...getRefParams() }),
      });
      if (!res.ok) {
        console.error("[Lead] Error:", res.status, await res.text());
      }
      setSent(true);
    } catch (err) {
      console.error("[Lead] Network error:", err);
      alert("Ошибка сети. Позвоните нам: +7 495 150-05-45");
    } finally {
      setSending(false);
    }
  };

  return (
    <section className="section" id="cta">
      <div className="container">
        <div className="cta reveal">
          <div className="cta__inner">
            <div>
              <div style={{ background: "#0e1726", borderRadius: 14, padding: "12px 20px", width: "fit-content", marginBottom: 20 }}>
                <img src="/images/logo.png" alt="EVOCARS" style={{ width: 100, display: "block" }} draggable={false} />
              </div>
              <h2 className="cta__title">
                Получить КП с&nbsp;выгодными условиями
              </h2>
              <p style={{ marginTop: 24, color: "var(--ink-2)", fontSize: 15, lineHeight: 1.55, maxWidth: 460 }}>
                Расскажите о потребности парка — пришлём актуальный прайс, спецификации, сроки поставки и шаблон договора.
              </p>
            </div>

            {calcParams && !sent && (
              <div style={{ padding: "16px 20px", background: "color-mix(in oklab, var(--orange) 8%, transparent)", border: "1px solid color-mix(in oklab, var(--orange) 20%, transparent)", borderRadius: 14, marginBottom: -20, display: "flex", gap: 24, flexWrap: "wrap", fontSize: 13 }}>
                <span style={{ fontWeight: 500 }}>Ваш расчёт:</span>
                <span>{fmt(calcParams.price!)} ₽</span>
                <span>Аванс {calcParams.down}%</span>
                <span>{calcParams.term} мес.</span>
                <span style={{ color: "var(--orange)", fontWeight: 600 }}>{fmt(calcParams.payment!)} ₽/мес</span>
              </div>
            )}

            {sent ? (
              <div style={{ padding: 32, border: "1px solid var(--line-strong)", borderRadius: 18 }}>
                <div className="eyebrow no-line" style={{ color: "var(--orange)" }}>Заявка принята</div>
                <h3 style={{ fontSize: 28, fontWeight: 500, letterSpacing: "-0.02em", marginTop: 12, lineHeight: 1.15 }}>
                  Спасибо, {name}.<br/>Свяжемся в течение 1 часа.
                </h3>
                <p style={{ marginTop: 14, color: "var(--ink-2)", fontSize: 14 }}>
                  Менеджер позвонит на номер {phone} и пришлёт КП на email после уточнения.
                </p>
              </div>
            ) : (
              <form className="cta__form" onSubmit={submit}>
                <div className="cta__field">
                  <label>Имя / контактное лицо</label>
                  <input type="text" placeholder="Иван Петров" value={name} onChange={(e) => setName(e.target.value)} required />
                </div>
                <div className="cta__field">
                  <label>Телефон</label>
                  <PhoneInput placeholder="+7 (___) ___-__-__" value={phone} onChange={setPhone} required />
                </div>
                <div className="cta__field">
                  <label>Компания (опционально)</label>
                  <input type="text" placeholder={'ООО «Лизинг-Про»'} value={company} onChange={(e) => setCompany(e.target.value)} />
                </div>
                <button type="submit" className="btn btn--primary cta__submit" disabled={sending}>
                  {sending ? "Отправка..." : "Получить КП"}
                  <Icon.Arrow />
                </button>
                <span className="cta__legal">Нажимая «Получить КП», вы принимаете политику обработки данных</span>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
