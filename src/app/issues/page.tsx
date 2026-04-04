import { PhotoField } from "@/components/photo-field";
import { StatusBadge } from "@/components/status-badge";
import { issueRecords } from "@/lib/mock-data";

export default function IssuesPage() {
  return (
    <main className="stack">
      <section className="page-header">
        <div>
          <h2 className="section-title">Issues & Inventory</h2>
          <p className="muted">Damage, missing items, empties, and refill-needed reporting with mandatory photos.</p>
        </div>
      </section>

      <section className="form-card">
        <h3>Report New Issue</h3>
        <div className="field-grid">
          <div className="field">
            <label>Title</label>
            <input placeholder="Broken kettle, towel missing, empty dispenser..." />
          </div>
          <div className="field">
            <label>Description</label>
            <textarea placeholder="What happened, what is affected, and what should be checked?" />
          </div>
          <div className="field-grid two">
            <div className="field">
              <label>Location</label>
              <input placeholder="Room 205 / Dining / Pool Washroom" />
            </div>
            <div className="field">
              <label>Category</label>
              <select defaultValue="damage">
                <option value="damage">Damage</option>
                <option value="missing">Missing item</option>
                <option value="empty">Empty item</option>
                <option value="refill">Refill needed</option>
              </select>
            </div>
          </div>
          <PhotoField label="Issue Photo" />
          <button className="primary-button">Submit Issue</button>
        </div>
      </section>

      <section className="section-card">
        <h3 className="section-title">Live Queue</h3>
        <div className="stack">
          {issueRecords.map((issue) => (
            <div className="list-row" key={issue.id}>
              <div>
                <strong>{issue.title}</strong>
                <p className="muted">
                  {issue.location} · {issue.category} · Priority {issue.priority}
                </p>
              </div>
              <StatusBadge tone={issue.status} />
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
