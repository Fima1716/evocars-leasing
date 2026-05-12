import { NextResponse } from "next/server";
import { getAllCars } from "@/lib/cars-data";

export async function GET() {
  const cars = await getAllCars();
  return NextResponse.json({ cars });
}
