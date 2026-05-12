import https from "https";

const TELEGRAM_IP = "149.154.167.220";
const TELEGRAM_HOST = "api.telegram.org";

function sendRequest(path: string, payload: Record<string, unknown>): Promise<string> {
  return new Promise((resolve, reject) => {
    const data = JSON.stringify(payload);
    const req = https.request(
      {
        hostname: TELEGRAM_IP,
        port: 443,
        path,
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Content-Length": Buffer.byteLength(data),
          "Host": TELEGRAM_HOST,
        },
        rejectUnauthorized: false,
        servername: TELEGRAM_HOST,
      },
      (res) => {
        let body = "";
        res.on("data", (chunk) => (body += chunk));
        res.on("end", () => {
          if (res.statusCode && res.statusCode >= 200 && res.statusCode < 300) {
            resolve(body);
          } else {
            reject(new Error(`Telegram ${res.statusCode}: ${body}`));
          }
        });
      }
    );
    req.on("error", reject);
    req.write(data);
    req.end();
  });
}

export async function sendTelegramNotification(message: string, carUrl?: string | null) {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;

  if (!token || !chatId) {
    console.warn("[TG] not configured — TELEGRAM_BOT_TOKEN or TELEGRAM_CHAT_ID missing");
    return;
  }

  const payload: Record<string, unknown> = {
    chat_id: chatId,
    text: message,
    parse_mode: "HTML",
  };

  if (carUrl) {
    payload.reply_markup = {
      inline_keyboard: [[{ text: "🚗 Открыть автомобиль", url: carUrl }]],
    };
  }

  try {
    const result = await sendRequest(`/bot${token}/sendMessage`, payload);
    console.log("[TG] sent OK:", result.substring(0, 100));
  } catch (err) {
    console.error("[TG] FAILED:", err);
  }
}

export function formatLeadMessage(lead: {
  name: string;
  phone: string;
  company?: string | null;
  carId?: string | null;
  message?: string | null;
  source: string;
  calcTerm?: number | null;
  calcDown?: number | null;
  calcPayment?: number | null;
  refCode?: string | null;
  utmSource?: string | null;
}): { text: string; carUrl: string | null } {
  const fmt = (v: number) => new Intl.NumberFormat("ru-RU").format(v);
  const siteUrl = process.env.SITE_URL || process.env.NEXT_PUBLIC_SITE_URL || "https://leasing.evocars.ru";

  let carUrl: string | null = null;

  let msg = `🔔 <b>Новая заявка!</b>\n\n`;
  msg += `👤 <b>${lead.name}</b>\n`;
  msg += `📞 ${lead.phone}\n`;

  if (lead.company) msg += `🏢 ${lead.company}\n`;

  if (lead.carId) {
    msg += `🚗 <b>${lead.carId}</b>\n`;
    if (lead.message?.startsWith("/catalog/")) {
      carUrl = `${siteUrl}${lead.message}`;
    } else {
      carUrl = `${siteUrl}/catalog`;
    }
  }

  msg += `\n📍 ${sourceLabel(lead.source)}`;

  if (lead.calcTerm && lead.calcDown != null && lead.calcPayment) {
    msg += `\n\n💰 <b>Расчёт:</b> ${lead.calcTerm} мес., аванс ${lead.calcDown}%, платёж ${fmt(lead.calcPayment)} ₽/мес`;
  }

  if (lead.utmSource) {
    msg += `\n\n🔗 Источник: ${lead.utmSource}`;
  }

  if (lead.message && !lead.message.startsWith("/catalog/")) {
    msg += `\n\n💬 ${lead.message}`;
  }

  if (lead.refCode) {
    const refUrl = `${siteUrl}/?ref=${lead.refCode}`;
    msg += `\n\n🤝 <b>Реферальная ссылка:</b>\n<code>${refUrl}</code>`;
  }

  msg += `\n\n⏰ ${new Date().toLocaleString("ru-RU", { timeZone: "Europe/Moscow" })}`;

  return { text: msg, carUrl };
}

function sourceLabel(source: string) {
  const labels: Record<string, string> = {
    WEBSITE: "📋 Форма на сайте",
    CALLBACK: "📞 Обратный звонок",
    EXIT_POPUP: "🚪 Exit-popup",
    CALCULATOR: "🧮 Калькулятор",
    TESTDRIVE: "🏁 Тест-драйв",
    REFERRAL: "🤝 Реферальная программа",
    OTHER: "💬 Другое",
  };
  return labels[source] || source;
}
