# Evocars Leasing

[![Next.js](https://img.shields.io/badge/Next.js-16-000?logo=nextdotjs&logoColor=white)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=black)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4-06B6D4?logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![Zod](https://img.shields.io/badge/Zod-4-3E67B1?logo=zod&logoColor=white)](https://zod.dev/)
[![React Hook Form](https://img.shields.io/badge/React_Hook_Form-7-EC5990?logo=reacthookform&logoColor=white)](https://react-hook-form.com/)
[![Telegram Bot API](https://img.shields.io/badge/Telegram_Bot-API-26A5E4?logo=telegram&logoColor=white)](https://core.telegram.org/bots/api)
[![Nginx](https://img.shields.io/badge/Nginx-009639?logo=nginx&logoColor=white)](https://nginx.org/)

Сайт: [corporate-evocars.ru](https://corporate-evocars.ru)

## Что это

B2B-сайт для автодилера [Evocars](https://evocars.ru). Лизинговые компании и корпоративные закупщики смотрят каталог, считают платежи в калькуляторе и оставляют заявки. Менеджер получает уведомление в Telegram и перезванивает.

Основной трафик идёт из Telegram-каналов, поэтому верстка mobile-first. Тема светлая.

## Что внутри

**Каталог** — карточки авто с фото, ценой и ежемесячным платежом. Есть фильтры (марка, кузов, привод, КПП, НДС) и сортировка. У каждой машины своя страница с галереей, характеристиками и формой заявки.

**Калькулятор лизинга** — аннуитетная формула. Слайдеры: цена, аванс, срок. Параметры (ставка, лимиты) настраиваются через админку.

**Заявки** — форма с валидацией (Zod). При отправке менеджеру приходит сообщение в Telegram с данными клиента, выбранным авто и расчётом из калькулятора. Трекинг источника заявки (форма, калькулятор, exit-попап, реферал и т.д.).

**Exit-попап** — на десктопе срабатывает при уходе курсора за пределы страницы, на мобильном через 45 секунд. Показывается один раз за сессию.

**Блог** — статьи про лизинг, динамические роуты.

**Админка** — дашборд со статистикой посещений (90 дней), таблица заявок с фильтрами и сменой статусов, управление каталогом (можно добавить авто руками или спарсить с auto.ru), настройки калькулятора и баннера.

**Прочее** — прелоадер на первый визит, карусель брендов, реферальные коды, UTM-метки, sitemap, robots.txt, OG-теги.

## Стек

- **Next.js 16** — App Router, SSR, standalone-сборка
- **React 19** + **TypeScript**
- **Tailwind CSS 4**
- **React Hook Form** + **Zod** — формы и валидация
- **Telegram Bot API** — уведомления (нативный HTTPS, без SDK)
- **JSON-файлы** — хранение заявок, авто, настроек и аналитики
- **Nginx** + **PM2** — продакшн на VPS, SSL через Certbot
- **Docker** — есть Dockerfile и docker-compose (опционально)

## Структура

```
app/
  (public)/        — главная, каталог, карточка авто, блог, тест-драйв
  (admin)/         — дашборд, заявки, авто, настройки
  api/             — leads, cars, upload, parse, analytics, settings
components/        — 34 компонента (hero, car, calculator, forms, layout, admin, ux)
lib/               — утилиты, данные авто, калькулятор, Telegram, валидация, блог
docker/            — Dockerfile, docker-compose.yml, nginx.conf
```

## Запуск

```bash
git clone https://github.com/Fima1716/evocars-leasing.git
cd evocars-leasing
npm install
cp .env.example .env   # заполнить TELEGRAM_BOT_TOKEN и TELEGRAM_CHAT_ID
npm run dev
```

Продакшн:

```bash
npm run build
pm2 start .next/standalone/server.js --name evocars-leasing
```

## .env

| Переменная | Описание |
|-----------|---------|
| `NEXT_PUBLIC_SITE_URL` | URL сайта |
| `TELEGRAM_BOT_TOKEN` | Токен бота |
| `TELEGRAM_CHAT_ID` | ID чата для уведомлений |
| `DEEPSEEK_API_KEY` | Ключ DeepSeek (опционально, для парсинга auto.ru) |
