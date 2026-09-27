import { NextResponse } from "next/server";
import { loadDraft, saveDraft } from "@/lib/services/drafts";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const token =
      typeof body.token === "string" && body.token.length > 0 ? body.token : null;
    const state = body.state;

    if (!state || typeof state !== "object") {
      return NextResponse.json({ error: "Invalid draft state." }, { status: 400 });
    }

    const savedToken = await saveDraft(token, state);
    return NextResponse.json({ token: savedToken });
  } catch {
    return NextResponse.json({ error: "Could not save draft." }, { status: 500 });
  }
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const token = searchParams.get("token");
    if (!token) {
      return NextResponse.json({ state: null });
    }
    const state = await loadDraft(token);
    return NextResponse.json({ state });
  } catch {
    return NextResponse.json({ state: null });
  }
}