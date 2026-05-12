import Link from "next/link";
import { formatPrice } from "@/lib/utils";
import { calculateMonthlyPayment } from "@/lib/calculator";

interface CarCardProps {
  car: {
    id: string;
    slug: string;
    brand: string;
    model: string;
    year: number;
    price: number;
    quantity: number;
    badges: string[];
    images: string[];
  };
}

export function CarCard({ car }: CarCardProps) {
  const monthlyPayment = calculateMonthlyPayment(car.price, 20, 36);

  return (
    <div className="glass group overflow-hidden transition-all hover:shadow-lg hover:shadow-amber/5">
      {/* Image */}
      <div className="aspect-[16/10] overflow-hidden bg-surface">
        <div className="flex h-full items-center justify-center text-text-tertiary">
          <svg className="h-16 w-16 opacity-20" viewBox="0 0 24 24" fill="currentColor">
            <path d="M18.92 6.01C18.72 5.42 18.16 5 17.5 5h-11c-.66 0-1.21.42-1.42 1.01L3 12v8c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1h12v1c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-8l-2.08-5.99zM6.5 16c-.83 0-1.5-.67-1.5-1.5S5.67 13 6.5 13s1.5.67 1.5 1.5S7.33 16 6.5 16zm11 0c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zM5 11l1.5-4.5h11L19 11H5z" />
          </svg>
        </div>
      </div>

      {/* Content */}
      <div className="p-5">
        <div className="text-xs uppercase tracking-wider text-text-tertiary">
          {car.brand}
        </div>
        <h3 className="mt-1 text-lg font-semibold">{car.model}</h3>
        <div className="mt-1 text-sm text-text-secondary">{car.year}</div>

        {/* Price */}
        <div className="mt-3 text-2xl font-extrabold text-amber tabular-nums">
          {formatPrice(car.price)}
        </div>
        <div className="mt-0.5 text-sm text-text-secondary">
          от {formatPrice(monthlyPayment)}/мес.
        </div>

        {/* Badges */}
        <div className="mt-3 flex flex-wrap gap-1.5">
          {car.badges.map((badge) => (
            <span
              key={badge}
              className="rounded-md border border-white/10 px-2 py-0.5 text-xs text-text-secondary"
            >
              {badge}
            </span>
          ))}
          <span className="rounded-md border border-rose/20 bg-rose/10 px-2 py-0.5 text-xs text-rose">
            В наличии: {car.quantity} шт.
          </span>
        </div>

        {/* Actions */}
        <div className="mt-5 flex gap-3">
          <Link
            href={`/catalog/${car.slug}`}
            className="flex-1 rounded-xl bg-amber px-4 py-2.5 text-center text-sm font-semibold text-zinc-900 transition-all hover:bg-amber-light active:scale-[0.98]"
          >
            Подробнее
          </Link>
        </div>
      </div>
    </div>
  );
}
