"use client";

interface ScheduledAlert {
  id: string;
  time: string;
  title: string;
  body: string;
  days?: string[];
}

const DAYS = ["sun", "mon", "tue", "wed", "thu", "fri", "sat"];

const WORKER_ALERTS: ScheduledAlert[] = [
  {
    id: "worker-0830",
    time: "08:30",
    title: "Worker report due",
    body: "Rangana and Praveen enter, Preetham exit. Photo required.",
  },
  {
    id: "worker-0900",
    time: "09:00",
    title: "Worker report due",
    body: "Yashoda enter. Photo required.",
  },
  {
    id: "worker-1730",
    time: "17:30",
    title: "Worker report due",
    body: "Yashoda exit. Photo required.",
  },
  {
    id: "worker-2030",
    time: "20:30",
    title: "Worker report due",
    body: "Praveen and Rangana exit, Preetham enter. Photo required.",
  },
];

const TASK_ALERTS: ScheduledAlert[] = [
  { id: "pool-photos", time: "10:00", title: "Swimming pool photos", body: "Daily pool photo submission required." },
  { id: "pool-cleaning", time: "10:00", title: "Pool cleaning", body: "Pool cleaning with step photos.", days: ["tue", "wed", "thu"] },
  { id: "backwash", time: "10:30", title: "Backwash", body: "Backwash proof photos due.", days: ["thu"] },
  { id: "parking-cleaning", time: "12:00", title: "Parking cleaning", body: "Parking cleaning proof due.", days: ["wed", "thu"] },
  { id: "lift-wiping", time: "15:00", title: "Lift wiping", body: "Lift wiping proof due.", days: ["wed", "thu"] },
  { id: "pool-washroom", time: "15:30", title: "Pool washroom cleaning", body: "Pool washroom proof due.", days: ["thu", "fri"] },
  { id: "dining-cleaning", time: "09:30", title: "Dining cleaning", body: "Dining cleaning proof due." },
];

const WATER_ALERTS: ScheduledAlert[] = ["06:00", "08:00", "10:00", "12:00", "14:00", "16:00", "18:00", "20:00"].map(
  (time) => ({
    id: `water-${time}`,
    time,
    title: "Water meter due",
    body: "Water meter reading and photo required.",
  }),
);

const ALL_ALERTS = [...WORKER_ALERTS, ...TASK_ALERTS, ...WATER_ALERTS];

let checkInterval: ReturnType<typeof setInterval> | null = null;
const firedAlerts = new Set<string>();

export async function requestNotificationPermission() {
  if (typeof window === "undefined" || !("Notification" in window)) {
    return false;
  }

  if (Notification.permission === "granted") {
    return true;
  }

  if (Notification.permission === "denied") {
    return false;
  }

  const permission = await Notification.requestPermission();
  return permission === "granted";
}

export function sendNotification(title: string, body: string, tag: string) {
  if (typeof window === "undefined" || !("Notification" in window)) {
    return;
  }

  if (Notification.permission !== "granted") {
    return;
  }

  new Notification(title, {
    body,
    icon: "/favicon.ico",
    tag,
    requireInteraction: true,
  });
}

export function startNotificationScheduler() {
  if (typeof window === "undefined" || checkInterval) {
    return;
  }

  checkInterval = setInterval(() => {
    const now = new Date();
    const currentTime = `${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`;
    const currentDay = DAYS[now.getDay()];
    const todayKey = now.toISOString().slice(0, 10);

    ALL_ALERTS.forEach((alert) => {
      const alertKey = `${alert.id}-${todayKey}`;
      if (firedAlerts.has(alertKey)) {
        return;
      }

      if (alert.time !== currentTime) {
        return;
      }

      if (alert.days && !alert.days.includes(currentDay)) {
        return;
      }

      firedAlerts.add(alertKey);
      sendNotification(alert.title, alert.body, alert.id);
    });
  }, 30000);
}

export function stopNotificationScheduler() {
  if (!checkInterval) {
    return;
  }

  clearInterval(checkInterval);
  checkInterval = null;
}
