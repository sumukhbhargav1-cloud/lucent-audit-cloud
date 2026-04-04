import { NextResponse } from "next/server";
import { submitIssue } from "@/lib/submission";

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const title = String(formData.get("title") || "");
    const description = String(formData.get("description") || "");
    const location = String(formData.get("location") || "");
    const category = String(formData.get("category") || "");
    const priority = String(formData.get("priority") || "");
    const photo = formData.get("photo");

    if (!title || !location || !category || !priority || !(photo instanceof File)) {
      return NextResponse.json({ ok: false, error: "Missing required issue fields." }, { status: 400 });
    }

    const result = await submitIssue({ title, description, location, category, priority, photo });
    return NextResponse.json({ ok: true, result });
  } catch (error) {
    return NextResponse.json(
      { ok: false, error: error instanceof Error ? error.message : "Issue submission failed." },
      { status: 500 },
    );
  }
}
