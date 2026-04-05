"use client";

interface ScheduledAlert {
  id: string;
  time: string;
  title: string;
  body: string;
  days?: string[];
}

const DAYS = ["sun", "mon", "tue", "wed", "thu", "fri", "sat"];
const STORAGE_PREFIX = "hotel-guardian-alert";
const ENABLED_KEY = `${STORAGE_PREFIX}-enabled`;
const CATCH_UP_WINDOW_MS = 90_000;

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

function getAlertStorageKey(alertId: string, dateKey: string) {
  return `${STORAGE_PREFIX}-${alertId}-${dateKey}`;
}

function isBrowserSupported() {
  return typeof window !== "undefined" && "Notification" in window;
}

function hasDayMatch(alert: ScheduledAlert, now: Date) {
  if (!alert.days?.length) {
    return true;
  }

  return alert.days.includes(DAYS[now.getDay()]);
}

function getScheduledDate(now: Date, time: string) {
  const [hours, minutes] = time.split(":").map(Number);
  const scheduled = new Date(now);
  scheduled.setHours(hours, minutes, 0, 0);
  return scheduled;
}

function wasAlertAlreadyFired(alertId: string, dateKey: string) {
  if (typeof window === "undefined") {
    return false;
  }
  return window.localStorage.getItem(getAlertStorageKey(alertId, dateKey)) === "1";
}

function markAlertFired(alertId: string, dateKey: string) {
  if (typeof window === "undefined") {
    return;
  }
  window.localStorage.setItem(getAlertStorageKey(alertId, dateKey), "1");
}

function shouldFireAlert(alert: ScheduledAlert, now: Date) {
  if (!hasDayMatch(alert, now)) {
    return false;
  }

  const dateKey = now.toISOString().slice(0, 10);
  if (wasAlertAlreadyFired(alert.id, dateKey)) {
    return false;
  }

  const scheduled = getScheduledDate(now, alert.time);
  const delta = now.getTime() - scheduled.getTime();
  return delta >= 0 && delta <= CATCH_UP_WINDOW_MS;
}

export async function requestNotificationPermission() {
  if (!isBrowserSupported()) {
    return false;
  }

  if (Notification.permission === "granted") {
    window.localStorage.setItem(ENABLED_KEY, "1");
    return true;
  }

  if (Notification.permission === "denied") {
    return false;
  }

  const permission = await Notification.requestPermission();
  if (permission === "granted") {
    window.localStorage.setItem(ENABLED_KEY, "1");
  }
  return permission === "granted";
}

export function sendNotification(title: string, body: string, tag: string) {
  if (!isBrowserSupported()) {
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

function runAlertCheck() {
  const now = new Date();
  const dateKey = now.toISOString().slice(0, 10);

  ALL_ALERTS.forEach((alert) => {
    if (!shouldFireAlert(alert, now)) {
      return;
    }

    markAlertFired(alert.id, dateKey);
    sendNotification(alert.title, alert.body, alert.id);
  });
}

export function isNotificationSchedulerEnabled() {
  if (typeof window === "undefined") {
    return false;
  }
  return window.localStorage.getItem(ENABLED_KEY) === "1";
}

export function startNotificationScheduler() {
  if (!isBrowserSupported() || checkInterval) {
    return;
  }

  runAlertCheck();
  checkInterval = setInterval(runAlertCheck, 20_000);
}

export function stopNotificationScheduler() {
  if (!checkInterval) {
    return;
  }

  clearInterval(checkInterval);
  checkInterval = null;
}

export function sendTestNotification() {
  sendNotification("Hotel Ops test alert", "Notifications are working in this browser.", "hotel-ops-test");
}
