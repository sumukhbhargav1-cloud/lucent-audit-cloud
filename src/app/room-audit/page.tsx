import Link from "next/link";
import { currentStay } from "@/lib/mock-data";

export default function RoomAuditPage() {
  return (
    <main className="stack">
      <section className="page-header">
        <div>
          <h2 className="section-title">Room Audit</h2>
          <p className="muted">Two audit modes with required photos and structured comparison reports.</p>
        </div>
      </section>

      <section className="modules-grid">
        <Link href="/room-audit/before-check-in" className="module-card">
          <div>
            <p className="eyebrow">Mode 1</p>
            <h3>Before Check-In</h3>
            <p>Guest name, dates, room number, full photo checklist, towel count, and bed condition.</p>
          </div>
          <span className="module-card-arrow">Start</span>
        </Link>
        <Link href="/room-audit/after-check-out" className="module-card">
          <div>
            <p className="eyebrow">Mode 2</p>
            <h3>After Check-Out</h3>
            <p>Fetch previous audit, compare towels, re-run photo evidence, and auto-flag mismatches.</p>
          </div>
          <span className="module-card-arrow">Review</span>
        </Link>
      </section>

      <section className="section-card">
        <h3 className="section-title">Latest Stay Context</h3>
        <div className="list-row">
          <div>
            <strong>
              Room {currentStay.roomNumber} · {currentStay.guestName}
            </strong>
            <p className="muted">
              Check-in {currentStay.checkInDate} · Expected checkout {currentStay.expectedCheckOutDate}
            </p>
          </div>
          <span className="badge badge-active">linked stay</span>
        </div>
      </section>
    </main>
  );
}
