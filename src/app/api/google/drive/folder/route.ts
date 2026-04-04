import { NextRequest, NextResponse } from "next/server";
import { ensureDriveFolder } from "@/lib/google/drive";

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as {
      folderName?: string;
      parentFolderId?: string;
    };

    if (!body.folderName) {
      return NextResponse.json({ ok: false, error: "folderName is required" }, { status: 400 });
    }

    const folder = await ensureDriveFolder({
      folderName: body.folderName,
      parentFolderId: body.parentFolderId,
    });

    return NextResponse.json({ ok: true, folder });
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
