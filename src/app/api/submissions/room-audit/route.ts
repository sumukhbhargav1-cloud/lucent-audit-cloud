import { NextResponse } from "next/server";
import { submitRoomAudit } from "@/lib/submission";

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const mode = String(formData.get("mode") || "");
    const guestName = String(formData.get("guestName") || "");
    const roomNumber = String(formData.get("roomNumber") || "");
    const checkInDate = String(formData.get("checkInDate") || "");
    const expectedCheckOutDate = String(formData.get("expectedCheckOutDate") || "");
    const towelCount = String(formData.get("towelCount") || "");
    const bedCondition = String(formData.get("bedCondition") || "");
    const files = formData
      .getAll("photos")
      .filter((entry): entry is File => entry instanceof File && entry.size > 0);

    if (
      (mode !== "before_check_in" && mode !== "after_check_out") ||
      !guestName ||
      !roomNumber ||
      !checkInDate ||
      !towelCount ||
      !bedCondition ||
      files.length === 0
    ) {
      return NextResponse.json({ ok: false, error: "Missing required room audit fields." }, { status: 400 });
    }

    const result = await submitRoomAudit({
      mode,
      guestName,
      roomNumber,
      checkInDate,
      expectedCheckOutDate,
      towelCount,
      bedCondition,
      files,
    });

    return NextResponse.json({ ok: true, result });
  } catch (error) {
    return NextResponse.json(
      { ok: false, error: error instanceof Error ? error.message : "Room audit submission failed." },
      { status: 500 },
    );
  }
}
