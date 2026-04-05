"use client";

import { FormEvent, useState } from "react";
import { SubmissionStatus } from "@/components/submission-status";
import { AUDIT_PHOTO_FIELDS, type AuditPhotoFieldKey } from "@/lib/audit-photo-fields";

export default function BeforeCheckInPage() {
  const [guestName, setGuestName] = useState("Aarav Sharma");
  const [roomNumber, setRoomNumber] = useState("205");
  const [checkInDate, setCheckInDate] = useState("2026-04-04");
  const [expectedCheckOutDate, setExpectedCheckOutDate] = useState("2026-04-06");
  const [towelCount, setTowelCount] = useState("2");
  const [bedCondition, setBedCondition] = useState("good");
  const [photos, setPhotos] = useState<Record<AuditPhotoFieldKey, File | null>>({
    acRemote: null,
    tvRemote: null,
    setTopBox: null,
    towelPhoto: null,
    bathroomPhotos: null,
    kettleTray: null,
    menuCards: null,
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const selectedPhotos = AUDIT_PHOTO_FIELDS.map((field) => photos[field.key]).filter(
    (photo): photo is File => Boolean(photo),
  );

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setSuccess("");

    if (selectedPhotos.length < AUDIT_PHOTO_FIELDS.length) {
      setError("All required audit photos must be captured before submission.");
      return;
    }

    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("mode", "before_check_in");
      formData.append("guestName", guestName);
      formData.append("roomNumber", roomNumber);
      formData.append("checkInDate", checkInDate);
      formData.append("expectedCheckOutDate", expectedCheckOutDate);
      formData.append("towelCount", towelCount);
      formData.append("bedCondition", bedCondition);
      selectedPhotos.forEach((photo) => formData.append("photos", photo));

      const response = await fetch("/api/submissions/room-audit", {
        method: "POST",
        body: formData,
      });

      const payload = (await response.json()) as {
        ok: boolean;
        error?: string;
        result?: { folderLink?: string };
      };

      if (!payload.ok) {
        throw new Error(payload.error || "Before check-in submission failed.");
      }

      setSuccess(`Before check-in audit submitted. Drive folder: ${payload.result?.folderLink || "created"}`);
    } catch (submitError) {
      setError(
        submitError instanceof Error ? submitError.message : "Before check-in audit submission failed.",
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="stack">
      <section className="page-header">
        <div>
          <h2 className="section-title">Before Check-In</h2>
          <p className="muted">This now submits a real audit record to Sheets and uploads photos to Drive.</p>
        </div>
      </section>

      <form className="form-card" onSubmit={handleSubmit}>
        <h3>Guest & Stay</h3>
        <div className="field">
          <label>Guest Name</label>
          <input value={guestName} onChange={(event) => setGuestName(event.target.value)} />
        </div>
        <div className="field-grid two">
          <div className="field">
            <label>Check-in Date</label>
            <input type="date" value={checkInDate} onChange={(event) => setCheckInDate(event.target.value)} />
          </div>
          <div className="field">
            <label>Expected Check-out</label>
            <input
              type="date"
              value={expectedCheckOutDate}
              onChange={(event) => setExpectedCheckOutDate(event.target.value)}
            />
          </div>
        </div>
        <div className="field-grid two">
          <div className="field">
            <label>Room Number</label>
            <input value={roomNumber} onChange={(event) => setRoomNumber(event.target.value)} />
          </div>
          <div className="field">
            <label>Towel Count</label>
            <input type="number" min="0" value={towelCount} onChange={(event) => setTowelCount(event.target.value)} />
          </div>
        </div>
        <div className="field">
          <label>Bed Condition</label>
          <select value={bedCondition} onChange={(event) => setBedCondition(event.target.value)}>
            <option value="ok">Ok</option>
            <option value="good">Good</option>
            <option value="bad">Bad</option>
            <option value="needs_enquiry">Needs Enquiry</option>
          </select>
        </div>
        <div className="field">
          <label>Required Upload Sections</label>
          <div className="stack">
            {AUDIT_PHOTO_FIELDS.map((field) => (
              <div className="field" key={field.key}>
                <label>{field.label}</label>
                <input
                  type="file"
                  accept="image/*"
                  capture="environment"
                  onChange={(event) =>
                    setPhotos((current) => ({
                      ...current,
                      [field.key]: event.target.files?.[0] || null,
                    }))
                  }
                />
                <span className="field-hint">
                  {photos[field.key] ? photos[field.key]?.name : `${field.label} upload required`}
                </span>
              </div>
            ))}
          </div>
        </div>
        <SubmissionStatus error={error} success={success} />
        <button className="primary-button" disabled={loading}>
          {loading ? "Submitting..." : "Submit Before Check-In Audit"}
        </button>
      </form>
    </main>
  );
}
