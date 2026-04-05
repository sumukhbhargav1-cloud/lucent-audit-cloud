"use client";

import { useEffect, useState } from "react";
import {
  isNotificationSchedulerEnabled,
  requestNotificationPermission,
  sendTestNotification,
  startNotificationScheduler,
} from "@/lib/notifications";

export function NotificationManager() {
  const [permissionState, setPermissionState] = useState<NotificationPermission | "unsupported">(
    typeof window !== "undefined" && "Notification" in window ? Notification.permission : "unsupported",
  );

  useEffect(() => {
    if (permissionState === "granted" && isNotificationSchedulerEnabled()) {
      startNotificationScheduler();
    }
  }, [permissionState]);

  async function enableAlerts() {
    const granted = await requestNotificationPermission();
    setPermissionState(granted ? "granted" : Notification.permission);
    if (granted) {
      startNotificationScheduler();
    }
  }

  if (permissionState === "unsupported") {
    return null;
  }

  if (permissionState === "granted") {
    return (
      <div className="button-row">
        <button className="ghost-button" type="button" onClick={sendTestNotification}>
          Test Alert
        </button>
      </div>
    );
  }

  return (
    <button className="ghost-button" type="button" onClick={enableAlerts}>
      Enable Alerts
    </button>
  );
}
