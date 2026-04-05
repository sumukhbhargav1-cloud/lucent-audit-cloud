import { NextResponse } from "next/server";
import { generateMonthlyPdfReport } from "@/lib/reports";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const month = searchParams.get("month") || new Date().toISOString().slice(0, 7);
    const file = await generateMonthlyPdfReport(month);

    return new NextResponse(new Uint8Array(file), {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="hotel-guardian-monthly-${month}.pdf"`,
      },
    });
  } catch (error) {
    return NextResponse.json(
      { ok: false, error: error instanceof Error ? error.message : "PDF export failed." },
      { status: 500 },
    );
  }
}
