# Database Schema

Database: Firestore
Tenancy model: shared database, logical isolation by `hotelId`

## Design rules

- Every business document includes `hotelId`
- Every mutable document includes `createdAt`, `updatedAt`, `createdBy`, `updatedBy`
- Important workflow entities also include `status`
- Images are not stored as raw binary in Firestore; store metadata and Google Drive references
- Use append-only audit logs for sensitive admin changes

## Collections

### `hotels`
- `id`
- `name`
- `code`
- `branding`: `{ logoUrl, primaryColor, supportPhone }`
- `timezone`
- `currency`
- `address`
- `status`: `active | paused | archived`
- `subscriptionPlan`: `trial | basic | growth | enterprise`
- `subscriptionStatus`: `active | past_due | canceled`
- `settings`: `{ workerLogGraceMinutes, waterLogIntervalHours, defaultReportDay, enableLocationCapture }`
- `createdAt`
- `updatedAt`

Indexes:
- `code` unique
- `status`

### `users`
- `id`
- `authUid`
- `fullName`
- `email`
- `phone`
- `avatarUrl`
- `status`: `active | invited | disabled`
- `lastLoginAt`
- `createdAt`
- `updatedAt`

Indexes:
- `authUid` unique
- `email`

### `hotelMemberships`
- `id`
- `hotelId`
- `userId`
- `role`: `superAdmin | hotelAdmin | manager | staff | auditor`
- `permissions`: string[]
- `employeeCode`
- `jobTitle`
- `isPrimary`
- `status`: `active | inactive`
- `createdAt`
- `updatedAt`

Indexes:
- `(hotelId, userId)` unique
- `(hotelId, role)`

### `workerSchedules`
- `id`
- `hotelId`
- `workerUserId` nullable
- `workerName`
- `actionType`: `enter | exit`
- `scheduledTimeLocal`: `HH:mm`
- `daysOfWeek`: number[]
- `graceMinutes`
- `notificationOffsetsMinutes`: number[]
- `requiresPhoto`: true
- `requiresTimestamp`: true
- `active`
- `createdAt`
- `updatedAt`

Indexes:
- `(hotelId, active)`
- `(hotelId, workerName)`

### `workerLogs`
- `id`
- `hotelId`
- `scheduleId`
- `workerUserId` nullable
- `workerName`
- `actionType`: `enter | exit`
- `scheduledFor`
- `dueWindowStart`
- `dueWindowEnd`
- `submittedAt` nullable
- `status`: `pending | completed | missed | holiday | approved_exception`
- `submission`: `{ photoCount, mediaIds, note, deviceInfo, geo? }`
- `timestamps`: `{ autoCapturedAt, clientCapturedAt }`
- `notificationState`: `{ sentAt, reminderSentAt, escalatedAt }`
- `createdAt`
- `updatedAt`
- `createdBy`
- `updatedBy`

Indexes:
- `(hotelId, scheduledFor, status)`
- `(hotelId, workerName, scheduledFor)`
- `(hotelId, workerUserId, scheduledFor)`

### `roomStays`
- `id`
- `hotelId`
- `roomNumber`
- `guestName`
- `checkInDate`
- `expectedCheckOutDate`
- `actualCheckOutDate` nullable
- `status`: `reserved | checked_in | checked_out | canceled`
- `sourceAuditId` nullable
- `createdAt`
- `updatedAt`
- `createdBy`
- `updatedBy`

Indexes:
- `(hotelId, roomNumber, status)`
- `(hotelId, guestName, checkInDate)`

### `auditTemplates`
- `id`
- `hotelId`
- `module`: `roomAudit`
- `mode`: `before_check_in | after_check_out`
- `name`
- `version`
- `active`
- `items`: array of checklist item definitions
  - `key`
  - `label`
  - `type`: `photo | photo_multi | enum | number | text`
  - `required`
  - `options`
  - `validation`
  - `sortOrder`
- `createdAt`
- `updatedAt`

Indexes:
- `(hotelId, module, mode, active)`

### `roomAudits`
- `id`
- `hotelId`
- `roomStayId` nullable
- `mode`: `before_check_in | after_check_out`
- `roomNumber`
- `guestName`
- `checkInDate` nullable
- `expectedCheckOutDate` nullable
- `auditTemplateId`
- `status`: `draft | submitted | flagged | reviewed`
- `responses`
- `comparison` nullable:
  - `previousAuditId`
  - `towelCountBefore`
  - `towelCountAfter`
  - `towelMismatch`
  - `changedFields`
- `driveFolder`: `{ id, name, url }`
- `sheetSync`: `{ rowId, syncedAt, status }`
- `submittedAt`
- `createdAt`
- `updatedAt`
- `createdBy`
- `updatedBy`

Indexes:
- `(hotelId, roomNumber, submittedAt)`
- `(hotelId, guestName, submittedAt)`
- `(hotelId, mode, status)`

### `tasks`
- `id`
- `hotelId`
- `name`
- `slug`
- `description`
- `category`
- `location`
- `taskType`: `single_step | multi_step`
- `requiresPhoto`: true
- `active`
- `defaultAssigneeUserIds`: string[]
- `stepDefinitions`
  - `stepKey`
  - `label`
  - `requiredPhotoCount`
  - `instructions`
  - `sortOrder`
- `createdAt`
- `updatedAt`
- `createdBy`
- `updatedBy`

Indexes:
- `(hotelId, active)`
- `(hotelId, category, active)`

