import Link from "next/link";
import ProductForm from "@/components/admin/ProductForm";

export default function NewProductPage() {
  return (
    <div className="space-y-5">
      <Link href="/admin/products" className="text-sm text-slate-500 hover:text-brand">← Sản phẩm</Link>
      <h1 className="text-2xl font-extrabold">Thêm sản phẩm</h1>
      <ProductForm />
    </div>
  );
}
