import Link from "next/link";

export default function PageBanner({ title, crumbs = [] }: { title: string; crumbs?: { label: string; href?: string }[] }) {
  return (
    <div className="bg-gradient-to-r from-[#a8121a] to-brand text-white">
      <div className="mx-auto max-w-7xl px-4 py-8">
        <nav className="text-sm text-white/80">
          <Link href="/" className="hover:text-white">Trang chủ</Link>
          {crumbs.map((c) => (
            <span key={c.label}>
              {" / "}
              {c.href ? <Link href={c.href} className="hover:text-white">{c.label}</Link> : <span className="text-white">{c.label}</span>}
            </span>
          ))}
        </nav>
        <h1 className="mt-2 text-2xl font-extrabold uppercase sm:text-3xl">{title}</h1>
      </div>
    </div>
  );
}
