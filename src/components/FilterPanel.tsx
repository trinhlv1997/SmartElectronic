"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState, useTransition } from "react";
import { CATEGORIES } from "@/data/categories";
import { countActiveFilters, filtersHref, PRICE_RANGES, type ProductFilters } from "@/lib/productFilters";
import type { Category } from "@/lib/types";

interface Props {
  filters: ProductFilters;
  categoryCounts: Record<Category, number>;
}

export default function FilterPanel({ filters, categoryCounts }: Props) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [q, setQ] = useState(filters.q ?? "");
  const [min, setMin] = useState(filters.min?.toString() ?? "");
  const [max, setMax] = useState(filters.max?.toString() ?? "");

  // Đồng bộ ô nhập khi URL đổi từ bên ngoài (xoá chip, nút Back, ô tìm kiếm trên header).
  useEffect(() => {
    setQ(filters.q ?? "");
    setMin(filters.min?.toString() ?? "");
    setMax(filters.max?.toString() ?? "");
  }, [filters.q, filters.min, filters.max]);

  const apply = (patch: Partial<ProductFilters>) => {
    startTransition(() => router.push(filtersHref({ ...filters, ...patch }), { scroll: false }));
  };

  const activeCount = countActiveFilters(filters);
  const toNum = (v: string) => {
    const n = Number(v.replace(/[^\d]/g, ""));
    return n > 0 ? n : undefined;
  };
  const isRange = (r: { min?: number; max?: number }) => r.min === filters.min && r.max === filters.max;

  const sectionTitle = "mb-3 text-sm font-bold uppercase tracking-wide";
  const optionRow = "flex cursor-pointer items-center gap-2.5 rounded-lg px-2 py-1.5 text-sm hover:bg-brand-50";
  const input = "w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-brand";

  return (
    <>
      <button
        type="button"
        onClick={() => setMobileOpen((v) => !v)}
        className="flex w-full items-center justify-between rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm font-bold uppercase lg:hidden"
        aria-expanded={mobileOpen}
      >
        <span>⚙ Bộ lọc {activeCount > 0 && <span className="ml-1 rounded-full bg-brand px-2 py-0.5 text-xs text-white">{activeCount}</span>}</span>
        <span>{mobileOpen ? "▲" : "▼"}</span>
      </button>

      <aside
        className={`${mobileOpen ? "block" : "hidden"} space-y-6 rounded-2xl border border-slate-200 bg-white p-5 lg:sticky lg:top-32 lg:block ${isPending ? "opacity-70" : ""}`}
        aria-busy={isPending}
      >
        <div className="flex items-center justify-between">
          <p className="font-extrabold uppercase">Bộ lọc</p>
          {isPending && <span className="text-xs text-slate-500">Đang lọc...</span>}
        </div>

        {/* Từ khoá */}
        <form
          role="search"
          onSubmit={(e) => {
            e.preventDefault();
            apply({ q: q.trim() || undefined });
          }}
        >
          <p className={sectionTitle}>Từ khoá</p>
          <div className="flex gap-2">
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Tên, mã sản phẩm..."
              className={input}
              aria-label="Từ khoá tìm kiếm"
            />
            <button className="shrink-0 rounded-lg bg-brand px-3 text-sm font-semibold text-white hover:bg-brand-dark">Tìm</button>
          </div>
        </form>

        {/* Danh mục */}
        <fieldset>
          <legend className={sectionTitle}>Danh mục</legend>
          <label className={optionRow}>
            <input type="radio" name="category" className="accent-brand" checked={!filters.category} onChange={() => apply({ category: undefined })} />
            <span className="flex-1">Tất cả</span>
          </label>
          {CATEGORIES.map((c) => (
            <label key={c.id} className={`${optionRow} ${categoryCounts[c.id] === 0 && filters.category !== c.id ? "opacity-50" : ""}`}>
              <input
                type="radio"
                name="category"
                className="accent-brand"
                checked={filters.category === c.id}
                onChange={() => apply({ category: c.id })}
              />
              <span className="flex-1">{c.label}</span>
              <span className="text-xs text-slate-400">{categoryCounts[c.id]}</span>
            </label>
          ))}
        </fieldset>

        {/* Khoảng giá */}
        <fieldset>
          <legend className={sectionTitle}>Khoảng giá</legend>
          {PRICE_RANGES.map((r) => (
            <label key={r.label} className={optionRow}>
              <input
                type="radio"
                name="price"
                className="accent-brand"
                checked={isRange(r)}
                onChange={() => apply({ min: r.min, max: r.max })}
              />
              {r.label}
            </label>
          ))}
          <form
            className="mt-3 space-y-2"
            onSubmit={(e) => {
              e.preventDefault();
              apply({ min: toNum(min), max: toNum(max) });
            }}
          >
            <div className="flex items-center gap-2">
              <input value={min} onChange={(e) => setMin(e.target.value)} inputMode="numeric" placeholder="Từ ₫" className={input} aria-label="Giá từ" />
              <span className="text-slate-400">–</span>
              <input value={max} onChange={(e) => setMax(e.target.value)} inputMode="numeric" placeholder="Đến ₫" className={input} aria-label="Giá đến" />
            </div>
            <button className="w-full rounded-lg border border-brand py-1.5 text-sm font-semibold text-brand hover:bg-brand-50">Áp dụng khoảng giá</button>
          </form>
        </fieldset>

        {/* Tình trạng */}
        <fieldset>
          <legend className={sectionTitle}>Tình trạng</legend>
          <label className={optionRow}>
            <input type="checkbox" className="accent-brand" checked={!!filters.inStock} onChange={(e) => apply({ inStock: e.target.checked || undefined })} />
            Còn hàng
          </label>
          <label className={optionRow}>
            <input type="checkbox" className="accent-brand" checked={!!filters.onSale} onChange={(e) => apply({ onSale: e.target.checked || undefined })} />
            Đang giảm giá
          </label>
        </fieldset>

        <button
          type="button"
          disabled={activeCount === 0}
          onClick={() => apply({ q: undefined, category: undefined, min: undefined, max: undefined, inStock: undefined, onSale: undefined })}
          className="w-full rounded-full bg-slate-800 py-2.5 text-sm font-bold text-white hover:bg-slate-900 disabled:cursor-not-allowed disabled:bg-slate-200 disabled:text-slate-400"
        >
          ✕ Xóa bộ lọc {activeCount > 0 && `(${activeCount})`}
        </button>
      </aside>
    </>
  );
}
