import { StatusBadge } from "@/components/status-badge";
import { taskDefinitions } from "@/lib/mock-data";

export default function WorkHoldsPage() {
  return (
    <main className="stack">
      <section className="page-header">
        <div>
          <h2 className="section-title">Work Holds</h2>
          <p className="muted">Scheduled task engine with dynamic task CRUD, reminders, and step-photo enforcement.</p>
        </div>
      </section>

      <section className="section-card">
        <div className="button-row">
          <button className="primary-button">Add Task</button>
          <button className="secondary-button">Edit Schedule</button>
          <button className="ghost-button">Remove Task</button>
        </div>
      </section>

      <section className="stack">
        {taskDefinitions.map((task) => (
          <article className="form-card" key={task.id}>
            <div className="list-row">
              <div>
                <strong>{task.name}</strong>
                <p className="muted">
                  {task.location} · {task.schedule}
                </p>
              </div>
              <StatusBadge tone={task.status} />
            </div>
            <div className="field-grid two">
              <div className="field">
                <label>Step count</label>
                <input value={`${task.stepCount} required photo step(s)`} readOnly />
              </div>
              <div className="field">
                <label>Reminder mode</label>
                <input value="Push + in-app + missed escalation" readOnly />
              </div>
            </div>
            <div className="highlight-box">
              Tasks are designed as template definitions plus generated task runs. That lets admins
              edit future schedules without corrupting completed historical records.
            </div>
          </article>
        ))}
      </section>
    </main>
  );
}
