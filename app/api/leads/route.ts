import { NextResponse } from "next/server";
import { readFile, writeFile, mkdir } from "fs/promises";
import { join } from "path";
import { leadSchema } from "@/lib/validations";
import { sendTelegramNotification, formatLeadMessage } from "@/lib/telegram";

const DATA_FILE = join(process.cwd(), "data", "leads.json");

async function readLeads() {
  try {
    const data = await readFile(DATA_FILE, "utf-8");
    return JSON.parse(data);
  } catch {
    return [];
  }
}

export async function GET() {
  const leads = await readLeads();
  return NextResponse.json({ leads });
}

export async function POST(request: Request) {
  console.log("[Leads API] POST received at", new Date().toISOString());
  try {
    const body = await request.json();
    console.log("[Leads API] Body:", JSON.stringify(body).substring(0, 200));
    const parsed = leadSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        {
          error: "Validation error",
          details: parsed.error.issues.map((e) => ({
            field: e.path.join("."),
            message: e.message,
          })),
        },
        { status: 400 }
      );
    }

    const data = parsed.data;

    // Generate ref code for REFERRAL leads
    const refCode = data.source === "REFERRAL"
      ? Math.random().toString(36).substring(2, 8).toUpperCase()
      : null;

    const lead = {
      id: Date.now(),
      name: data.name,
      phone: data.phone,
      email: data.email || null,
      company: data.company || null,
      carId: data.carId || null,
      message: data.message || null,
      calcTerm: data.calcTerm ?? null,
      calcDown: data.calcDown ?? null,
      calcPayment: data.calcPayment ?? null,
      source: data.source,
      refCode,
      utmSource: data.utmSource || null,
      utmMedium: data.utmMedium || null,
      utmCampaign: data.utmCampaign || null,
      status: "new",
      createdAt: new Date().toISOString(),
    };

    const leads = await readLeads();
    leads.unshift(lead);

    await mkdir(join(process.cwd(), "data"), { recursive: true });
    await writeFile(DATA_FILE, JSON.stringify(leads, null, 2));

    // Fire-and-forget Telegram notification
    const { text, carUrl } = formatLeadMessage({
      name: lead.name,
      phone: lead.phone,
      company: lead.company,
      carId: lead.carId,
      message: lead.message,
      source: lead.source,
      calcTerm: lead.calcTerm,
      calcDown: lead.calcDown,
      calcPayment: lead.calcPayment,
      refCode: lead.refCode,
      utmSource: lead.utmSource,
    });
    sendTelegramNotification(text, carUrl).catch(() => {});

    const response: Record<string, unknown> = {
      id: lead.id,
      message: "Заявка принята. Мы свяжемся с вами в ближайшее время.",
    };
    if (refCode) response.refCode = refCode;

    return NextResponse.json(response, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    const { id, status } = await request.json();
    if (!id || !status) return NextResponse.json({ error: "Нет id или status" }, { status: 400 });
    const leads = await readLeads();
    const lead = leads.find((l: { id: number }) => l.id === id);
    if (!lead) return NextResponse.json({ error: "Не найден" }, { status: 404 });
    lead.status = status;
    await writeFile(DATA_FILE, JSON.stringify(leads, null, 2));
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Ошибка" }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { id } = await request.json();
    if (!id) return NextResponse.json({ error: "Нет id" }, { status: 400 });
    const leads = await readLeads();
    const filtered = leads.filter((l: { id: number }) => l.id !== id);
    if (filtered.length === leads.length) return NextResponse.json({ error: "Не найден" }, { status: 404 });
    await writeFile(DATA_FILE, JSON.stringify(filtered, null, 2));
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Ошибка удаления" }, { status: 500 });
  }
}
