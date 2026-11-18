import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import AddToCartButton from "@/components/AddToCartButton";
import { CATEGORIES } from "@/data/categories";
import { getActiveProductBySlug } from "@/server/products";
import { discountPercent, formatPrice } from "@/lib/format";

type Params = Promise<{ slug: string }>;

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const product = await getActiveProductBySlug((await params).slug);
  return { title: product ? `${product.name} | SmartElectronic` : "Không tìm thấy sản phẩm" };
}

export default async function ProductDetailPage({ params }: { params: Params }) {
  const product = await getActiveProductBySlug((await params).slug);
  if (!product) notFound();

  const category = CATEGORIES.find((c) => c.id === product.category);
  const discount = discountPercent(product.price, product.oldPrice);

  return (
    <div className="mx-auto max-w-7xl space-y-8 px-4 py-8">
      <nav className="text-sm text-slate-500">
        <Link href="/" className="hover:text-brand">Trang chủ</Link> /{" "}
        <Link href={`/products?category=${product.category}`} className="hover:text-brand">{category?.label}</Link> /{" "}
        <span className="text-slate-800">{product.name}</span>
      </nav>

      <div className="grid gap-8 md:grid-cols-2">
        <div className="flex aspect-square items-center justify-center overflow-hidden rounded-2xl bg-slate-50 text-[10rem] shadow-sm">
          {product.imageUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={product.imageUrl} alt={product.name} className="h-full w-full object-contain" />
          ) : (
            product.icon
          )}
        </div>
        <div className="space-y-4">
          <p className="text-sm text-slate-500">Mã sản phẩm: <strong>{product.sku}</strong></p>
          <h1 className="text-3xl font-extrabold">{product.name}</h1>
          <p className="text-amber-500">★ {product.rating.toFixed(1)}</p>
          <div className="flex items-baseline gap-3">
            <span className="text-3xl font-bold text-red-600">{formatPrice(product.price)}</span>
            {product.oldPrice && <span className="text-slate-400 line-through">{formatPrice(product.oldPrice)}</span>}
            {discount && <span className="rounded bg-red-100 px-2 py-0.5 text-sm font-semibold text-red-600">-{discount}%</span>}
          </div>
          <p className={product.stock > 0 ? "text-green-600" : "text-red-500"}>
            {product.stock > 0 ? `Còn hàng (${product.stock})` : "Tạm hết hàng"}
          </p>
          <p className="text-slate-700">{product.description}</p>
          <AddToCartButton productId={product.id} disabled={product.stock === 0} className="px-8 py-3 text-base" />
        </div>
      </div>

      <section className="rounded-xl bg-white p-6 shadow-sm">
        <h2 className="mb-4 text-lg font-bold">Thông số kỹ thuật</h2>
        <table className="w-full text-sm">
          <tbody>
            {Object.entries(product.specs).map(([k, v]) => (
              <tr key={k} className="border-b border-slate-100 last:border-0">
                <td className="w-1/3 py-2 text-slate-500">{k}</td>
                <td className="py-2">{v}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </div>
  );
}
