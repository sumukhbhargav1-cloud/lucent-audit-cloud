import "server-only";

import { randomUUID } from "node:crypto";
import { ensureDriveFolder, uploadFileToDrive } from "@/lib/google/drive";
import {
  appendOperationalDataRow,
  appendOpsSummaryRow,
  DATA_SHEETS,
  findLatestBeforeCheckInAudit,
} from "@/lib/google/operations";

const HOTEL_ID = "lucent-main";

function toIsoDate(date = new Date()) {
  return date.toISOString().slice(0, 10);
}

function toDisplayTime(date = new Date()) {
  return new Intl.DateTimeFormat("en-IN", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
    timeZone: "Asia/Kolkata",
  }).format(date);
}

async function uploadPhotos(folderId: string, files: File[]) {
  const uploaded = [];

  for (const file of files) {
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const uploadedFile = await uploadFileToDrive({
      folderId,
      fileName: file.name || `capture-${Date.now()}.jpg`,
      mimeType: file.type || "image/jpeg",
      buffer,
    });
    uploaded.push(uploadedFile.webViewLink || uploadedFile.webContentLink || "");
  }

  return uploaded;
}

function formatDriveQuotaError(error: unknown) {
  const message = error instanceof Error ? error.message : "Google Drive upload failed.";
  if (message.includes("Service Accounts do not have storage quota")) {
    return "Google Drive upload failed because the current parent folder is in personal My Drive. Service accounts can create folders there but cannot store uploaded files without quota. Move the target folder into a Shared Drive and share that Shared Drive with the service account, or switch to delegated user OAuth.";
  }
  return message;
}

export async function submitWorkerLog({
  workerName,
  actionType,
  scheduledTime,
  photo,
}: {
  workerName: string;
  actionType: string;
  scheduledTime: string;
  photo: File;
}) {
  const submittedAt = new Date();
  const folderName = `WorkerReport_${workerName}_${actionType}_${toIsoDate(submittedAt)}`;
  const folder = await ensureDriveFolder({ folderName });
  let photoLinks: string[] = [];
  try {
    photoLinks = await uploadPhotos(folder.id!, [photo]);
  } catch (error) {
    throw new Error(formatDriveQuotaError(error));
  }
  const recordId = randomUUID();

  await appendOperationalDataRow(DATA_SHEETS.workerLogs, [
    recordId,
    HOTEL_ID,
    workerName,
    actionType,
    scheduledTime,
    submittedAt.toISOString(),
    folder.webViewLink || "",
    photoLinks.join(", "),
    "completed",
  ]);

  await appendOpsSummaryRow({
    workName: `Worker Report - ${workerName} ${actionType}`,
    date: toIsoDate(submittedAt),
    time: toDisplayTime(submittedAt),
    location: "Entrance",
    driveFolderLink: folder.webViewLink || "",
  });

  return { recordId, folderLink: folder.webViewLink, photoLinks };
}

export async function submitRoomAudit({
  mode,
  guestName,
  roomNumber,
  checkInDate,
  expectedCheckOutDate,
  towelCount,
  bedCondition,
  files,
}: {
  mode: "before_check_in" | "after_check_out";
  guestName: string;
  roomNumber: string;
  checkInDate: string;
  expectedCheckOutDate: string;
  towelCount: string;
  bedCondition: string;
  files: File[];
}) {
  const submittedAt = new Date();
  const folderName = `RoomAudit_${mode}_${toIsoDate(submittedAt)}_${roomNumber}`;
  const folder = await ensureDriveFolder({ folderName });
  let photoLinks: string[] = [];
  try {
    photoLinks = await uploadPhotos(folder.id!, files);
  } catch (error) {
    throw new Error(formatDriveQuotaError(error));
  }
  const recordId = randomUUID();

  let comparisonAuditId = "";
  let comparisonSummary = "";
  let status = "submitted";

  if (mode === "after_check_out") {
    const previous = await findLatestBeforeCheckInAudit({ guestName, roomNumber });
    if (previous) {
      comparisonAuditId = previous.recordId;
      const mismatch = previous.towelCount !== towelCount;
      comparisonSummary = mismatch
        ? `Towel mismatch before=${previous.towelCount} after=${towelCount}`
        : "No towel mismatch";
      status = mismatch ? "flagged" : "submitted";
    }
  }

  await appendOperationalDataRow(DATA_SHEETS.roomAudits, [
    recordId,
    HOTEL_ID,
    mode,
    guestName,
    roomNumber,
    checkInDate,
    expectedCheckOutDate,
    submittedAt.toISOString(),
    folder.webViewLink || "",
    towelCount,
    bedCondition,
    photoLinks.join(", "),
    comparisonAuditId,
    comparisonSummary,
    status,
  ]);

  await appendOpsSummaryRow({
    workName: `Room Audit - ${mode}`,
    date: toIsoDate(submittedAt),
    time: toDisplayTime(submittedAt),
    location: `Room ${roomNumber}`,
    driveFolderLink: folder.webViewLink || "",
  });

  return {
    recordId,
    status,
    comparisonAuditId,
    comparisonSummary,
    folderLink: folder.webViewLink,
    photoLinks,
  };
}

