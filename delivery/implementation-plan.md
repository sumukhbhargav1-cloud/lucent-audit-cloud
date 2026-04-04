# Step-by-Step Implementation Plan

## Phase 1: Foundation

1. Initialize Next.js App Router project with TypeScript, ESLint, Prettier, and a component library suitable for mobile-first design.
2. Configure Firebase project for Auth, Firestore, Cloud Functions, and Cloud Messaging.
3. Create environment configuration strategy for Antigravity staging and production.
4. Implement authentication flow, hotel selection context, role model, and protected routes.
5. Add Firestore security rules and backend permission helpers based on `hotelId` and membership role.

## Phase 2: Shared platform systems

1. Build core domain types and repository/service layers for Firestore.
2. Create reusable mobile form engine for required fields, photo capture fields, enums, numeric inputs, and validation state.
3. Build media intake pipeline for camera capture, temporary upload, validation, and Drive sync orchestration.
4. Implement notification registration and in-app alert center.
5. Implement audit log framework for admin changes and critical operations.

## Phase 3: Worker Report module

1. Model recurring worker schedules for the named staff entries.
2. Build scheduled function to generate daily worker log events.
3. Build worker log list, capture screen, submit API, and missed-status reconciliation.
4. Add admin override for Holiday and Approved Exception.
5. Add reminder notifications and escalation for missed events.

## Phase 4: Room Audit module

1. Create room stay and audit template models.
2. Build Before Check-In draft and submit flow.
3. Build After Check-Out search and previous-audit fetch flow.
4. Implement comparison logic for towel mismatch and field changes.
5. Auto-create linked issue when mismatch or configured condition triggers.
6. Generate structured audit report view and export hooks.

## Phase 5: Work Holds module

1. Seed predefined task definitions and schedules.
2. Build admin CRUD for task definitions, steps, and schedule editing.
3. Implement scheduled generation of task runs from definitions.
4. Build single-step and multi-step task completion flows with mandatory photo validation.
5. Add due reminders, missed logic, and completion analytics.

## Phase 6: Issues / Inventory module

1. Build issue reporting screen with mandatory photo capture.
2. Build issue assignment, status workflow, and resolution tracking.
3. Build inventory exception list with statuses Missing, Empty, Refill Needed.
4. Link issue creation from audit mismatches and task failures.

## Phase 7: Water Meter module

1. Model 2-hour recurring schedule generation.
2. Build water log capture flow with reading input and mandatory photo.
3. Add missed interval detection and compliance dashboard widgets.
4. Add consumption summaries for daily and monthly views.

## Phase 8: Google integrations

1. Add Google Drive folder creation service with deterministic naming.
2. Upload all captured images to the relevant folder and save metadata.
3. Add Google Sheets append service using standardized row shape.
4. Add retry and reconciliation jobs for failed syncs.
5. Prepare credential injection flow so later uploaded JSON credentials can be connected without refactoring.

## Phase 9: Reporting and analytics

1. Build dashboard summary queries for daily operations.
2. Build staff performance, task completion, audit compliance, and issue aging analytics.
3. Implement monthly PDF report generation.
4. Implement monthly Excel report generation.
5. Implement weekly Sunday organization job.

## Phase 10: Hardening for SaaS

1. Add hotel provisioning flow and tenant bootstrap templates.
2. Add subscription-plan placeholders and entitlement checks.
3. Add observability: request logs, function logs, error alerts, sync failure alerts.
4. Add rate limiting, idempotency keys, and duplicate-submission protection.
5. Validate mobile performance, offline behavior, and push notification reliability.

## Acceptance checklist

- Staff can complete all required modules on mobile
- Required photo rules block incomplete submissions
- Admin can manage tasks, schedules, templates, and issues
- Scheduled reminders and missed-state automation work
- Google Drive folders and Google Sheets rows are created
- Monthly PDF and Excel exports are downloadable
- All records are scoped by `hotelId`
- SaaS analytics and multi-hotel separation are functional
