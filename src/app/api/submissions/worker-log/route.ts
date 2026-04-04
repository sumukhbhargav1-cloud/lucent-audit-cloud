import { NextResponse } from "next/server";
import { submitWorkerLog } from "@/lib/submission";

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const workerName = String(formData.get("workerName") || "");
    const actionType = String(formData.get("actionType") || "");
    const scheduledTime = String(formData.get("scheduledTime") || "");
    const photo = formData.get("photo");

    if (!workerName || !actionType || !scheduledTime || !(photo instanceof File)) {
      return NextResponse.json({ ok: false, error: "Missing required worker log fields." }, { status: 400 });
    }

    const result = await submitWorkerLog({ workerName, actionType, scheduledTime, photo });
    return NextResponse.json({ ok: true, result });
  } catch (error) {
    return NextResponse.json(
      { ok: false, error: error instanceof Error ? error.message : "Worker log submission failed." },
      { status: 500 },
    );
  }
}
