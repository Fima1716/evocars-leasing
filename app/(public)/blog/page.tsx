import type { Metadata } from "next";
import Link from "next/link";
import { blogPosts } from "@/lib/blog-data";

export const metadata: Metadata = {
  title: "Блог о лизинге автомобилей — Evocars Leasing",
  description:
    "Полезные статьи о лизинге автомобилей для бизнеса: как работает лизинг, налоговые льготы, сравнение с кредитом, советы по выбору лизинговой компании.",
  openGraph: {
    title: "Блог о лизинге автомобилей — Evocars Leasing",
    description:
      "Полезные статьи о лизинге автомобилей для бизнеса: как работает лизинг, налоговые льготы, сравнение с кредитом.",
  },
};

export default function BlogPage() {
  return (
    <div className="page-catalog__main">
      <div className="container page-catalog__head">
        <nav className="crumbs">
          <Link href="/">Главная</Link>
          <span aria-hidden="true">/</span>
          <span>Блог</span>
        </nav>
        <div className="page-catalog__title-row">
          <div>
            <h1 className="page-catalog__title">
              Блог о <span className="o">лизинге</span>
            </h1>
          </div>
          <p className="page-catalog__lede">
            Разбираем лизинг простым языком: налоги, условия, сравнения и
            практические советы для&nbsp;бизнеса.
          </p>
        </div>
      </div>

      <div className="container" style={{ paddingBottom: 100 }}>
        <div className="blog-list">
          {blogPosts.map((post, i) => (
            <Link
              key={post.slug}
              href={`/blog/${post.slug}`}
              className={`blog__card reveal reveal-delay-${Math.min(i + 1, 6)}`}
            >
              <div className="blog__cover">
                <span className="blog__cover-tag">{post.tag}</span>
                <div className="blog__cover-art">
                  <BlogCoverArt index={i} />
                </div>
              </div>
              <div className="blog__body">
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 12,
                  }}
                >
                  <span className="blog__date mono">{post.date}</span>
                  <span
                    style={{
                      fontFamily: "var(--mono)",
                      fontSize: 11,
                      color: "var(--ink-3)",
                      letterSpacing: "0.06em",
                    }}
                  >
                    {post.readTime}
                  </span>
                </div>
                <h2 className="blog__title">{post.title}</h2>
                <p className="blog__excerpt">{post.excerpt}</p>
                <span className="blog__more">
                  Читать
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                    <path
                      d="M2 7h10M8 3l4 4-4 4"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

function BlogCoverArt({ index }: { index: number }) {
  const arts = [
    // 0 — basics: document/key icon
    <svg key={0} className="bart" viewBox="0 0 120 80" fill="none">
      <rect x="30" y="10" width="60" height="70" rx="6" stroke="var(--line-strong)" strokeWidth="1.5" />
      <line x1="42" y1="30" x2="78" y2="30" stroke="var(--orange)" strokeWidth="1.5" strokeLinecap="round" />
      <line x1="42" y1="42" x2="78" y2="42" stroke="var(--line-strong)" strokeWidth="1.5" strokeLinecap="round" />
      <line x1="42" y1="54" x2="66" y2="54" stroke="var(--line-strong)" strokeWidth="1.5" strokeLinecap="round" />
    </svg>,
    // 1 — comparison: two columns
    <svg key={1} className="bart" viewBox="0 0 120 80" fill="none">
      <rect x="16" y="20" width="36" height="44" rx="4" stroke="var(--line-strong)" strokeWidth="1.5" />
      <rect x="68" y="20" width="36" height="44" rx="4" stroke="var(--orange)" strokeWidth="1.5" />
      <line x1="34" y1="30" x2="34" y2="54" stroke="var(--line-strong)" strokeWidth="1" />
      <line x1="86" y1="30" x2="86" y2="54" stroke="var(--orange)" strokeWidth="1" />
      <circle cx="60" cy="42" r="6" stroke="var(--ink-3)" strokeWidth="1.5" />
      <path d="M57 42h6M60 39v6" stroke="var(--ink-3)" strokeWidth="1.5" strokeLinecap="round" />
    </svg>,
    // 2 — tax/percent
    <svg key={2} className="bart" viewBox="0 0 120 80" fill="none">
      <circle cx="60" cy="40" r="28" stroke="var(--line-strong)" strokeWidth="1.5" />
      <text x="60" y="47" textAnchor="middle" fontSize="22" fontFamily="var(--mono)" fill="var(--orange)" fontWeight="600">%</text>
      <path d="M44 24l32 32" stroke="var(--ink-3)" strokeWidth="1" strokeLinecap="round" />
    </svg>,
    // 3 — steps/guide
    <svg key={3} className="bart" viewBox="0 0 120 80" fill="none">
      <circle cx="24" cy="24" r="8" stroke="var(--orange)" strokeWidth="1.5" />
      <circle cx="60" cy="40" r="8" stroke="var(--line-strong)" strokeWidth="1.5" />
      <circle cx="96" cy="56" r="8" stroke="var(--line-strong)" strokeWidth="1.5" />
      <path d="M32 28l20 8" stroke="var(--line-strong)" strokeWidth="1" strokeLinecap="round" />
      <path d="M68 44l20 8" stroke="var(--line-strong)" strokeWidth="1" strokeLinecap="round" />
      <text x="24" y="28" textAnchor="middle" fontSize="9" fontFamily="var(--mono)" fill="var(--orange)">1</text>
      <text x="60" y="44" textAnchor="middle" fontSize="9" fontFamily="var(--mono)" fill="var(--ink-3)">2</text>
      <text x="96" y="60" textAnchor="middle" fontSize="9" fontFamily="var(--mono)" fill="var(--ink-3)">3</text>
    </svg>,
    // 4 — checklist
    <svg key={4} className="bart" viewBox="0 0 120 80" fill="none">
      <rect x="25" y="12" width="70" height="60" rx="6" stroke="var(--line-strong)" strokeWidth="1.5" />
      {[0,1,2,3,4].map((r) => (
        <g key={r}>
          <rect x="34" y={22 + r * 10} width="8" height="8" rx="2" stroke={r < 3 ? "var(--orange)" : "var(--line-strong)"} strokeWidth="1.2" fill={r < 3 ? "var(--orange-glow)" : "none"} />
          {r < 3 && <path d={`M${36} ${26 + r * 10}l2 2 4-4`} stroke="var(--orange)" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />}
          <line x1="48" y1={26 + r * 10} x2="84" y2={26 + r * 10} stroke={r < 3 ? "var(--ink-2)" : "var(--line-strong)"} strokeWidth="1" strokeLinecap="round" />
        </g>
      ))}
    </svg>,
    // 5 — zero/myth
    <svg key={5} className="bart" viewBox="0 0 120 80" fill="none">
      <circle cx="60" cy="40" r="26" stroke="var(--line-strong)" strokeWidth="1.5" />
      <text x="60" y="48" textAnchor="middle" fontSize="28" fontFamily="var(--mono)" fill="var(--ink-3)" fontWeight="500">0</text>
      <line x1="38" y1="18" x2="82" y2="62" stroke="var(--orange)" strokeWidth="2" strokeLinecap="round" />
    </svg>,
    // 6 — split/two types
    <svg key={6} className="bart" viewBox="0 0 120 80" fill="none">
      <rect x="14" y="18" width="38" height="48" rx="5" fill="var(--bg-3)" stroke="var(--orange)" strokeWidth="1.5" />
      <rect x="68" y="18" width="38" height="48" rx="5" fill="var(--bg-3)" stroke="var(--line-strong)" strokeWidth="1.5" />
      <text x="33" y="46" textAnchor="middle" fontSize="10" fontFamily="var(--mono)" fill="var(--orange)">ФИН</text>
      <text x="87" y="46" textAnchor="middle" fontSize="10" fontFamily="var(--mono)" fill="var(--ink-3)">ОПЕ</text>
    </svg>,
    // 7 — china/globe
    <svg key={7} className="bart" viewBox="0 0 120 80" fill="none">
      <circle cx="60" cy="40" r="26" stroke="var(--line-strong)" strokeWidth="1.5" />
      <ellipse cx="60" cy="40" rx="10" ry="26" stroke="var(--line-strong)" strokeWidth="1" />
      <line x1="34" y1="40" x2="86" y2="40" stroke="var(--line-strong)" strokeWidth="1" />
      <line x1="38" y1="28" x2="82" y2="28" stroke="var(--orange)" strokeWidth="1" strokeLinecap="round" />
      <line x1="38" y1="52" x2="82" y2="52" stroke="var(--line-strong)" strokeWidth="1" strokeLinecap="round" />
    </svg>,
  ];

  return arts[index % arts.length] ?? null;
}
