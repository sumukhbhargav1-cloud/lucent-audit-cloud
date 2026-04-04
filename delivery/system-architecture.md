# System Architecture

## High-level architecture

```text
Mobile Browser
  -> Next.js Frontend on Antigravity
  -> Authenticated API routes / server actions
  -> Firestore for operational data
  -> Cloud Functions for background jobs
  -> Firebase Cloud Messaging for alerts
  -> Google Drive for photo folders/files
  -> Google Sheets for reporting rows
  -> PDF/Excel report generator for monthly exports
```

## Key architectural decisions

### 1. Shared-database multi-tenancy

Use one Firestore project with strict `hotelId` partitioning and role enforcement. This reduces operational overhead at early SaaS stage while still allowing clean tenant reporting and later sharding if required.

### 2. Schedule materialization pattern

Do not query recurring schedules directly in the UI for due work. Materialize them into concrete daily records:
- worker schedule -> worker log
- task schedule -> task run
- water schedule -> water log

This makes missed detection, notifications, analytics, and reporting much simpler and more reliable.

### 3. Evidence-first workflow

Every operational workflow is completed only when required media exists. The business record is not considered valid based on form fields alone.

### 4. Async Google sync

UI submission should be fast. Persist the operational record first, then orchestrate Drive and Sheets sync through backend jobs with retry states. The UI can show `syncing` vs `synced` indicators.

### 5. Configurable templates

Room audit items and work-hold tasks should be driven by admin-editable templates rather than hardcoded forms. Seed defaults from current hotel process, but support future changes per hotel.

## Suggested domain workflows

### Worker log flow

1. Daily generator creates due worker log records.
2. Staff receives push reminder.
3. Staff opens due log and captures live photo.
4. Submission writes Firestore record and media metadata.
5. Background sync uploads to Drive and appends Sheets row.
6. Overdue unreconciled records become `missed`.
7. Admin may convert `missed` to `holiday` or `approved_exception`.

### Room audit flow

1. Staff chooses before-check-in or after-check-out.
2. Form loads active hotel template.
3. Required items and photos are validated on device and server.
4. For after-check-out, previous audit is loaded and compared.
5. Flags or linked issues are created where mismatch rules fire.
6. Structured report is stored and exportable.

### Task flow

1. Admin configures task definition and schedule.
2. Generator creates task run instances.
3. Assigned staff receives due notification.
4. Staff completes one-step or multi-step photo proof.
5. Run is marked complete only when all required steps are satisfied.

## Scalability considerations

- Store denormalized snapshots for analytics-heavy screens
- Use batched writes where appropriate
- Add BigQuery export later if analytics becomes heavier
- Keep tenant config isolated in hotel-scoped settings documents
- Use plan-based feature flags for subscription tiers

## Risks and mitigations

- Mobile browser camera limitations vary by device:
  - Mitigation: use direct camera capture patterns, tested progressive enhancement, and server enforcement of required media.
- Google API failures can block downstream reporting:
  - Mitigation: async retries, sync status fields, admin reconciliation queue.
- Firestore query/index growth:
  - Mitigation: materialized daily records, deliberate composite index design, archive old reports periodically.
