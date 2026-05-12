import { NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import { join } from "path";
import { randomBytes } from "crypto";

// In standalone mode, process.cwd() is .next/standalone/
// but nginx serves uploads from the project root's public/uploads/
const PROJECT_ROOT = process.env.PROJECT_ROOT || process.cwd();
const UPLOAD_DIR = join(PROJECT_ROOT, "public", "uploads");

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const files = formData.getAll("files") as File[];

    if (!files.length) {
      return NextResponse.json({ error: "Нет файлов" }, { status: 400 });
    }

    await mkdir(UPLOAD_DIR, { recursive: true });

    const urls: string[] = [];

    for (const file of files) {
      const ext = file.name.split(".").pop()?.toLowerCase() || "jpg";
      const name = `${Date.now()}-${randomBytes(4).toString("hex")}.${ext}`;
      const buffer = Buffer.from(await file.arrayBuffer());
      await writeFile(join(UPLOAD_DIR, name), buffer);
      urls.push(`/uploads/${name}`);
    }

    return NextResponse.json({ urls });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Ошибка загрузки" },
      { status: 500 }
    );
  }
}
