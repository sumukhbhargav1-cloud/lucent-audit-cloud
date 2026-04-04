"use client";

import { useId, useState } from "react";

export function PhotoField({
  label,
  hint = "Live camera capture required",
  required = true,
}: {
  label: string;
  hint?: string;
  required?: boolean;
}) {
  const id = useId();
  const [fileName, setFileName] = useState<string>("");

  return (
    <label className="photo-field" htmlFor={id}>
      <span className="photo-field-title">
        {label} {required ? <strong>*</strong> : null}
      </span>
      <span className="photo-field-hint">{hint}</span>
      <input
        id={id}
        type="file"
        accept="image/*"
        capture="environment"
        onChange={(event) => setFileName(event.target.files?.[0]?.name ?? "")}
      />
      <span className="photo-field-button">{fileName ? `Captured: ${fileName}` : "Open Camera"}</span>
    </label>
  );
}
