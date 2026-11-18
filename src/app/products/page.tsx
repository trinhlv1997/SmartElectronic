import Link from "next/link";
import ProductCard from "@/components/ProductCard";
import { CATEGORIES, getProducts, isCategory, type ProductQuery } from "@/data/products";

const SORTS: { id: NonNullable<ProductQuery["sort"]>; label: string }[] = [
  { id: "price-asc", label: "Giá tăng dần" },
  { id: "price-desc", label: "Giá giảm dần" },
  { id: "rating", label: "Đánh giá cao" },
];

type SearchParams = Promise<{ category?: string; q?: string; sort?: string }>;

export default async function ProductsPage({ searchParams }: { searchParams: SearchParams }) {
  const params = await searchParams;
  const category = isCategory(params.category) ? params.category : undefined;
  const sort = SORTS.find((s) => s.id === params.sort)?.id;
  const q = params.q?.trim() || undefined;
  const products = getProducts({ category, q, sort });

  const buildHref = (patch: Record<string, string | undefined>) => {
    const next = new URLSearchParams();
    const merged = { category, q, sort, ...patch };
    for (const [k, v] of Object.entries(merged)) if (v) next.set(k, v);
    const qs = next.toString();
    return qs ? `/products?${qs}` : "/products";
  };

  const chip = (active: boolean) =>
    `rounded-full border px-3 py-1 text-sm ${active ? "border-brand bg-brand text-white" : "border-slate-300 bg-white hover:border-brand"}`;

  return (
    <div className="mx-auto max-w-7xl space-y-6 px-4 py-8">
      <h1 className="text-2xl font-extrabold uppercase">{q ? `Kết quả cho “${q}”` : "Tất cả sản phẩm"}</h1>

      <div className="flex flex-wrap gap-2">
        <Link href={buildHref({ category: undefined })} className={chip(!category)}>Tất cả</Link>
        {CATEGORIES.map((c) => (
          <Link key={c.id} href={buildHref({ category: c.id })} className={chip(category === c.id)}>
            {c.icon} {c.label}
          </Link>
        ))}
      </div>

      <div className="flex flex-wrap items-center gap-2 text-sm">
        <span className="text-slate-500">Sắp xếp:</span>
        {SORTS.map((s) => (
          <Link key={s.id} href={buildHref({ sort: sort === s.id ? undefined : s.id })} className={chip(sort === s.id)}>
            {s.label}
          </Link>
        ))}
      </div>

      {products.length === 0 ? (
        <p className="py-12 text-center text-slate-500">Không tìm thấy sản phẩm phù hợp.</p>
      ) : (
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          {products.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      )}
    </div>
  );
}
