import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { blogPosts, getBlogPost } from "@/lib/blog-data";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return blogPosts.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = getBlogPost(slug);
  if (!post) return { title: "Не найдено" };

  return {
    title: `${post.title} — Evocars Leasing`,
    description: post.excerpt,
    openGraph: {
      title: post.title,
      description: post.excerpt,
    },
  };
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const post = getBlogPost(slug);
  if (!post) notFound();

  return (
    <div className="page-catalog__main">
      <div className="container" style={{ paddingTop: 40, paddingBottom: 80 }}>
        {/* Breadcrumbs */}
        <nav className="crumbs">
          <Link href="/">Главная</Link>
          <span aria-hidden="true">/</span>
          <Link href="/blog">Блог</Link>
          <span aria-hidden="true">/</span>
          <span>{post.title}</span>
        </nav>

        <div className="blog-post-layout">
          {/* Article */}
          <article className="blog-post">
            {/* Header */}
            <header className="blog-post__header">
              <div className="blog-post__meta">
                <span className="blog-post__tag">{post.tag}</span>
                <span className="blog-post__date mono">{post.date}</span>
                <span className="blog-post__read-time mono">{post.readTime} чтения</span>
              </div>
              <h1 className="blog-post__title">{post.title}</h1>
              <p className="blog-post__excerpt">{post.excerpt}</p>
            </header>

            {/* Divider */}
            <div
              style={{
                height: 1,
                background: "var(--line)",
                margin: "32px 0",
              }}
            />

            {/* Content */}
            <div
              className="blog-post__content"
              dangerouslySetInnerHTML={{ __html: post.content }}
            />

            {/* CTA */}
            <div className="blog-post__cta">
              <div className="blog-post__cta-inner">
                <div>
                  <p className="blog-post__cta-label mono">Готовы к сделке?</p>
                  <h2 className="blog-post__cta-title">
                    Рассчитайте лизинг на&nbsp;автомобиль прямо сейчас
                  </h2>
                  <p className="blog-post__cta-text">
                    Toyota Camry IX (XV80) China — от&nbsp;5 200 000 ₽.
                    Ответим на&nbsp;вопросы и&nbsp;подберём условия
                    под&nbsp;ваш бизнес.
                  </p>
                </div>
                <div className="blog-post__cta-actions">
                  <Link href="/catalog" className="btn btn--primary">
                    Смотреть каталог
                    <svg
                      width="14"
                      height="14"
                      viewBox="0 0 14 14"
                      fill="none"
                      className="arrow"
                    >
                      <path
                        d="M2 7h10M8 3l4 4-4 4"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </Link>
                  <Link href="/#cta" className="btn btn--ghost">
                    Оставить заявку
                  </Link>
                </div>
              </div>
            </div>
          </article>

          {/* Sidebar */}
          <aside className="blog-post__sidebar">
            <div className="blog-post__sidebar-box">
              <p
                style={{
                  fontFamily: "var(--mono)",
                  fontSize: 11,
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                  color: "var(--ink-3)",
                  marginBottom: 16,
                }}
              >
                Другие статьи
              </p>
              <div
                style={{ display: "flex", flexDirection: "column", gap: 4 }}
              >
                {blogPosts
                  .filter((p) => p.slug !== slug)
                  .slice(0, 6)
                  .map((p) => (
                    <Link
                      key={p.slug}
                      href={`/blog/${p.slug}`}
                      className="blog-post__sidebar-link"
                    >
                      <span className="blog-post__sidebar-link-tag">
                        {p.tag}
                      </span>
                      <span className="blog-post__sidebar-link-title">
                        {p.title}
                      </span>
                    </Link>
                  ))}
              </div>
            </div>

            <div className="blog-post__sidebar-box blog-post__sidebar-promo">
              <p
                style={{
                  fontFamily: "var(--mono)",
                  fontSize: 11,
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                  color: "var(--orange)",
                  marginBottom: 12,
                }}
              >
                Выгодно
              </p>
              <p
                style={{
                  fontSize: 15,
                  fontWeight: 500,
                  lineHeight: 1.35,
                  marginBottom: 16,
                }}
              >
                Toyota Camry в&nbsp;лизинг от&nbsp;142 000 ₽/мес
              </p>
              <Link href="/catalog" className="btn btn--primary" style={{ width: "100%", justifyContent: "center" }}>
                В каталог
              </Link>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
