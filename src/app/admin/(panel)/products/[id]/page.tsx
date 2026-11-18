import Link from "next/link";
import { notFound } from "next/navigation";
import DeleteProductButton from "@/components/admin/DeleteProductButton";
import ProductForm from "@/components/admin/ProductForm";
import { specsToText } from "@/server/productForm";
import { getProductById } from "@/server/products";

export default async function EditProductPage({ params }: { params: Promise<{ id: string }> }) {
  const product = await getProductById((await params).id);
  if (!product) notFound();

  return (
    <div className="space-y-5">
      <Link href="/admin/products" className="text-sm text-slate-500 hover:text-brand">← Sản phẩm</Link>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-extrabold">Sửa: {product.name}</h1>
        <div className="flex items-center gap-3">
          {product.active && (
            <Link href={`/products/${product.slug}`} target="_blank" className="text-sm font-semibold text-brand hover:underline">Xem trên website ↗</Link>
          )}
          <DeleteProductButton id={product.id} name={product.name} />
        </div>
      </div>
      <ProductForm product={product} specsText={specsToText(product.specs)} />
    </div>
  );
}
