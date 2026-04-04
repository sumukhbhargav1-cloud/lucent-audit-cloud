import "server-only";

import { Readable } from "node:stream";
import { getDriveClient } from "@/lib/google/client";

export interface EnsureDriveFolderInput {
  folderName: string;
  parentFolderId?: string;
}

export interface UploadDriveFileInput {
  folderId: string;
  fileName: string;
  mimeType: string;
  buffer: Buffer;
}

function escapeDriveQuery(value: string) {
  return value.replace(/\\/g, "\\\\").replace(/'/g, "\\'");
}

export async function ensureDriveFolder({
  folderName,
  parentFolderId = process.env.GOOGLE_DRIVE_PARENT_FOLDER_ID,
}: EnsureDriveFolderInput) {
  const drive = await getDriveClient();

  const queryParts = [
    "mimeType='application/vnd.google-apps.folder'",
    `name='${escapeDriveQuery(folderName)}'`,
    "trashed=false",
  ];

  if (parentFolderId) {
    queryParts.push(`'${parentFolderId}' in parents`);
  }

  const existing = await drive.files.list({
    q: queryParts.join(" and "),
    fields: "files(id,name,webViewLink,parents)",
    includeItemsFromAllDrives: true,
    supportsAllDrives: true,
  });

  const found = existing.data.files?.[0];
  if (found?.id) {
    return found;
  }

  const created = await drive.files.create({
    requestBody: {
      name: folderName,
      mimeType: "application/vnd.google-apps.folder",
      parents: parentFolderId ? [parentFolderId] : undefined,
    },
    fields: "id,name,webViewLink,parents",
    supportsAllDrives: true,
  });

  return created.data;
}

export async function uploadFileToDrive({
  folderId,
  fileName,
  mimeType,
  buffer,
}: UploadDriveFileInput) {
  const drive = await getDriveClient();

  const created = await drive.files.create({
    requestBody: {
      name: fileName,
      parents: [folderId],
    },
    media: {
      mimeType,
      body: Readable.from(buffer),
    },
    fields: "id,name,webViewLink,webContentLink",
    supportsAllDrives: true,
  });

  return created.data;
}
