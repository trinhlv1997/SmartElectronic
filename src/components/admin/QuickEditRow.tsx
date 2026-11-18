"use client";

import Link from "next/link";
import { useActionState } from "react";
import { quickUpdateAction } from "@/app/admin/actions";
import ProductThumb from "@/components/ProductThumb";
import type { Product } from "@/lib/types";

export default function QuickEditRow({ product: p, categoryLabel }: { product: Product; categoryLabel: string }) {
  const [state, action, pending] = useActionState(quickUpdateAction.bind(null, p.id), undefined);
  const formId = `quick-${p.id}`;
  const input = "w-full rounded-md border border-slate-300 px-2 py-1.5 text-right outline-none focus:border-brand";

  return (
    <tr className={p.active ? "" : "bg-slate-50 text-slate-400"}>
      <td className="px-4 py-3">
        <div className="flex items-center gap-3">
          <ProductThumb product={p} className="h-10 w-10 text-xl" />
          <div className="min-w-0">
            <Link href={`/admin/products/${p.id}`} className="font-semibold text-ink hover:text-brand">{p.name}</Link>
            <p className="text-xs text-slate-500">{p.sku}{p.featured && " · ⭐ Nổi bật"}</p>
          </div>
        </div>
        {/* form nằm trong ô, các input bên dưới gắn vào bằng thuộc tính form= */}
        <form id={formId} action={action} />
      </td>
      <td className="px-2 py-3 text-slate-600">{categoryLabel}</td>
      <td className="w-32 px-2 py-3">
        <input form={formId} name="price" defaultValue={p.price} inputMode="numeric" className={input} aria-label="Giá bán" />
      </td>
      <td className="w-32 px-2 py-3">
        <input form={formId} name="oldPrice" defaultValue={p.oldPrice ?? ""} inputMode="numeric" placeholder="—" className={input} aria-label="Giá gốc" />
      </td>
      <td className="w-24 px-2 py-3">
        <input form={formId} name="stock" defaultValue={p.stock} inputMode="numeric" className={`${input} ${p.stock === 0 ? "border-red-300 text-red-600" : ""}`} aria-label="Tồn kho" />
      </td>
      <td className="px-2 py-3 text-center">
        <input form={formId} type="checkbox" name="active" defaultChecked={p.active} className="h-4 w-4 accent-brand" aria-label="Hiển thị trên website" />
      </td>
      <td className="whitespace-nowrap px-4 py-3 text-right">
        <button form={formId} disabled={pending} className="rounded-md bg-brand px-3 py-1.5 text-xs font-bold text-white hover:bg-brand-dark disabled:opacity-60">
          {pending ? "..." : "Lưu"}
        </button>
        <Link href={`/admin/products/${p.id}`} className="ml-2 text-xs font-semibold text-slate-500 hover:text-brand">Sửa</Link>
        {state?.error && <p className="mt-1 text-xs text-red-600">{state.error}</p>}
        {state?.message && !pending && <p className="mt-1 text-xs text-green-600">✓ {state.message}</p>}
      </td>
    </tr>
  );
}
