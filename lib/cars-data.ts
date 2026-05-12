export interface CarData {
  id: number;
  slug: string;
  brand: string;
  name: string;
  trim: string;
  generation: string;
  year: number;
  fuel: string;
  engine: string;
  power: number;
  drive: string;
  tx: string;
  body: string;
  color: string;
  mileage: number;
  price: number;
  oldPrice: number;
  monthly: number;
  status: string;
  nds: boolean;
  tag: string;
  img: string;
  gallery: string[];
  features: string[];
  description: string;
  specs: Record<string, string>;
  autoruUrl?: string;
  kpFile?: string;
}

export const carsData: CarData[] = [
  {
    id: 1, slug: "camry-sport-plus-1",
    brand: "Toyota", name: "Toyota Camry IX (XV80)", trim: "Sport PLUS", generation: "IX (XV80)",
    year: 2025, fuel: "Гибрид", engine: "2.0 л", power: 197, drive: "Передний", tx: "CVT", body: "Седан",
    color: "Чёрный", mileage: 5, price: 5100000, oldPrice: 0, monthly: 126000,
    status: "В наличии", nds: false, tag: "",
    img: "/images/cars/car1/camry-1.jpg",
    gallery: ["/images/cars/car1/camry-1.jpg","/images/cars/car1/camry-2.jpg","/images/cars/car1/camry-3.jpg","/images/cars/car1/camry-4.jpg","/images/cars/car1/camry-5.jpg","/images/cars/car1/camry-6.jpg","/images/cars/car1/camry-7.jpg","/images/cars/car1/camry-8.jpg","/images/cars/car1/camry-9.jpg"],
    features: ["Без НДС", "ЭПТС", "Растаможен", "1 владелец"],
    description: "Toyota Camry IX поколения (XV80) China Market, комплектация Sport PLUS. Гибридный двигатель 2.0 л, 197 л.с. Новый автомобиль, пробег 5 км. Полная растаможка, электронный ПТС.",
    specs: { "Двигатель": "2.0 л Гибрид", "Мощность": "197 л.с.", "КПП": "CVT (вариатор)", "Привод": "Передний", "Кузов": "Седан", "Цвет": "Чёрный", "Пробег": "5 км", "Год": "2025", "Рынок": "China Market", "ПТС": "Электронный", "Владельцы": "1", "Налог/год": "17 325 ₽" },
    autoruUrl: "https://auto.ru/cars/used/sale/toyota/camry/1131512785-e74fcfca/",
    kpFile: "/docs/camry-kp.pdf",
  },
  {
    id: 2, slug: "camry-sport-plus-2",
    brand: "Toyota", name: "Toyota Camry IX (XV80)", trim: "Sport PLUS", generation: "IX (XV80)",
    year: 2025, fuel: "Гибрид", engine: "2.0 л", power: 197, drive: "Передний", tx: "CVT", body: "Седан",
    color: "Чёрный", mileage: 1, price: 5100000, oldPrice: 0, monthly: 126000,
    status: "В наличии", nds: true, tag: "TOP",
    img: "/images/cars/car2/1.jpg",
    gallery: ["/images/cars/car2/1.jpg","/images/cars/car2/2.jpg","/images/cars/car2/3.jpg","/images/cars/car2/4.jpg","/images/cars/car2/5.jpg","/images/cars/car2/6.jpg","/images/cars/car2/7.jpg","/images/cars/car2/8.jpg","/images/cars/car2/9.jpg"],
    features: ["НДС к вычету", "ЭПТС", "Растаможен", "1 владелец"],
    description: "Toyota Camry IX поколения (XV80) China Market, комплектация Sport PLUS. Гибридный двигатель 2.0 л, 197 л.с. Новый автомобиль, пробег 1 км. С НДС — возможен вычет для юр. лиц.",
    specs: { "Двигатель": "2.0 л Гибрид", "Мощность": "197 л.с.", "КПП": "CVT (вариатор)", "Привод": "Передний", "Кузов": "Седан", "Цвет": "Чёрный", "Пробег": "1 км", "Год": "2025", "Рынок": "China Market", "ПТС": "Электронный", "Владельцы": "1", "НДС": "Включён" },
    autoruUrl: "https://auto.ru/cars/used/sale/toyota/camry/1131592880-5eb41b5c/",
    kpFile: "/docs/camry-kp.pdf",
  },
  {
    id: 3, slug: "camry-sport-plus-3",
    brand: "Toyota", name: "Toyota Camry IX (XV80)", trim: "Sport PLUS", generation: "IX (XV80)",
    year: 2025, fuel: "Гибрид", engine: "2.0 л", power: 197, drive: "Передний", tx: "CVT", body: "Седан",
    color: "Чёрный", mileage: 0, price: 5100000, oldPrice: 0, monthly: 126000,
    status: "В наличии", nds: true, tag: "",
    img: "/images/cars/car2/3.jpg", gallery: [],
    features: ["НДС к вычету", "ЭПТС", "Гарантия"],
    description: "Toyota Camry IX (XV80), Sport PLUS, 2025. Гибрид 2.0 л, 197 л.с., CVT.",
    specs: { "Двигатель": "2.0 л Гибрид", "Мощность": "197 л.с.", "КПП": "CVT", "Привод": "Передний", "Кузов": "Седан", "Цвет": "Чёрный" },
    kpFile: "/docs/camry-kp.pdf",
  },
  {
    id: 4, slug: "camry-sport-plus-4",
    brand: "Toyota", name: "Toyota Camry IX (XV80)", trim: "Sport PLUS", generation: "IX (XV80)",
    year: 2025, fuel: "Гибрид", engine: "2.0 л", power: 197, drive: "Передний", tx: "CVT", body: "Седан",
    color: "Чёрный", mileage: 0, price: 5100000, oldPrice: 0, monthly: 126000,
    status: "В наличии", nds: true, tag: "",
    img: "/images/cars/car1/camry-5.jpg", gallery: [],
    features: ["НДС к вычету", "ЭПТС", "Гарантия"],
    description: "Toyota Camry IX (XV80), Sport PLUS, 2025. Гибрид 2.0 л, 197 л.с., CVT.",
    specs: { "Двигатель": "2.0 л Гибрид", "Мощность": "197 л.с.", "КПП": "CVT", "Привод": "Передний", "Кузов": "Седан", "Цвет": "Чёрный" },
    kpFile: "/docs/camry-kp.pdf",
  },
  {
    id: 5, slug: "camry-sport-plus-5",
    brand: "Toyota", name: "Toyota Camry IX (XV80)", trim: "Sport PLUS", generation: "IX (XV80)",
    year: 2025, fuel: "Гибрид", engine: "2.0 л", power: 197, drive: "Передний", tx: "CVT", body: "Седан",
    color: "Чёрный", mileage: 0, price: 5100000, oldPrice: 0, monthly: 126000,
    status: "В наличии", nds: false, tag: "",
    img: "/images/cars/car1/camry-3.jpg", gallery: [],
    features: ["Без НДС", "ЭПТС", "Гарантия"],
    description: "Toyota Camry IX (XV80), Sport PLUS, 2025. Гибрид 2.0 л, 197 л.с., CVT.",
    specs: { "Двигатель": "2.0 л Гибрид", "Мощность": "197 л.с.", "КПП": "CVT", "Привод": "Передний", "Кузов": "Седан", "Цвет": "Чёрный" },
    kpFile: "/docs/camry-kp.pdf",
  },
  {
    id: 6, slug: "camry-sport-plus-6",
    brand: "Toyota", name: "Toyota Camry IX (XV80)", trim: "Sport PLUS", generation: "IX (XV80)",
    year: 2025, fuel: "Гибрид", engine: "2.0 л", power: 197, drive: "Передний", tx: "CVT", body: "Седан",
    color: "Чёрный", mileage: 0, price: 5100000, oldPrice: 0, monthly: 126000,
    status: "В наличии", nds: false, tag: "",
    img: "/images/cars/car2/5.jpg", gallery: [],
    features: ["Без НДС", "ЭПТС", "Гарантия"],
    description: "Toyota Camry IX (XV80), Sport PLUS, 2025. Гибрид 2.0 л, 197 л.с., CVT.",
    specs: { "Двигатель": "2.0 л Гибрид", "Мощность": "197 л.с.", "КПП": "CVT", "Привод": "Передний", "Кузов": "Седан", "Цвет": "Чёрный" },
    kpFile: "/docs/camry-kp.pdf",
  },
];

