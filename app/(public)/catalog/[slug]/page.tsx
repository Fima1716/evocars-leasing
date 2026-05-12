import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { carsData, getCarBySlugAll } from "@/lib/cars-data";
import { CarDetailClient } from "@/components/car/CarDetailClient";
import { LeasingCalculator } from "@/components/calculator/LeasingCalculator";
import { CTASection } from "@/components/forms/CTASection";

export const dynamic = "force-dynamic";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return carsData.map(c => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const car = await getCarBySlugAll(slug);
  if (!car) return { title: "Не найдено" };

  const fmt = (v: number) => v.toLocaleString("ru-RU");
  return {
    title: `${car.name} ${car.trim} — ${fmt(car.price)} ₽`,
    description: car.description,
    openGraph: {
      title: `${car.name} ${car.trim} — от ${fmt(car.price)} ₽`,
      description: `${car.year}, ${car.engine}, ${car.power} л.с., ${car.fuel}. ${car.status}.`,
      images: car.gallery.length > 0 ? [{ url: car.gallery[0] }] : [{ url: car.img }],
    },
  };
}

export default async function CarDetailPage({ params }: Props) {
  const { slug } = await params;
  const car = await getCarBySlugAll(slug);
  if (!car) notFound();

  return (
    <>
      <div className="page-catalog__main">
        <div className="container" style={{ paddingTop: 40 }}>
          <nav className="crumbs">
            <Link href="/">Главная</Link>
            <span aria-hidden="true">/</span>
            <Link href="/catalog">Каталог</Link>
            <span aria-hidden="true">/</span>
            <span>{car.name}</span>
          </nav>
        </div>
        <CarDetailClient car={car} />
      </div>
      <LeasingCalculator />
      <CTASection />
    </>
  );
}
