import type { Metadata } from "next";
import "./design.css";

export const metadata: Metadata = {
  title: {
    default: "EVOCARS Leasing — автомобили в лизинг для бизнеса",
    template: "%s | EVOCARS Leasing",
  },
  description:
    "EVOCARS Leasing — автомобили в лизинг для юридических лиц. Toyota Camry IX (XV80) — прямые поставки, фиксированные цены, полное сопровождение.",
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"
  ),
  openGraph: {
    type: "website",
    locale: "ru_RU",
    siteName: "EVOCARS Leasing",
    title: "EVOCARS Leasing — автомобили в лизинг для бизнеса",
    description:
      "Toyota Camry IX (XV80) — 2025 год, гибрид, от 5 100 000 ₽. Прямые поставки, фиксированные цены, полное сопровождение сделки.",
  },
  twitter: {
    card: "summary_large_image",
    title: "EVOCARS Leasing — автомобили в лизинг для бизнеса",
    description:
      "Toyota Camry IX (XV80) — 2025 год, гибрид, от 5 100 000 ₽. Прямые поставки, фиксированные цены, полное сопровождение сделки.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Geist:wght@300;400;500;600;700;800;900&family=Geist+Mono:wght@300;400;500;600&family=Instrument+Serif:ital@0;1&display=swap" rel="stylesheet" />
      </head>
      <body>
        {children}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(m,e,t,r,i,k,a){m[i]=m[i]||function(){(m[i].a=m[i].a||[]).push(arguments)};m[i].l=1*new Date();for(var j=0;j<document.scripts.length;j++){if(document.scripts[j].src===r){return;}}k=e.createElement(t),a=e.getElementsByTagName(t)[0],k.async=1,k.src=r,a.parentNode.insertBefore(k,a)})(window,document,'script','https://mc.yandex.ru/metrika/tag.js?id=109036053','ym');ym(109036053,'init',{ssr:true,webvisor:true,clickmap:true,accurateTrackBounce:true,trackLinks:true});`,
          }}
        />
        <noscript>
          <div>
            <img src="https://mc.yandex.ru/watch/109036053" style={{ position: "absolute", left: -9999 }} alt="" />
          </div>
        </noscript>
      </body>
    </html>
  );
}
