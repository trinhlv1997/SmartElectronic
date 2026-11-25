import type { Metadata } from "next";
import PageBanner from "@/components/PageBanner";
import { NEWS } from "@/data/site";

export const metadata: Metadata = { title: "Tin tức | LeMan" };

export default function NewsPage() {
  return (
    <>
      <PageBanner title="Tin tức" crumbs={[{ label: "Tin tức" }]} />
      <div className="mx-auto grid max-w-7xl gap-6 px-4 py-10 md:grid-cols-3">
        {NEWS.map((n) => (
          <article key={n.slug} className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
            <div className="flex aspect-video items-center justify-center bg-gradient-to-br from-brand-50 to-brand-100 text-7xl">{n.icon}</div>
            <div className="p-5">
              <p className="text-xs text-slate-500">{new Date(n.date).toLocaleDateString("vi-VN")}</p>
              <h2 className="mt-1 font-bold">{n.title}</h2>
              <p className="mt-2 text-sm text-slate-600">{n.excerpt}</p>
            </div>
          </article>
        ))}
      </div>
    </>
  );
}
