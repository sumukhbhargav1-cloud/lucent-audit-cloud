import { PhotoField } from "@/components/photo-field";
import { currentStay } from "@/lib/mock-data";

export default function AfterCheckOutPage() {
  return (
    <main className="stack">
      <section className="page-header">
        <div>
          <h2 className="section-title">After Check-Out</h2>
          <p className="muted">Search guest record, load previous audit, compare results, and flag mismatches.</p>
        </div>
      </section>

      <section className="form-card">
        <h3>Previous Audit Match</h3>
        <div className="field-grid two">
          <div className="field">
            <label>Guest Name</label>
            <input defaultValue={currentStay.guestName} />
          </div>
          <div className="field">
            <label>Room Number</label>
            <input defaultValue={currentStay.roomNumber} />
          </div>
        </div>
        <div className="highlight-box">
          Matched previous audit: Room {currentStay.roomNumber}, towel count before checkout was{" "}
          {currentStay.towelCount}, and bed condition was {currentStay.bedCondition}.
        </div>
      </section>

      <section className="form-card">
        <h3>Comparison Audit</h3>
        <div className="field-grid two">
          <div className="field">
            <label>Current Towel Count</label>
            <input type="number" defaultValue="1" />
          </div>
          <div className="field">
            <label>System Decision</label>
            <input value="Mismatch detected: auto-create linked issue" readOnly />
          </div>
        </div>
        <div className="warning-box">
          Towel mismatch flagged. Production submission should create a linked issue and mark the
          audit report as flagged until reviewed.
        </div>
        <div className="check-grid">
          <PhotoField label="Bathroom Photos" />
          <PhotoField label="AC Remote" />
          <PhotoField label="TV Remote" />
          <PhotoField label="Set-top Box" />
          <PhotoField label="Kettle & Tray" />
          <PhotoField label="Menu Cards" />
          <PhotoField label="Towel Count Photo" />
        </div>
        <button className="primary-button">Submit After Check-Out Audit</button>
      </section>
    </main>
  );
}
