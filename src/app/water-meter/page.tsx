import { PhotoField } from "@/components/photo-field";
import { StatusBadge } from "@/components/status-badge";
import { waterLogs } from "@/lib/mock-data";

export default function WaterMeterPage() {
  return (
    <main className="stack">
      <section className="page-header">
        <div>
          <h2 className="section-title">Water Meter</h2>
          <p className="muted">Bi-hourly mandatory readings with camera evidence, timestamps, and compliance reporting.</p>
        </div>
      </section>

      <section className="form-card">
        <h3>Submit Reading</h3>
        <div className="field-grid two">
          <div className="field">
            <label>Scheduled slot</label>
            <input value="12:00 PM" readOnly />
          </div>
          <div className="field">
            <label>Timestamp</label>
            <input value="2026-04-04 12:00:00 IST" readOnly />
          </div>
        </div>
        <div className="field">
          <label>Meter reading</label>
          <input placeholder="Enter the current reading" />
        </div>
        <PhotoField label="Meter Photo" />
        <button className="primary-button">Submit Water Log</button>
      </section>

      <section className="section-card">
        <h3 className="section-title">Today&apos;s Schedule</h3>
        <div className="stack">
          {waterLogs.map((log) => (
            <div className="list-row" key={log.slot}>
              <div>
                <strong>{log.slot}</strong>
                <p className="muted">{log.reading}</p>
              </div>
              <StatusBadge tone={log.status} />
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
