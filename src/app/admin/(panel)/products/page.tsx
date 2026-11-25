import Link from "next/link";
import QuickEditRow from "@/components/admin/QuickEditRow";
import { isCategoryIn, labelOf } from "@/data/categories";
import { getCategories } from "@/server/categories";
import { normalizeText } from "@/lib/productFilters";
import { listAllProducts } from "@/server/products";

type SP = Promise<{ q?: string; category?: string; stock?: string; saved?: string }>;

export default async function AdminProductsPage({ searchParams }: { searchParams: SP }) {
  const { q, category, stock, saved } = await searchParams;
  const [all, categories] = await Promise.all([listAllProducts(), getCategories()]);
  const isCategory = isCategoryIn(categories);
  const categoryLabel = labelOf(categories);
  const tokens = q ? normalizeText(q).split(/\s+/).filter(Boolean) : [];
  const products = all.filter((p) => {
    if (isCategory(category) && p.category !== category) return false;
    if (stock === "0" && p.stock !== 0) return false;
    if (tokens.length && !tokens.every((t) => normalizeText(`${p.name} ${p.sku}`).includes(t))) return false;
    return true;
  });

  const input = "rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm outline-none focus:border-brand";

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-extrabold">Sản phẩm <span className="text-base font-normal text-slate-500">({products.length}/{all.length})</span></h1>
        <Link href="/admin/products/new" className="rounded-full bg-brand px-5 py-2.5 text-sm font-bold text-white hover:bg-brand-dark">
          + Thêm sản phẩm
        </Link>
      </div>

      {saved && <p className="rounded-lg bg-green-50 p-3 text-sm text-green-700">✓ Đã lưu “{saved}”.</p>}

      <form className="flex flex-wrap gap-2">
        <input name="q" defaultValue={q} placeholder="Tìm tên, mã..." className={`${input} min-w-48 flex-1`} />
        <select name="category" defaultValue={category ?? ""} className={input}>
          <option value="">Tất cả danh mục</option>
          {categories.map((c) => <option key={c.id} value={c.id}>{c.label}</option>)}
        </select>
        <select name="stock" defaultValue={stock ?? ""} className={input}>
          <option value="">Mọi tồn kho</option>
          <option value="0">Hết hàng</option>
        </select>
        <button className="rounded-lg bg-slate-800 px-4 text-sm font-semibold text-white">Lọc</button>
        {(q || category || stock) && <Link href="/admin/products" className="self-center text-sm text-slate-500 hover:text-brand">Xóa lọc</Link>}
      </form>

      <p className="text-xs text-slate-500">Sửa giá, giá gốc, tồn kho, hiển thị ngay trong bảng rồi bấm <b>Lưu</b>. Giá gốc để trống = không giảm giá.</p>

      <div className="overflow-x-auto rounded-2xl bg-white shadow-sm">
        <table className="w-full min-w-[900px] text-sm">
          <thead className="bg-slate-50 text-left text-xs uppercase text-slate-500">
            <tr>
              <th className="px-4 py-3">Sản phẩm</th>
              <th className="px-2 py-3">Danh mục</th>
              <th className="px-2 py-3">Giá bán (₫)</th>
              <th className="px-2 py-3">Giá gốc (₫)</th>
              <th className="px-2 py-3">Tồn kho</th>
              <th className="px-2 py-3 text-center">Hiển thị</th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {products.map((p) => (
              <QuickEditRow key={p.id} product={p} categoryLabel={categoryLabel(p.category)} />
            ))}
          </tbody>
        </table>
        {products.length === 0 && <p className="p-8 text-center text-slate-500">Không có sản phẩm phù hợp.</p>}
      </div>
    </div>
  );
}
