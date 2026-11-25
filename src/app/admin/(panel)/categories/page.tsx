import type { Metadata } from "next";
import CategoryManager from "@/components/admin/CategoryManager";
import { listCategoriesWithCounts } from "@/server/categories";

export const metadata: Metadata = { title: "Danh mục | LeMan", robots: { index: false } };

export default async function AdminCategoriesPage() {
  const categories = await listCategoriesWithCounts();
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-extrabold">Danh mục sản phẩm</h1>
      <CategoryManager categories={categories} />
    </div>
  );
}
