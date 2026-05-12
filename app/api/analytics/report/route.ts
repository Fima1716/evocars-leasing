import { NextResponse } from "next/server";
import { readFile } from "fs/promises";
import { join } from "path";
import { sendTelegramNotification } from "@/lib/telegram";

interface Lead {
  id: number;
  name: string;
  phone: string;
  carId?: string | null;
  source: string;
  status: string;
  createdAt: string;
  company?: string | null;
  calcTerm?: number | null;
  calcDown?: number | null;
  calcPayment?: number | null;
}

async function readLeads(): Promise<Lead[]> {
  try {
    const raw = await readFile(join(process.cwd(), "data", "leads.json"), "utf-8");
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

async function callDeepSeek(prompt: string): Promise<string> {
  const key = process.env.DEEPSEEK_API_KEY;
  if (!key) throw new Error("DEEPSEEK_API_KEY not set");

  const res = await fetch("https://api.deepseek.com/chat/completions", {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${key}` },
    body: JSON.stringify({
      model: "deepseek-chat",
      messages: [
        {
          role: "system",
          content: "Ты — аналитик B2B-продаж автомобилей в лизинг. Формируй сжатый отчёт СТРОГО по данным: цифры, проценты, факты. НЕ давай советов, рекомендаций, что улучшить или что делать. Только аналитика и выводы из имеющихся данных. Формат: чёткие пункты с цифрами. Используй эмодзи для структурирования. ВАЖНО: не используй markdown-разметку (никаких **, *, ```, #). Пиши простым текстом. Ответ не более 1500 символов.",
        },
        { role: "user", content: prompt },
      ],
      temperature: 0.3,
      max_tokens: 1500,
    }),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`DeepSeek ${res.status}: ${err}`);
  }

  const data = await res.json();
  return data.choices?.[0]?.message?.content || "Нет ответа";
}

function buildPrompt(leads: Lead[]): string {
  const now = new Date();
  const today = leads.filter((l) => {
    const d = new Date(l.createdAt);
    return d.toDateString() === now.toDateString();
  });
  const week = leads.filter((l) => {
    const d = new Date(l.createdAt);
    return now.getTime() - d.getTime() < 7 * 24 * 3600 * 1000;
  });

  const byStatus: Record<string, number> = {};
  const byCar: Record<string, number> = {};
  const bySource: Record<string, number> = {};
  const byHour: Record<number, number> = {};

  for (const l of leads) {
    byStatus[l.status] = (byStatus[l.status] || 0) + 1;
    if (l.carId) byCar[l.carId] = (byCar[l.carId] || 0) + 1;
    bySource[l.source] = (bySource[l.source] || 0) + 1;
    const h = new Date(l.createdAt).getHours();
    byHour[h] = (byHour[h] || 0) + 1;
  }

  const withCalc = leads.filter((l) => l.calcTerm);
  const avgTerm = withCalc.length > 0 ? Math.round(withCalc.reduce((s, l) => s + (l.calcTerm || 0), 0) / withCalc.length) : 0;
  const avgDown = withCalc.length > 0 ? Math.round(withCalc.reduce((s, l) => s + (l.calcDown || 0), 0) / withCalc.length) : 0;

  return `Данные сайта EVOCARS Leasing (B2B лизинг автомобилей). Дата: ${now.toLocaleDateString("ru-RU")}.

СТАТИСТИКА ЗАЯВОК:
- Всего: ${leads.length}
- Сегодня: ${today.length}
- За неделю: ${week.length}

ПО СТАТУСАМ: ${JSON.stringify(byStatus)}

ПО АВТОМОБИЛЯМ: ${JSON.stringify(byCar)}

ПО ИСТОЧНИКАМ: ${JSON.stringify(bySource)}

ПО ЧАСАМ (МСК): ${JSON.stringify(byHour)}

КАЛЬКУЛЯТОР (${withCalc.length} расчётов):
- Средний срок: ${avgTerm} мес.
- Средний аванс: ${avgDown}%

ПОСЛЕДНИЕ 10 ЗАЯВОК:
${leads
  .slice(0, 10)
  .map((l) => `• ${l.name} | ${l.carId || "без авто"} | ${l.source} | ${l.status} | ${new Date(l.createdAt).toLocaleString("ru-RU")}`)
  .join("\n")}

Сформируй краткий отчёт:
1. Топ автомобилей/комплектаций по заявкам (с %)
2. Распределение по источникам (с %)
3. Конверсия по статусам (с %)
4. Пиковые часы активности
5. Средние параметры калькулятора

НЕ давай рекомендаций и советов. Только цифры и факты.`;
}

export async function POST() {
  try {
    const leads = await readLeads();

    if (leads.length === 0) {
      return NextResponse.json({ error: "Нет заявок для анализа" }, { status: 400 });
    }

    const prompt = buildPrompt(leads);
    const analysis = await callDeepSeek(prompt);

    const tgMsg =
      `📊 <b>AI-аналитика EVOCARS</b>\n` +
      `<i>${new Date().toLocaleString("ru-RU", { timeZone: "Europe/Moscow" })}</i>\n` +
      `<i>Всего заявок: ${leads.length}</i>\n\n` +
      analysis;

    await sendTelegramNotification(tgMsg);

    return NextResponse.json({ ok: true, analysis });
  } catch (err) {
    console.error("[Analytics] Error:", err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Ошибка генерации отчёта" },
      { status: 500 }
    );
  }
}
