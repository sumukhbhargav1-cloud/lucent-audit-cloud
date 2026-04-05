import { ReportDownloads } from "@/components/report-downloads";
import { monthlyReportChecklist, taskDefinitions } from "@/lib/mock-data";

export default function AdminPage() {
  return (
    <main className="stack">
      <section className="page-header">
        <div>
          <h2 className="section-title">Admin Console</h2>
          <p className="muted">Tenant controls, templates, schedules, reporting, and SaaS-ready configuration.</p>
        </div>
      </section>

      <section className="modules-grid">
        <div className="section-card">
          <p className="eyebrow">Tenancy</p>
          <h3>Hotel & Role Model</h3>
          <p className="muted">`hotelId`-scoped data, membership roles, audit logs, and future subscription entitlements.</p>
        </div>
        <div className="section-card">
          <p className="eyebrow">Automation</p>
          <h3>Scheduler Jobs</h3>
          <p className="muted">Worker logs, task runs, water logs, reminders, missed-state marking, and monthly reports.</p>
        </div>
      </section>

      <section className="form-card">
        <h3>Task Schedule Definitions</h3>
        <div className="stack">
          {taskDefinitions.map((task) => (
            <div className="list-row" key={task.id}>
              <div>
                <strong>{task.name}</strong>
                <p className="muted">{task.schedule}</p>
              </div>
              <button className="ghost-button">Edit</button>
            </div>
          ))}
        </div>
      </section>

      <section className="form-card">
        <h3>Monthly Reporting Pipeline</h3>
        <div className="stack">
          {monthlyReportChecklist.map((item) => (
            <div className="list-row" key={item}>
              <div>
                <strong>{item}</strong>
                <p className="muted">Prepared as a background job with retry-safe cloud execution.</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <ReportDownloads />
    </main>
  );
}
