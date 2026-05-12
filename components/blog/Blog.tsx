import Link from "next/link";
import { Icon } from "@/components/ui/Icons";
import { blogPosts } from "@/lib/blog-data";

const posts = blogPosts.slice(0, 3);
const blogCovers = [
  "/images/cars/car2/1.jpg",
  "/images/cars/car1/camry-3.jpg",
  "/images/cars/car2/5.jpg",
];

export function Blog() {
  return (
    <section className="section" id="blog">
      <div className="container">
        <div className="section__head">
          <h2 className="section-title reveal reveal-delay-1">
            Блог и аналитика
          </h2>
        </div>

        <div className="blog">
          {posts.map((p, i) => (
            <Link key={p.slug} href={`/blog/${p.slug}`} className={`blog__card reveal reveal-delay-${i + 1}`}>
              <div className="blog__cover">
                <span className="blog__cover-tag">{p.tag}</span>
                <img
                  src={blogCovers[i] || "/images/cars/car1/camry-1.jpg"}
                  alt={p.title}
                  draggable={false}
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                />
              </div>
              <div className="blog__body">
                <span className="blog__date mono">{p.date}</span>
                <h3 className="blog__title">{p.title}</h3>
                <p className="blog__excerpt">{p.excerpt}</p>
                <span className="blog__more">
                  Читать
                  <Icon.ArrowRight />
                </span>
              </div>
            </Link>
          ))}
        </div>

        <div style={{ marginTop: 40, textAlign: "center" }}>
          <Link href="/blog" className="btn btn--ghost">
            Все статьи
            <Icon.ArrowRight />
          </Link>
        </div>
      </div>
    </section>
  );
}