export async function submitTaskRun({
  taskName,
  location,
  files,
}: {
  taskName: string;
  location: string;
  files: File[];
}) {
  const submittedAt = new Date();
  const folderName = `Task_${taskName.replace(/\s+/g, "_")}_${toIsoDate(submittedAt)}_${location.replace(/\s+/g, "_")}`;
  const folder = await ensureDriveFolder({ folderName });
  let photoLinks: string[] = [];
  try {
    photoLinks = await uploadPhotos(folder.id!, files);
  } catch (error) {
    throw new Error(formatDriveQuotaError(error));
  }
  const recordId = randomUUID();

  await appendOperationalDataRow(DATA_SHEETS.taskSubmissions, [
    recordId,
    HOTEL_ID,
    taskName,
    location,
    submittedAt.toISOString(),
    folder.webViewLink || "",
    photoLinks.join(", "),
    String(files.length),
    "completed",
  ]);

  await appendOpsSummaryRow({
    workName: taskName,
    date: toIsoDate(submittedAt),
    time: toDisplayTime(submittedAt),
    location,
    driveFolderLink: folder.webViewLink || "",
  });

  return { recordId, folderLink: folder.webViewLink, photoLinks };
}

export async function submitIssue({
  title,
  description,
  location,
  category,
  priority,
  photo,
}: {
  title: string;
  description: string;
  location: string;
  category: string;
  priority: string;
  photo: File;
}) {
  const submittedAt = new Date();
  const folderName = `Issue_${title.replace(/\s+/g, "_")}_${toIsoDate(submittedAt)}`;
  const folder = await ensureDriveFolder({ folderName });
  let photoLinks: string[] = [];
  try {
    photoLinks = await uploadPhotos(folder.id!, [photo]);
  } catch (error) {
    throw new Error(formatDriveQuotaError(error));
  }
  const recordId = randomUUID();

  await appendOperationalDataRow(DATA_SHEETS.issues, [
    recordId,
    HOTEL_ID,
    title,
    description,
    location,
    category,
    priority,
    submittedAt.toISOString(),
    folder.webViewLink || "",
    photoLinks.join(", "),
    "open",
  ]);

  await appendOpsSummaryRow({
    workName: `Issue - ${title}`,
    date: toIsoDate(submittedAt),
    time: toDisplayTime(submittedAt),
    location,
    driveFolderLink: folder.webViewLink || "",
  });

  return { recordId, folderLink: folder.webViewLink, photoLinks };
}

export async function submitWaterLog({
  slot,
  reading,
  photo,
}: {
  slot: string;
  reading: string;
  photo: File;
}) {
  const submittedAt = new Date();
  const folderName = `WaterMeter_${toIsoDate(submittedAt)}_${slot.replace(/[:\s]/g, "_")}`;
  const folder = await ensureDriveFolder({ folderName });
  let photoLinks: string[] = [];
  try {
    photoLinks = await uploadPhotos(folder.id!, [photo]);
  } catch (error) {
    throw new Error(formatDriveQuotaError(error));
  }
  const recordId = randomUUID();

  await appendOperationalDataRow(DATA_SHEETS.waterLogs, [
    recordId,
    HOTEL_ID,
    slot,
    reading,
    submittedAt.toISOString(),
    folder.webViewLink || "",
    photoLinks.join(", "),
    "completed",
  ]);

  await appendOpsSummaryRow({
    workName: "Water Meter",
    date: toIsoDate(submittedAt),
    time: toDisplayTime(submittedAt),
    location: "Water Meter Room",
    driveFolderLink: folder.webViewLink || "",
  });

  return { recordId, folderLink: folder.webViewLink, photoLinks };
}

export async function lookupBeforeCheckInAudit(input: {
  guestName?: string;
  roomNumber?: string;
}) {
  return findLatestBeforeCheckInAudit(input);
}
