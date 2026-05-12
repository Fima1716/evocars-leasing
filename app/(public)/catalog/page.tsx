import type { Metadata } from "next";
import Link from "next/link";
import { CatalogFull } from "@/components/car/CatalogFull";
import { getAllCars } from "@/lib/cars-data";

export const revalidate = 60; // ISR: rebuild every 60 seconds

export const metadata: Metadata = {
  title: "Каталог автомобилей в лизинг",
  description: "Каталог автомобилей в лизинг — 47 марок, более 600 моделей. Прямые поставки, фиксированная цена, юридическое сопровождение.",
};

export default async function CatalogPage() {
  return (
    <div className="page-catalog__main">
      <div className="container page-catalog__head">
        <nav className="crumbs">
          <Link href="/">Главная</Link>
          <span aria-hidden="true">/</span>
          <span>Каталог</span>
        </nav>
        <h1 className="page-catalog__title">Все автомобили в&nbsp;<span className="o">лизинг</span></h1>
      </div>
      <CatalogFull cars={await getAllCars()} />
    </div>
  );
}
