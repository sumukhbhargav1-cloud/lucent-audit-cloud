import Link from "next/link";

export function TopNav() {
  return (
    <header className="topbar">
      <div>
        <h1>Hotel Ops</h1>
        <p className="topbar-subtitle">Audit & Management System</p>
      </div>
      <Link href="/admin" className="ghost-button">
        Admin
      </Link>
    </header>
  );
}
