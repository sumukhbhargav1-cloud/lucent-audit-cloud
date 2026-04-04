"use client";

import { FormEvent, useMemo, useState } from "react";
import { SubmissionStatus } from "@/components/submission-status";
import { StatusBadge } from "@/components/status-badge";
import { taskDefinitions } from "@/lib/mock-data";

export default function WorkHoldsPage() {
  const [taskId, setTaskId] = useState(taskDefinitions[0].id);
  const [stepPhotos, setStepPhotos] = useState<(File | null)[]>([]);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const activeTask = useMemo(
    () => taskDefinitions.find((task) => task.id === taskId) || taskDefinitions[0],
    [taskId],
  );

  const photoSlots = useMemo(
    () => Array.from({ length: activeTask.stepCount }, (_, index) => stepPhotos[index] || null),
    [activeTask.stepCount, stepPhotos],
  );

  function handleStepPhotoChange(index: number, file: File | null) {
    setStepPhotos((current) => {
      const next = Array.from({ length: activeTask.stepCount }, (_, i) => current[i] || null);
      next[index] = file;
      return next;
    });
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setSuccess("");

    const files = photoSlots.filter((file): file is File => Boolean(file));

    if (files.length < activeTask.stepCount) {
      setError(`This task needs ${activeTask.stepCount} separate proof photo(s), one for each step.`);
      return;
    }

    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("taskName", activeTask.name);
      formData.append("location", activeTask.location);
      files.forEach((photo) => formData.append("photos", photo));

      const response = await fetch("/api/submissions/task", {
        method: "POST",
        body: formData,
      });
      const payload = (await response.json()) as {
        ok: boolean;
        error?: string;
        result?: { folderLink?: string };
      };

      if (!payload.ok) {
        throw new Error(payload.error || "Task submission failed.");
      }

      setSuccess(`Task proof submitted successfully. Drive folder: ${payload.result?.folderLink || "created"}`);
      setStepPhotos([]);
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : "Task submission failed.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="stack">
      <section className="page-header">
        <div>
          <h2 className="section-title">Work Holds</h2>
          <p className="muted">Task submissions now create Drive folders and append structured Sheet rows.</p>
        </div>
      </section>

      <section className="stack">
        {taskDefinitions.map((task) => (
          <article className="form-card" key={task.id}>
            <div className="list-row">
              <div>
                <strong>{task.name}</strong>
                <p className="muted">
                  {task.location} · {task.schedule}
                </p>
              </div>
              <StatusBadge tone={task.status} />
            </div>
          </article>
        ))}
      </section>

      <form className="form-card" onSubmit={handleSubmit}>
        <h3>Submit Task Proof</h3>
        <div className="field">
          <label>Task</label>
          <select
            value={taskId}
            onChange={(event) => {
              setTaskId(event.target.value);
              setStepPhotos([]);
            }}
          >
            {taskDefinitions.map((task) => (
              <option key={task.id} value={task.id}>
                {task.name}
              </option>
            ))}
          </select>
        </div>
        <div className="highlight-box">
          Selected task: {activeTask.name}. Required step photos: {activeTask.stepCount}. Location: {activeTask.location}.
        </div>
        <div className="stack">
          {photoSlots.map((photo, index) => (
            <div className="field" key={`${activeTask.id}-step-${index + 1}`}>
              <label>{`Step ${index + 1} Photo`}</label>
              <input
                type="file"
                accept="image/*"
                capture="environment"
                onChange={(event) => handleStepPhotoChange(index, event.target.files?.[0] || null)}
              />
              <span className="field-hint">
                {photo ? `${photo.name}` : `Capture photo for step ${index + 1}`}
              </span>
            </div>
          ))}
        </div>
        <SubmissionStatus error={error} success={success} />
        <button className="primary-button" disabled={loading}>
          {loading ? "Submitting..." : "Submit Task Evidence"}
        </button>
      </form>
    </main>
  );
}