### `taskSchedules`
- `id`
- `hotelId`
- `taskId`
- `scheduleType`: `daily | weekly | custom`
- `daysOfWeek`
- `timeLocal`
- `endTimeLocal` nullable
- `specialRules`: `{ postCleaningOnly, reminderOffsetsMinutes }`
- `active`
- `createdAt`
- `updatedAt`

Indexes:
- `(hotelId, taskId, active)`
- `(hotelId, active, timeLocal)`

### `taskRuns`
- `id`
- `hotelId`
- `taskId`
- `taskScheduleId`
- `nameSnapshot`
- `location`
- `assignedUserIds`
- `scheduledFor`
- `windowStart`
- `windowEnd`
- `status`: `pending | in_progress | completed | missed | canceled | flagged`
- `startedAt` nullable
- `completedAt` nullable
- `photoRequirementSummary`
- `driveFolder`: `{ id, name, url }`
- `sheetSync`: `{ rowId, syncedAt, status }`
- `createdAt`
- `updatedAt`
- `createdBy`
- `updatedBy`

Indexes:
- `(hotelId, scheduledFor, status)`
- `(hotelId, taskId, scheduledFor)`

### `taskRunSteps`
- `id`
- `hotelId`
- `taskRunId`
- `stepKey`
- `label`
- `requiredPhotoCount`
- `submittedPhotoCount`
- `mediaIds`
- `notes`
- `status`: `pending | completed`
- `completedAt` nullable
- `createdAt`
- `updatedAt`

Indexes:
- `(hotelId, taskRunId, stepKey)` unique

### `issues`
- `id`
- `hotelId`
- `sourceType`: `manual | room_audit | task_run | water_log`
- `sourceId` nullable
- `title`
- `description`
- `location`
- `roomNumber` nullable
- `category`
- `priority`: `low | medium | high | critical`
- `status`: `open | assigned | in_progress | resolved | closed`
- `assigneeUserId` nullable
- `mediaIds`
- `driveFolder`: `{ id, name, url }`
- `submittedAt`
- `resolvedAt` nullable
- `createdAt`
- `updatedAt`
- `createdBy`
- `updatedBy`

Indexes:
- `(hotelId, status, priority)`
- `(hotelId, location, status)`

### `inventoryItems`
- `id`
- `hotelId`
- `name`
- `category`
- `location`
- `status`: `ok | missing | empty | refill_needed`
- `quantity` nullable
- `threshold` nullable
- `notes`
- `lastObservedAt`
- `lastObservedBy`
- `relatedIssueId` nullable
- `createdAt`
- `updatedAt`

Indexes:
- `(hotelId, status)`
- `(hotelId, location, status)`

### `waterLogs`
- `id`
- `hotelId`
- `meterLabel`
- `location`
- `scheduledFor`
- `readingValue` nullable
- `unit`: `liters | kiloliters | cubic_meters`
- `status`: `pending | completed | missed`
- `mediaIds`
- `driveFolder`: `{ id, name, url }`
- `sheetSync`: `{ rowId, syncedAt, status }`
- `submittedAt` nullable
- `createdAt`
- `updatedAt`
- `createdBy`
- `updatedBy`

Indexes:
- `(hotelId, scheduledFor, status)`
- `(hotelId, meterLabel, scheduledFor)`

### `mediaAssets`
- `id`
- `hotelId`
- `ownerType`
- `ownerId`
- `captureType`: `camera`
- `mimeType`
- `fileName`
- `fileSize`
- `width`
- `height`
- `driveFileId`
- `driveFolderId`
- `driveUrl`
- `capturedAt`
- `uploadedAt`
- `checksum`
- `createdAt`
- `createdBy`

Indexes:
- `(hotelId, ownerType, ownerId)`
- `(hotelId, driveFolderId)`

### `notifications`
- `id`
- `hotelId`
- `type`: `worker_log_due | task_due | water_due | reminder | escalation`
- `targetType`
- `targetId`
- `recipientUserId`
- `channel`: `push | in_app`
- `scheduledFor`
- `sentAt` nullable
- `status`: `queued | sent | failed | canceled`
- `payload`
- `createdAt`
- `updatedAt`

Indexes:
- `(hotelId, recipientUserId, status)`
- `(hotelId, scheduledFor, status)`

### `reports`
- `id`
- `hotelId`
- `reportType`: `weekly_ops | monthly_pdf | monthly_excel`
- `periodStart`
- `periodEnd`
- `status`: `queued | processing | ready | failed`
- `fileUrl`
- `driveFolderId` nullable
- `generatedAt` nullable
- `createdAt`
- `updatedAt`

Indexes:
- `(hotelId, reportType, periodStart)`

### `auditLogs`
- `id`
- `hotelId`
- `actorUserId`
- `action`
- `targetType`
- `targetId`
- `diffSummary`
- `metadata`
- `createdAt`

Indexes:
- `(hotelId, targetType, targetId, createdAt)`
- `(hotelId, actorUserId, createdAt)`

## Firestore security model

- Users can read/write only documents for hotels where they have an active membership
- Staff can create operational records assigned to them or allowed by workflow
- Only admins and managers can change schedules, templates, and role assignments
- Only backend service paths can write Google sync metadata, reports, and system-generated missed states

## Example document naming conventions

- `workerLogs/{hotelId}_{scheduleId}_{YYYYMMDDHHmm}`
- `taskRuns/{hotelId}_{taskId}_{YYYYMMDDHHmm}`
- `waterLogs/{hotelId}_{meterLabel}_{YYYYMMDDHHmm}`

This helps idempotent schedule generation.
