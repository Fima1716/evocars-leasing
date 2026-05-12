import Link from "next/link";

export function TestDrivePromo() {
  return (
    <section className="section td-promo" id="testdrive">
      <div className="container">
        <div className="td-promo__card reveal">
          <div className="td-promo__map">
            <iframe
              src="https://yandex.ru/map-widget/v1/?ll=37.571908%2C55.735869&z=15&pt=37.571908%2C55.735869%2Cpm2rdm"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
            />
            <div className="td-promo__map-badge">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M8 1C5.24 1 3 3.24 3 6c0 3.75 5 9 5 9s5-5.25 5-9c0-2.76-2.24-5-5-5zm0 7a2 2 0 110-4 2 2 0 010 4z" fill="currentColor"/></svg>
              Малая Пироговская, 8
            </div>
          </div>
          <div className="td-promo__content">
            <div className="eyebrow no-line">Тест-драйв</div>
            <h2 className="td-promo__title">
              Проведите <span className="o">тест-драйв</span>{" "}в&nbsp;два&nbsp;клика
            </h2>
            <p className="td-promo__desc">
              Оцените автомобиль лично перед оформлением лизинга. Мы организуем тест-драйв
              в удобное время — в нашем шоуруме или с доставкой к вашему офису.
            </p>
            <div className="td-promo__benefits">
              <div className="td-promo__benefit">
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M10 18a8 8 0 100-16 8 8 0 000 16z" stroke="currentColor" strokeWidth="1.4"/><path d="M10 6v4l2.5 2.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/></svg>
                <span>Согласование за 1 час</span>
              </div>
              <div className="td-promo__benefit">
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M3 10l5 5L17 5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/></svg>
                <span>Доставка к офису</span>
              </div>
              <div className="td-promo__benefit">
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M10 2l2.4 4.9 5.4.8-3.9 3.8.9 5.4L10 14.6l-4.8 2.3.9-5.4L2.2 7.7l5.4-.8L10 2z" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round"/></svg>
                <span>Премиум автомобили</span>
              </div>
            </div>
            <Link href="/testdrive" className="btn btn--primary td-promo__cta">
              Провести тест-драйв
              <svg width="16" height="12" viewBox="0 0 16 12" fill="none"><path d="M9 1l5 5-5 5M14 6H2" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/></svg>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
