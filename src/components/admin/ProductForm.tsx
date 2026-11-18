"use client";

import Link from "next/link";
import { useActionState, useState } from "react";
import { saveProductAction } from "@/app/admin/actions";
import { CATEGORIES } from "@/data/categories";
import type { Product } from "@/lib/types";

export default function ProductForm({ product, specsText }: { product?: Product; specsText?: string }) {
  const [state, action, pending] = useActionState(saveProductAction.bind(null, product?.id ?? null), undefined);
  const [imageUrl, setImageUrl] = useState(product?.imageUrl ?? "");
  const err = state?.errors ?? {};

  const input = "mt-1 w-full rounded-lg border px-3 py-2 text-sm outline-none focus:border-brand";
  const cls = (k: string) => `${input} ${err[k] ? "border-red-400" : "border-slate-300"}`;
  const Err = ({ k }: { k: string }) => (err[k] ? <span className="mt-1 block text-xs text-red-600">{err[k]}</span> : null);
  const label = "block text-sm font-medium";

  return (
    <form action={action} className="grid gap-6 lg:grid-cols-3">
      <div className="space-y-5 rounded-2xl bg-white p-6 shadow-sm lg:col-span-2">
        <h2 className="font-bold">Thông tin sản phẩm</h2>
        <label className={label}>Tên sản phẩm *<input name="name" defaultValue={product?.name} className={cls("name")} /><Err k="name" /></label>
        <div className="grid gap-4 sm:grid-cols-2">
          <label className={label}>Mã sản phẩm (SKU) *<input name="sku" defaultValue={product?.sku} className={cls("sku")} /><Err k="sku" /></label>
          <label className={label}>
            Slug (URL)
            <input name="slug" defaultValue={product?.slug} placeholder="tự tạo từ tên nếu bỏ trống" className={cls("slug")} />
            <Err k="slug" />
          </label>
        </div>
        <label className={label}>
          Danh mục *
          <select name="category" defaultValue={product?.category ?? ""} className={cls("category")}>
            <option value="" disabled>Chọn danh mục</option>
            {CATEGORIES.map((c) => <option key={c.id} value={c.id}>{c.icon} {c.label}</option>)}
          </select>
          <Err k="category" />
        </label>
        <label className={label}>Mô tả<textarea name="description" rows={4} defaultValue={product?.description} className={cls("description")} /></label>
        <label className={label}>
          Thông số kỹ thuật <span className="font-normal text-slate-500">(mỗi dòng “Tên: Giá trị”)</span>
          <textarea name="specs" rows={6} defaultValue={specsText} placeholder={"Công suất: 9W\nNhiệt độ màu: 6500K"} className={`${cls("specs")} font-mono`} />
        </label>
      </div>

      <div className="space-y-6">
        <div className="space-y-4 rounded-2xl bg-white p-6 shadow-sm">
          <h2 className="font-bold">Giá & tồn kho</h2>
          <label className={label}>Giá bán (₫) *<input name="price" inputMode="numeric" defaultValue={product?.price} className={cls("price")} /><Err k="price" /></label>
          <label className={label}>
            Giá gốc (₫) <span className="font-normal text-slate-500">— để trống nếu không giảm</span>
            <input name="oldPrice" inputMode="numeric" defaultValue={product?.oldPrice ?? ""} className={cls("oldPrice")} />
            <Err k="oldPrice" />
          </label>
          <label className={label}>Tồn kho *<input name="stock" inputMode="numeric" defaultValue={product?.stock ?? 0} className={cls("stock")} /><Err k="stock" /></label>
        </div>

        <div className="space-y-4 rounded-2xl bg-white p-6 shadow-sm">
          <h2 className="font-bold">Hiển thị</h2>
          <label className="flex items-center gap-2 text-sm"><input type="checkbox" name="active" defaultChecked={product?.active ?? true} className="h-4 w-4 accent-brand" /> Hiển thị trên website</label>
          <label className="flex items-center gap-2 text-sm"><input type="checkbox" name="featured" defaultChecked={product?.featured} className="h-4 w-4 accent-brand" /> Sản phẩm nổi bật (trang chủ)</label>
          <div className="grid grid-cols-2 gap-3">
            <label className={label}>Thứ tự<input name="sortOrder" inputMode="numeric" defaultValue={product?.sortOrder ?? 0} className={cls("sortOrder")} /><Err k="sortOrder" /></label>
            <label className={label}>Đánh giá<input name="rating" inputMode="decimal" defaultValue={product?.rating ?? 5} className={cls("rating")} /><Err k="rating" /></label>
          </div>
          <label className={label}>Biểu tượng (emoji)<input name="icon" defaultValue={product?.icon ?? "📦"} className={cls("icon")} /></label>
          <label className={label}>
            URL ảnh <span className="font-normal text-slate-500">(tuỳ chọn)</span>
            <input name="imageUrl" value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} placeholder="https://..." className={cls("imageUrl")} />
            <Err k="imageUrl" />
          </label>
          {/^https?:\/\//.test(imageUrl) && (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={imageUrl} alt="Xem trước" className="h-32 w-full rounded-lg bg-slate-50 object-contain" />
          )}
        </div>

        {state?.error && <p className="rounded-lg bg-red-50 p-3 text-sm text-red-600">{state.error}</p>}
        <div className="flex gap-3">
          <button disabled={pending} className="flex-1 rounded-full bg-brand py-3 font-bold text-white hover:bg-brand-dark disabled:opacity-60">
            {pending ? "Đang lưu..." : product ? "Lưu thay đổi" : "Tạo sản phẩm"}
          </button>
          <Link href="/admin/products" className="rounded-full border border-slate-300 px-5 py-3 text-sm font-semibold hover:bg-slate-50">Huỷ</Link>
        </div>
      </div>
    </form>
  );
}
