import { NextResponse } from "next/server";

// Analytics stub — logs events without Prisma
export async function POST() {
  return new NextResponse(null, { status: 204 });
}
