import "server-only";

import { appendOperationalRow, appendSheetRow, ensureSheetExists, getSheetRows } from "@/lib/google/sheets";

export const DATA_SHEETS = {
  workerLogs: "worker_logs",
  roomAudits: "room_audits",
  taskSubmissions: "task_submissions",
  issues: "issues",
  waterLogs: "water_logs",
} as const;

const SHEET_HEADERS: Record<(typeof DATA_SHEETS)[keyof typeof DATA_SHEETS], string[]> = {
  worker_logs: [
    "recordId",
    "hotelId",
    "workerName",
    "actionType",
    "scheduledTime",
    "submittedAt",
    "folderLink",
    "photoLinks",
    "status",
  ],
  room_audits: [
    "recordId",
    "hotelId",
    "mode",
    "guestName",
    "roomNumber",
    "checkInDate",
    "expectedCheckOutDate",
    "submittedAt",
    "folderLink",
    "towelCount",
    "bedCondition",
    "photoLinks",
    "comparisonAuditId",
    "comparisonSummary",
    "status",
  ],
  task_submissions: [
    "recordId",
    "hotelId",
    "taskName",
    "location",
    "submittedAt",
    "folderLink",
    "photoLinks",
    "stepCount",
    "status",
  ],
  issues: [
    "recordId",
    "hotelId",
    "title",
    "description",
    "location",
    "category",
    "priority",
    "submittedAt",
    "folderLink",
    "photoLinks",
    "status",
  ],
  water_logs: [
    "recordId",
    "hotelId",
    "slot",
    "reading",
    "submittedAt",
    "folderLink",
    "photoLinks",
    "status",
  ],
};

export async function ensureOperationalSheets() {
  await Promise.all(
    Object.entries(DATA_SHEETS).map(([, sheetName]) =>
      ensureSheetExists({
        sheetName,
        headers: SHEET_HEADERS[sheetName],
      }),
    ),
  );
}

export async function appendOperationalDataRow(
  sheetName: (typeof DATA_SHEETS)[keyof typeof DATA_SHEETS],
  values: string[],
) {
  await ensureSheetExists({
    sheetName,
    headers: SHEET_HEADERS[sheetName],
  });

  return appendSheetRow({ sheetName, values });
}

export async function appendOpsSummaryRow(input: {
  workName: string;
  date: string;
  time: string;
  location: string;
  driveFolderLink: string;
}) {
  return appendOperationalRow(input);
}

export async function findLatestBeforeCheckInAudit({
  guestName,
  roomNumber,
}: {
  guestName?: string;
  roomNumber?: string;
}) {
  const rows = await getSheetRows({ sheetName: DATA_SHEETS.roomAudits });

  const filtered = rows.filter((row) => {
    const guestMatches = guestName
      ? row.guestName.toLowerCase().includes(guestName.toLowerCase())
      : true;
    const roomMatches = roomNumber ? row.roomNumber === roomNumber : true;
    return row.mode === "before_check_in" && guestMatches && roomMatches;
  });

  return filtered.sort((left, right) => right.submittedAt.localeCompare(left.submittedAt))[0] ?? null;
}
