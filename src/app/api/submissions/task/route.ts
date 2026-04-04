import { NextResponse } from "next/server";
import { submitTaskRun } from "@/lib/submission";

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const taskName = String(formData.get("taskName") || "");
    const location = String(formData.get("location") || "");
    const files = formData
      .getAll("photos")
      .filter((entry): entry is File => entry instanceof File && entry.size > 0);

    if (!taskName || !location || files.length === 0) {
      return NextResponse.json({ ok: false, error: "Missing required task submission fields." }, { status: 400 });
    }

    const result = await submitTaskRun({ taskName, location, files });
    return NextResponse.json({ ok: true, result });
  } catch (error) {
    return NextResponse.json(
      { ok: false, error: error instanceof Error ? error.message : "Task submission failed." },
      { status: 500 },
    );
  }
}
