import "server-only";

import { getSheetsClient } from "@/lib/google/client";

export interface AppendSheetRowInput {
  workName: string;
  date: string;
  time: string;
  location: string;
  driveFolderLink: string;
  spreadsheetId?: string;
  sheetName?: string;
}

export async function appendOperationalRow({
  workName,
  date,
  time,
  location,
  driveFolderLink,
  spreadsheetId = process.env.GOOGLE_SHEETS_SPREADSHEET_ID,
  sheetName = process.env.GOOGLE_SHEETS_SHEET_NAME || "Sheet1",
}: AppendSheetRowInput) {
  if (!spreadsheetId) {
    throw new Error("Missing GOOGLE_SHEETS_SPREADSHEET_ID.");
  }

  const sheets = await getSheetsClient();
  const range = `${sheetName}!A:E`;

  const response = await sheets.spreadsheets.values.append({
    spreadsheetId,
    range,
    valueInputOption: "USER_ENTERED",
    requestBody: {
      values: [[workName, date, time, location, driveFolderLink]],
    },
  });

  return response.data;
}
