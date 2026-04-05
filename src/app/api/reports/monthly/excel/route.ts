import { NextResponse } from "next/server";
import { generateMonthlyExcelReport } from "@/lib/reports";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const month = searchParams.get("month") || new Date().toISOString().slice(0, 7);
    const file = await generateMonthlyExcelReport(month);

    return new NextResponse(new Uint8Array(file), {
      status: 200,
      headers: {
        "Content-Type":
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        "Content-Disposition": `attachment; filename="hotel-guardian-monthly-${month}.xlsx"`,
      },
    });
  } catch (error) {
    return NextResponse.json(
      { ok: false, error: error instanceof Error ? error.message : "Excel export failed." },
      { status: 500 },
    );
  }
}
