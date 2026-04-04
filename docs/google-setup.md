# Google Drive and Sheets Setup

The app now includes server-side Google integration helpers for:
- Drive folder creation
- Sheets row append
- service account auth through environment variables or a local JSON path

## Local development

Set this in `.env.local` if you want to use the downloaded service account file directly:

```env
GOOGLE_SERVICE_ACCOUNT_JSON_PATH=C:\Users\YATS\Downloads\gdrive.json
```

Optional defaults:

```env
GOOGLE_DRIVE_PARENT_FOLDER_ID=
GOOGLE_SHEETS_SPREADSHEET_ID=
GOOGLE_SHEETS_SHEET_NAME=Sheet1
GOOGLE_PROJECT_ID=spry-metric-492305-e1
```

## Antigravity deployment

Prefer environment variables instead of a JSON file:

```env
GOOGLE_PROJECT_ID=
GOOGLE_SERVICE_ACCOUNT_EMAIL=
GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY=
GOOGLE_DRIVE_PARENT_FOLDER_ID=
GOOGLE_DRIVE_SHARED_DRIVE_ID=
GOOGLE_SHEETS_SPREADSHEET_ID=
GOOGLE_SHEETS_SHEET_NAME=Sheet1
```

## API routes

`GET /api/google/health`
- validates that credentials can be loaded

`POST /api/google/drive/folder`
- body: `{ "folderName": "WorkName_2026-04-04_Room205", "parentFolderId": "optional" }`

`POST /api/google/sheets/append`
- body:
  `{ "workName": "Room Audit", "date": "2026-04-04", "time": "10:00", "location": "Room 205", "driveFolderLink": "https://..." }`

## Important

- The service account must be granted access to the target Drive folder or shared drive.
- The same service account must have edit access to the target spreadsheet.
- These routes are currently generic plumbing endpoints; the next step is connecting them into Firebase-backed submission workflows.
