"use client";

import { useState, useRef } from "react";

const fmt = (v: number) => v.toLocaleString("ru-RU");

export function AdminCarsClient() {
  const [step, setStep] = useState(1);

  // Core
  const [name, setName] = useState("");
  const [trim, setTrim] = useState("");
  const [year, setYear] = useState(2025);
  const [price, setPrice] = useState(0);
  const [nds, setNds] = useState(false);

  // Specs
  const [engine, setEngine] = useState("");
  const [power, setPower] = useState(0);
  const [fuel, setFuel] = useState("Бензин");
  const [transmission, setTransmission] = useState("Автомат");
  const [drive, setDrive] = useState("Передний");
  const [bodyType, setBodyType] = useState("Седан");
  const [color, setColor] = useState("");
  const [mileage, setMileage] = useState(0);

  // Media
  const [photos, setPhotos] = useState<string[]>([]);
  const [photoInput, setPhotoInput] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);

  // KP document
  const [kpFile, setKpFile] = useState("");
  const [kpUploading, setKpUploading] = useState(false);
  const kpFileRef = useRef<HTMLInputElement>(null);

  // Content
  const [description, setDescription] = useState("");
  const [features, setFeatures] = useState<string[]>(["ЭПТС", "Растаможен"]);
  const [featureInput, setFeatureInput] = useState("");

  // Save
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");

  const addPhotoUrl = () => {
    if (!photoInput.trim()) return;
    setPhotos(p => [...p, photoInput.trim()]);
    setPhotoInput("");
  };

  const removePhoto = (i: number) => setPhotos(p => p.filter((_, j) => j !== i));

  const [uploading, setUploading] = useState(false);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || !files.length) return;
    setUploading(true);
    try {
      const formData = new FormData();
      Array.from(files).forEach(file => formData.append("files", file));
      const res = await fetch("/api/upload", { method: "POST", body: formData });
      if (!res.ok) throw new Error("Ошибка загрузки");
      const data = await res.json();
      if (data.urls) setPhotos(p => [...p, ...data.urls]);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Ошибка загрузки файлов");
    } finally {
      setUploading(false);
    }
  };

  const handleKpUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setKpUploading(true);
    try {
      const formData = new FormData();
      formData.append("files", file);
      const res = await fetch("/api/upload", { method: "POST", body: formData });
      if (!res.ok) throw new Error("Ошибка загрузки");
      const data = await res.json();
      if (data.urls?.[0]) setKpFile(data.urls[0]);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Ошибка загрузки КП");
    } finally {
      setKpUploading(false);
    }
  };

  const addFeature = () => {
    if (!featureInput.trim()) return;
    setFeatures(f => [...f, featureInput.trim()]);
    setFeatureInput("");
  };
  const removeFeature = (i: number) => setFeatures(f => f.filter((_, j) => j !== i));

  const monthly = price > 0 ? Math.round(price * 0.8 * (0.15 / 12) * Math.pow(1 + 0.15 / 12, 36) / (Math.pow(1 + 0.15 / 12, 36) - 1)) : 0;

  const saveCar = async () => {
    setSaving(true);
    setError("");
    try {
      const res = await fetch("/api/cars/save", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name, trim, price, year, engine, power, fuel, transmission,
          drive, bodyType, color, mileage, nds, description, features,
          images: photos, brand: name.split(" ")[0], kpFile,
        }),
      });
      const text = await res.text();
      let d;
      try { d = JSON.parse(text); } catch { throw new Error(`Сервер вернул не JSON (${res.status}): ${text.slice(0, 100)}`); }
      if (!res.ok) throw new Error(d.error);
      setSaved(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Ошибка сохранения");
    } finally {
      setSaving(false);
    }
  };

  const resetForm = () => {
    setSaved(false); setStep(1); setName(""); setTrim(""); setPrice(0); setYear(2025);
    setEngine(""); setPower(0); setFuel("Бензин"); setTransmission("Автомат");
    setDrive("Передний"); setBodyType("Седан"); setColor(""); setMileage(0);
    setPhotos([]); setKpFile(""); setDescription(""); setFeatures(["ЭПТС", "Растаможен"]); setError("");
  };

  const steps = ["Данные", "Фото", "Предпросмотр"];

  return (
    <div>
      <h1 className="admin-h1">Добавить автомобиль</h1>

      <div className="admin-steps">
        {steps.map((label, i) => (
          <button key={i} className={`admin-step ${step === i + 1 ? "is-active" : ""} ${step > i + 1 ? "is-done" : ""}`} onClick={() => !saved && setStep(i + 1)}>
            <span className="admin-step__num">{step > i + 1 ? "✓" : i + 1}</span>
            <span className="admin-step__label">{label}</span>
          </button>
        ))}
      </div>

      {/* ═══ Step 1: Data ═══ */}
      {step === 1 && (
        <div className="admin-card">
          <div className="admin-card__head"><h2>Данные автомобиля</h2></div>

          <div className="admin-section" style={{ borderTop: "none", paddingTop: 0 }}>
            <div className="admin-section__title">Основное</div>
            <div className="admin-grid admin-grid--2">
              <Field label="Название модели" required>
                <input className="admin-input" value={name} onChange={e => setName(e.target.value)} placeholder="Toyota Camry IX (XV80)" />
              </Field>
              <Field label="Комплектация">
                <input className="admin-input" value={trim} onChange={e => setTrim(e.target.value)} placeholder="Sport PLUS" />
              </Field>
            </div>
            <div className="admin-grid admin-grid--3">
              <Field label="Цена, ₽" required>
                <input className="admin-input" type="number" value={price || ""} onChange={e => setPrice(Number(e.target.value))} placeholder="5200000" />
              </Field>
              <Field label="Год выпуска">
                <input className="admin-input" type="number" value={year} onChange={e => setYear(Number(e.target.value))} />
              </Field>
              <Field label="Цвет">
                <input className="admin-input" value={color} onChange={e => setColor(e.target.value)} placeholder="Чёрный" />
              </Field>
            </div>
            <label className="admin-checkbox">
              <input type="checkbox" checked={nds} onChange={e => setNds(e.target.checked)} />
              <span className="admin-checkbox__box" />
              <span>С НДС <span style={{ color: "var(--ink-3)" }}>— к вычету для юр. лиц</span></span>
            </label>
          </div>

          <div className="admin-section">
            <div className="admin-section__title">Характеристики</div>
            <div className="admin-grid admin-grid--3">
              <Field label="Двигатель"><input className="admin-input" value={engine} onChange={e => setEngine(e.target.value)} placeholder="2.0 л" /></Field>
              <Field label="Мощность, л.с."><input className="admin-input" type="number" value={power || ""} onChange={e => setPower(Number(e.target.value))} placeholder="197" /></Field>
              <Field label="Топливо"><select className="admin-input" value={fuel} onChange={e => setFuel(e.target.value)}><option>Бензин</option><option>Гибрид</option><option>Дизель</option><option>Электро</option></select></Field>
              <Field label="КПП"><select className="admin-input" value={transmission} onChange={e => setTransmission(e.target.value)}><option>Автомат</option><option>CVT</option><option>Робот</option><option>Механика</option></select></Field>
              <Field label="Привод"><select className="admin-input" value={drive} onChange={e => setDrive(e.target.value)}><option>Передний</option><option>Полный</option><option>Задний</option></select></Field>
              <Field label="Кузов"><select className="admin-input" value={bodyType} onChange={e => setBodyType(e.target.value)}><option>Седан</option><option>Кроссовер</option><option>Хэтчбек</option><option>Универсал</option><option>Купе</option><option>Минивэн</option><option>Пикап</option></select></Field>
            </div>
            <div className="admin-grid admin-grid--3">
              <Field label="Пробег, км"><input className="admin-input" type="number" value={mileage || ""} onChange={e => setMileage(Number(e.target.value))} placeholder="0" /></Field>
            </div>
          </div>

          <div className="admin-section">
            <div className="admin-section__title">Бейджи</div>
            <div className="admin-tags">
              {features.map((f, i) => (<span key={i} className="admin-tag">{f}<button onClick={() => removeFeature(i)} className="admin-tag__x">&times;</button></span>))}
            </div>
            <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
              <input className="admin-input" value={featureInput} onChange={e => setFeatureInput(e.target.value)} onKeyDown={e => e.key === "Enter" && (e.preventDefault(), addFeature())} placeholder="Добавить..." style={{ flex: 1 }} />
              <button onClick={addFeature} className="admin-btn admin-btn--ghost">+</button>
            </div>
            <div className="admin-tag-hints">
              {["ЭПТС", "НДС к вычету", "Без НДС", "Гарантия", "Растаможен", "1 владелец", "Trade-in", "Новый"].filter(t => !features.includes(t)).map(t => (
                <button key={t} className="admin-tag-hint" onClick={() => setFeatures(f => [...f, t])}>{t}</button>
              ))}
            </div>
          </div>

          <div className="admin-section">
            <div className="admin-section__title">Описание</div>
            <textarea className="admin-input admin-textarea" value={description} onChange={e => setDescription(e.target.value)} placeholder="Состояние, комплектация, история, особенности..." rows={5} />
          </div>

          <div className="admin-nav">
            <div />
            <button onClick={() => setStep(2)} className="admin-btn admin-btn--primary" disabled={!name || !price}>Далее: фото →</button>
          </div>
        </div>
      )}

      {/* ═══ Step 2: Photos ═══ */}
      {step === 2 && (
        <div className="admin-card">
          <div className="admin-card__head"><h2>Фотографии</h2><p>Загрузите файлы или вставьте ссылки</p></div>

          <div className="admin-upload" onClick={() => !uploading && fileRef.current?.click()} style={{ opacity: uploading ? 0.6 : 1 }}>
            <input ref={fileRef} type="file" accept="image/*" multiple hidden onChange={handleFileUpload} />
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none"><path d="M12 16V8M12 8l-3 3M12 8l3 3" stroke="var(--orange)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/><path d="M20 16.2A4.5 4.5 0 0017.5 8h-1.13A7 7 0 104 14.9" stroke="var(--ink-3)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
            <div style={{ fontSize: 15, fontWeight: 500, marginTop: 8 }}>{uploading ? "Загрузка..." : "Нажмите или перетащите файлы"}</div>
            <div style={{ fontSize: 13, color: "var(--ink-3)", marginTop: 4 }}>JPG, PNG, WebP</div>
          </div>

          <div style={{ display: "flex", gap: 8, marginTop: 16 }}>
            <input className="admin-input" value={photoInput} onChange={e => setPhotoInput(e.target.value)} onKeyDown={e => e.key === "Enter" && (e.preventDefault(), addPhotoUrl())} placeholder="Или ссылка на фото..." style={{ flex: 1 }} />
            <button onClick={addPhotoUrl} disabled={!photoInput} className="admin-btn admin-btn--ghost">Добавить</button>
          </div>

          {photos.length > 0 && (
            <div className="admin-photos">
              {photos.map((src, i) => (
                <div key={i} className="admin-photo">
                  <img src={src} alt="" />
                  <button className="admin-photo__del" onClick={() => removePhoto(i)}>&times;</button>
                  {i === 0 && <span className="admin-photo__main mono">Главная</span>}
                </div>
              ))}
            </div>
          )}

          {/* KP Document */}
          <div style={{ marginTop: 24, padding: 16, borderRadius: 12, border: "1px solid var(--line)", background: "var(--bg-3)" }}>
            <div style={{ fontSize: 14, fontWeight: 500, marginBottom: 10 }}>Коммерческое предложение (PDF)</div>
            {kpFile ? (
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M4 2h8l4 4v12a1 1 0 01-1 1H4a1 1 0 01-1-1V3a1 1 0 011-1z" stroke="var(--orange)" strokeWidth="1.2"/><path d="M12 2v4h4" stroke="var(--orange)" strokeWidth="1.2"/></svg>
                <a href={kpFile} target="_blank" rel="noopener noreferrer" style={{ fontSize: 13, color: "var(--orange)" }}>КП загружено</a>
                <button onClick={() => setKpFile("")} style={{ fontSize: 12, color: "var(--ink-3)", background: "none", border: "none", cursor: "pointer" }}>Удалить</button>
              </div>
            ) : (
              <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                <button onClick={() => kpFileRef.current?.click()} disabled={kpUploading} className="admin-btn admin-btn--ghost" style={{ fontSize: 13 }}>
                  {kpUploading ? "Загрузка..." : "Загрузить PDF"}
                </button>
                <input ref={kpFileRef} type="file" accept=".pdf" hidden onChange={handleKpUpload} />
                <span style={{ fontSize: 12, color: "var(--ink-3)" }}>или</span>
                <input className="admin-input" style={{ flex: 1, fontSize: 13 }} placeholder="Ссылка на PDF..." value={kpFile} onChange={e => setKpFile(e.target.value)} />
              </div>
            )}
          </div>

          <div className="admin-nav">
            <button onClick={() => setStep(1)} className="admin-btn admin-btn--ghost">← Назад</button>
            <button onClick={() => setStep(3)} className="admin-btn admin-btn--primary">Предпросмотр →</button>
          </div>
        </div>
      )}

      {/* ═══ Step 3: Full Preview & Publish ═══ */}
      {step === 3 && (
        <div className="admin-card" style={{ padding: 0, overflow: "hidden" }}>
          {saved ? (
            <div style={{ textAlign: "center", padding: "60px 32px" }}>
              <div style={{ width: 64, height: 64, borderRadius: "50%", background: "rgba(100,220,100,0.15)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 20px", fontSize: 28, color: "#6ddc6d" }}>✓</div>
              <h2 style={{ fontSize: 24, fontWeight: 500 }}>Автомобиль добавлен</h2>
              <p style={{ color: "var(--ink-2)", marginTop: 8 }}>{name} — {fmt(price)} ₽</p>
              <div style={{ display: "flex", gap: 12, justifyContent: "center", marginTop: 24 }}>
                <button onClick={resetForm} className="admin-btn admin-btn--ghost">Добавить ещё</button>
                <a href="/catalog" className="admin-btn admin-btn--primary">Открыть каталог</a>
              </div>
            </div>
          ) : (
            <>
              {/* Full page preview — like the real car detail page */}
              <div style={{ padding: 32 }}>
                <div style={{ fontSize: 12, color: "var(--ink-3)", fontFamily: "var(--mono)", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 20 }}>Предпросмотр страницы автомобиля</div>

                {/* Gallery + Info grid like car detail */}
                <div style={{ display: "grid", gridTemplateColumns: photos.length > 0 ? "1.3fr 1fr" : "1fr", gap: 32 }}>
                  {/* Gallery */}
                  {photos.length > 0 && (
                    <div>
                      <div style={{ aspectRatio: "4/3", borderRadius: 14, overflow: "hidden", background: "var(--bg-3)", border: "1px solid var(--line)" }}>
                        <img src={photos[0]} alt={name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                      </div>
                      {photos.length > 1 && (
                        <div style={{ display: "flex", gap: 6, marginTop: 8, overflowX: "auto" }}>
                          {photos.slice(1, 6).map((src, i) => (
                            <div key={i} style={{ flex: "0 0 72px", height: 54, borderRadius: 8, overflow: "hidden", border: "1px solid var(--line)" }}>
                              <img src={src} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                            </div>
                          ))}
                          {photos.length > 6 && <div style={{ flex: "0 0 72px", height: 54, borderRadius: 8, background: "var(--bg-3)", border: "1px solid var(--line)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, color: "var(--ink-3)" }}>+{photos.length - 6}</div>}
                        </div>
                      )}
                    </div>
                  )}

                  {/* Info panel */}
                  <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                    {features.length > 0 && (
                      <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                        {features.map((f, i) => <span key={i} style={{ padding: "5px 10px", borderRadius: 6, fontSize: 12, background: "var(--bg-3)", border: "1px solid var(--line)", color: "var(--ink-2)" }}>{f}</span>)}
                      </div>
                    )}
                    <h2 style={{ fontSize: 24, fontWeight: 500 }}>{name || "Название не указано"}</h2>
                    <div className="mono" style={{ fontSize: 13, color: "var(--ink-3)", textTransform: "uppercase" }}>{[trim, color, year].filter(Boolean).join(" · ")}</div>

                    <div style={{ padding: "16px 0", borderTop: "1px solid var(--line)", borderBottom: "1px solid var(--line)", display: "flex", alignItems: "baseline", gap: 16 }}>
                      <span style={{ fontSize: 28, fontWeight: 500 }}>{price > 0 ? `${fmt(price)} ₽` : "—"}</span>
                      {monthly > 0 && <span className="mono" style={{ fontSize: 14, color: "var(--orange)" }}>от {fmt(monthly)} ₽/мес</span>}
                    </div>

                    {/* Quick specs */}
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
                      {[
                        { l: "Двигатель", v: engine ? `${engine} · ${fuel}` : "—" },
                        { l: "Мощность", v: power ? `${power} л.с.` : "—" },
                        { l: "КПП", v: transmission },
                        { l: "Привод", v: drive },
                        { l: "Кузов", v: bodyType },
                        { l: "Пробег", v: `${mileage} км` },
                      ].map(s => (
                        <div key={s.l} style={{ padding: 10, borderRadius: 8, background: "var(--bg-3)", border: "1px solid var(--line)" }}>
                          <div className="mono" style={{ fontSize: 10, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--ink-3)" }}>{s.l}</div>
                          <div style={{ fontSize: 14, fontWeight: 500, marginTop: 3 }}>{s.v}</div>
                        </div>
                      ))}
                    </div>

                    {nds && <div style={{ fontSize: 13, color: "var(--orange)" }}>НДС включён — к вычету для юр. лиц</div>}
                  </div>
                </div>

                {/* Specs table */}
                <div style={{ marginTop: 32 }}>
                  <h3 style={{ fontSize: 18, fontWeight: 500, marginBottom: 16 }}>Характеристики</h3>
                  <div style={{ maxWidth: 500 }}>
                    {[
                      ["Двигатель", engine ? `${engine} ${fuel}` : "—"],
                      ["Мощность", power ? `${power} л.с.` : "—"],
                      ["КПП", transmission],
                      ["Привод", drive],
                      ["Кузов", bodyType],
                      ["Цвет", color || "—"],
                      ["Пробег", `${mileage} км`],
                      ["Год", String(year)],
                      ["НДС", nds ? "Включён" : "Нет"],
                    ].map(([k, v]) => (
                      <div key={k} style={{ display: "flex", alignItems: "baseline", gap: 12, padding: "10px 0", borderBottom: "1px solid var(--line)" }}>
                        <span style={{ fontSize: 14, color: "var(--ink-2)", minWidth: 100 }}>{k}</span>
                        <span style={{ flex: 1, borderBottom: "1px dotted var(--line-strong)", marginBottom: 4, minWidth: 20 }} />
                        <span style={{ fontSize: 14, fontWeight: 500 }}>{v}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Description */}
                {description && (
                  <div style={{ marginTop: 32 }}>
                    <h3 style={{ fontSize: 18, fontWeight: 500, marginBottom: 12 }}>Описание</h3>
                    <p style={{ fontSize: 15, lineHeight: 1.6, color: "var(--ink-2)", maxWidth: 600 }}>{description}</p>
                  </div>
                )}
              </div>

              {/* Bottom bar */}
              <div style={{ padding: "20px 32px", borderTop: "1px solid var(--line)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <button onClick={() => setStep(2)} className="admin-btn admin-btn--ghost">← Редактировать</button>
                {error && <span style={{ fontSize: 13, color: "#ff6b6b" }}>{error}</span>}
                <button onClick={saveCar} disabled={saving || !name || !price} className="admin-btn admin-btn--save">
                  {saving ? "Сохранение..." : "Опубликовать на сайте"}
                </button>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}

function Field({ label, required, children }: { label: string; required?: boolean; children: React.ReactNode }) {
  return (
    <div className="admin-field">
      <label className="admin-label">{label}{required && <span style={{ color: "var(--orange)" }}> *</span>}</label>
      {children}
    </div>
  );
}
