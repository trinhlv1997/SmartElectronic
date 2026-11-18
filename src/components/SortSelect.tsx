"use client";

import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { filtersHref, SORTS, type ProductFilters, type SortId } from "@/lib/productFilters";

export default function SortSelect({ filters }: { filters: ProductFilters }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  return (
    <label className="flex items-center gap-2 text-sm">
      <span className="text-slate-500">Sắp xếp:</span>
      <select
        value={filters.sort ?? ""}
        disabled={isPending}
        onChange={(e) => {
          const sort = (e.target.value || undefined) as SortId | undefined;
          startTransition(() => router.push(filtersHref({ ...filters, sort }), { scroll: false }));
        }}
        className="rounded-lg border border-slate-300 bg-white px-3 py-2 outline-none focus:border-brand"
      >
        <option value="">Mặc định</option>
        {SORTS.map((s) => (
          <option key={s.id} value={s.id}>{s.label}</option>
        ))}
      </select>
    </label>
  );
}
