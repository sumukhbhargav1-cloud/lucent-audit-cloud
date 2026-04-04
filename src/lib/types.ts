export type UserRole = "superAdmin" | "hotelAdmin" | "manager" | "staff" | "auditor";

export type StatusTone =
  | "pending"
  | "completed"
  | "missed"
  | "flagged"
  | "active"
  | "open"
  | "resolved";

export interface WorkerSchedule {
  workerName: string;
  time: string;
  type: "enter" | "exit";
  status: StatusTone;
}

export interface RoomAuditRecord {
  guestName: string;
  roomNumber: string;
  checkInDate: string;
  expectedCheckOutDate: string;
  towelCount: number;
  bedCondition: "ok" | "good" | "bad" | "needs_enquiry";
}

export interface TaskDefinition {
  id: string;
  name: string;
  schedule: string;
  location: string;
  stepCount: number;
  status: StatusTone;
}

export interface IssueRecord {
  id: string;
  title: string;
  location: string;
  category: string;
  priority: "low" | "medium" | "high" | "critical";
  status: "open" | "active" | "resolved";
}

export interface WaterLogRecord {
  slot: string;
  reading: string;
  status: StatusTone;
}
