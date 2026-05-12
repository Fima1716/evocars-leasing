import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-4">
      <h1 className="text-6xl font-extrabold text-amber">404</h1>
      <p className="mt-4 text-lg text-text-secondary">Страница не найдена</p>
      <Link
        href="/"
        className="mt-8 rounded-2xl bg-amber px-8 py-3 text-sm font-semibold text-zinc-900 transition-all hover:bg-amber-light"
      >
        На главную
      </Link>
    </div>
  );
}
