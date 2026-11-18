import Link from "next/link";
import HeroSlider from "@/components/HeroSlider";
import ProductCard from "@/components/ProductCard";
import SectionTitle from "@/components/SectionTitle";
import { CATEGORIES } from "@/data/categories";
import { FIELDS, NEWS, REASONS, SOLUTIONS, STATS } from "@/data/site";
import { listActiveProducts } from "@/server/products";

const formatDate = (iso: string) => new Date(iso).toLocaleDateString("vi-VN");

export default async function HomePage() {
  const products = await listActiveProducts();
  const suggested = products.filter((p) => p.featured).slice(0, 4);
  const highlights = products.filter((p) => p.oldPrice && p.oldPrice > p.price).slice(0, 8);

  return (
    <>
      <HeroSlider />

      {/* Danh mục gợi ý */}
      <section className="mx-auto max-w-7xl px-4 pt-14">
        <SectionTitle title="Danh mục gợi ý" href="/products" />
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-8">
          {CATEGORIES.map((c) => (
            <Link
              key={c.id}
              href={`/products?category=${c.id}`}
              className="group flex flex-col items-center gap-3 rounded-xl border border-slate-200 bg-white px-2 py-5 text-center text-sm font-semibold transition hover:border-brand hover:text-brand hover:shadow-md"
            >
              <span className="flex h-16 w-16 items-center justify-center rounded-full bg-brand-50 text-3xl transition group-hover:bg-brand group-hover:scale-105">
                {c.icon}
              </span>
              {c.label}
            </Link>
          ))}
        </div>
      </section>

      {/* Sản phẩm gợi ý */}
      <section className="mx-auto max-w-7xl px-4 pt-14">
        <SectionTitle title="Sản phẩm gợi ý" href="/products" />
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          {suggested.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </section>

      {/* Lĩnh vực nổi bật */}
      <section className="mx-auto max-w-7xl px-4 pt-14">
        <SectionTitle title="Lĩnh vực nổi bật" />
        <div className="grid gap-4 md:grid-cols-3">
          {FIELDS.map((f) => (
            <Link
              key={f.title}
              href={`/products?category=${f.category}`}
              className={`group relative flex h-64 flex-col justify-end overflow-hidden rounded-2xl bg-gradient-to-br ${f.from} ${f.to} p-6 text-white`}
            >
              <span className="absolute -right-6 -top-6 text-[9rem] opacity-30 transition duration-500 group-hover:scale-110 group-hover:opacity-50">
                {f.icon}
              </span>
              <h3 className="relative text-2xl font-extrabold uppercase">{f.title}</h3>
              <p className="relative mt-1 text-sm text-white/90">{f.sub}</p>
              <span className="relative mt-4 text-sm font-semibold underline-offset-4 group-hover:underline">Tìm hiểu thêm →</span>
            </Link>
          ))}
        </div>
      </section>

      {/* Vì sao chọn */}
      <section className="mt-14 bg-gradient-to-br from-[#a8121a] to-brand py-14 text-white">
        <div className="mx-auto max-w-7xl px-4">
          <SectionTitle title="Vì sao chọn SmartElectronic?" light />
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {REASONS.map((r) => (
              <div key={r.title} className="rounded-2xl bg-white/10 p-6 backdrop-blur transition hover:bg-white/15">
                <span className="text-4xl">{r.icon}</span>
                <h3 className="mt-4 text-lg font-bold">{r.title}</h3>
                <p className="mt-2 text-sm text-white/85">{r.desc}</p>
              </div>
            ))}
          </div>
          <div className="mt-10 grid grid-cols-2 gap-6 border-t border-white/20 pt-10 text-center lg:grid-cols-4">
            {STATS.map((s) => (
              <div key={s.label}>
                <p className="text-4xl font-extrabold">{s.value}</p>
                <p className="mt-1 text-sm uppercase tracking-wide text-white/80">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Hệ sinh thái giải pháp */}
      <section id="giai-phap" className="mx-auto max-w-7xl scroll-mt-32 px-4 pt-14">
        <SectionTitle title="Hệ sinh thái giải pháp xanh — thông minh" />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {SOLUTIONS.map((s) => (
            <Link
              key={s.id}
              href={`/products?category=${s.category}`}
              className="group flex items-start gap-4 rounded-2xl border border-slate-200 bg-white p-6 transition hover:border-brand hover:shadow-lg"
            >
              <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-brand-50 text-3xl">{s.icon}</span>
              <span>
                <span className="block font-bold uppercase group-hover:text-brand">{s.title}</span>
                <span className="mt-1 block text-sm text-slate-600">{s.desc}</span>
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* Sản phẩm nổi bật */}
      <section className="mt-14 bg-slate-50 py-14">
        <div className="mx-auto max-w-7xl px-4">
          <SectionTitle title="Sản phẩm khuyến mãi" href="/products?sort=price-asc" />
          <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
            {highlights.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </div>
      </section>

      {/* Bài viết gợi ý */}
      <section className="mx-auto max-w-7xl px-4 pt-14">
        <SectionTitle title="Bài viết gợi ý" href="/news" />
        <div className="grid gap-6 md:grid-cols-3">
          {NEWS.map((n) => (
            <Link key={n.slug} href="/news" className="group overflow-hidden rounded-2xl border border-slate-200 bg-white transition hover:shadow-lg">
              <div className="flex aspect-video items-center justify-center bg-gradient-to-br from-brand-50 to-orange-50 text-7xl">
                <span className="transition group-hover:scale-110">{n.icon}</span>
              </div>
              <div className="p-5">
                <p className="text-xs text-slate-500">{formatDate(n.date)}</p>
                <h3 className="mt-1 font-bold leading-snug group-hover:text-brand">{n.title}</h3>
                <p className="mt-2 line-clamp-2 text-sm text-slate-600">{n.excerpt}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </>
  );
}
