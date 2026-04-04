import "server-only";

import { google } from "googleapis";
import { getGoogleServiceAccount } from "@/lib/google/service-account";

async function createAuth(scopes: string[]) {
  const serviceAccount = await getGoogleServiceAccount();

  return new google.auth.JWT({
    email: serviceAccount.client_email,
    key: serviceAccount.private_key,
    scopes,
  });
}

export async function getDriveClient() {
  const auth = await createAuth(["https://www.googleapis.com/auth/drive"]);
  return google.drive({ version: "v3", auth });
}

export async function getSheetsClient() {
  const auth = await createAuth(["https://www.googleapis.com/auth/spreadsheets"]);
  return google.sheets({ version: "v4", auth });
}
