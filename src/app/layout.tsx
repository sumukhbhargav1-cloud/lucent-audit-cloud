import type { Metadata } from "next";
import { BottomNav } from "@/components/bottom-nav";
import { TopNav } from "@/components/top-nav";
import "./globals.css";

export const metadata: Metadata = {
  title: "Hotel Guardian Cloud",
  description: "Mobile-first hotel audit and operations management system.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <div className="app-shell">
          <TopNav />
          {children}
        </div>
        <BottomNav />
      </body>
    </html>
  );
}
