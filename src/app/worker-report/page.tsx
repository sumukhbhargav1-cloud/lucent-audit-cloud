import { StatusBadge } from "@/components/status-badge";
import { workerSchedules } from "@/lib/mock-data";

export default function WorkerReportPage() {
  return (
    <main className="stack">
      <section className="page-header">
        <div>
          <h2 className="section-title">Worker Report</h2>
          <p className="muted">Required enter and exit logs with photo proof and auto timestamp capture.</p>
        </div>
      </section>

      <section className="section-card">
        <h3 className="section-title">Mandatory Schedule</h3>
        <div className="stack">
          {workerSchedules.map((schedule) => (
            <div className="list-row" key={`${schedule.workerName}-${schedule.time}-${schedule.type}`}>
              <div>
                <strong>
                  {schedule.time} · {schedule.workerName}
                </strong>
                <p className="muted">
                  {schedule.type === "enter" ? "Entry" : "Exit"} with push reminder,
                  in-app alert, and missed-to-holiday admin override support.
                </p>
              </div>
              <StatusBadge tone={schedule.status} />
            </div>
          ))}
        </div>
      </section>

      <section className="form-card">
        <h3>Proof Capture</h3>
        <div className="field-grid two">
          <div className="field">
            <label>Worker</label>
            <select defaultValue="Rangana">
              <option>Rangana</option>
              <option>Praveen</option>
              <option>Preetham</option>
              <option>Yashoda</option>
            </select>
          </div>
          <div className="field">
            <label>Action</label>
            <select defaultValue="enter">
              <option value="enter">Enter</option>
              <option value="exit">Exit</option>
            </select>
          </div>
        </div>
        <div className="field-grid two">
          <div className="field">
            <label>Auto timestamp</label>
            <input value="2026-04-04 08:31:00 IST" readOnly />
          </div>
          <div className="field">
            <label>Submission state</label>
            <input value="Pending mandatory photo" readOnly />
          </div>
        </div>
        <div className="highlight-box">
          Camera-only uploads are enforced in the client with `capture=&quot;environment&quot;`
          and must also be validated in backend submission handlers before completion.
        </div>
        <button className="primary-button">Open Worker Capture Flow</button>
      </section>
    </main>
  );
}
