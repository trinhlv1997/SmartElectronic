"use client";

import Link from "next/link";
import { useState } from "react";
import { useCart } from "@/context/CartContext";
import { formatPrice } from "@/lib/format";
import { useCartLines } from "@/lib/useCartLines";

export default function CheckoutPage() {
  const { items, hydrated, clear } = useCart();
  const { lines, subtotal } = useCartLines();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [orderId, setOrderId] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    const form = new FormData(e.currentTarget);
    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customer: {
            name: form.get("name"),
            phone: form.get("phone"),
            address: form.get("address"),
            note: form.get("note"),
          },
          items,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Đặt hàng thất bại.");
      setOrderId(data.order.id);
      clear();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Đặt hàng thất bại.");
    } finally {
      setSubmitting(false);
    }
  }

  if (orderId) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-20 text-center">
        <p className="text-5xl">✅</p>
        <h1 className="mt-4 text-2xl font-bold">Đặt hàng thành công!</h1>
        <p className="mt-2 text-slate-600">Mã đơn hàng: <strong>{orderId}</strong>. Chúng tôi sẽ gọi xác nhận trong thời gian sớm nhất.</p>
        <Link href="/products" className="mt-6 inline-block text-brand hover:underline">← Tiếp tục mua sắm</Link>
      </div>
    );
  }

  if (!hydrated) return <p className="mx-auto max-w-7xl px-4 py-12 text-center text-slate-500">Đang tải...</p>;

  if (lines.length === 0) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-20 text-center">
        <p className="text-slate-600">Giỏ hàng trống, chưa thể đặt hàng.</p>
        <Link href="/products" className="mt-4 inline-block text-brand hover:underline">← Xem sản phẩm</Link>
      </div>
    );
  }

  const input = "w-full rounded-lg border border-slate-300 px-3 py-2 outline-none focus:border-brand";

  return (
    <div className="mx-auto grid max-w-7xl gap-6 px-4 py-8 lg:grid-cols-3">
      <form onSubmit={handleSubmit} className="space-y-4 rounded-xl bg-white p-6 shadow-sm lg:col-span-2">
        <h1 className="text-2xl font-bold">Thông tin giao hàng</h1>
        <label className="block text-sm">Họ và tên<input name="name" required className={`mt-1 ${input}`} /></label>
        <label className="block text-sm">
          Số điện thoại
          <input name="phone" required pattern="0\d{9}" title="10 số, bắt đầu bằng 0" inputMode="tel" className={`mt-1 ${input}`} />
        </label>
        <label className="block text-sm">Địa chỉ nhận hàng<input name="address" required className={`mt-1 ${input}`} /></label>
        <label className="block text-sm">Ghi chú<textarea name="note" rows={3} className={`mt-1 ${input}`} /></label>
        <p className="text-sm text-slate-500">Thanh toán khi nhận hàng (COD).</p>
        {error && <p className="rounded-lg bg-red-50 p-3 text-sm text-red-600">{error}</p>}
        <button
          type="submit"
          disabled={submitting}
          className="w-full rounded-full bg-brand py-3 font-medium text-white hover:bg-brand-dark disabled:bg-slate-400"
        >
          {submitting ? "Đang gửi..." : `Đặt hàng · ${formatPrice(subtotal)}`}
        </button>
      </form>

      <aside className="h-fit space-y-3 rounded-xl bg-white p-6 shadow-sm">
        <h2 className="text-lg font-bold">Đơn hàng ({lines.length} sản phẩm)</h2>
        {lines.map(({ product, quantity }) => (
          <div key={product.id} className="flex justify-between gap-2 text-sm">
            <span>{product.name} × {quantity}</span>
            <span className="shrink-0">{formatPrice(product.price * quantity)}</span>
          </div>
        ))}
        <div className="flex justify-between border-t border-slate-200 pt-3 font-bold">
          <span>Tổng cộng</span><span className="text-red-600">{formatPrice(subtotal)}</span>
        </div>
      </aside>
    </div>
  );
}
