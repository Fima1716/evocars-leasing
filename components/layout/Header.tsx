"use client";

import { useState, useEffect, useCallback } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { Icon } from "@/components/ui/Icons";

export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [drawer, setDrawer] = useState<"catalog" | "leasing" | null>(null);
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      setScrolled(y > 30);
      document.documentElement.style.setProperty("--banner-visible", y > 30 ? "0" : "1");
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleLogoClick = useCallback((e: React.MouseEvent) => {
    if (pathname === "/") {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [pathname]);

  return (
    <>
      <header className={`hdr ${scrolled ? "is-scrolled" : ""}`}>
        <div className="container hdr__inner">
          <Link href="/" className="logo" aria-label="EVOCARS — главная" onClick={handleLogoClick}>
            <img src="/images/logo.png" alt="EVOCARS" className="logo__img" />
            <span className="logo__sub">Бизнесу</span>
          </Link>

          <nav className="hdr__nav">
            <button
              className={`hdr__nav-item has-caret ${drawer === "catalog" ? "is-active" : ""}`}
              onClick={() => setDrawer(drawer === "catalog" ? null : "catalog")}
            >
              Каталог
              <svg width="10" height="6" viewBox="0 0 10 6" fill="none"><path d="M1 1l4 4 4-4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/></svg>
            </button>
            <button
              className={`hdr__nav-item has-caret ${drawer === "leasing" ? "is-active" : ""}`}
              onClick={() => setDrawer(drawer === "leasing" ? null : "leasing")}
            >
              Бизнесу
              <svg width="10" height="6" viewBox="0 0 10 6" fill="none"><path d="M1 1l4 4 4-4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/></svg>
            </button>
            <Link href="/#calc" className="hdr__nav-item">Калькулятор</Link>
            <Link href="/blog" className="hdr__nav-item">Блог</Link>
            <Link href="/#faq" className="hdr__nav-item">Помощь</Link>
            <Link href="/#cta" className="hdr__nav-item">Контакты</Link>
          </nav>

          <div className="hdr__right">
            <a href="tel:+74951500545" className="hdr__phone">
              <span className="hdr__phone-icon" aria-hidden="true">
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M12.7 9.96l-1.93-.62c-.3-.1-.62-.04-.86.16l-1.36 1.13c-1.65-.85-3-2.2-3.85-3.85L5.83 5.42c.2-.24.26-.56.16-.86L5.37 2.63c-.13-.4-.5-.67-.92-.66l-2.05.05c-.55.02-.97.49-.93 1.04C2 8.65 5.05 11.7 10.34 12.13c.55.04 1.02-.38 1.04-.93l.05-2.05c0-.42-.27-.79-.66-.92z" fill="currentColor"/></svg>
              </span>
              +7 495 150-05-45
            </a>
            <Link href="/#cta" className="btn btn--primary hdr__cta">
              Получить предложение
              <Icon.Arrow />
            </Link>
            <button
              className={`hdr__burger ${open ? "is-open" : ""}`}
              onClick={() => setOpen(!open)}
              aria-label="Меню"
            >
              <span/><span/><span/>
            </button>
          </div>
        </div>

        {/* Mega drawer */}
        <div className={`hdr__drawer ${drawer ? "is-open" : ""}`}>
          <div className="container">
            {drawer === "catalog" && (
              <div className="hdr__drawer-grid">
                <div>
                  <div className="hdr__drawer-cap">Категории</div>
                  <div className="hdr__drawer-links">
                    <Link href="/catalog">Легковые автомобили</Link>
                    <Link href="/catalog">Коммерческий транспорт</Link>
                    <Link href="/catalog">Автомобили с пробегом</Link>
                    <Link href="/catalog">Премиум и&nbsp;спорт</Link>
                  </div>
                </div>
                <div>
                  <div className="hdr__drawer-cap">Популярные марки</div>
                  <div className="hdr__drawer-links">
                    <Link href="/catalog">Toyota</Link>
                    <Link href="/catalog">BMW</Link>
                    <Link href="/catalog">Audi</Link>
                    <Link href="/catalog">Mercedes-Benz</Link>
                    <Link href="/catalog">Lexus</Link>
                    <Link href="/catalog">Geely</Link>
                  </div>
                </div>
                <Link href="/catalog" className="hdr__drawer-feature" onClick={() => setDrawer(null)}>
                  <div className="hdr__drawer-feature-cap">Каталог</div>
                  <div className="hdr__drawer-feature-title">Все 47 марок<br/>и&nbsp;более 600 моделей</div>
                  <div className="hdr__drawer-feature-arrow"><Icon.Arrow /></div>
                </Link>
              </div>
            )}
            {drawer === "leasing" && (
              <div className="hdr__drawer-grid">
                <div>
                  <div className="hdr__drawer-cap">Кому</div>
                  <div className="hdr__drawer-links">
                    <Link href="/#segments">Юридическим лицам</Link>
                    <Link href="/#segments">Индивидуальным предпринимателям</Link>
                    <Link href="/#segments">Физическим лицам</Link>
                    <Link href="/#segments">Самозанятым</Link>
                  </div>
                </div>
                <div>
                  <div className="hdr__drawer-cap">Программы</div>
                  <div className="hdr__drawer-links">
                    <Link href="/#calc">Финансовый лизинг</Link>
                    <Link href="/#calc">Операционный лизинг</Link>
                    <Link href="/#calc">С госсубсидией</Link>
                    <Link href="/#calc">Авто с пробегом</Link>
                  </div>
                </div>
                <Link href="/testdrive" className="hdr__drawer-feature" onClick={() => setDrawer(null)}>
                  <div className="hdr__drawer-feature-cap">Тест-драйв</div>
                  <div className="hdr__drawer-feature-title">Запишитесь<br/>на&nbsp;тест&#8209;драйв онлайн</div>
                  <div className="hdr__drawer-feature-arrow"><Icon.Arrow /></div>
                </Link>
              </div>
            )}
          </div>
        </div>
      </header>

      {drawer && <div className="hdr__backdrop" onClick={() => setDrawer(null)} />}
    </>
  );
}
