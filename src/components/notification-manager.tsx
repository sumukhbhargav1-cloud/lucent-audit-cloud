"use client";

import { useEffect, useState } from "react";
import { requestNotificationPermission, startNotificationScheduler } from "@/lib/notifications";

export function NotificationManager() {
  const [permissionState, setPermissionState] = useState<NotificationPermission | "unsupported">(
    typeof window !== "undefined" && "Notification" in window ? Notification.permission : "unsupported",
  );

  useEffect(() => {
    if (permissionState === "granted") {
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

  if (permissionState === "granted" || permissionState === "unsupported") {
    return null;
  }

  return (
    <button className="ghost-button" type="button" onClick={enableAlerts}>
      Enable Alerts
    </button>
  );
}
