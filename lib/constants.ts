export const SITE = {
  name: "Evocars Leasing",
  url: process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000",
  phone: "+7 (495) 150-05-45",
  email: "sales@evocars.ru",
  address: "Москва, ул. Малая Пироговская, 8",
  hours: "Пн-Пт 9:00–18:00",
  telegram: "https://t.me/evocars",
  whatsapp: "https://wa.me/74951500545",
} as const;

export const NAV_LINKS = [
  { href: "/catalog", label: "Каталог" },
  { href: "/about", label: "О компании" },
  { href: "/contacts", label: "Контакты" },
] as const;
