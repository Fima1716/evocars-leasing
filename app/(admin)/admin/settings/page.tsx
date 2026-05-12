"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

interface Settings {
  annualRate: number;
  minDown: number;
  maxDown: number;
  terms: number[];
  defaultTerm: number;
  defaultDown: number;
  minPrice: number;
  maxPrice: number;
  priceStep: number;
  defaultPrice: number;
  calculatorEnabled: boolean;
  bannerEnabled: boolean;
  bannerBadge: string;
  bannerText: string;
  bannerLink: string;
  bannerButtonText: string;
}

const fmt = (v: number) => v.toLocaleString("ru-RU");

export default function SettingsPage() {
  const [s, setS] = useState<Settings | null>(null);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [newTerm, setNewTerm] = useState("");

  useEffect(() => {
    fetch("/api/settings")
      .then((r) => r.json())
      .then(setS);
  }, []);

  const save = async () => {
    if (!s) return;
    setSaving(true);
    setSaved(false);
    const res = await fetch("/api/settings", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(s),
    });
    if (res.ok) setSaved(true);
    setSaving(false);
    setTimeout(() => setSaved(false), 3000);
  };

  const upd = (key: keyof Settings, val: number | string | boolean) => {
    if (!s) return;
    setS({ ...s, [key]: val });
  };

  const addTerm = () => {
    if (!s || !newTerm) return;
    const n = Number(newTerm);
    if (n > 0 && !s.terms.includes(n)) {
      setS({ ...s, terms: [...s.terms, n].sort((a, b) => a - b) });
      setNewTerm("");
    }
  };

  const removeTerm = (t: number) => {
    if (!s) return;
    setS({ ...s, terms: s.terms.filter((x) => x !== t) });
  };

  if (!s) return <div style={{ padding: 40, textAlign: "center", color: "var(--ink-3)" }}>Загрузка...</div>;

  const fieldStyle: React.CSSProperties = { display: "flex", justifyContent: "space-between", alignItems: "center", padding: "14px 0", borderBottom: "1px solid var(--line)" };
  const labelStyle: React.CSSProperties = { fontSize: 14 };
  const inputStyle: React.CSSProperties = {
    width: 120, padding: "8px 12px", borderRadius: 8,
    border: "1px solid var(--line)", background: "var(--bg-3)",
    color: "var(--ink)", fontSize: 14, textAlign: "right",
    fontFamily: "var(--mono)",
  };

  // preview calc
  const r = s.annualRate / 100 / 12;
  const downAmt = Math.round(s.defaultPrice * s.defaultDown / 100);
  const principal = s.defaultPrice - downAmt;
  const n = s.defaultTerm;
  const monthly = r > 0 ? Math.round(principal * (r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1)) : Math.round(principal / n);

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
        <div>
          <Link href="/admin" style={{ fontSize: 12, color: "var(--ink-3)", textDecoration: "none" }}>← Панель управления</Link>
          <h1 style={{ fontSize: 24, fontWeight: 500, marginTop: 6 }}>Настройки</h1>
        </div>
        <button
          onClick={save}
          disabled={saving}
          style={{
            padding: "10px 24px", borderRadius: 10,
            background: saved ? "#6ddc6d" : "var(--orange)",
            color: saved ? "#0a3a0a" : "#0c0a08",
            fontSize: 14, fontWeight: 500, border: "none",
            cursor: saving ? "wait" : "pointer",
          }}
        >
          {saving ? "Сохранение..." : saved ? "Сохранено ✓" : "Сохранить"}
        </button>
      </div>

      {/* Calculator visibility toggle */}
      <div style={{ marginBottom: 20, padding: "16px 24px", borderRadius: 14, border: "1px solid var(--line)", background: "var(--bg-2)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <div style={{ fontSize: 15, fontWeight: 500 }}>Калькулятор на главной</div>
          <div style={{ fontSize: 12, color: "var(--ink-3)", marginTop: 4 }}>Показывать или скрывать секцию калькулятора на главной странице</div>
        </div>
        <label style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13, cursor: "pointer" }}>
          <input
            type="checkbox"
            checked={s.calculatorEnabled}
            onChange={(e) => upd("calculatorEnabled", e.target.checked)}
            style={{ width: 18, height: 18, accentColor: "var(--orange)" }}
          />
          {s.calculatorEnabled ? "Включён" : "Скрыт"}
        </label>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
        {/* Left: settings */}
        <div style={{ padding: 24, borderRadius: 14, border: "1px solid var(--line)", background: "var(--bg-2)" }}>
          <div style={{ fontSize: 15, fontWeight: 500, marginBottom: 16 }}>Параметры</div>

          <div style={fieldStyle}>
            <span style={labelStyle}>Годовая ставка, %</span>
            <input style={inputStyle} type="number" min={1} max={50} step={0.5} value={s.annualRate} onChange={(e) => upd("annualRate", +e.target.value)} />
          </div>
          <div style={fieldStyle}>
            <span style={labelStyle}>Мин. аванс, %</span>
            <input style={inputStyle} type="number" min={0} max={90} value={s.minDown} onChange={(e) => upd("minDown", +e.target.value)} />
          </div>
          <div style={fieldStyle}>
            <span style={labelStyle}>Макс. аванс, %</span>
            <input style={inputStyle} type="number" min={1} max={90} value={s.maxDown} onChange={(e) => upd("maxDown", +e.target.value)} />
          </div>
          <div style={fieldStyle}>
            <span style={labelStyle}>Аванс по умолчанию, %</span>
            <input style={inputStyle} type="number" min={0} max={90} value={s.defaultDown} onChange={(e) => upd("defaultDown", +e.target.value)} />
          </div>

          <div style={{ ...fieldStyle, flexDirection: "column", alignItems: "flex-start", gap: 10 }}>
            <span style={labelStyle}>Сроки лизинга (мес.)</span>
            <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
              {s.terms.map((t) => (
                <span key={t} style={{ display: "inline-flex", alignItems: "center", gap: 4, padding: "4px 10px", borderRadius: 6, background: "var(--bg-3)", border: "1px solid var(--line)", fontSize: 13, fontFamily: "var(--mono)" }}>
                  {t}
                  <button onClick={() => removeTerm(t)} style={{ border: "none", background: "none", color: "var(--ink-3)", cursor: "pointer", fontSize: 14, padding: 0, lineHeight: 1 }}>×</button>
                </span>
              ))}
              <div style={{ display: "inline-flex", gap: 4 }}>
                <input
                  style={{ ...inputStyle, width: 60, textAlign: "center" }}
                  type="number" min={1} placeholder="+"
                  value={newTerm} onChange={(e) => setNewTerm(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && addTerm()}
                />
              </div>
            </div>
          </div>

          <div style={fieldStyle}>
            <span style={labelStyle}>Срок по умолчанию, мес.</span>
            <select style={{ ...inputStyle, width: 120 }} value={s.defaultTerm} onChange={(e) => upd("defaultTerm", +e.target.value)}>
              {s.terms.map((t) => <option key={t} value={t}>{t} мес</option>)}
            </select>
          </div>

          <div style={{ fontSize: 15, fontWeight: 500, marginTop: 20, marginBottom: 16 }}>Диапазон цен</div>

          <div style={fieldStyle}>
            <span style={labelStyle}>Мин. цена</span>
            <input style={{ ...inputStyle, width: 140 }} type="number" step={100000} value={s.minPrice} onChange={(e) => upd("minPrice", +e.target.value)} />
          </div>
          <div style={fieldStyle}>
            <span style={labelStyle}>Макс. цена</span>
            <input style={{ ...inputStyle, width: 140 }} type="number" step={100000} value={s.maxPrice} onChange={(e) => upd("maxPrice", +e.target.value)} />
          </div>
          <div style={fieldStyle}>
            <span style={labelStyle}>Шаг цены</span>
            <input style={{ ...inputStyle, width: 140 }} type="number" step={10000} value={s.priceStep} onChange={(e) => upd("priceStep", +e.target.value)} />
          </div>
          <div style={{ ...fieldStyle, borderBottom: "none" }}>
            <span style={labelStyle}>Цена по умолчанию</span>
            <input style={{ ...inputStyle, width: 140 }} type="number" step={100000} value={s.defaultPrice} onChange={(e) => upd("defaultPrice", +e.target.value)} />
          </div>
        </div>

        {/* Right: preview */}
        <div style={{ padding: 24, borderRadius: 14, border: "1px solid var(--line)", background: "var(--bg-2)" }}>
          <div style={{ fontSize: 15, fontWeight: 500, marginBottom: 16 }}>Превью расчёта</div>
          <div style={{ fontSize: 12, color: "var(--ink-3)", marginBottom: 20, fontFamily: "var(--mono)" }}>
            Как будет выглядеть расчёт с текущими настройками (при значениях по умолчанию)
          </div>

          <div style={{ textAlign: "center", padding: 20 }}>
            <div style={{ fontSize: 11, color: "var(--ink-3)", fontFamily: "var(--mono)", letterSpacing: "0.15em", textTransform: "uppercase" }}>Ежемесячный платёж</div>
            <div style={{ fontSize: 40, fontWeight: 600, color: "var(--orange)", fontFamily: "var(--mono)", marginTop: 4 }}>{fmt(monthly)} ₽</div>
            <div style={{ fontSize: 12, color: "var(--ink-3)", marginTop: 4 }}>{s.annualRate}% годовых</div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginTop: 20 }}>
            {[
              { l: "Стоимость авто", v: `${fmt(s.defaultPrice)} ₽` },
              { l: "Аванс", v: `${s.defaultDown}% · ${fmt(downAmt)} ₽` },
              { l: "Срок", v: `${s.defaultTerm} мес.` },
              { l: "Сумма договора", v: `${fmt(monthly * n + downAmt)} ₽` },
              { l: "Переплата", v: `${fmt(monthly * n + downAmt - s.defaultPrice)} ₽` },
              { l: "Тело кредита", v: `${fmt(principal)} ₽` },
            ].map(({ l, v }) => (
              <div key={l} style={{ padding: 12, borderRadius: 8, background: "var(--bg-3)" }}>
                <div style={{ fontSize: 10, color: "var(--ink-3)", fontFamily: "var(--mono)", textTransform: "uppercase", letterSpacing: "0.1em" }}>{l}</div>
                <div style={{ fontSize: 14, fontWeight: 500, marginTop: 4, fontFamily: "var(--mono)" }}>{v}</div>
              </div>
            ))}
          </div>

          <div style={{ marginTop: 20, padding: 14, borderRadius: 8, background: "rgba(251,191,36,0.08)", border: "1px solid rgba(251,191,36,0.15)" }}>
            <div style={{ fontSize: 12, color: "var(--orange)", fontWeight: 500, marginBottom: 6 }}>Формула</div>
            <div style={{ fontSize: 11, color: "var(--ink-2)", fontFamily: "var(--mono)", lineHeight: 1.6 }}>
              M = P × [r × (1+r)^n] / [(1+r)^n − 1]<br />
              P = цена − аванс = {fmt(principal)} ₽<br />
              r = {s.annualRate}% / 12 = {(s.annualRate / 12).toFixed(4)}%<br />
              n = {s.defaultTerm} месяцев
            </div>
          </div>
        </div>
      </div>

      {/* Banner settings */}
      <div style={{ marginTop: 24, padding: 24, borderRadius: 14, border: "1px solid var(--line)", background: "var(--bg-2)" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
          <div style={{ fontSize: 15, fontWeight: 500 }}>Баннер над хедером</div>
          <label style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13, cursor: "pointer" }}>
            <input
              type="checkbox"
              checked={s.bannerEnabled}
              onChange={(e) => upd("bannerEnabled", e.target.checked)}
              style={{ width: 18, height: 18, accentColor: "var(--orange)" }}
            />
            Включён
          </label>
        </div>

        <div style={fieldStyle}>
          <span style={labelStyle}>Бейдж (слева)</span>
          <input
            style={{ ...inputStyle, width: 200, textAlign: "left" }}
            type="text"
            value={s.bannerBadge}
            onChange={(e) => upd("bannerBadge", e.target.value)}
            placeholder="В наличии"
          />
        </div>
        <div style={fieldStyle}>
          <span style={labelStyle}>Текст</span>
          <input
            style={{ ...inputStyle, width: 400, textAlign: "left" }}
            type="text"
            value={s.bannerText}
            onChange={(e) => upd("bannerText", e.target.value)}
            placeholder="6 автомобилей Toyota Camry..."
          />
        </div>
        <div style={fieldStyle}>
          <span style={labelStyle}>Ссылка</span>
          <input
            style={{ ...inputStyle, width: 200, textAlign: "left" }}
            type="text"
            value={s.bannerLink}
            onChange={(e) => upd("bannerLink", e.target.value)}
            placeholder="/catalog"
          />
        </div>
        <div style={{ ...fieldStyle, borderBottom: "none" }}>
          <span style={labelStyle}>Текст кнопки</span>
          <input
            style={{ ...inputStyle, width: 200, textAlign: "left" }}
            type="text"
            value={s.bannerButtonText}
            onChange={(e) => upd("bannerButtonText", e.target.value)}
            placeholder="Смотреть каталог"
          />
        </div>
      </div>

      {/* Bottom save button */}
      <div style={{ marginTop: 20, textAlign: "right" }}>
        <button
          onClick={save}
          disabled={saving}
          style={{
            padding: "10px 24px", borderRadius: 10,
            background: saved ? "#6ddc6d" : "var(--orange)",
            color: saved ? "#0a3a0a" : "#0c0a08",
            fontSize: 14, fontWeight: 500, border: "none",
            cursor: saving ? "wait" : "pointer",
          }}
        >
          {saving ? "Сохранение..." : saved ? "Сохранено ✓" : "Сохранить все настройки"}
        </button>
      </div>
    </div>
  );
}
