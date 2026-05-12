import Link from "next/link";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ minHeight: "100vh", background: "var(--bg)", color: "var(--ink)", cursor: "auto" }}>
      <style>{`
        .cursor { display: none !important; }
        body, a, button, input, select, textarea { cursor: auto !important; }
      `}</style>
      <div style={{ borderBottom: "1px solid var(--line)", padding: "14px 32px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 24 }}>
          <Link href="/admin" style={{ display: "flex", alignItems: "center", gap: 10, textDecoration: "none", color: "var(--ink)" }}>
            <span style={{ fontSize: 18, fontWeight: 600 }}>EVOCARS</span>
            <span style={{ fontSize: 11, color: "var(--ink-3)", fontFamily: "var(--mono)", letterSpacing: "0.12em" }}>ADMIN</span>
          </Link>
          <nav style={{ display: "flex", gap: 4 }}>
            {[
              { href: "/admin", label: "Dashboard" },
              { href: "/admin/leads", label: "Заявки" },
              { href: "/admin/cars", label: "Авто" },
              { href: "/admin/settings", label: "Настройки" },
            ].map((link) => (
              <Link
                key={link.href}
                href={link.href}
                style={{
                  padding: "6px 12px", borderRadius: 6, fontSize: 13,
                  color: "var(--ink-2)", textDecoration: "none",
                  transition: "color 0.15s",
                }}
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>
        <Link href="/" style={{ fontSize: 13, color: "var(--ink-3)", textDecoration: "none" }}>← На сайт</Link>
      </div>
      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "32px" }}>
        {children}
      </div>
    </div>
  );
}
