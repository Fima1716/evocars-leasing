"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";

export function MobileNav() {
  const pathname = usePathname();
  const [showMore, setShowMore] = useState(false);

  const tabs = [
    { href: "/", label: "Главная", icon: <svg width="22" height="22" viewBox="0 0 22 22" fill="none"><path d="M3 9.5L11 3l8 6.5V19a1 1 0 01-1 1h-4v-5a1 1 0 00-1-1h-4a1 1 0 00-1 1v5H4a1 1 0 01-1-1V9.5z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/></svg> },
    { href: "/catalog", label: "Каталог", icon: <svg width="22" height="22" viewBox="0 0 22 22" fill="none"><rect x="3" y="3" width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.5"/><rect x="12" y="3" width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.5"/><rect x="3" y="12" width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.5"/><rect x="12" y="12" width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.5"/></svg> },
    { href: "/#calc", label: "Расчёт", icon: <svg width="22" height="22" viewBox="0 0 22 22" fill="none"><rect x="4" y="2" width="14" height="18" rx="2" stroke="currentColor" strokeWidth="1.5"/><line x1="7" y1="6" x2="15" y2="6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/><circle cx="8" cy="11" r="1" fill="currentColor"/><circle cx="11" cy="11" r="1" fill="currentColor"/><circle cx="14" cy="11" r="1" fill="currentColor"/><circle cx="8" cy="15" r="1" fill="currentColor"/><circle cx="11" cy="15" r="1" fill="currentColor"/><circle cx="14" cy="15" r="1" fill="currentColor"/></svg> },
    { href: "/#cta", label: "Заявка", icon: <svg width="22" height="22" viewBox="0 0 22 22" fill="none"><path d="M5 3h12a2 2 0 012 2v12a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2z" stroke="currentColor" strokeWidth="1.5"/><path d="M7 8h8M7 11h8M7 14h4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg> },
  ];

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    if (href.startsWith("/#")) return pathname === "/";
    return pathname.startsWith(href);
  };

  return (
    <>
      <nav className="mobile-nav">
        <div className="mobile-nav__inner">
          {tabs.map(tab => (
            <Link key={tab.href} href={tab.href} className={`mobile-nav__tab ${isActive(tab.href) ? "is-active" : ""}`}>
              {tab.icon}
              <span>{tab.label}</span>
            </Link>
          ))}
          <button type="button" className={`mobile-nav__tab ${showMore ? "is-active" : ""}`} onClick={() => setShowMore(!showMore)}>
            <svg width="22" height="22" viewBox="0 0 22 22" fill="none"><circle cx="11" cy="5" r="1.5" fill="currentColor"/><circle cx="11" cy="11" r="1.5" fill="currentColor"/><circle cx="11" cy="17" r="1.5" fill="currentColor"/></svg>
            <span>Ещё</span>
          </button>
        </div>
      </nav>

      {/* Slide-up panel */}
      {showMore && (
        <div className="mobile-more-overlay" onClick={() => setShowMore(false)}>
          <div className="mobile-more-panel" onClick={e => e.stopPropagation()}>
            <div className="mobile-more-handle" />
            <Link href="/blog" className="mobile-more-link" onClick={() => setShowMore(false)}>Блог</Link>
            <Link href="/testdrive" className="mobile-more-link" onClick={() => setShowMore(false)}>Тест-драйв</Link>
            <Link href="/#faq" className="mobile-more-link" onClick={() => setShowMore(false)}>Помощь</Link>
            <Link href="/#cta" className="mobile-more-link" onClick={() => setShowMore(false)}>Контакты</Link>
            <a href="tel:+74951500545" className="mobile-more-link mobile-more-link--phone">
              <svg width="16" height="16" viewBox="0 0 14 14" fill="none"><path d="M12.7 9.96l-1.93-.62c-.3-.1-.62-.04-.86.16l-1.36 1.13c-1.65-.85-3-2.2-3.85-3.85L5.83 5.42c.2-.24.26-.56.16-.86L5.37 2.63c-.13-.4-.5-.67-.92-.66l-2.05.05c-.55.02-.97.49-.93 1.04C2 8.65 5.05 11.7 10.34 12.13c.55.04 1.02-.38 1.04-.93l.05-2.05c0-.42-.27-.79-.66-.92z" fill="currentColor"/></svg>
              +7 495 150-05-45
            </a>
          </div>
        </div>
      )}
    </>
  );
}
