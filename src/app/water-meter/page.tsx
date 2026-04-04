"use client";

import { FormEvent, useState } from "react";
import { SubmissionStatus } from "@/components/submission-status";
import { StatusBadge } from "@/components/status-badge";
import { waterLogs } from "@/lib/mock-data";

export default function WaterMeterPage() {
  const [slot, setSlot] = useState("12:00 PM");
  const [reading, setReading] = useState("");
  const [photo, setPhoto] = useState<File | null>(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setSuccess("");

    if (!photo) {
      setError("A water meter photo is required.");
      return;
    }

    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("slot", slot);
      formData.append("reading", reading);
      formData.append("photo", photo);

      const response = await fetch("/api/submissions/water-log", {
        method: "POST",
        body: formData,
      });
      const payload = (await response.json()) as {
        ok: boolean;
        error?: string;
        result?: { folderLink?: string };
      };

      if (!payload.ok) {
        throw new Error(payload.error || "Water log submission failed.");
      }

      setSuccess(`Water log submitted. Drive folder: ${payload.result?.folderLink || "created"}`);
      setReading("");
      setPhoto(null);
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : "Water log submission failed.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="stack">
      <section className="page-header">
        <div>
          <h2 className="section-title">Water Meter</h2>
          <p className="muted">Bi-hourly meter readings now write directly to Drive and Sheets.</p>
        </div>
      </section>

      <form className="form-card" onSubmit={handleSubmit}>
        <h3>Submit Reading</h3>
        <div className="field-grid two">
          <div className="field">
            <label>Scheduled Slot</label>
            <input value={slot} onChange={(event) => setSlot(event.target.value)} />
          </div>
          <div className="field">
            <label>Reading Value</label>
            <input value={reading} onChange={(event) => setReading(event.target.value)} required />
          </div>
        </div>
        <div className="field">
          <label>Meter Photo</label>
          <input
            type="file"
            accept="image/*"
            capture="environment"
            onChange={(event) => setPhoto(event.target.files?.[0] || null)}
            required
          />
        </div>
        <SubmissionStatus error={error} success={success} />
        <button className="primary-button" disabled={loading}>
          {loading ? "Submitting..." : "Submit Water Log"}
        </button>
      </form>

      <section className="section-card">
        <h3 className="section-title">Today&apos;s Slots</h3>
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
