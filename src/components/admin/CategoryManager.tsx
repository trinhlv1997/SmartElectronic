"use client";

import { useActionState, useEffect, useState } from "react";
import { deleteCategoryAction, saveCategoryAction } from "@/app/admin/actions";
import { normalizeText } from "@/lib/productFilters";
import type { CategoryInfo } from "@/lib/types";

type Row = CategoryInfo & { productCount: number };

const input = "w-full rounded-lg border px-3 py-2 text-sm outline-none focus:border-brand";
const errCls = (has?: string) => `${input} ${has ? "border-red-400" : "border-slate-300"}`;
const toSlug = (s: string) => normalizeText(s).replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 40);

function Feedback({ error, message }: { error?: string; message?: string }) {
  if (error) return <p className="text-xs text-red-600">{error}</p>;
  if (message) return <p className="text-xs text-green-700">✓ {message}</p>;
  return null;
}

function NewCategoryForm({ nextOrder }: { nextOrder: number }) {
  const [state, action, pending] = useActionState(saveCategoryAction.bind(null, null), undefined);
  const [label, setLabel] = useState("");
  const [id, setId] = useState("");
  const [idTouched, setIdTouched] = useState(false);
  const err = state?.errors ?? {};

  // clear the form after a successful create
  useEffect(() => {
    if (state?.message) {
      setLabel("");
      setId("");
      setIdTouched(false);
    }
  }, [state]);

  return (
    <form action={action} className="space-y-4 rounded-2xl bg-white p-5 shadow-sm">
      <h2 className="font-bold">Thêm danh mục</h2>
      <div className="grid gap-3 sm:grid-cols-[1fr_1fr_90px_90px_auto] sm:items-start">
        <label className="text-sm font-medium">
          Tên danh mục *
          <input
            name="label"
            value={label}
            onChange={(e) => {
              setLabel(e.target.value);
              if (!idTouched) setId(toSlug(e.target.value));
            }}
            placeholder="Đèn tường LED"
            className={`mt-1 ${errCls(err.label)}`}
          />
          {err.label && <span className="mt-1 block text-xs text-red-600">{err.label}</span>}
        </label>
        <label className="text-sm font-medium">
          Mã (dùng trong link) *
          <input
            name="id"
            value={id}
            onChange={(e) => {
              setIdTouched(true);
              setId(e.target.value.toLowerCase());
            }}
            placeholder="den-tuong-led"
            className={`mt-1 font-mono ${errCls(err.id)}`}
          />
          {err.id && <span className="mt-1 block text-xs text-red-600">{err.id}</span>}
        </label>
        <label className="text-sm font-medium">
          Biểu tượng
          <input name="icon" defaultValue="💡" className={`mt-1 text-center text-lg ${errCls(err.icon)}`} />
        </label>
        <label className="text-sm font-medium">
          Thứ tự
          <input name="sortOrder" type="number" min={0} defaultValue={nextOrder} className={`mt-1 ${errCls(err.sortOrder)}`} />
        </label>
        <button disabled={pending} className="mt-6 rounded-full bg-brand px-5 py-2 text-sm font-bold text-white hover:bg-brand-dark disabled:opacity-60">
          {pending ? "Đang thêm..." : "+ Thêm"}
        </button>
      </div>
      <p className="text-xs text-slate-500">Mã chỉ gồm chữ thường không dấu, số, dấu gạch ngang và không đổi được sau khi tạo.</p>
      <Feedback error={state?.error} message={state?.message} />
    </form>
  );
}

function CategoryRow({ c }: { c: Row }) {
  const [state, action, pending] = useActionState(saveCategoryAction.bind(null, c.id), undefined);
  const [delState, delAction, deleting] = useActionState(deleteCategoryAction.bind(null, c.id), undefined);
  const err = state?.errors ?? {};
  const inUse = c.productCount > 0;

  return (
    <tr className="border-t border-slate-100 align-top">
      <td className="px-3 py-3" colSpan={4}>
        <form action={action} className="grid gap-2 sm:grid-cols-[64px_1fr_90px_auto] sm:items-center">
          <input name="icon" defaultValue={c.icon} aria-label="Biểu tượng" className={`text-center text-lg ${errCls(err.icon)}`} />
          <div>
            <input name="label" defaultValue={c.label} aria-label="Tên danh mục" className={errCls(err.label)} />
            {err.label && <span className="mt-1 block text-xs text-red-600">{err.label}</span>}
          </div>
          <input name="sortOrder" type="number" min={0} defaultValue={c.sortOrder} aria-label="Thứ tự" className={errCls(err.sortOrder)} />
          <button disabled={pending} className="rounded-full border border-brand px-4 py-1.5 text-sm font-semibold text-brand hover:bg-brand-50 disabled:opacity-60">
            {pending ? "Đang lưu..." : "Lưu"}
          </button>
          <div className="sm:col-span-4">
            <Feedback error={state?.error ?? (err.icon || err.sortOrder)} message={state?.message} />
          </div>
        </form>
      </td>
      <td className="px-3 py-3 font-mono text-xs text-slate-500">{c.id}</td>
      <td className="px-3 py-3 text-center">
        <a href={`/admin/products?category=${c.id}`} className="text-brand hover:underline">{c.productCount}</a>
      </td>
      <td className="px-3 py-3 text-right">
        <form
          action={delAction}
          onSubmit={(e) => {
            if (!confirm(`Xóa danh mục “${c.label}”?`)) e.preventDefault();
          }}
        >
          <button
            disabled={inUse || deleting}
            title={inUse ? "Còn sản phẩm trong danh mục — không xóa được" : "Xóa danh mục"}
            className="rounded-full border border-red-300 bg-red-50 px-3 py-1.5 text-sm text-red-600 hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-40"
          >
            Xóa
          </button>
        </form>
        <Feedback error={delState?.error} message={delState?.message} />
      </td>
    </tr>
  );
}

export default function CategoryManager({ categories }: { categories: Row[] }) {
  const nextOrder = (categories.at(-1)?.sortOrder ?? 0) + 10;
  return (
    <div className="space-y-6">
      <NewCategoryForm nextOrder={nextOrder} />
      <div className="overflow-x-auto rounded-2xl bg-white shadow-sm">
        <table className="w-full min-w-[760px] text-sm">
          <thead className="bg-slate-50 text-left text-xs uppercase text-slate-500">
            <tr>
              <th className="px-3 py-3" colSpan={4}>Biểu tượng · Tên · Thứ tự</th>
              <th className="px-3 py-3">Mã</th>
              <th className="px-3 py-3 text-center">Sản phẩm</th>
              <th className="px-3 py-3" />
            </tr>
          </thead>
          <tbody>
            {categories.map((c) => (
              // keyed by id only: a save re-renders the list but keeps the row (and its "Đã lưu" message)
              <CategoryRow key={c.id} c={c} />
            ))}
          </tbody>
        </table>
        {categories.length === 0 && <p className="p-6 text-center text-sm text-slate-500">Chưa có danh mục nào.</p>}
      </div>
      <p className="text-xs text-slate-500">
        Danh mục hiển thị theo <strong>Thứ tự</strong> tăng dần ở menu Sản phẩm, trang chủ, bộ lọc và chân trang. Chỉ xóa được danh mục không còn sản phẩm.
      </p>
    </div>
  );
}
