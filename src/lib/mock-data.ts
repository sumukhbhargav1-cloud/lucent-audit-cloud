import type {
  IssueRecord,
  RoomAuditRecord,
  TaskDefinition,
  WaterLogRecord,
  WorkerSchedule,
} from "@/lib/types";

export const hotelSummary = {
  name: "Lucent Hotel",
  code: "lucent-main",
  timezone: "Asia/Kolkata",
  activeRole: "hotelAdmin",
  completionRate: "92%",
  workerCompliance: "88%",
  auditCompliance: "94%",
  openIssues: 7,
};

export const workerSchedules: WorkerSchedule[] = [
  { workerName: "Rangana", time: "08:30", type: "enter", status: "pending" },
  { workerName: "Praveen", time: "08:30", type: "enter", status: "completed" },
  { workerName: "Preetham", time: "08:30", type: "exit", status: "missed" },
  { workerName: "Yashoda", time: "09:00", type: "enter", status: "pending" },
  { workerName: "Yashoda", time: "17:30", type: "exit", status: "pending" },
  { workerName: "Praveen", time: "20:30", type: "exit", status: "pending" },
  { workerName: "Rangana", time: "20:30", type: "exit", status: "pending" },
  { workerName: "Preetham", time: "20:30", type: "enter", status: "pending" },
];

export const currentStay: RoomAuditRecord = {
  guestName: "Aarav Sharma",
  roomNumber: "205",
  checkInDate: "2026-04-04",
  expectedCheckOutDate: "2026-04-06",
  towelCount: 2,
  bedCondition: "good",
};

export const taskDefinitions: TaskDefinition[] = [
  {
    id: "pool-photos",
    name: "Swimming Pool Photos",
    schedule: "Daily 10:00 AM + Tue/Wed/Thu post-cleaning",
    location: "Pool",
    stepCount: 1,
    status: "pending",
  },
  {
    id: "pool-cleaning",
    name: "Pool Cleaning",
    schedule: "Tue/Wed/Thu 10:00 AM to 11:00 AM",
    location: "Pool",
    stepCount: 4,
    status: "active",
  },
  {
    id: "backwash",
    name: "Backwash",
    schedule: "Thu 10:30 AM",
    location: "Filtration Room",
    stepCount: 3,
    status: "pending",
  },
  {
    id: "dining",
    name: "Dining Cleaning",
    schedule: "Daily 9:30 AM",
    location: "Dining Area",
    stepCount: 1,
    status: "completed",
  },
];

export const issueRecords: IssueRecord[] = [
  {
    id: "issue-1",
    title: "Towel mismatch in Room 205",
    location: "Room 205",
    category: "Missing item",
    priority: "high",
    status: "open",
  },
  {
    id: "issue-2",
    title: "Pool washroom refill needed",
    location: "Pool Washroom",
    category: "Refill needed",
    priority: "medium",
    status: "active",
  },
  {
    id: "issue-3",
    title: "Broken kettle tray edge",
    location: "Room 110",
    category: "Damage",
    priority: "medium",
    status: "resolved",
  },
];

export const waterLogs: WaterLogRecord[] = [
  { slot: "08:00 AM", reading: "12140 L", status: "completed" },
  { slot: "10:00 AM", reading: "12220 L", status: "completed" },
  { slot: "12:00 PM", reading: "Pending", status: "pending" },
];

export const monthlyReportChecklist = [
  "PDF hotel operations report",
  "Excel audit export",
  "Drive folder reconciliation",
  "Sheets sync verification",
];
