import { NextResponse } from "next/server";
import { submitWaterLog } from "@/lib/submission";

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const slot = String(formData.get("slot") || "");
    const reading = String(formData.get("reading") || "");
    const photo = formData.get("photo");

    if (!slot || !reading || !(photo instanceof File)) {
      return NextResponse.json({ ok: false, error: "Missing required water log fields." }, { status: 400 });
    }

    const result = await submitWaterLog({ slot, reading, photo });
    return NextResponse.json({ ok: true, result });
  } catch (error) {
    return NextResponse.json(
      { ok: false, error: error instanceof Error ? error.message : "Water log submission failed." },
      { status: 500 },
    );
  }
}
