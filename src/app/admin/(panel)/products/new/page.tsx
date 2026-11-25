import Link from "next/link";
import ProductForm from "@/components/admin/ProductForm";
import { getCategories } from "@/server/categories";

export default async function NewProductPage() {
  const categories = await getCategories();
  return (
    <div className="space-y-5">
      <Link href="/admin/products" className="text-sm text-slate-500 hover:text-brand">← Sản phẩm</Link>
      <h1 className="text-2xl font-extrabold">Thêm sản phẩm</h1>
      {categories.length === 0 ? (
        <p className="rounded-lg bg-amber-50 p-4 text-sm text-amber-800">
          Chưa có danh mục nào. <Link href="/admin/categories" className="font-semibold underline">Tạo danh mục</Link> trước khi thêm sản phẩm.
        </p>
      ) : (
        <ProductForm categories={categories} />
      )}
    </div>
  );
}
