"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

interface Lead {
  id: number;
  name: string;
  phone: string;
  carId?: string | null;
  source: string;
  status: string;
  createdAt: string;
}

const statusColors: Record<string, string> = {
  new: "#fbbf24",
  in_progress: "#3b82f6",
  done: "#6ddc6d",
  rejected: "#666",
};
const statusLabels: Record<string, string> = {
  new: "Новая",
  in_progress: "В работе",
  done: "Завершена",
  rejected: "Отклонена",
};

interface DayStat { date: string; visitors: number; hits: number }

export default function AdminPage() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [aiLoading, setAiLoading] = useState(false);
  const [aiResult, setAiResult] = useState<string | null>(null);
  const [visitStats, setVisitStats] = useState<DayStat[]>([]);

  useEffect(() => {
    fetch("/api/leads")
      .then((r) => r.json())
      .then((d) => setLeads(d.leads || []))
      .finally(() => setLoading(false));
    fetch("/api/analytics/hit")
      .then((r) => r.json())
      .then((d) => setVisitStats(d.stats || []))
      .catch(() => {});
  }, []);

  const runAI = async () => {
    setAiLoading(true);
    setAiResult(null);
    try {
      const res = await fetch("/api/analytics/report", { method: "POST" });
      const data = await res.json();
      if (res.ok) {
        setAiResult(data.analysis);
      } else {
        setAiResult(`Ошибка: ${data.error}`);
      }
    } catch {
      setAiResult("Ошибка сети");
    } finally {
      setAiLoading(false);
    }
  };

  const newCount = leads.filter((l) => l.status === "new").length;
  const inProgressCount = leads.filter((l) => l.status === "in_progress").length;
  const doneCount = leads.filter((l) => l.status === "done").length;

  // top cars
  const carCounts: Record<string, number> = {};
  for (const l of leads) {
    if (l.carId) carCounts[l.carId] = (carCounts[l.carId] || 0) + 1;
  }
  const topCars = Object.entries(carCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3);

  // today
  const todayStr = new Date().toDateString();
  const todayCount = leads.filter((l) => new Date(l.createdAt).toDateString() === todayStr).length;

  // visits
  const todayDate = new Date().toISOString().slice(0, 10);
  const todayVisits = visitStats.find((d) => d.date === todayDate);
  const totalVisitors = visitStats.reduce((s, d) => s + d.visitors, 0);
  const weekAgo = new Date(Date.now() - 7 * 86400000).toISOString().slice(0, 10);
  const weekVisitors = visitStats.filter((d) => d.date >= weekAgo).reduce((s, d) => s + d.visitors, 0);

  const cardStyle: React.CSSProperties = {
    padding: 24,
    borderRadius: 14,
    border: "1px solid var(--line)",
    background: "var(--bg-2)",
  };

  if (loading) return <div style={{ padding: 40, textAlign: "center", color: "var(--ink-3)" }}>Загрузка...</div>;

  return (
    <div>
      <h1 className="admin-h1" style={{ fontSize: 28, fontWeight: 500, marginBottom: 24 }}>
        Панель управления
      </h1>

      {/* Stats row */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12, marginBottom: 12 }}>
        {[
          { label: "Посетители сегодня", value: todayVisits?.visitors ?? 0, color: "#a78bfa" },
          { label: "За неделю", value: weekVisitors, color: "#818cf8" },
          { label: "Всего посетителей", value: totalVisitors, color: "var(--ink)" },
          { label: "Просмотры сегодня", value: todayVisits?.hits ?? 0, color: "var(--ink-2)" },
        ].map((s) => (
          <div key={s.label} style={cardStyle}>
            <div style={{ fontSize: 11, color: "var(--ink-3)", textTransform: "uppercase", letterSpacing: "0.1em", fontFamily: "var(--mono)" }}>
              {s.label}
            </div>
            <div style={{ fontSize: 32, fontWeight: 600, color: s.color, marginTop: 6 }}>{s.value}</div>
          </div>
        ))}
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12, marginBottom: 24 }}>
        {[
          { label: "Всего заявок", value: leads.length, color: "var(--ink)" },
          { label: "Новые заявки", value: newCount, color: "#fbbf24" },
          { label: "В работе", value: inProgressCount, color: "#3b82f6" },
          { label: "Заявки сегодня", value: todayCount, color: "#6ddc6d" },
        ].map((s) => (
          <div key={s.label} style={cardStyle}>
            <div style={{ fontSize: 11, color: "var(--ink-3)", textTransform: "uppercase", letterSpacing: "0.1em", fontFamily: "var(--mono)" }}>
              {s.label}
            </div>
            <div style={{ fontSize: 32, fontWeight: 600, color: s.color, marginTop: 6 }}>{s.value}</div>
          </div>
        ))}
      </div>

      {/* Nav cards */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12, marginBottom: 24 }}>
        <Link href="/admin/leads" style={{ ...cardStyle, textDecoration: "none", color: "var(--ink)" }}>
          <div style={{ fontSize: 17, fontWeight: 500, marginBottom: 6 }}>Заявки</div>
          <div style={{ fontSize: 13, color: "var(--ink-2)" }}>Таблица, статусы, фильтры</div>
        </Link>
        <Link href="/admin/cars" style={{ ...cardStyle, textDecoration: "none", color: "var(--ink)" }}>
          <div style={{ fontSize: 17, fontWeight: 500, marginBottom: 6 }}>Автомобили</div>
          <div style={{ fontSize: 13, color: "var(--ink-2)" }}>Добавить, удалить, просмотр</div>
        </Link>
        <Link href="/admin/settings" style={{ ...cardStyle, textDecoration: "none", color: "var(--ink)" }}>
          <div style={{ fontSize: 17, fontWeight: 500, marginBottom: 6 }}>Настройки</div>
          <div style={{ fontSize: 13, color: "var(--ink-2)" }}>Калькулятор, баннер</div>
        </Link>
      </div>

      {/* Top cars + AI */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 24 }}>
        {/* Popular cars */}
        <div style={cardStyle}>
          <div style={{ fontSize: 15, fontWeight: 500, marginBottom: 14 }}>Популярные авто</div>
          {topCars.length === 0 ? (
            <div style={{ fontSize: 13, color: "var(--ink-3)" }}>Нет данных</div>
          ) : (
            topCars.map(([name, count], i) => (
              <div key={name} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "8px 0", borderTop: i > 0 ? "1px solid var(--line)" : undefined }}>
                <span style={{ fontSize: 13 }}>{name}</span>
                <span style={{ fontSize: 13, fontWeight: 600, color: "var(--orange)", fontFamily: "var(--mono)" }}>{count} заявок</span>
              </div>
            ))
          )}
        </div>

        {/* AI Analytics */}
        <div style={cardStyle}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
            <div style={{ fontSize: 15, fontWeight: 500 }}>AI-аналитика</div>
            <button
              onClick={runAI}
              disabled={aiLoading}
              style={{
                padding: "6px 14px",
                borderRadius: 8,
                background: aiLoading ? "var(--line)" : "var(--orange)",
                color: aiLoading ? "var(--ink-3)" : "#0c0a08",
                fontSize: 12,
                fontWeight: 500,
                border: "none",
                cursor: aiLoading ? "wait" : "pointer",
              }}
            >
              {aiLoading ? "Анализ..." : "Сгенерировать отчёт"}
            </button>
          </div>
          <div style={{ fontSize: 12, color: "var(--ink-3)", marginBottom: 8 }}>
            DeepSeek проанализирует заявки и отправит отчёт в Telegram
          </div>
          {aiResult && (
            <pre style={{ fontSize: 12, color: "var(--ink-2)", whiteSpace: "pre-wrap", lineHeight: 1.5, maxHeight: 300, overflow: "auto", marginTop: 8, padding: 12, background: "var(--bg-3)", borderRadius: 8 }}>
              {aiResult}
            </pre>
          )}
        </div>
      </div>

      {/* Recent leads */}
      <div style={cardStyle}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
          <div style={{ fontSize: 15, fontWeight: 500 }}>Последние заявки</div>
          <Link href="/admin/leads" style={{ fontSize: 12, color: "var(--orange)" }}>Все заявки →</Link>
        </div>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
          <thead>
            <tr style={{ borderBottom: "1px solid var(--line)" }}>
              <th style={{ textAlign: "left", padding: "8px 4px", color: "var(--ink-3)", fontWeight: 400, fontFamily: "var(--mono)", fontSize: 11 }}>Статус</th>
              <th style={{ textAlign: "left", padding: "8px 4px", color: "var(--ink-3)", fontWeight: 400, fontFamily: "var(--mono)", fontSize: 11 }}>Имя</th>
              <th style={{ textAlign: "left", padding: "8px 4px", color: "var(--ink-3)", fontWeight: 400, fontFamily: "var(--mono)", fontSize: 11 }}>Телефон</th>
              <th style={{ textAlign: "left", padding: "8px 4px", color: "var(--ink-3)", fontWeight: 400, fontFamily: "var(--mono)", fontSize: 11 }}>Авто</th>
              <th style={{ textAlign: "left", padding: "8px 4px", color: "var(--ink-3)", fontWeight: 400, fontFamily: "var(--mono)", fontSize: 11 }}>Дата</th>
            </tr>
          </thead>
          <tbody>
            {leads.slice(0, 8).map((l) => (
              <tr key={l.id} style={{ borderBottom: "1px solid var(--line)" }}>
                <td style={{ padding: "8px 4px" }}>
                  <span style={{
                    display: "inline-block", padding: "2px 8px", borderRadius: 6, fontSize: 10,
                    background: (statusColors[l.status] || "#666") + "22",
                    color: statusColors[l.status] || "#666",
                    border: `1px solid ${(statusColors[l.status] || "#666")}44`,
                  }}>
                    {statusLabels[l.status] || l.status}
                  </span>
                </td>
                <td style={{ padding: "8px 4px", fontWeight: 500 }}>{l.name}</td>
                <td style={{ padding: "8px 4px", color: "var(--orange)", fontFamily: "var(--mono)" }}>{l.phone}</td>
                <td style={{ padding: "8px 4px", color: "var(--ink-2)", maxWidth: 180, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                  {l.carId || "—"}
                </td>
                <td style={{ padding: "8px 4px", color: "var(--ink-3)", fontFamily: "var(--mono)", fontSize: 11 }}>
                  {new Date(l.createdAt).toLocaleString("ru-RU", { day: "2-digit", month: "2-digit", hour: "2-digit", minute: "2-digit" })}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {leads.length === 0 && (
          <div style={{ textAlign: "center", padding: 24, color: "var(--ink-3)" }}>Заявок пока нет</div>
        )}
      </div>
    </div>
  );
}
