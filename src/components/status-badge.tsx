import type { StatusTone } from "@/lib/types";

const toneMap: Record<StatusTone, string> = {
  pending: "badge badge-pending",
  completed: "badge badge-completed",
  missed: "badge badge-missed",
  flagged: "badge badge-flagged",
  active: "badge badge-active",
  open: "badge badge-open",
  resolved: "badge badge-completed",
};

export function StatusBadge({
  tone,
  label,
}: {
  tone: StatusTone;
  label?: string;
}) {
  return <span className={toneMap[tone]}>{label ?? tone}</span>;
}
