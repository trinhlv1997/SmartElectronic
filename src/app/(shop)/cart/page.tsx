"use client";

import Link from "next/link";
import { useCart } from "@/context/CartContext";
import ProductThumb from "@/components/ProductThumb";
import { formatPrice } from "@/lib/format";
import { useCartLines } from "@/lib/useCartLines";

export default function CartPage() {
  const { setQuantity, remove } = useCart();
  const { lines, subtotal, loading } = useCartLines();

  if (loading) return <p className="mx-auto max-w-7xl px-4 py-12 text-center text-slate-500">Đang tải giỏ hàng...</p>;

  if (lines.length === 0) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-20 text-center">
        <p className="text-5xl">🛒</p>
        <p className="mt-4 text-slate-600">Giỏ hàng của bạn đang trống.</p>
        <Link href="/products" className="mt-4 inline-block rounded-full bg-brand px-5 py-2 text-white hover:bg-brand-dark">
          Tiếp tục mua sắm
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto grid max-w-7xl gap-6 px-4 py-8 lg:grid-cols-3">
      <div className="space-y-3 lg:col-span-2">
        <h1 className="text-2xl font-bold">Giỏ hàng</h1>
        {lines.map(({ product, quantity }) => (
          <div key={product.id} className="flex items-center gap-4 rounded-xl bg-white p-4 shadow-sm">
            <ProductThumb product={product} className="h-16 w-16 text-3xl" />
            <div className="min-w-0 flex-1">
              <Link href={`/products/${product.slug}`} className="font-medium hover:text-brand">{product.name}</Link>
              <p className="text-sm text-red-600">{formatPrice(product.price)}</p>
            </div>
            <div className="flex items-center rounded-lg border border-slate-300">
              <button className="px-3 py-1" onClick={() => setQuantity(product.id, quantity - 1)} aria-label="Giảm">−</button>
              <span className="w-8 text-center">{quantity}</span>
              <button
                className="px-3 py-1 disabled:text-slate-300"
                disabled={quantity >= product.stock}
                onClick={() => setQuantity(product.id, quantity + 1)}
                aria-label="Tăng"
              >
                +
              </button>
            </div>
            <button onClick={() => remove(product.id)} className="text-sm text-slate-400 hover:text-red-500">Xoá</button>
          </div>
        ))}
      </div>

      <aside className="h-fit rounded-xl bg-white p-6 shadow-sm">
        <h2 className="mb-4 text-lg font-bold">Tóm tắt đơn hàng</h2>
        <div className="flex justify-between text-sm"><span>Tạm tính</span><span>{formatPrice(subtotal)}</span></div>
        <div className="flex justify-between text-sm text-green-600"><span>Phí vận chuyển</span><span>Miễn phí</span></div>
        <div className="mt-4 flex justify-between border-t border-slate-200 pt-4 font-bold">
          <span>Tổng cộng</span><span className="text-red-600">{formatPrice(subtotal)}</span>
        </div>
        <Link href="/checkout" className="mt-6 block rounded-full bg-brand py-3 text-center font-medium text-white hover:bg-brand-dark">
          Tiến hành đặt hàng
        </Link>
      </aside>
    </div>
  );
}
