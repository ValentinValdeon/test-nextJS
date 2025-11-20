import { NextResponse } from "next/server";
import { testConnection } from "@/lib/db";

export async function GET() {
  const ok = await testConnection();
  return NextResponse.json({ connected: ok });
}
