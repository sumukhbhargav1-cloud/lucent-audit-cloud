import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    ok: true,
    service: "hotel-guardian-cloud",
    mode: "prototype-cloud-ready",
    integrations: {
      firebase: "pending-env",
      googleDrive: "pending-service-account-json",
      googleSheets: "pending-service-account-json",
    },
  });
}
