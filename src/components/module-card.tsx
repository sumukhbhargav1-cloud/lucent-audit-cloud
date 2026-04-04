import Link from "next/link";

export function ModuleCard({
  href,
  title,
  description,
  meta,
}: {
  href: string;
  title: string;
  description: string;
  meta: string;
}) {
  return (
    <Link href={href} className="module-card">
      <div>
        <p className="eyebrow">{meta}</p>
        <h3>{title}</h3>
        <p>{description}</p>
      </div>
      <span className="module-card-arrow">Open</span>
    </Link>
  );
}
