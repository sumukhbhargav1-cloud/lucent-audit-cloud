"use client";

import { FormEvent, useMemo, useState } from "react";
import { SubmissionStatus } from "@/components/submission-status";
import { StatusBadge } from "@/components/status-badge";
import { workerSchedules } from "@/lib/mock-data";

export default function WorkerReportPage() {
  const [workerName, setWorkerName] = useState(workerSchedules[0].workerName);
  const [actionType, setActionType] = useState(workerSchedules[0].type);
  const [scheduledTime, setScheduledTime] = useState(workerSchedules[0].time);
  const [photo, setPhoto] = useState<File | null>(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const workerNames = useMemo(
    () => Array.from(new Set(workerSchedules.map((schedule) => schedule.workerName))),
    [],
  );

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setSuccess("");

    if (!photo) {
      setError("A camera photo is required before submitting the worker log.");
      return;
    }

    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("workerName", workerName);
      formData.append("actionType", actionType);
      formData.append("scheduledTime", scheduledTime);
      formData.append("photo", photo);

      const response = await fetch("/api/submissions/worker-log", {
        method: "POST",
        body: formData,
      });
      const payload = (await response.json()) as {
        ok: boolean;
        error?: string;
        result?: { folderLink?: string };
      };

      if (!payload.ok) {
        throw new Error(payload.error || "Worker log submission failed.");
      }

      setSuccess(`Worker log submitted successfully. Drive folder: ${payload.result?.folderLink || "created"}`);
      setPhoto(null);
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : "Worker log submission failed.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="stack">
      <section className="page-header">
        <div>
          <h2 className="section-title">Worker Report</h2>
          <p className="muted">Submit real worker logs that upload proof to Drive and record rows in Sheets.</p>
        </div>
      </section>

      <section className="section-card">
        <h3 className="section-title">Mandatory Schedule</h3>
        <div className="stack">
          {workerSchedules.map((schedule) => (
            <div className="list-row" key={`${schedule.workerName}-${schedule.time}-${schedule.type}`}>
              <div>
                <strong>
                  {schedule.time} - {schedule.workerName}
                </strong>
                <p className="muted">{schedule.type === "enter" ? "Entry" : "Exit"} proof required</p>
              </div>
              <StatusBadge tone={schedule.status} />
            </div>
          ))}
        </div>
      </section>

      <form className="form-card" onSubmit={handleSubmit}>
        <h3>Submit Worker Proof</h3>
        <div className="field-grid two">
          <div className="field">
            <label>Worker</label>
            <select value={workerName} onChange={(event) => setWorkerName(event.target.value)}>
              {workerNames.map((name) => (
                <option key={name} value={name}>
                  {name}
                </option>
              ))}
            </select>
          </div>
          <div className="field">
            <label>Action</label>
            <select
              value={actionType}
              onChange={(event) => setActionType(event.target.value as "enter" | "exit")}
            >
              <option value="enter">Enter</option>
              <option value="exit">Exit</option>
            </select>
          </div>
        </div>
        <div className="field-grid two">
          <div className="field">
            <label>Scheduled Time</label>
            <select value={scheduledTime} onChange={(event) => setScheduledTime(event.target.value)}>
              {workerSchedules.map((schedule) => (
                <option key={`${schedule.time}-${schedule.workerName}-${schedule.type}`} value={schedule.time}>
                  {schedule.time}
                </option>
              ))}
            </select>
          </div>
          <div className="field">
            <label>Camera Photo</label>
            <input
              type="file"
              accept="image/*"
              capture="environment"
              onChange={(event) => setPhoto(event.target.files?.[0] || null)}
            />
          </div>
        </div>
        <SubmissionStatus error={error} success={success} />
        <button className="primary-button" disabled={loading}>
          {loading ? "Submitting..." : "Submit Worker Log"}
        </button>
      </form>
    </main>
  );
}
