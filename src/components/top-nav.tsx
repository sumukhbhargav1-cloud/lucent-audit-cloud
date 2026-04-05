import Link from "next/link";
import { NotificationManager } from "@/components/notification-manager";

export function TopNav() {
  return (
    <header className="topbar">
      <div>
        <h1>Hotel Ops</h1>
        <p className="topbar-subtitle">Audit & Management System</p>
      </div>
      <div className="button-row">
        <NotificationManager />
        <Link href="/admin" className="ghost-button">
          Admin
        </Link>
      </div>
    </header>
  );
}
