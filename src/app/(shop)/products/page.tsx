import type { Metadata } from "next";
import Link from "next/link";
import ActiveFilters from "@/components/ActiveFilters";
import FilterPanel from "@/components/FilterPanel";
import PageBanner from "@/components/PageBanner";
import ProductCard from "@/components/ProductCard";
import SortSelect from "@/components/SortSelect";
import { CATEGORIES, isCategory } from "@/data/categories";
import { filtersHref, parseFilters } from "@/lib/productFilters";
import { searchProducts } from "@/server/products";

type SearchParams = Promise<Record<string, string | string[] | undefined>>;

export const metadata: Metadata = { title: "Sản phẩm | SmartElectronic" };

export default async function ProductsPage({ searchParams }: { searchParams: SearchParams }) {
  const filters = parseFilters(await searchParams, isCategory);
  const { products, categoryCounts } = await searchProducts(filters);
  const categoryLabel = CATEGORIES.find((c) => c.id === filters.category)?.label;
  const title = filters.q ? `Kết quả cho “${filters.q}”` : (categoryLabel ?? "Tất cả sản phẩm");

  return (
    <>
      <PageBanner title={title} crumbs={[{ label: "Sản phẩm", href: categoryLabel || filters.q ? "/products" : undefined }, ...(categoryLabel ? [{ label: categoryLabel }] : [])]} />
      <div className="mx-auto grid max-w-7xl gap-6 px-4 py-8 lg:grid-cols-[270px_1fr]">
        <div>
          <FilterPanel filters={filters} categoryCounts={categoryCounts} />
        </div>

        <div className="min-w-0 space-y-5">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <p className="text-sm text-slate-600">
              Tìm thấy <strong className="text-ink">{products.length}</strong> sản phẩm
            </p>
            <SortSelect filters={filters} />
          </div>

          <ActiveFilters filters={filters} />

          {products.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-slate-300 py-16 text-center">
              <p className="text-5xl">🔍</p>
              <p className="mt-4 font-semibold">Không tìm thấy sản phẩm phù hợp</p>
              <p className="mt-1 text-sm text-slate-500">Hãy thử từ khoá khác hoặc bỏ bớt bộ lọc.</p>
              <Link
                href={filtersHref({ sort: filters.sort })}
                className="mt-5 inline-block rounded-full bg-brand px-6 py-2.5 text-sm font-bold text-white hover:bg-brand-dark"
              >
                Xóa bộ lọc
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-4 xl:grid-cols-3">
              {products.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
