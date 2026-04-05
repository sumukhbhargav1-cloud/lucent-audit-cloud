"use client";

import { useMemo, useState } from "react";

export function ReportDownloads() {
  const defaultMonth = useMemo(() => new Date().toISOString().slice(0, 7), []);
  const [month, setMonth] = useState(defaultMonth);

  return (
    <div className="form-card">
      <h3>Download Monthly Reports</h3>
      <div className="field">
        <label>Month</label>
        <input type="month" value={month} onChange={(event) => setMonth(event.target.value)} />
      </div>
      <div className="button-row">
        <a className="primary-button" href={`/api/reports/monthly/pdf?month=${month}`}>
          Download PDF
        </a>
        <a className="secondary-button" href={`/api/reports/monthly/excel?month=${month}`}>
          Download Excel
        </a>
      </div>
    </div>
  );
}
