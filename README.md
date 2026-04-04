# Hotel Guardian Cloud

Hotel Guardian Cloud is a mobile-first hotel audit and operations management system designed to grow into a multi-tenant SaaS platform.

## Included in this repository

- Next.js App Router frontend
- Mobile-first staff workflow screens
- Worker Report module
- Room Audit module
- Work Holds task module
- Issues and Inventory module
- Water Meter module
- Admin console shell
- Google Drive server-side integration helpers
- Google Sheets server-side integration helpers
- Production architecture and delivery docs in `delivery/`

## Verified status

- `npm run lint` passes
- `npm run build` passes
- Google service account authentication verified
- Google Sheets append verified
- Google Drive folder creation verified

## Local setup

1. Install dependencies:

```bash
npm install
```

2. Configure environment values in `.env.local`.

3. Start the app:

```bash
npm run dev
```

4. Build for production:

```bash
npm run build
```

## Important environment variables

- `GOOGLE_SERVICE_ACCOUNT_JSON_PATH`
- `GOOGLE_DRIVE_PARENT_FOLDER_ID`
- `GOOGLE_SHEETS_SPREADSHEET_ID`
- `GOOGLE_SHEETS_SHEET_NAME`
- Firebase keys for Auth, Firestore, Functions, and Messaging

See:
- `docs/google-setup.md`
- `delivery/antigravity-deployment-prompt.md`
- `delivery/database-schema.md`

## Current implementation note

The repository currently contains a verified app shell and server-side Google integrations. The next step is wiring all business submissions directly into Firebase + Drive + Sheets persistence flows for full production behavior.
