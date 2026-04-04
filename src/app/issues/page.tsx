"use client";

import { FormEvent, useState } from "react";
import { SubmissionStatus } from "@/components/submission-status";
import { StatusBadge } from "@/components/status-badge";
import { issueRecords } from "@/lib/mock-data";

export default function IssuesPage() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");
  const [category, setCategory] = useState("damage");
  const [priority, setPriority] = useState("medium");
  const [photo, setPhoto] = useState<File | null>(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setSuccess("");

    if (!photo) {
      setError("A photo is required for every issue submission.");
      return;
    }

    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("title", title);
      formData.append("description", description);
      formData.append("location", location);
      formData.append("category", category);
      formData.append("priority", priority);
      formData.append("photo", photo);

      const response = await fetch("/api/submissions/issue", {
        method: "POST",
        body: formData,
      });
      const payload = (await response.json()) as {
        ok: boolean;
        error?: string;
        result?: { folderLink?: string };
      };

      if (!payload.ok) {
        throw new Error(payload.error || "Issue submission failed.");
      }

      setSuccess(`Issue submitted. Drive folder: ${payload.result?.folderLink || "created"}`);
      setTitle("");
      setDescription("");
      setLocation("");
      setPhoto(null);
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : "Issue submission failed.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="stack">
      <section className="page-header">
        <div>
          <h2 className="section-title">Issues & Inventory</h2>
          <p className="muted">Report real issues with Drive photo uploads and Sheet-based logging.</p>
        </div>
      </section>

      <form className="form-card" onSubmit={handleSubmit}>
        <h3>Report Issue</h3>
        <div className="field">
          <label>Title</label>
          <input value={title} onChange={(event) => setTitle(event.target.value)} required />
        </div>
        <div className="field">
          <label>Description</label>
          <textarea value={description} onChange={(event) => setDescription(event.target.value)} />
        </div>
        <div className="field-grid two">
          <div className="field">
            <label>Location</label>
            <input value={location} onChange={(event) => setLocation(event.target.value)} required />
          </div>
          <div className="field">
            <label>Category</label>
            <select value={category} onChange={(event) => setCategory(event.target.value)}>
              <option value="damage">Damage</option>
              <option value="missing">Missing item</option>
              <option value="empty">Empty item</option>
              <option value="refill">Refill needed</option>
            </select>
          </div>
        </div>
        <div className="field-grid two">
          <div className="field">
            <label>Priority</label>
            <select value={priority} onChange={(event) => setPriority(event.target.value)}>
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
              <option value="critical">Critical</option>
            </select>
          </div>
          <div className="field">
            <label>Issue Photo</label>
            <input
              type="file"
              accept="image/*"
              capture="environment"
              onChange={(event) => setPhoto(event.target.files?.[0] || null)}
              required
            />
          </div>
        </div>
        <SubmissionStatus error={error} success={success} />
        <button className="primary-button" disabled={loading}>
          {loading ? "Submitting..." : "Submit Issue"}
        </button>
      </form>

      <section className="section-card">
        <h3 className="section-title">Reference Queue</h3>
        <div className="stack">
          {issueRecords.map((issue) => (
            <div className="list-row" key={issue.id}>
              <div>
                <strong>{issue.title}</strong>
                <p className="muted">
                  {issue.location} · {issue.category} · {issue.priority}
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
