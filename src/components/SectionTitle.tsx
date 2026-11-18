import Link from "next/link";

export default function SectionTitle({ title, href, light }: { title: string; href?: string; light?: boolean }) {
  return (
    <div className="mb-6 flex items-end justify-between gap-4">
      <div>
        <h2 className={`text-xl font-extrabold uppercase tracking-wide sm:text-2xl ${light ? "text-white" : "text-ink"}`}>{title}</h2>
        <span className="mt-2 block h-1 w-14 rounded bg-brand" />
      </div>
      {href && (
        <Link href={href} className={`shrink-0 text-sm font-semibold hover:underline ${light ? "text-white" : "text-brand"}`}>
          Xem tất cả →
        </Link>
      )}
    </div>
  );
}
