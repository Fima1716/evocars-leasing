"use client";

import { useState } from "react";
import { PhoneInput } from "@/components/ui/PhoneInput";

export function ReferralPromo() {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [sent, setSent] = useState(false);
  const [sending, setSending] = useState(false);
  const [refLink, setRefLink] = useState("");
  const [copied, setCopied] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!phone || sending) return;
    setSending(true);
    try {
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name || "—",
          phone,
          source: "REFERRAL",
          message: "Реферальная программа — узнать подробнее",
        }),
      });
      if (res.ok) {
        const data = await res.json();
        if (data.refCode) {
          setRefLink(`${window.location.origin}/?ref=${data.refCode}`);
        }
        setSent(true);
      } else {
        alert("Ошибка отправки. Позвоните: +7 495 150-05-45");
      }
    } catch {
      alert("Ошибка сети. Позвоните: +7 495 150-05-45");
    } finally {
      setSending(false);
    }
  };

  const copyLink = () => {
    navigator.clipboard.writeText(refLink).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <section className="section ref-promo" id="referral">
      <div className="container">
        <div className="ref-promo__card reveal">
          <div className="ref-promo__content">
            <div className="eyebrow no-line">Партнёрам</div>
            <h2 className="ref-promo__title">
              Получи <span className="ref-promo__amount">200 000 ₽</span>{" "}за&nbsp;рекомендацию
            </h2>
            <p className="ref-promo__desc">
              Порекомендуйте нас клиенту, который оформит лизинг автомобиля — и получите агентское вознаграждение. Без вложений, без рисков.
            </p>
            <div className="ref-promo__steps">
              <div className="ref-promo__step">
                <span className="ref-promo__step-num mono">01</span>
                <span>Оставьте заявку — получите личную ссылку</span>
              </div>
              <div className="ref-promo__step">
                <span className="ref-promo__step-num mono">02</span>
                <span>Отправьте ссылку клиенту</span>
              </div>
              <div className="ref-promo__step">
                <span className="ref-promo__step-num mono">03</span>
                <span>Клиент оформляет лизинг — вы получаете 200 000 ₽</span>
              </div>
            </div>
          </div>
          <div className="ref-promo__form-wrap">
            {sent ? (
              <div className="ref-promo__sent">
                <svg width="48" height="48" viewBox="0 0 48 48" fill="none"><circle cx="24" cy="24" r="22" stroke="var(--orange)" strokeWidth="2"/><path d="M15 25l6 6 12-14" stroke="var(--orange)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                <div className="ref-promo__sent-title">Ваша реферальная ссылка</div>
                {refLink && (
                  <div className="ref-promo__link-box">
                    <input type="text" readOnly value={refLink} className="ref-promo__link-input mono" onClick={(e) => (e.target as HTMLInputElement).select()} />
                    <button type="button" className="ref-promo__link-copy" onClick={copyLink}>
                      {copied ? "Скопировано!" : "Копировать"}
                    </button>
                  </div>
                )}
                <div className="ref-promo__sent-text">
                  Отправьте эту ссылку клиенту. Менеджер свяжется с вами и расскажет подробности.
                </div>
              </div>
            ) : (
              <form className="ref-promo__form" onSubmit={submit}>
                <h3 className="ref-promo__form-title">Получить ссылку</h3>
                <input
                  type="text"
                  className="ref-promo__input"
                  placeholder="Ваше имя"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
                <PhoneInput
                  className="ref-promo__input"
                  placeholder="+7 (___) ___-__-__"
                  value={phone}
                  onChange={setPhone}
                  required
                />
                <button type="submit" className="btn btn--primary ref-promo__submit" disabled={sending || !phone}>
                  {sending ? "Отправка..." : "Получить реферальную ссылку"}
                </button>
                <span className="ref-promo__legal mono">
                  Нажимая кнопку, вы соглашаетесь с условиями обработки персональных данных
                </span>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
