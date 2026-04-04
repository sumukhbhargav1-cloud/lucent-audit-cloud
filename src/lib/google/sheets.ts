import "server-only";

import { getSheetsClient } from "@/lib/google/client";

export interface AppendSheetRowInput {
  values: string[];
  spreadsheetId?: string;
  sheetName?: string;
}

const OPERATIONS_COLUMNS = [
  "Work Name",
  "Date",
  "Time",
  "Location",
  "Google Drive Folder Link",
];

async function getSpreadsheetId(spreadsheetId?: string) {
  const resolved = spreadsheetId || process.env.GOOGLE_SHEETS_SPREADSHEET_ID;
  if (!resolved) {
    throw new Error("Missing GOOGLE_SHEETS_SPREADSHEET_ID.");
  }
  return resolved;
}

export async function ensureSheetExists({
  spreadsheetId,
  sheetName,
  headers,
}: {
  spreadsheetId?: string;
  sheetName: string;
  headers: string[];
}) {
  const resolvedSpreadsheetId = await getSpreadsheetId(spreadsheetId);
  const sheets = await getSheetsClient();

  const metadata = await sheets.spreadsheets.get({ spreadsheetId: resolvedSpreadsheetId });
  const existing = metadata.data.sheets?.find(
    (sheet) => sheet.properties?.title === sheetName,
  );

  if (!existing) {
    await sheets.spreadsheets.batchUpdate({
      spreadsheetId: resolvedSpreadsheetId,
      requestBody: {
        requests: [{ addSheet: { properties: { title: sheetName } } }],
      },
    });
  }

  const currentValues = await sheets.spreadsheets.values.get({
    spreadsheetId: resolvedSpreadsheetId,
    range: `${sheetName}!1:1`,
  });

  if (!currentValues.data.values?.[0]?.length) {
    await sheets.spreadsheets.values.update({
      spreadsheetId: resolvedSpreadsheetId,
      range: `${sheetName}!A1`,
      valueInputOption: "RAW",
      requestBody: { values: [headers] },
    });
  }

  return { spreadsheetId: resolvedSpreadsheetId, sheetName };
}

export async function appendSheetRow({
  values,
  spreadsheetId,
  sheetName,
}: AppendSheetRowInput) {
  if (!sheetName) {
    throw new Error("sheetName is required.");
  }

  const resolvedSpreadsheetId = await getSpreadsheetId(spreadsheetId);
  const sheets = await getSheetsClient();

  const response = await sheets.spreadsheets.values.append({
    spreadsheetId: resolvedSpreadsheetId,
    range: `${sheetName}!A:Z`,
    valueInputOption: "USER_ENTERED",
    requestBody: {
      values: [values],
    },
  });

  return response.data;
}

export async function appendOperationalRow({
  workName,
  date,
  time,
  location,
  driveFolderLink,
  spreadsheetId,
  sheetName = process.env.GOOGLE_SHEETS_SHEET_NAME || "Sheet1",
}: {
  workName: string;
  date: string;
  time: string;
  location: string;
  driveFolderLink: string;
  spreadsheetId?: string;
  sheetName?: string;
}) {
  await ensureSheetExists({
    spreadsheetId,
    sheetName,
    headers: OPERATIONS_COLUMNS,
  });

  return appendSheetRow({
    spreadsheetId,
    sheetName,
    values: [workName, date, time, location, driveFolderLink],
  });
}

export async function getSheetRows({
  spreadsheetId,
  sheetName,
}: {
  spreadsheetId?: string;
  sheetName: string;
}) {
  const resolvedSpreadsheetId = await getSpreadsheetId(spreadsheetId);
  const sheets = await getSheetsClient();

  const response = await sheets.spreadsheets.values.get({
    spreadsheetId: resolvedSpreadsheetId,
    range: `${sheetName}!A:Z`,
  });

  const values = response.data.values ?? [];
  const [headers = [], ...rows] = values;

  return rows.map((row) =>
    headers.reduce<Record<string, string>>((record, header, index) => {
      record[header] = row[index] ?? "";
      return record;
    }, {}),
  );
}
