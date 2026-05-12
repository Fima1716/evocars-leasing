"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";

interface Lead {
  id: number;
  name: string;
  phone: string;
  email?: string | null;
  company?: string | null;
  carId?: string | null;
  message?: string | null;
  calcTerm?: number | null;
  calcDown?: number | null;
  calcPayment?: number | null;
  source: string;
  status: string;
  createdAt: string;
}

const statusLabels: Record<string, string> = {
  new: "Новая",
  in_progress: "В работе",
  done: "Завершена",
  rejected: "Отклонена",
};

const statusColors: Record<string, string> = {
  new: "#fbbf24",
  in_progress: "#3b82f6",
  done: "#6ddc6d",
  rejected: "#666",
};

const sourceLabels: Record<string, string> = {
  WEBSITE: "Сайт",
  CALLBACK: "Звонок",
  EXIT_POPUP: "Exit-popup",
  CALCULATOR: "Калькулятор",
  TESTDRIVE: "Тест-драйв",
  REFERRAL: "Реферал",
  OTHER: "Другое",
};

const fmt = (v: number) => v.toLocaleString("ru-RU");

export function AdminLeadsClient() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [sourceFilter, setSourceFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [sortField, setSortField] = useState<"createdAt" | "name" | "status">("createdAt");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("desc");

  useEffect(() => {
    fetch("/api/leads")
      .then((r) => r.json())
      .then((d) => setLeads(d.leads || []))
      .finally(() => setLoading(false));
  }, []);

  const updateStatus = async (id: number, status: string) => {
    const res = await fetch("/api/leads", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, status }),
    });
    if (res.ok) setLeads((l) => l.map((lead) => (lead.id === id ? { ...lead, status } : lead)));
  };

  const deleteLead = async (id: number) => {
    if (!confirm("Удалить заявку?")) return;
    const res = await fetch("/api/leads", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    if (res.ok) setLeads((l) => l.filter((lead) => lead.id !== id));
  };

  const toggleSort = (field: typeof sortField) => {
    if (sortField === field) setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    else { setSortField(field); setSortDir("desc"); }
  };

  const filtered = useMemo(() => {
    let list = filter === "all" ? leads : leads.filter((l) => l.status === filter);
    if (sourceFilter !== "all") list = list.filter((l) => l.source === sourceFilter);
    if (search) {
      const q = search.toLowerCase();
      list = list.filter(
        (l) =>
          l.name.toLowerCase().includes(q) ||
          l.phone.includes(q) ||
          (l.carId && l.carId.toLowerCase().includes(q)) ||
          (l.company && l.company.toLowerCase().includes(q))
      );
    }
    list.sort((a, b) => {
      let cmp = 0;
      if (sortField === "createdAt") cmp = new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
      else if (sortField === "name") cmp = a.name.localeCompare(b.name);
      else if (sortField === "status") cmp = a.status.localeCompare(b.status);
      return sortDir === "asc" ? cmp : -cmp;
    });
    return list;
  }, [leads, filter, sourceFilter, search, sortField, sortDir]);

  const newCount = leads.filter((l) => l.status === "new").length;

  const thStyle: React.CSSProperties = {
    textAlign: "left", padding: "10px 8px", color: "var(--ink-3)",
    fontWeight: 400, fontFamily: "var(--mono)", fontSize: 10,
    textTransform: "uppercase", letterSpacing: "0.12em",
    borderBottom: "1px solid var(--line)", cursor: "pointer",
    userSelect: "none", whiteSpace: "nowrap",
  };
  const tdStyle: React.CSSProperties = { padding: "10px 8px", borderBottom: "1px solid var(--line)", fontSize: 13, verticalAlign: "middle" };

  if (loading) return <div style={{ padding: 40, textAlign: "center", color: "var(--ink-3)" }}>Загрузка...</div>;

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
        <div>
          <Link href="/admin" style={{ fontSize: 12, color: "var(--ink-3)", textDecoration: "none" }}>← Панель управления</Link>
          <h1 style={{ fontSize: 24, fontWeight: 500, marginTop: 6 }}>
            Заявки {newCount > 0 && <span style={{ fontSize: 14, color: "var(--orange)", fontWeight: 400 }}>({newCount} новых)</span>}
          </h1>
        </div>
        <input
          type="text"
          placeholder="Поиск по имени, телефону, авто..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{
            padding: "8px 14px", borderRadius: 8, border: "1px solid var(--line)",
            background: "var(--bg-3)", color: "var(--ink)", fontSize: 13, width: 280,
          }}
        />
      </div>

      {/* Filters */}
      <div style={{ display: "flex", gap: 6, marginBottom: 16, flexWrap: "wrap" }}>
        {[
          { key: "all", label: `Все (${leads.length})` },
          { key: "new", label: `Новые (${leads.filter((l) => l.status === "new").length})` },
          { key: "in_progress", label: `В работе (${leads.filter((l) => l.status === "in_progress").length})` },
          { key: "done", label: `Завершённые (${leads.filter((l) => l.status === "done").length})` },
          { key: "rejected", label: `Отклонённые (${leads.filter((l) => l.status === "rejected").length})` },
        ].map((f) => (
          <button
            key={f.key}
            onClick={() => setFilter(f.key)}
            style={{
              padding: "5px 12px", borderRadius: 6, fontSize: 12, fontWeight: 500,
              border: `1px solid ${filter === f.key ? "var(--orange)" : "var(--line)"}`,
              background: filter === f.key ? "rgba(251,191,36,0.1)" : "transparent",
              color: filter === f.key ? "var(--orange)" : "var(--ink-2)",
              cursor: "pointer",
            }}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Source filters */}
      <div style={{ display: "flex", gap: 6, marginBottom: 16, flexWrap: "wrap" }}>
        <span style={{ fontSize: 11, color: "var(--ink-3)", alignSelf: "center", marginRight: 4 }}>Источник:</span>
        {[
          { key: "all", label: "Все" },
          ...Object.entries(sourceLabels).map(([key, label]) => ({
            key,
            label: `${label} (${leads.filter((l) => l.source === key).length})`,
          })),
        ].map((f) => (
          <button
            key={f.key}
            onClick={() => setSourceFilter(f.key)}
            style={{
              padding: "4px 10px", borderRadius: 6, fontSize: 11, fontWeight: 500,
              border: `1px solid ${sourceFilter === f.key ? "#3b82f6" : "var(--line)"}`,
              background: sourceFilter === f.key ? "rgba(59,130,246,0.1)" : "transparent",
              color: sourceFilter === f.key ? "#3b82f6" : "var(--ink-2)",
              cursor: "pointer",
            }}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Table */}
      <div style={{ borderRadius: 14, border: "1px solid var(--line)", background: "var(--bg-2)", overflow: "hidden" }}>
        {filtered.length === 0 ? (
          <div style={{ textAlign: "center", padding: 48, color: "var(--ink-3)", fontSize: 14 }}>
            {leads.length === 0 ? "Заявок пока нет" : "Нет заявок по фильтру"}
          </div>
        ) : (
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr>
                  <th style={thStyle} onClick={() => toggleSort("status")}>
                    Статус {sortField === "status" && (sortDir === "asc" ? "↑" : "↓")}
                  </th>
                  <th style={thStyle} onClick={() => toggleSort("name")}>
                    Контакт {sortField === "name" && (sortDir === "asc" ? "↑" : "↓")}
                  </th>
                  <th style={thStyle}>Авто</th>
                  <th style={thStyle}>Источник</th>
                  <th style={thStyle}>Расчёт</th>
                  <th style={thStyle} onClick={() => toggleSort("createdAt")}>
                    Дата {sortField === "createdAt" && (sortDir === "asc" ? "↑" : "↓")}
                  </th>
                  <th style={{ ...thStyle, textAlign: "right" }}>Действия</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((lead) => (
                  <tr key={lead.id} style={{ transition: "background 0.15s" }} onMouseEnter={(e) => (e.currentTarget.style.background = "var(--bg-3)")} onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}>
                    <td style={tdStyle}>
                      <span style={{
                        display: "inline-block", padding: "3px 8px", borderRadius: 6, fontSize: 10,
                        fontWeight: 500, background: (statusColors[lead.status] || "#666") + "22",
                        color: statusColors[lead.status] || "#666",
                        border: `1px solid ${(statusColors[lead.status] || "#666")}44`,
                      }}>
                        {statusLabels[lead.status] || lead.status}
                      </span>
                    </td>
                    <td style={tdStyle}>
                      <div style={{ fontWeight: 500 }}>{lead.name}</div>
                      <a href={`tel:${lead.phone}`} style={{ fontSize: 12, color: "var(--orange)", textDecoration: "none", fontFamily: "var(--mono)" }}>
                        {lead.phone}
                      </a>
                      {lead.company && <div style={{ fontSize: 11, color: "var(--ink-3)", marginTop: 2 }}>{lead.company}</div>}
                    </td>
                    <td style={{ ...tdStyle, maxWidth: 200 }}>
                      {lead.carId ? (
                        <span style={{ fontSize: 12, color: "#3b82f6" }}>{lead.carId}</span>
                      ) : (
                        <span style={{ fontSize: 12, color: "var(--ink-3)" }}>—</span>
                      )}
                      {lead.message && (
                        <div style={{ fontSize: 11, color: "var(--ink-3)", marginTop: 3, whiteSpace: "pre-line", lineHeight: 1.3 }}>
                          {lead.message}
                        </div>
                      )}
                    </td>
                    <td style={tdStyle}>
                      <span style={{ fontSize: 11, fontFamily: "var(--mono)", color: "var(--ink-2)" }}>
                        {sourceLabels[lead.source] || lead.source}
                      </span>
                    </td>
                    <td style={tdStyle}>
                      {lead.calcTerm ? (
                        <span style={{ fontSize: 11, fontFamily: "var(--mono)", color: "var(--ink-2)" }}>
                          {lead.calcTerm}м / {lead.calcDown}% / {fmt(lead.calcPayment || 0)}₽
                        </span>
                      ) : (
                        <span style={{ fontSize: 11, color: "var(--ink-3)" }}>—</span>
                      )}
                    </td>
                    <td style={{ ...tdStyle, fontFamily: "var(--mono)", fontSize: 11, color: "var(--ink-3)", whiteSpace: "nowrap" }}>
                      {new Date(lead.createdAt).toLocaleString("ru-RU", { day: "2-digit", month: "2-digit", year: "2-digit", hour: "2-digit", minute: "2-digit" })}
                    </td>
                    <td style={{ ...tdStyle, textAlign: "right", whiteSpace: "nowrap" }}>
                      <select
                        value={lead.status}
                        onChange={(e) => updateStatus(lead.id, e.target.value)}
                        style={{
                          padding: "3px 6px", borderRadius: 6, fontSize: 11,
                          border: "1px solid var(--line)", background: "var(--bg-3)",
                          color: "var(--ink)", marginRight: 6,
                        }}
                      >
                        <option value="new">Новая</option>
                        <option value="in_progress">В работе</option>
                        <option value="done">Завершена</option>
                        <option value="rejected">Отклонена</option>
                      </select>
                      <button
                        onClick={() => deleteLead(lead.id)}
                        style={{
                          padding: "3px 8px", borderRadius: 6, fontSize: 11,
                          border: "1px solid rgba(255,107,107,0.3)", background: "transparent",
                          color: "#ff6b6b", cursor: "pointer",
                        }}
                      >
                        ✕
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <div style={{ marginTop: 12, fontSize: 12, color: "var(--ink-3)", fontFamily: "var(--mono)" }}>
        Показано: {filtered.length} из {leads.length}
      </div>
    </div>
  );
}
