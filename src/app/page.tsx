import { ModuleCard } from "@/components/module-card";
import { StatusBadge } from "@/components/status-badge";
import {
  hotelSummary,
  issueRecords,
  taskDefinitions,
  waterLogs,
  workerSchedules,
} from "@/lib/mock-data";

export default function HomePage() {
  return (
    <main>
      <section className="hero-card">
        <p className="eyebrow">Multi-hotel SaaS ready</p>
        <h2>{hotelSummary.name}</h2>
        <p className="muted">
          Cloud-first staff operations with mandatory camera proof, scheduled alerts,
          room audit compliance, and monthly reporting.
        </p>
        <div className="metrics-grid">
          <div className="metric-card">
            <span className="eyebrow">Completion</span>
            <strong>{hotelSummary.completionRate}</strong>
            <span className="muted">today&apos;s tasks and logs</span>
          </div>
          <div className="metric-card">
            <span className="eyebrow">Workers</span>
            <strong>{hotelSummary.workerCompliance}</strong>
            <span className="muted">attendance proof compliance</span>
          </div>
          <div className="metric-card">
            <span className="eyebrow">Audits</span>
            <strong>{hotelSummary.auditCompliance}</strong>
            <span className="muted">before/after room coverage</span>
          </div>
          <div className="metric-card">
            <span className="eyebrow">Issues</span>
            <strong>{hotelSummary.openIssues}</strong>
            <span className="muted">open operational items</span>
          </div>
        </div>
      </section>

      <section>
        <div className="page-header">
          <div>
            <h2 className="section-title">Core Modules</h2>
            <p className="muted">Designed for large mobile actions and fast staff workflows.</p>
          </div>
        </div>
        <div className="modules-grid">
          <ModuleCard
            href="/worker-report"
            title="Worker Report"
            meta="Timed attendance proof"
            description="Scheduled enter and exit logs with mandatory camera capture, auto timestamping, and missed-state automation."
          />
          <ModuleCard
            href="/room-audit"
            title="Room Audit"
            meta="Before & after room checks"
            description="Structured guest-linked audits for check-in and check-out with towel mismatch detection and required photos."
          />
          <ModuleCard
            href="/work-holds"
            title="Work Holds"
            meta="Dynamic scheduled tasks"
            description="Operational tasks with daily schedules, multi-step evidence, editability, reminders, and compliance tracking."
          />
          <ModuleCard
            href="/issues"
            title="Issues / Inventory"
            meta="Damage, missing, refill"
            description="Photo-backed issue reporting, operational exceptions, and inventory visibility across rooms and shared areas."
          />
        </div>
      </section>

      <section className="section-card">
        <h2 className="section-title">Today&apos;s Live Timeline</h2>
        <div className="stack">
          {workerSchedules.slice(0, 4).map((schedule) => (
            <div className="list-row" key={`${schedule.workerName}-${schedule.time}-${schedule.type}`}>
              <div>
                <strong>{`${schedule.time} - ${schedule.workerName} ${schedule.type}`}</strong>
                <p className="muted">Mandatory photo + auto timestamp + alert workflow</p>
              </div>
              <StatusBadge tone={schedule.status} />
            </div>
          ))}
          {taskDefinitions.slice(0, 2).map((task) => (
            <div className="list-row" key={task.id}>
              <div>
                <strong>{task.name}</strong>
                <p className="muted">{task.schedule}</p>
              </div>
              <StatusBadge tone={task.status} />
            </div>
          ))}
          <div className="list-row">
            <div>
              <strong>Water meter 12:00 PM</strong>
              <p className="muted">Bi-hourly reading with camera proof and sheet sync</p>
            </div>
            <StatusBadge tone={waterLogs[2].status} />
          </div>
        </div>
      </section>

      <section className="section-card">
        <h2 className="section-title">Ops Snapshot</h2>
        <div className="stack">
          <div className="list-row">
            <div>
              <strong>Flagged issue queue</strong>
              <p className="muted">{issueRecords[0].title}</p>
            </div>
            <StatusBadge tone="flagged" label="urgent" />
          </div>
          <div className="list-row">
            <div>
              <strong>Monthly reports</strong>
              <p className="muted">
                PDF + Excel generation prepared for scheduled Sunday and month-end automation.
              </p>
            </div>
            <StatusBadge tone="active" label="scheduled" />
          </div>
        </div>
      </section>
    </main>
  );
}
