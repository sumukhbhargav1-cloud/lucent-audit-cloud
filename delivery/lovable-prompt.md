Build a production-ready mobile-first HOTEL AUDIT & OPERATIONS MANAGEMENT SYSTEM that is designed from day one to scale into a multi-tenant SaaS product for multiple hotels.

Product name: Hotel Guardian Cloud

Primary users:
- Admin
- Staff

Core stack:
- Frontend: Next.js App Router + React + TypeScript
- UI: mobile-first responsive design optimized for phone use
- Backend: Firebase Authentication + Firestore + Cloud Functions + Firebase Cloud Messaging
- Media storage flow: upload captured images to Google Drive folders via backend service integration
- Reporting flow: append operational logs to Google Sheets via backend service integration
- Deployment target: cloud-hosted on Antigravity, not local

Non-negotiable product rules:
- Fully cloud-based
- Mobile-first UI
- Camera-only uploads everywhere photos are required
- Do not allow gallery or generic file upload UI
- Submission must be blocked until required photos are captured
- Every record must include hotelId for SaaS readiness
- Dynamic task/checklist management by Admin
- Admin and Staff role-based access
- Notifications and reminders for scheduled operational work

Main homepage navigation:
1. Worker Report
2. Room Audit
3. Work Holds
4. Issues / Inventory
5. Water Meter

Global UX requirements:
- Large tap targets
- Very fast task completion on phones
- Sticky bottom navigation on mobile
- Color-coded status chips: Pending, Due Soon, Completed, Missed, Flagged
- Dashboard cards with today’s due items
- Offline-friendly UI state with retry queue for weak connectivity
- Auto timestamp and auto user attribution on every submission
- Every form should show progress and missing mandatory fields before submit

Authentication and tenancy:
- Firebase Auth with email/password and phone-friendly login UX
- users belong to one or more hotels through membership records
- roles: superAdmin, hotelAdmin, manager, staff, auditor
- hotelAdmin manages staff, tasks, checklists, rooms, schedules, and issue categories for their hotel

Core data model collections:
- hotels
- users
- hotelMemberships
- workerSchedules
- workerLogs
- roomStays
- roomAudits
- tasks
- taskSchedules
- taskRuns
- taskRunSteps
- issues
- inventoryItems
- waterLogs
- notifications
- reports
- auditTemplates
- appConfig

Module 1: Worker Report
Create a scheduled attendance-style logging system with mandatory photo proof and automatic timestamp capture.

Default schedule rules:
- 8:30 AM: Rangana Enter, Praveen Enter, Preetham Exit
- 9:00 AM: Yashoda Enter
- 5:30 PM: Yashoda Exit
- 8:30 PM: Praveen Exit, Rangana Exit, Preetham Enter

Worker log rules:
- Each required event becomes a scheduled worker log task
- Staff sees only their due actions
- Admin sees all due/missed/completed logs
- Capture must require a live camera photo
- Auto timestamp on submit
- Auto location if permission granted, but do not block if location is denied
- If not submitted within grace window, mark as Missed
- Admin can later reclassify Missed as Holiday or Approved Exception
- Trigger in-app alerts and push notifications at scheduled time and reminder intervals

Module 2: Room Audit
Support two audit modes:
- Before Check-In
- After Check-Out

Before Check-In fields:
- Guest Name
- Check-in Date
- Expected Check-out Date
- Room Number
- AC Remote photo required
- TV Remote photo required
- Set-top Box photo required
- Bed Condition enum: Ok, Good, Bad, Needs Enquiry
- Towel Count number required plus towel photo required
- Bathroom Photos required
- Kettle and Tray photo required
- Menu Cards photo required

After Check-Out flow:
- Ask for Guest Name and room number
- Match and fetch the latest relevant check-in audit record
- Show previous values side by side
- Require all audit items again
- Compare towel count before vs after
- If mismatch, auto-create flagged issue or highlight mismatch before submission
- Bathroom photos, bed condition update, and all item photos remain mandatory

