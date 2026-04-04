import { NextRequest, NextResponse } from "next/server";
import { appendOperationalRow } from "@/lib/google/sheets";

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as {
      workName?: string;
      date?: string;
      time?: string;
      location?: string;
      driveFolderLink?: string;
      spreadsheetId?: string;
      sheetName?: string;
    };

    if (!body.workName || !body.date || !body.time || !body.location || !body.driveFolderLink) {
      return NextResponse.json(
        {
          ok: false,
          error: "workName, date, time, location, and driveFolderLink are required",
        },
        { status: 400 },
      );
    }

    const result = await appendOperationalRow({
      workName: body.workName,
      date: body.date,
      time: body.time,
      location: body.location,
      driveFolderLink: body.driveFolderLink,
      spreadsheetId: body.spreadsheetId,
      sheetName: body.sheetName,
    });

    return NextResponse.json({ ok: true, result });
  } catch (error) {
    return NextResponse.json(
      {
        ok: false,
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    );
  }
}