export function getCarBySlug(slug: string) {
  return carsData.find(c => c.slug === slug) || null;
}

export function getCarById(id: number) {
  return carsData.find(c => c.id === id) || null;
}

/** Read admin-added cars from data/cars.json and merge with static data */
export async function getAllCars(): Promise<CarData[]> {
  const dynamic: CarData[] = [];
  try {
    const { readFile } = await import("fs/promises");
    const { join } = await import("path");
    const raw = await readFile(join(process.cwd(), "data", "cars.json"), "utf-8");
    const saved = JSON.parse(raw) as Record<string, unknown>[];
    for (const c of saved) {
      dynamic.push({
        id: (c.id as number) || Date.now(),
        slug: (c.slug as string) || "",
        brand: (c.brand as string) || "",
        name: (c.name as string) || "",
        trim: (c.trim as string) || "",
        generation: (c.generation as string) || "",
        year: (c.year as number) || 2025,
        fuel: (c.fuel as string) || "",
        engine: (c.engine as string) || "",
        power: (c.power as number) || 0,
        drive: (c.drive as string) || "",
        tx: (c.tx as string) || (c.transmission as string) || "",
        body: (c.body as string) || (c.bodyType as string) || "",
        color: (c.color as string) || "",
        mileage: (c.mileage as number) || 0,
        price: (c.price as number) || 0,
        oldPrice: (c.oldPrice as number) || 0,
        monthly: (c.monthly as number) || 0,
        status: (c.status as string) || "В наличии",
        nds: (c.nds as boolean) || false,
        tag: (c.tag as string) || "",
        img: (c.img as string) || ((c.gallery as string[])?.[0]) || "",
        gallery: (c.gallery as string[]) || [],
        features: (c.features as string[]) || [],
        description: (c.description as string) || "",
        specs: (c.specs as Record<string, string>) || {},
        autoruUrl: (c.autoruUrl as string) || "",
        kpFile: (c.kpFile as string) || "",
      });
    }
  } catch {}
  return [...carsData, ...dynamic];
}

export async function getCarBySlugAll(slug: string): Promise<CarData | null> {
  const all = await getAllCars();
  return all.find(c => c.slug === slug) || null;
}