Room audit rules:
- No submission until all mandatory data and photos are completed
- Each audit produces a structured report
- Preserve version history
- Support dynamic checklist templates so each hotel can add/remove items later

Module 3: Work Holds
Build a dynamic scheduled task management module.

Seed predefined tasks:
- Swimming Pool Photos: Daily 10:00 AM and also Tue/Wed/Thu post-cleaning
- Pool Cleaning: Tue/Wed/Thu 10:00 AM to 11:00 AM with step-by-step photos
- Backwash: Thu 10:30 AM with step photos
- Parking Cleaning: Wed/Thu 12:00 PM
- Lift Wiping: Wed/Thu 3:00 PM
- Pool Washroom Cleaning: Thu/Fri 3:30 PM
- Dining Cleaning: Daily 9:30 AM

Task capabilities:
- Admin can add new tasks
- Admin can remove tasks
- Admin can edit schedule
- Tasks can be one-step or multi-step
- Each step can require one or many photos
- Notifications must trigger when task becomes due
- Completion requires mandatory evidence according to task rules
- Task runs should be generated from task schedules

Module 4: Issues / Inventory
Provide an issue reporting and inventory exception system.

Issue report fields:
- Title
- Description
- Location
- Category
- Priority
- Photo mandatory

Inventory exception lists:
- Missing Items
- Empty Items
- Refill Needed

Rules:
- Admin can configure categories and statuses
- Staff can submit issues with photo evidence
- Admin can assign, update, and resolve issues
- Link issues to room audit mismatches and task failures where relevant

Module 5: Water Meter
- Mandatory entry every 2 hours
- Photo required
- Timestamp required
- Admin visibility into missing intervals
- Daily and monthly consumption reporting

Google Drive integration requirements:
- Every task/audit/water log/issue record should create or use a Google Drive folder named in the pattern WorkName_Date_RoomOrArea
- Upload all captured images to that folder through backend functions
- Persist Google Drive folder id and shareable link in Firestore
- Keep source entity linked to the Drive folder

Google Sheets integration requirements:
- Append one row per completed operational record
- Columns:
  - Work Name
  - Date
  - Time
  - Location
  - Google Drive Folder Link
- Build this via backend functions after successful submission

Automation requirements:
- Sunday weekly organization routine for folder/report housekeeping
- Monthly report generation:
  - downloadable PDF report
  - downloadable Excel report

Dashboard and SaaS analytics:
- Today’s due tasks
- Worker log compliance
- Task completion rate
- Room audit completion and flagged mismatches
- Water meter compliance
- Issue aging and closure rate
- Hotel-level analytics with date filters

Admin features:
- Manage hotels, rooms, staff, schedules, templates, task definitions, issue categories
- Override missed events
- Manage notification settings
- Export reports
- View audit trail of changes

Engineering requirements:
- Strong TypeScript types
- Server-side role enforcement in backend functions and Firestore rules
- Reusable form engine for dynamic checklists
- Firestore rules scoped by hotelId and membership
- Background Cloud Functions for schedule generation, missed status updates, notifications, Google Drive upload orchestration, Google Sheets append, and monthly reporting
- Include idempotency protection for background jobs
- Include audit logs for critical admin changes

Camera capture implementation requirement:
- Use camera capture UI optimized for mobile browsers
- Prefer direct camera invocation with `capture="environment"` where supported
- Show a warning that gallery upload is intentionally disabled
- Backend must validate presence of required media before accepting completion

Deliver complete screens and flows:
- Login
- Hotel selector if user belongs to multiple hotels
- Dashboard
- Worker Report list and capture screen
- Room Audit mode selection, audit form, audit detail report
- Work Holds list, task detail, step completion flow
- Issues list, issue create, issue detail
- Water Meter log list and capture flow
- Admin console for tasks/schedules/templates/users/reports
- Analytics dashboard

Generate code and schema with production-ready organization, reusable components, clean data types, Firebase integration layers, and cloud deployment readiness.
