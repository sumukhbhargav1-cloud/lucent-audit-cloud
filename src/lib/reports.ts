import "server-only";

import { PDFDocument, StandardFonts, rgb } from "pdf-lib";
import * as XLSX from "xlsx";
import { DATA_SHEETS } from "@/lib/google/operations";
import { getSheetRows } from "@/lib/google/sheets";

type ReportSheetName = (typeof DATA_SHEETS)[keyof typeof DATA_SHEETS];

interface MonthlyReportData {
  month: string;
  generatedAt: string;
  sheets: Record<ReportSheetName, Record<string, string>[]>;
  summary: {
    workerLogs: number;
    roomAudits: number;
    taskSubmissions: number;
    issues: number;
    waterLogs: number;
    flaggedRoomAudits: number;
    openIssues: number;
  };
}

function matchesMonth(value: string, month: string) {
  return value?.startsWith(month);
}

function filterRowsByMonth(rows: Record<string, string>[], month: string) {
  return rows.filter((row) =>
    Object.values(row).some((value) => typeof value === "string" && matchesMonth(value, month)),
  );
}

export async function getMonthlyReportData(month: string): Promise<MonthlyReportData> {
  const [workerLogs, roomAudits, taskSubmissions, issues, waterLogs] = await Promise.all([
    getSheetRows({ sheetName: DATA_SHEETS.workerLogs }),
    getSheetRows({ sheetName: DATA_SHEETS.roomAudits }),
    getSheetRows({ sheetName: DATA_SHEETS.taskSubmissions }),
    getSheetRows({ sheetName: DATA_SHEETS.issues }),
    getSheetRows({ sheetName: DATA_SHEETS.waterLogs }),
  ]);

  const filtered = {
    worker_logs: filterRowsByMonth(workerLogs, month),
    room_audits: filterRowsByMonth(roomAudits, month),
    task_submissions: filterRowsByMonth(taskSubmissions, month),
    issues: filterRowsByMonth(issues, month),
    water_logs: filterRowsByMonth(waterLogs, month),
  };

  return {
    month,
    generatedAt: new Date().toISOString(),
    sheets: filtered,
    summary: {
      workerLogs: filtered.worker_logs.length,
      roomAudits: filtered.room_audits.length,
      taskSubmissions: filtered.task_submissions.length,
      issues: filtered.issues.length,
      waterLogs: filtered.water_logs.length,
      flaggedRoomAudits: filtered.room_audits.filter((row) => row.status === "flagged").length,
      openIssues: filtered.issues.filter((row) => row.status === "open").length,
    },
  };
}

function addSheetToWorkbook(workbook: XLSX.WorkBook, name: string, rows: Record<string, string>[]) {
  const sheet = XLSX.utils.json_to_sheet(rows.length ? rows : [{ notice: "No records for this month" }]);
  XLSX.utils.book_append_sheet(workbook, sheet, name);
}

export async function generateMonthlyExcelReport(month: string) {
  const report = await getMonthlyReportData(month);
  const workbook = XLSX.utils.book_new();

  addSheetToWorkbook(workbook, "summary", [
    {
      month: report.month,
      generatedAt: report.generatedAt,
      workerLogs: String(report.summary.workerLogs),
      roomAudits: String(report.summary.roomAudits),
      taskSubmissions: String(report.summary.taskSubmissions),
      issues: String(report.summary.issues),
      waterLogs: String(report.summary.waterLogs),
      flaggedRoomAudits: String(report.summary.flaggedRoomAudits),
      openIssues: String(report.summary.openIssues),
    },
  ]);
  addSheetToWorkbook(workbook, "worker_logs", report.sheets.worker_logs);
  addSheetToWorkbook(workbook, "room_audits", report.sheets.room_audits);
  addSheetToWorkbook(workbook, "task_submissions", report.sheets.task_submissions);
  addSheetToWorkbook(workbook, "issues", report.sheets.issues);
  addSheetToWorkbook(workbook, "water_logs", report.sheets.water_logs);

  return XLSX.write(workbook, { type: "buffer", bookType: "xlsx" }) as Buffer;
}

function drawSummaryLine(page: import("pdf-lib").PDFPage, text: string, x: number, y: number, size = 11) {
  page.drawText(text, {
    x,
    y,
    size,
    color: rgb(0.07, 0.09, 0.12),
  });
}

export async function generateMonthlyPdfReport(month: string) {
  const report = await getMonthlyReportData(month);
  const pdf = await PDFDocument.create();
  const page = pdf.addPage([595, 842]);
  const font = await pdf.embedFont(StandardFonts.Helvetica);
  const bold = await pdf.embedFont(StandardFonts.HelveticaBold);

  page.drawText("Hotel Guardian Cloud Monthly Report", {
    x: 40,
    y: 790,
    size: 20,
    font: bold,
    color: rgb(0.1, 0.2, 0.5),
  });
  page.drawText(`Month: ${month}`, { x: 40, y: 760, size: 12, font });
  page.drawText(`Generated: ${report.generatedAt}`, { x: 40, y: 742, size: 10, font });

  const lines = [
    `Worker logs: ${report.summary.workerLogs}`,
    `Room audits: ${report.summary.roomAudits}`,
    `Flagged room audits: ${report.summary.flaggedRoomAudits}`,
    `Task submissions: ${report.summary.taskSubmissions}`,
    `Issues: ${report.summary.issues}`,
    `Open issues: ${report.summary.openIssues}`,
    `Water logs: ${report.summary.waterLogs}`,
  ];

  let y = 700;
  page.drawText("Summary", { x: 40, y, size: 14, font: bold });
  y -= 24;
  lines.forEach((line) => {
    drawSummaryLine(page, line, 40, y);
    y -= 18;
  });

  y -= 12;
  page.drawText("Recent Room Audits", { x: 40, y, size: 14, font: bold });
  y -= 22;
  report.sheets.room_audits.slice(0, 8).forEach((row) => {
    const summary = `${row.mode || "audit"} | Room ${row.roomNumber || "-"} | ${row.guestName || "-"} | ${row.status || "-"}`;
    drawSummaryLine(page, summary, 40, y, 10);
    y -= 16;
  });

  y -= 8;
  page.drawText("Recent Issues", { x: 40, y, size: 14, font: bold });
  y -= 22;
  report.sheets.issues.slice(0, 8).forEach((row) => {
    const summary = `${row.title || "-"} | ${row.location || "-"} | ${row.priority || "-"} | ${row.status || "-"}`;
    drawSummaryLine(page, summary, 40, y, 10);
    y -= 16;
  });

  return Buffer.from(await pdf.save());
}
