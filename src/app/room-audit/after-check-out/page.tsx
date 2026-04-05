"use client";

import { FormEvent, useState } from "react";
import { SubmissionStatus } from "@/components/submission-status";
import { AUDIT_PHOTO_FIELDS, type AuditPhotoFieldKey } from "@/lib/audit-photo-fields";

interface LookupResult {
  recordId: string;
  guestName: string;
  roomNumber: string;
  checkInDate: string;
  expectedCheckOutDate: string;
  towelCount: string;
  bedCondition: string;
}

export default function AfterCheckOutPage() {
  const [guestName, setGuestName] = useState("Aarav Sharma");
  const [roomNumber, setRoomNumber] = useState("205");
  const [lookup, setLookup] = useState<LookupResult | null>(null);
  const [towelCount, setTowelCount] = useState("1");
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
  const [searching, setSearching] = useState(false);
  const selectedPhotos = AUDIT_PHOTO_FIELDS.map((field) => photos[field.key]).filter(
    (photo): photo is File => Boolean(photo),
  );

  async function handleLookup() {
    setError("");
    setSuccess("");
    setSearching(true);

    try {
      const search = new URLSearchParams({
        guestName,
        roomNumber,
      });
      const response = await fetch(`/api/submissions/room-audit/lookup?${search.toString()}`);
      const payload = (await response.json()) as {
        ok: boolean;
        error?: string;
        result?: LookupResult | null;
      };

      if (!payload.ok) {
        throw new Error(payload.error || "Lookup failed.");
      }

      if (!payload.result) {
        setLookup(null);
        setError("No matching before check-in audit found yet.");
        return;
      }

      setLookup(payload.result);
      setSuccess(`Matched previous audit ${payload.result.recordId} for room ${payload.result.roomNumber}.`);
    } catch (lookupError) {
      setError(lookupError instanceof Error ? lookupError.message : "Lookup failed.");
    } finally {
      setSearching(false);
    }
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setSuccess("");

    if (!lookup) {
      setError("Search and match a previous check-in audit before submitting checkout.");
      return;
    }

    if (selectedPhotos.length < AUDIT_PHOTO_FIELDS.length) {
      setError("All checkout audit photos are required before submission.");
      return;
    }

    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("mode", "after_check_out");
      formData.append("guestName", guestName);
      formData.append("roomNumber", roomNumber);
      formData.append("checkInDate", lookup.checkInDate);
      formData.append("expectedCheckOutDate", lookup.expectedCheckOutDate);
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
        result?: { status?: string; comparisonSummary?: string; folderLink?: string };
      };

      if (!payload.ok) {
        throw new Error(payload.error || "After checkout submission failed.");
      }

      const comparisonText = payload.result?.comparisonSummary ? ` ${payload.result.comparisonSummary}` : "";
      setSuccess(
        `After checkout audit submitted with status ${payload.result?.status || "submitted"}.${comparisonText} Drive folder: ${payload.result?.folderLink || "created"}`,
      );
    } catch (submitError) {
      setError(
        submitError instanceof Error ? submitError.message : "After checkout audit submission failed.",
      );
    } finally {
      setLoading(false);
    }
  }

  const towelMismatch = lookup ? lookup.towelCount !== towelCount : false;

  return (
    <main className="stack">
      <section className="page-header">
        <div>
          <h2 className="section-title">After Check-Out</h2>
          <p className="muted">This now looks up the last before check-in audit from Sheets and flags towel mismatches.</p>
        </div>
      </section>

      <section className="form-card">
        <h3>Lookup Previous Audit</h3>
        <div className="field-grid two">
          <div className="field">
            <label>Guest Name</label>
            <input value={guestName} onChange={(event) => setGuestName(event.target.value)} />
          </div>
          <div className="field">
            <label>Room Number</label>
            <input value={roomNumber} onChange={(event) => setRoomNumber(event.target.value)} />
          </div>
        </div>
        <button className="secondary-button" type="button" onClick={handleLookup} disabled={searching}>
          {searching ? "Searching..." : "Find Previous Audit"}
        </button>
        {lookup ? (
          <div className="highlight-box">
            Previous towels: {lookup.towelCount}. Previous bed condition: {lookup.bedCondition}. Check-in date:{" "}
            {lookup.checkInDate}.
          </div>
        ) : null}
      </section>

      <form className="form-card" onSubmit={handleSubmit}>
        <h3>Submit Check-Out Audit</h3>
        <div className="field-grid two">
          <div className="field">
            <label>Current Towel Count</label>
            <input type="number" min="0" value={towelCount} onChange={(event) => setTowelCount(event.target.value)} />
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
        </div>
        {towelMismatch ? (
          <div className="warning-box">
            Towel mismatch detected. Submitting will mark the record as flagged and store the comparison summary.
          </div>
        ) : null}
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
          {loading ? "Submitting..." : "Submit After Check-Out Audit"}
        </button>
      </form>
    </main>
  );
}
