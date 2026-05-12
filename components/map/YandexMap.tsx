"use client";

import { useEffect, useRef } from "react";

declare global {
  interface Window {
    ymaps?: any;
  }
}

const MAP_CENTER: [number, number] = [55.735869, 37.571908];
const ZOOM = 16;

export function YandexMap() {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<any>(null);

  useEffect(() => {
    if (mapRef.current) return;

    const init = () => {
      if (!containerRef.current || !window.ymaps) return;
      window.ymaps.ready(() => {
        if (mapRef.current) return;
        const map = new window.ymaps.Map(containerRef.current, {
          center: MAP_CENTER,
          zoom: ZOOM,
          controls: ["zoomControl", "fullscreenControl"],
        });
        const placemark = new window.ymaps.Placemark(
          MAP_CENTER,
          {
            balloonContentHeader: "EVOCARS",
            balloonContentBody: "Москва, Малая Пироговская, 8",
            hintContent: "EVOCARS — автомобили в лизинг",
          },
          {
            preset: "islands#redAutoIcon",
          }
        );
        map.geoObjects.add(placemark);
        map.behaviors.disable("scrollZoom");
        mapRef.current = map;
      });
    };

    if (window.ymaps) {
      init();
    } else {
      const script = document.createElement("script");
      script.src =
        "https://api-maps.yandex.ru/2.1/?apikey=none&lang=ru_RU";
      script.async = true;
      script.onload = init;
      document.head.appendChild(script);
    }
  }, []);

  return (
    <section className="section map-section" id="map">
      <div className="container">
        <div className="section__head reveal">
          <div className="eyebrow">
            <span className="eyebrow__dot" />
            Как нас найти
          </div>
          <h2 className="section-title" style={{ marginTop: 16 }}>
            Приезжайте на <span className="o">осмотр</span>
          </h2>
          <p style={{ color: "var(--ink-2)", fontSize: 16, marginTop: 12, maxWidth: 480 }}>
            Москва, Малая Пироговская, 8. Все автомобили можно осмотреть вживую и записаться на тест-драйв.
          </p>
        </div>
        <div className="map-wrap reveal" ref={containerRef} />
      </div>
    </section>
  );
}
