import Link from "next/link";
import { notFound } from "next/navigation";
import DeleteProductButton from "@/components/admin/DeleteProductButton";
import ImageManager from "@/components/admin/ImageManager";
import ProductForm from "@/components/admin/ProductForm";
import { getCategories } from "@/server/categories";
import { specsToText } from "@/server/productForm";
import { getProductById } from "@/server/products";

export default async function EditProductPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ created?: string }>;
}) {
  const [product, categories] = await Promise.all([getProductById((await params).id), getCategories()]);
  const { created } = await searchParams;
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
      {created && <p className="rounded-lg bg-green-50 p-3 text-sm text-green-700">✓ Đã tạo sản phẩm. Thêm hình ảnh bên dưới.</p>}
      <ImageManager productId={product.id} images={product.images} />
      <ProductForm product={product} specsText={specsToText(product.specs)} categories={categories} />
    </div>
  );
}
