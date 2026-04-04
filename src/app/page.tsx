import { ModuleCard } from "@/components/module-card";
import { hotelSummary } from "@/lib/mock-data";

export default function HomePage() {
  return (
    <main className="stack">
      <section className="page-header">
        <div>
          <h2 className="section-title">Quick Actions</h2>
          <p className="muted">{hotelSummary.name}</p>
        </div>
      </section>

      <div className="modules-grid">
        <ModuleCard
          href="/worker-report"
          title="Worker Report"
          meta="Attendance"
          description="Staff attendance and time logs"
        />
        <ModuleCard
          href="/room-audit"
          title="Room Audit"
          meta="Inspection"
          description="Check-in and check-out inspections"
        />
        <ModuleCard
          href="/work-holds"
          title="Work Holds"
          meta="Tasks"
          description="Scheduled tasks and proofs"
        />
        <ModuleCard
          href="/issues"
          title="Issues & Inventory"
          meta="Problems"
          description="Report damage and track items"
        />
        <ModuleCard
          href="/water-meter"
          title="Water Meter"
          meta="Readings"
          description="Bi-hourly meter readings"
        />
        <ModuleCard
          href="/admin"
          title="Admin Dashboard"
          meta="Admin"
          description="Analytics and compliance overview"
        />
      </div>
    </main>
  );
}
