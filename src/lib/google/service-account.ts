import "server-only";

import { readFile } from "node:fs/promises";

export interface GoogleServiceAccount {
  type: string;
  project_id: string;
  private_key: string;
  client_email: string;
  token_uri?: string;
}

function normalizePrivateKey(key: string) {
  return key.replace(/\\n/g, "\n");
}

async function readJsonFile(jsonPath: string): Promise<GoogleServiceAccount> {
  const raw = await readFile(jsonPath, "utf8");
  const parsed = JSON.parse(raw) as GoogleServiceAccount;

  return {
    ...parsed,
    private_key: normalizePrivateKey(parsed.private_key),
  };
}

function fromEnv(): GoogleServiceAccount | null {
  const projectId = process.env.FIREBASE_PROJECT_ID || process.env.GOOGLE_PROJECT_ID;
  const clientEmail = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL || process.env.FIREBASE_CLIENT_EMAIL;
  const privateKey =
    process.env.GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY || process.env.FIREBASE_PRIVATE_KEY;

  if (!projectId || !clientEmail || !privateKey) {
    return null;
  }

  return {
    type: "service_account",
    project_id: projectId,
    client_email: clientEmail,
    private_key: normalizePrivateKey(privateKey),
    token_uri: "https://oauth2.googleapis.com/token",
  };
}

export async function getGoogleServiceAccount() {
  const fromEnvironment = fromEnv();
  if (fromEnvironment) {
    return fromEnvironment;
  }

  const jsonPath = process.env.GOOGLE_SERVICE_ACCOUNT_JSON_PATH;
  if (!jsonPath) {
    throw new Error(
      "Missing Google service account configuration. Set env vars or GOOGLE_SERVICE_ACCOUNT_JSON_PATH.",
    );
  }

  return readJsonFile(jsonPath);
}
