import { NextResponse } from "next/server";
import { getGoogleServiceAccount } from "@/lib/google/service-account";

export async function GET() {
  try {
    const serviceAccount = await getGoogleServiceAccount();

    return NextResponse.json({
      ok: true,
      projectId: serviceAccount.project_id,
      clientEmail: serviceAccount.client_email,
      source: process.env.GOOGLE_SERVICE_ACCOUNT_JSON_PATH ? "json-path-or-env" : "env",
    });
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
