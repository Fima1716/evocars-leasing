const brands = [
  { name: "Toyota", logo: "/images/brands/toyota.png" },
  { name: "BMW", logo: "/images/brands/bmw.png" },
  { name: "Audi", logo: "/images/brands/audi.png" },
  { name: "Lexus", logo: "/images/brands/lexus.png" },
  { name: "Mercedes", logo: "/images/brands/mercedes.png" },
  { name: "Volkswagen", logo: "/images/brands/volkswagen.png" },
  { name: "Hyundai", logo: "/images/brands/hyundai.png" },
  { name: "Kia", logo: "/images/brands/kia.png" },
  { name: "Genesis", logo: "/images/brands/genesis.png" },
  { name: "Geely", logo: "/images/brands/geely.png" },
  { name: "Li Auto", logo: "/images/brands/li-auto.png" },
  { name: "Voyah", logo: "/images/brands/voyah.png" },
  { name: "AVATR", logo: "/images/brands/avatr.png" },
  { name: "AITO", logo: "/images/brands/aito.png" },
  { name: "Chery", logo: "/images/brands/chery.png" },
  { name: "EXEED", logo: "/images/brands/exeed.png" },
  { name: "Haval", logo: "/images/brands/haval.png" },
  { name: "OMODA", logo: "/images/brands/omoda.png" },
  { name: "Zeekr", logo: "/images/brands/zeekr.png" },
  { name: "JETOUR", logo: "/images/brands/jetour.png" },
  { name: "Mazda", logo: "/images/brands/mazda.png" },
  { name: "Volvo", logo: "/images/brands/volvo.png" },
  { name: "Infiniti", logo: "/images/brands/infiniti.png" },
  { name: "Dongfeng", logo: "/images/brands/dongfeng.png" },
];

export function BrandsMarquee() {
  return (
    <section className="brands-section">
      <div className="container">
        <div className="brands-head reveal">
          <div className="eyebrow no-line">Марки в лизинг</div>
          <h2 className="brands-title">Поставляем <span className="o">любые марки</span> под заказ</h2>
        </div>
        <div className="brands-grid reveal">
          {brands.map((b) => (
            <div key={b.name} className="brands-card brands-card--static">
              <div className="brands-card__logo">
                <img src={b.logo} alt={b.name} draggable={false} />
              </div>
              <span className="brands-card__name mono">{b.name}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
