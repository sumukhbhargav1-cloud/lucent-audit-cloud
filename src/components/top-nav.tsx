import Link from "next/link";

export function TopNav() {
  return (
    <header className="topbar">
      <div>
        <p className="eyebrow">Hotel Guardian Cloud</p>
        <h1>Hotel Audit & Operations</h1>
      </div>
      <Link href="/admin" className="ghost-button">
        Admin
      </Link>
    </header>
  );
}
