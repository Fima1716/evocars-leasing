import { NextResponse } from "next/server";
import { readFile, writeFile, mkdir } from "fs/promises";
import { join } from "path";

const FILE = join(process.cwd(), "data", "settings.json");

const DEFAULTS = {
  annualRate: 15,
  minDown: 10,
  maxDown: 49,
  terms: [12, 24, 36, 48, 60],
  defaultTerm: 36,
  defaultDown: 20,
  minPrice: 3000000,
  maxPrice: 8000000,
  priceStep: 50000,
  defaultPrice: 5200000,
  calculatorEnabled: true,
  bannerEnabled: true,
  bannerBadge: "В наличии",
  bannerText: "6 автомобилей Toyota Camry IX (XV80) — 2025 год, гибрид, от 5 100 000 ₽",
  bannerLink: "/catalog",
  bannerButtonText: "Смотреть каталог",
};

export async function GET() {
  try {
    const raw = await readFile(FILE, "utf-8");
    return NextResponse.json({ ...DEFAULTS, ...JSON.parse(raw) });
  } catch {
    return NextResponse.json(DEFAULTS);
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const settings = {
      annualRate: Number(body.annualRate) || DEFAULTS.annualRate,
      minDown: Number(body.minDown) || DEFAULTS.minDown,
      maxDown: Number(body.maxDown) || DEFAULTS.maxDown,
      terms: Array.isArray(body.terms) ? body.terms.map(Number).filter((n: number) => n > 0) : DEFAULTS.terms,
      defaultTerm: Number(body.defaultTerm) || DEFAULTS.defaultTerm,
      defaultDown: Number(body.defaultDown) || DEFAULTS.defaultDown,
      minPrice: Number(body.minPrice) || DEFAULTS.minPrice,
      maxPrice: Number(body.maxPrice) || DEFAULTS.maxPrice,
      priceStep: Number(body.priceStep) || DEFAULTS.priceStep,
      defaultPrice: Number(body.defaultPrice) || DEFAULTS.defaultPrice,
      calculatorEnabled: body.calculatorEnabled !== undefined ? Boolean(body.calculatorEnabled) : DEFAULTS.calculatorEnabled,
      bannerEnabled: body.bannerEnabled !== undefined ? Boolean(body.bannerEnabled) : DEFAULTS.bannerEnabled,
      bannerBadge: typeof body.bannerBadge === "string" ? body.bannerBadge : DEFAULTS.bannerBadge,
      bannerText: typeof body.bannerText === "string" ? body.bannerText : DEFAULTS.bannerText,
      bannerLink: typeof body.bannerLink === "string" ? body.bannerLink : DEFAULTS.bannerLink,
      bannerButtonText: typeof body.bannerButtonText === "string" ? body.bannerButtonText : DEFAULTS.bannerButtonText,
    };
    await mkdir(join(process.cwd(), "data"), { recursive: true });
    await writeFile(FILE, JSON.stringify(settings, null, 2));
    return NextResponse.json({ ok: true, settings });
  } catch {
    return NextResponse.json({ error: "Ошибка сохранения" }, { status: 500 });
  }
}
