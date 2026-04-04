import "server-only";

import { getDriveClient } from "@/lib/google/client";

export interface EnsureDriveFolderInput {
  folderName: string;
  parentFolderId?: string;
}

export async function ensureDriveFolder({
  folderName,
  parentFolderId = process.env.GOOGLE_DRIVE_PARENT_FOLDER_ID,
}: EnsureDriveFolderInput) {
  const drive = await getDriveClient();

  const queryParts = [
    "mimeType='application/vnd.google-apps.folder'",
    `name='${folderName.replace(/'/g, "\\'")}'`,
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
