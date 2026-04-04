"use client";

export function SubmissionStatus({
  error,
  success,
}: {
  error?: string;
  success?: string;
}) {
  if (!error && !success) {
    return null;
  }

  return (
    <div className={error ? "warning-box" : "highlight-box"}>
      {error ? error : success}
    </div>
  );
}
