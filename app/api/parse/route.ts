import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { url } = await request.json();

    if (!url || !url.includes("auto.ru")) {
      return NextResponse.json({ error: "Нужна ссылка на авто.ру" }, { status: 400 });
    }

    // 1. Fetch the page
    const res = await fetch(url, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36",
        "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
        "Accept-Language": "ru-RU,ru;q=0.9",
        "Sec-Fetch-Dest": "document",
        "Sec-Fetch-Mode": "navigate",
        "Sec-Fetch-Site": "none",
      },
      redirect: "follow",
    });

    const html = await res.text();

    // 2. Extract images directly (regex is reliable for yandex CDN URLs)
    const images: string[] = [];
    const imgRegex = /https:\/\/avatars\.mds\.yandex\.net\/get-autoru-vos\/[^\s"'<>]+\/1200x900/g;
    const imgMatches = html.match(imgRegex);
    if (imgMatches) {
      [...new Set(imgMatches)].forEach(u => images.push(u));
    }

    // 3. Send HTML to DeepSeek Flash for structured extraction
    const deepseekKey = process.env.DEEPSEEK_API_KEY;
    if (!deepseekKey) {
      // Fallback: basic extraction without AI
      return NextResponse.json(fallbackParse(url, html, images));
    }

    // Trim HTML to essential parts (reduce tokens)
    const trimmed = trimHtml(html);

    const aiRes = await fetch("https://api.deepseek.com/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${deepseekKey}`,
      },
      body: JSON.stringify({
        model: "deepseek-chat",
        messages: [
          {
            role: "system",
            content: `Ты парсер объявлений автомобилей. Извлеки данные из HTML страницы auto.ru и верни ТОЛЬКО JSON (без markdown, без \`\`\`). Формат:
{"name":"полное название","year":2025,"price":5200000,"engine":"2.0 л","power":197,"fuel":"Гибрид/Бензин/Дизель","transmission":"CVT/Автомат/Механика/Робот","drive":"Передний/Полный/Задний","bodyType":"Седан/Кроссовер/Хэтчбек","color":"Чёрный","mileage":1,"trim":"комплектация","description":"описание","nds":true,"owners":1}
Если данных нет — оставь пустую строку или 0. Цену в рублях целым числом.`
          },
          {
            role: "user",
            content: `URL: ${url}\n\nHTML (фрагмент):\n${trimmed}`
          }
        ],
        temperature: 0,
        max_tokens: 1000,
      }),
    });

    if (!aiRes.ok) {
      return NextResponse.json(fallbackParse(url, html, images));
    }

    const aiData = await aiRes.json();
    const content = aiData.choices?.[0]?.message?.content || "";

    // Parse AI response
    let parsed;
    try {
      // Remove possible markdown wrapping
      const jsonStr = content.replace(/```json?\n?/g, "").replace(/```/g, "").trim();
      parsed = JSON.parse(jsonStr);
    } catch {
      return NextResponse.json(fallbackParse(url, html, images));
    }

    return NextResponse.json({
      ...parsed,
      images,
      sourceUrl: url,
      parsedBy: "deepseek",
    });

  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Ошибка парсинга" },
      { status: 500 }
    );
  }
}

/** Trim HTML to reduce tokens — keep meta, title, JSON-LD, key content */
function trimHtml(html: string): string {
  const parts: string[] = [];

  // Title
  const title = html.match(/<title[^>]*>([\s\S]*?)<\/title>/);
  if (title) parts.push(`<title>${title[1]}</title>`);

  // Meta description and og tags
  const metas = html.match(/<meta[^>]*(?:description|og:|auto)[^>]*>/gi);
  if (metas) parts.push(...metas.slice(0, 20));

  // JSON-LD
  const jsonld = html.match(/<script[^>]*application\/ld\+json[^>]*>([\s\S]*?)<\/script>/gi);
  if (jsonld) parts.push(...jsonld.slice(0, 3));

  // Look for price-related data
  const priceBlocks = html.match(/"price"[^}]{0,200}/gi);
  if (priceBlocks) parts.push(...priceBlocks.slice(0, 5));

  // Car info blocks
  const infoBlocks = html.match(/"vehicle[^}]{0,500}/gi);
  if (infoBlocks) parts.push(...infoBlocks.slice(0, 5));

  // Any block with car specs
  const specBlocks = html.match(/(?:двигатель|мощность|transmission|engine|power|displacement|объ[её]м)[^<]{0,200}/gi);
  if (specBlocks) parts.push(...specBlocks.slice(0, 10));

  const result = parts.join("\n");
  // Cap at ~6000 chars to keep within token limits
  return result.slice(0, 6000);
}

/** Fallback parser without AI */
function fallbackParse(url: string, html: string, images: string[]) {
  const brandMatch = url.match(/\/sale\/(\w+)\/(\w+)\//);
  const brand = brandMatch ? capitalize(brandMatch[1]) : "";
  const model = brandMatch ? capitalize(brandMatch[2]) : "";

  const getMeta = (name: string) => {
    const m = html.match(new RegExp(`<meta[^>]*(?:name|property)="${name}"[^>]*content="([^"]*)"`, "i"));
    return m ? m[1] : "";
  };

  const ogTitle = getMeta("og:title");
  const ogDesc = getMeta("og:description");

  let price = 0;
  const priceMatch = html.match(/"price"\s*:\s*(\d+)/i) || html.match(/"amount"\s*:\s*(\d+)/);
  if (priceMatch) price = parseInt(priceMatch[1]);

  let year = 2025;
  const yearMatch = (ogTitle || "").match(/20\d{2}/);
  if (yearMatch) year = parseInt(yearMatch[0]);

  const engineMatch = (ogDesc || "").match(/(\d+\.\d+)\s*л/);
  const powerMatch = (ogDesc || "").match(/(\d+)\s*л\.?\s*с/i);

  return {
    name: ogTitle?.split(",")[0] || `${brand} ${model}`,
    year,
    price,
    engine: engineMatch ? `${engineMatch[1]} л` : "",
    power: powerMatch ? parseInt(powerMatch[1]) : 0,
    fuel: (ogDesc || "").toLowerCase().includes("гибрид") ? "Гибрид" : "Бензин",
    transmission: (ogDesc || "").includes("CVT") ? "CVT" : (ogDesc || "").includes("автомат") ? "Автомат" : "",
    drive: (ogDesc || "").toLowerCase().includes("полн") ? "Полный" : "Передний",
    bodyType: (ogDesc || "").toLowerCase().includes("кроссовер") ? "Кроссовер" : "Седан",
    color: "",
    mileage: 0,
    description: ogDesc || `${brand} ${model}. Заполните данные вручную.`,
    images,
    sourceUrl: url,
    parsedBy: "fallback",
    warning: images.length === 0 ? "Auto.ru блокирует серверные запросы. Данные извлечены частично — дополните вручную." : undefined,
  };
}

function capitalize(s: string) {
  return s ? s.charAt(0).toUpperCase() + s.slice(1).toLowerCase() : "";
}
