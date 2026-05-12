import { NextResponse } from "next/server";
import { readFile, writeFile, mkdir } from "fs/promises";
import { join } from "path";

const FILE = join(process.cwd(), "data", "visits.json");

interface DayStats {
  date: string;
  visitors: number;
  hits: number;
  uids: string[];
}

async function readVisits(): Promise<DayStats[]> {
  try {
    const raw = await readFile(FILE, "utf-8");
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

// POST — register a hit
export async function POST(request: Request) {
  try {
    const { uid, page } = await request.json();
    if (!uid) return NextResponse.json({ ok: false }, { status: 400 });

    const today = new Date().toISOString().slice(0, 10); // YYYY-MM-DD
    const visits = await readVisits();

    let day = visits.find((d) => d.date === today);
    if (!day) {
      day = { date: today, visitors: 0, hits: 0, uids: [] };
      visits.push(day);
    }

    day.hits++;
    if (!day.uids.includes(uid)) {
      day.uids.push(uid);
      day.visitors++;
    }

    // keep last 90 days
    const cutoff = visits.length > 90 ? visits.length - 90 : 0;
    const trimmed = visits.slice(cutoff);

    await mkdir(join(process.cwd(), "data"), { recursive: true });
    await writeFile(FILE, JSON.stringify(trimmed, null, 2));

    void page; // reserved for future per-page tracking
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}

// GET — return stats (for admin dashboard)
export async function GET() {
  const visits = await readVisits();
  // strip uids from response
  const stats = visits.map(({ date, visitors, hits }) => ({ date, visitors, hits }));
  return NextResponse.json({ stats });
}
