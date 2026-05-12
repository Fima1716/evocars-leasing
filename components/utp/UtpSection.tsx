const rows = [
  { value: "−23%", heading: "Прямой контракт с заводом", body: "Без дилерской наценки. Стоимость, логистика, таможня — каждая статья отдельной строкой в договоре." },
  { value: "14–28 дн.", heading: "Поставка на склад в Москве", body: "Авто в наличии или доставка из Китая. Партии до 50 единиц — выделенный логистический коридор." },
  { value: "fix ₽", heading: "Цена заморожена в договоре", body: "Курс фиксируется на дату подписания. Никаких пересчётов и валютных оговорок." },
  { value: "ЭПТС", heading: "Документы и гарантия", body: "Электронный ПТС, ДКП, акт приёма-передачи — в день выдачи. ОСАГО оформляем сами." },
  { value: "1–50", heading: "Любой объём партии", body: "Скидка лесенкой от объёма: от 5 ед. −1.5%, от 10 −3%, от 25 −5%." },
  { value: "B2B", heading: "Партнёр для лизинговых компаний", body: "NDA, договор поставки, выделенный менеджер. ВЭД и сертификация на нашей стороне." },
];

export function UtpSection() {
  return (
    <section className="section" id="utp">
      <div className="container">
        <div className="ug reveal">
          {rows.map((r, i) => (
            <div key={i} className="ug__item">
              <div className="ug__value mono">{r.value}</div>
              <div className="ug__text">
                <h3 className="ug__heading">{r.heading}</h3>
                <p className="ug__body">{r.body}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
