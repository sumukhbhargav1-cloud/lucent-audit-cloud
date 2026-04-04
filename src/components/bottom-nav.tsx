"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const items = [
  { href: "/", label: "Home" },
  { href: "/worker-report", label: "Worker" },
  { href: "/room-audit", label: "Audit" },
  { href: "/work-holds", label: "Tasks" },
  { href: "/issues", label: "Issues" },
];

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="bottom-nav">
      {items.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          className={pathname === item.href ? "bottom-nav-link active" : "bottom-nav-link"}
        >
          {item.label}
        </Link>
      ))}
    </nav>
  );
}
