import Link from "next/link";

export function Footer() {
  return (
    <footer className="ftr">
      <div className="container">
        <div className="ftr__top">
          <div className="ftr__about">
            <Link href="/" className="logo" aria-label="EVOCARS — главная">
              <img src="/images/logo.png" alt="EVOCARS" className="logo__img" />
              <span className="logo__sub">Бизнесу</span>
            </Link>
            <p className="ftr__lead">
              B2B-направление EVOCARS. Прямые поставки автомобилей для лизинговых компаний и корпоративных автопарков.
            </p>
          </div>

          <div className="ftr__col">
            <h4>Навигация</h4>
            <ul>
              <li><a href="#catalog">Каталог</a></li>
              <li><a href="#utp">Преимущества</a></li>
              <li><a href="#calc">Калькулятор</a></li>
              <li><a href="#faq">FAQ</a></li>
              <li><a href="#blog">Блог</a></li>
            </ul>
          </div>

          <div className="ftr__col">
            <h4>Контакты</h4>
            <ul>
              <li>+7 495 150-05-45</li>
              <li>sales@evocars.ru</li>
              <li>Москва, Малая Пироговская, 8</li>
              <li>Пн-Пт 9:00-18:00</li>
            </ul>
          </div>

          <div className="ftr__col">
            <h4>Связаться</h4>
            <ul>
              <li><a href="https://t.me/evocars" target="_blank" rel="noopener noreferrer">Telegram</a></li>
              <li><a href="https://wa.me/74951500545" target="_blank" rel="noopener noreferrer">WhatsApp</a></li>
              <li><a href="https://corporate-evocars.ru" target="_blank" rel="noopener noreferrer">corporate-evocars.ru</a></li>
            </ul>
          </div>
        </div>

        <div className="ftr__bottom">
          <span>&copy; 2026 EVOCARS — КОРПОРАТИВНЫЕ ПРОДАЖИ АВТОМОБИЛЕЙ</span>
          <span>CORPORATE-EVOCARS.RU</span>
        </div>
      </div>
    </footer>
  );
}
