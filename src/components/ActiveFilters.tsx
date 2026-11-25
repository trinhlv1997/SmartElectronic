import Link from "next/link";
import { formatPrice } from "@/lib/format";
import { countActiveFilters, filtersHref, type ProductFilters } from "@/lib/productFilters";
import type { CategoryInfo } from "@/lib/types";

/** Các bộ lọc đang bật dưới dạng chip, bấm × để bỏ từng cái; "Xóa tất cả" giữ lại cách sắp xếp. */
export default function ActiveFilters({ filters, categories }: { filters: ProductFilters; categories: CategoryInfo[] }) {
  if (countActiveFilters(filters) === 0) return null;

  const chips: { label: string; href: string }[] = [];
  if (filters.q) chips.push({ label: `“${filters.q}”`, href: filtersHref({ ...filters, q: undefined }) });
  if (filters.category) {
    const label = categories.find((c) => c.id === filters.category)?.label ?? filters.category;
    chips.push({ label, href: filtersHref({ ...filters, category: undefined }) });
  }
  if (filters.min !== undefined || filters.max !== undefined) {
    const label =
      filters.min !== undefined && filters.max !== undefined
        ? `${formatPrice(filters.min)} – ${formatPrice(filters.max)}`
        : filters.min !== undefined
          ? `Từ ${formatPrice(filters.min)}`
          : `Đến ${formatPrice(filters.max!)}`;
    chips.push({ label, href: filtersHref({ ...filters, min: undefined, max: undefined }) });
  }
  if (filters.inStock) chips.push({ label: "Còn hàng", href: filtersHref({ ...filters, inStock: undefined }) });
  if (filters.onSale) chips.push({ label: "Đang giảm giá", href: filtersHref({ ...filters, onSale: undefined }) });

  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className="text-sm text-slate-500">Đang lọc:</span>
      {chips.map((c) => (
        <Link
          key={c.label}
          href={c.href}
          scroll={false}
          className="group flex items-center gap-1.5 rounded-full border border-brand/30 bg-brand-50 py-1 pl-3 pr-2 text-sm text-brand hover:border-brand"
          aria-label={`Bỏ lọc ${c.label}`}
        >
          {c.label}
          <span className="flex h-5 w-5 items-center justify-center rounded-full text-xs group-hover:bg-brand group-hover:text-white">✕</span>
        </Link>
      ))}
      <Link href={filtersHref({ sort: filters.sort })} scroll={false} className="ml-1 text-sm font-semibold text-slate-600 underline-offset-4 hover:text-brand hover:underline">
        Xóa tất cả
      </Link>
    </div>
  );
}
