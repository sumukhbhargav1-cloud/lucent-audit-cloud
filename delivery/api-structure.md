# API Structure

Architecture style:
- Next.js route handlers for app APIs
- Firebase Cloud Functions for scheduled/background jobs and external integrations
- Firestore as source of truth

All API routes:
- require authentication
- resolve active hotel membership
- enforce role-based permissions
- log critical actions

## API namespaces

### Auth and session

`POST /api/auth/select-hotel`
- Purpose: set active hotel context for multi-hotel users
- Body: `{ hotelId }`

### Dashboard

`GET /api/dashboard/summary`
- Returns today’s due worker logs, task runs, water logs, open issues, compliance metrics

`GET /api/dashboard/timeline?date=YYYY-MM-DD`
- Returns chronological operational schedule for the selected day

### Worker Reports

`GET /api/worker-logs?date=YYYY-MM-DD&status=pending`
- List due/completed/missed worker log events

`POST /api/worker-logs/{id}/submit`
- Submit worker entry/exit proof
- Body:
  - `photoToken` or uploaded media reference
  - `note` optional
  - `clientCapturedAt`
  - `geo` optional
- Side effects:
  - upload to Drive folder
  - append Sheet row
  - status becomes completed

`POST /api/worker-logs/{id}/override`
- Admin only
- Body: `{ status: "holiday" | "approved_exception", reason }`

### Room Audits

`POST /api/room-audits/before-check-in/start`
- Create draft audit

`GET /api/room-audits/templates?mode=before_check_in`
- Fetch active audit template

`GET /api/room-audits/search-stay?guestName=&roomNumber=`
- Find matching stay for post-checkout

`GET /api/room-audits/previous?roomStayId=`
- Fetch previous audit for comparison

`POST /api/room-audits/{id}/submit`
- Submit full audit payload
- Side effects:
  - generate comparison result
  - create issue when towel mismatch or severe condition found
  - create Drive folder
  - append Sheet row

`GET /api/room-audits/{id}`
- Returns detailed report view

### Tasks / Work Holds

`GET /api/tasks`
- List task definitions

`POST /api/tasks`
- Admin only, create task definition

`PATCH /api/tasks/{id}`
- Admin only, edit task

`DELETE /api/tasks/{id}`
- Admin only, soft-delete task

`GET /api/task-runs?date=YYYY-MM-DD&status=pending`
- Returns generated scheduled task instances

`GET /api/task-runs/{id}`
- Returns task run detail including step requirements

`POST /api/task-runs/{id}/start`
- Mark task as in progress

`POST /api/task-runs/{id}/steps/{stepKey}/submit`
- Submit step photos and notes

`POST /api/task-runs/{id}/complete`
- Finalize run after validating all required steps/photos

### Issues / Inventory

`GET /api/issues?status=open`
- List issues

`POST /api/issues`
- Create issue with mandatory photo

`PATCH /api/issues/{id}`
- Update status, assignee, resolution

`GET /api/inventory-items?status=missing`
- List filtered inventory exceptions

`POST /api/inventory-items`
- Admin or manager create/update tracked item

`PATCH /api/inventory-items/{id}`
- Update status or quantity

### Water Meter

`GET /api/water-logs?date=YYYY-MM-DD`
- List scheduled intervals and completion state

`POST /api/water-logs/{id}/submit`
- Submit water meter reading and mandatory photo

### Reports and exports

`GET /api/reports?type=monthly_pdf`
- List generated reports

`POST /api/reports/generate`
- Admin only

`GET /api/reports/{id}/download`
- Returns signed URL or redirect

### Admin config

`GET /api/admin/users`
- Hotel user list and roles

`POST /api/admin/users/invite`
- Invite or create staff user

`PATCH /api/admin/memberships/{id}`
- Update role/permissions

`GET /api/admin/schedules`
- View worker schedules, task schedules, water schedules

`POST /api/admin/worker-schedules`
- Create worker schedule

`POST /api/admin/task-schedules`
- Create task schedule

`POST /api/admin/water-schedules`
- Configure water meter schedule

`GET /api/admin/templates`
- List dynamic checklist templates

`POST /api/admin/templates`
- Create or version template

### Notifications

`GET /api/notifications`
- In-app alert feed

`POST /api/notifications/register-device`
- Register FCM token for push

## Background Cloud Functions

### Scheduler functions

`generateWorkerLogs`
`generateTaskRuns`
`generateWaterLogs`
`markMissedItems`

### Notification functions

`sendDueNotifications`
`sendEscalations`

### Google integration functions

`syncDriveFolderAndMedia`
`appendGoogleSheetRow`

### Reporting functions

`weeklyOrganizationJob`
`generateMonthlyPdfReport`
`generateMonthlyExcelReport`

## Common request/response standards

- Request id passed as `x-request-id`
- Idempotency key for submit/complete endpoints
- Standard errors:
  - `AUTH_REQUIRED`
  - `FORBIDDEN`
  - `HOTEL_CONTEXT_REQUIRED`
  - `VALIDATION_ERROR`
  - `MEDIA_REQUIRED`
  - `ALREADY_SUBMITTED`
  - `SCHEDULE_WINDOW_EXPIRED`
  - `GOOGLE_SYNC_FAILED`

## Media upload strategy

Recommended production approach:
1. frontend captures image from camera
2. frontend uploads to a temporary secured intake endpoint or signed storage target
3. backend validates owner, module, and required presence
4. background function pushes media to Google Drive and writes `mediaAssets`
5. business record stays blocked from completion until required media references are present
