import { NextResponse } from "next/server";
import { readFile, writeFile } from "fs/promises";
import { join } from "path";

const DATA_FILE = join(process.cwd(), "data", "cars.json");

async function readCars() {
  try {
    const data = await readFile(DATA_FILE, "utf-8");
    return JSON.parse(data);
  } catch {
    return [];
  }
}

export async function GET() {
  const cars = await readCars();
  return NextResponse.json({ cars });
}

export async function DELETE(request: Request) {
  try {
    const { id } = await request.json();
    if (!id) return NextResponse.json({ error: "Нет id" }, { status: 400 });
    const cars = await readCars();
    const filtered = cars.filter((c: { id: number }) => c.id !== id);
    if (filtered.length === cars.length) {
      return NextResponse.json({ error: "Не найден" }, { status: 404 });
    }
    await writeFile(DATA_FILE, JSON.stringify(filtered, null, 2));
    return NextResponse.json({ ok: true });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Ошибка удаления" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const car = await request.json();

    // Generate slug
    const slug = `${car.brand || "car"}-${car.name || "auto"}-${Date.now()}`
      .toLowerCase()
      .replace(/[^a-z0-9а-яё]+/gi, "-")
      .replace(/-+/g, "-")
      .slice(0, 60);

    const newCar = {
      id: Date.now(),
      slug,
      brand: car.brand || car.name?.split(" ")[0] || "—",
      name: car.name || "—",
      trim: car.trim || "",
      generation: car.generation || "",
      year: car.year || 2025,
      fuel: car.fuel || "Бензин",
      engine: car.engine || "",
      power: car.power || 0,
      drive: car.drive || "Передний",
      tx: car.transmission || "Автомат",
      body: car.bodyType || "Седан",
      color: car.color || "",
      mileage: car.mileage || 0,
      price: car.price || 0,
      monthly: Math.round((car.price || 0) * 0.8 / 36 * 1.15 / 0.85) || 0,
      status: "В наличии",
      nds: car.nds || false,
      tag: "",
      img: car.images?.[0] || "",
      gallery: car.images || [],
      features: [car.nds ? "НДС к вычету" : "Без НДС", "ЭПТС"].filter(Boolean),
      description: car.description || "",
      specs: {
        "Двигатель": car.engine || "—",
        "Мощность": car.power ? `${car.power} л.с.` : "—",
        "КПП": car.transmission || "—",
        "Привод": car.drive || "—",
        "Кузов": car.bodyType || "—",
        "Цвет": car.color || "—",
        "Пробег": car.mileage ? `${car.mileage} км` : "0 км",
        "Год": String(car.year || 2025),
      },
      autoruUrl: car.sourceUrl || "",
      kpFile: car.kpFile || "",
      createdAt: new Date().toISOString(),
    };

    const cars = await readCars();
    cars.push(newCar);

    // Ensure data directory exists
    const { mkdir } = await import("fs/promises");
    await mkdir(join(process.cwd(), "data"), { recursive: true });

    await writeFile(DATA_FILE, JSON.stringify(cars, null, 2));

    return NextResponse.json({ ok: true, car: newCar }, { status: 201 });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Ошибка сохранения" },
      { status: 500 }
    );
  }
}
