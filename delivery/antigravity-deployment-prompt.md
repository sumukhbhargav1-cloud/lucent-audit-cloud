Deploy this Next.js + Firebase hotel operations SaaS to Antigravity as a cloud-hosted production application.

Deployment target:
- Antigravity managed cloud deployment
- No local runtime dependencies in the production design
- Use environment variables and secret management for all credentials

Application summary:
- Multi-tenant hotel audit and operations management platform
- Mobile-first Next.js frontend
- Firebase Auth, Firestore, Cloud Functions, Cloud Messaging
- Google Drive API integration for image foldering and uploads
- Google Sheets API integration for operational reporting rows

Deployment requirements:
- Build and deploy the Next.js application
- Configure production environment variables
- Support secure server-side secrets for:
  - Firebase service account or application credentials
  - Firebase web config
  - Google Drive API credentials
  - Google Sheets API credentials
  - FCM keys or equivalent configuration
- Configure custom domain support
- Enforce HTTPS
- Enable autoscaling appropriate for SaaS workloads
- Configure structured logs and error monitoring

Environment variables to provision:
- NEXT_PUBLIC_FIREBASE_API_KEY
- NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN
- NEXT_PUBLIC_FIREBASE_PROJECT_ID
- NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET
- NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID
- NEXT_PUBLIC_FIREBASE_APP_ID
- NEXT_PUBLIC_APP_ENV
- FIREBASE_CLIENT_EMAIL
- FIREBASE_PRIVATE_KEY
- FIREBASE_PROJECT_ID
- GOOGLE_DRIVE_PARENT_FOLDER_ID
- GOOGLE_DRIVE_SHARED_DRIVE_ID
- GOOGLE_SHEETS_SPREADSHEET_ID
- GOOGLE_SERVICE_ACCOUNT_EMAIL
- GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY
- APP_BASE_URL
- CRON_SHARED_SECRET

Runtime architecture:
- Next.js app serves UI and server actions or API handlers
- Firebase Admin SDK used only on trusted server side
- Background jobs handled by Cloud Functions or secure scheduled workers
- Antigravity hosts frontend and any required server endpoints

Operational setup:
- Configure scheduled jobs for:
  - task run generation
  - worker log generation
  - missed status reconciliation
  - notification fanout
  - weekly Sunday organization
  - monthly PDF and Excel report generation
- Configure storage/network egress permissions for Google APIs
- Provide zero-downtime deployment strategy
- Separate staging and production environments

Security requirements:
- Never expose service account secrets to the client
- Enforce role-based API access
- Ensure every request is scoped by hotelId and authenticated membership
- Rate-limit write-heavy endpoints
- Log admin actions and failed submissions

Monitoring and reliability:
- Health check endpoint
- Error alerts
- Job retry policy with idempotency keys
- Dead-letter handling for failed report generation or Google sync

Deployment output expectations:
- Running production URL
- Environment variable checklist
- Scheduled job checklist
- Secret configuration checklist
- Post-deploy smoke test checklist
