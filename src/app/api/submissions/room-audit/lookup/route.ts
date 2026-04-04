import { NextResponse } from "next/server";
import { lookupBeforeCheckInAudit } from "@/lib/submission";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const guestName = searchParams.get("guestName") || undefined;
    const roomNumber = searchParams.get("roomNumber") || undefined;

    const result = await lookupBeforeCheckInAudit({ guestName, roomNumber });
    return NextResponse.json({ ok: true, result });
  } catch (error) {
    return NextResponse.json(
      { ok: false, error: error instanceof Error ? error.message : "Room audit lookup failed." },
      { status: 500 },
    );
  }
}
