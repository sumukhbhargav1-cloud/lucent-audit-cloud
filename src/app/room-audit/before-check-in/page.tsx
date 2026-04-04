import { PhotoField } from "@/components/photo-field";

const bedConditions = ["Ok", "Good", "Bad", "Needs Enquiry"];

export default function BeforeCheckInPage() {
  return (
    <main className="stack">
      <section className="page-header">
        <div>
          <h2 className="section-title">Before Check-In</h2>
          <p className="muted">All fields and all evidence must be complete before submit becomes valid.</p>
        </div>
      </section>

      <section className="form-card">
        <h3>Guest & Stay</h3>
        <div className="field-grid">
          <div className="field">
            <label>Guest Name</label>
            <input placeholder="Guest full name" defaultValue="Aarav Sharma" />
          </div>
          <div className="field-grid two">
            <div className="field">
              <label>Check-in Date</label>
              <input type="date" defaultValue="2026-04-04" />
            </div>
            <div className="field">
              <label>Expected Check-out</label>
              <input type="date" defaultValue="2026-04-06" />
            </div>
          </div>
          <div className="field">
            <label>Room Number</label>
            <input placeholder="205" defaultValue="205" />
          </div>
        </div>
      </section>

      <section className="form-card">
        <h3>Audit Checklist</h3>
        <div className="pill-group">
          {bedConditions.map((condition, index) => (
            <span key={condition} className={index === 1 ? "pill-option active" : "pill-option"}>
              {condition}
            </span>
          ))}
        </div>
        <div className="field-grid two">
          <div className="field">
            <label>Towel Count</label>
            <input type="number" min="0" defaultValue="2" />
          </div>
          <div className="field">
            <label>Validation</label>
            <input value="Submit blocked until every proof exists" readOnly />
          </div>
        </div>
        <div className="check-grid">
          <PhotoField label="AC Remote" />
          <PhotoField label="TV Remote" />
          <PhotoField label="Set-top Box" />
          <PhotoField label="Towel Count Photo" />
          <PhotoField label="Bathroom Photos" hint="Capture bathroom evidence set" />
          <PhotoField label="Kettle & Tray" />
          <PhotoField label="Menu Cards" />
        </div>
        <button className="primary-button">Submit Before Check-In Audit</button>
      </section>
    </main>
  );
}
