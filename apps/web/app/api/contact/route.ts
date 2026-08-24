import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({ ok: true, service: "slabtrade", phase: "public-website" });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    if (!body?.email || !body?.message) {
      return NextResponse.json({ error: "Email and message are required." }, { status: 400 });
    }
    return NextResponse.json({ ok: true, message: "Thanks — we will be in touch." });
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }
}
