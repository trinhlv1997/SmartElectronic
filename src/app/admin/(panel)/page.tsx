import Link from "next/link";
import OrderStatusBadge from "@/components/admin/OrderStatusBadge";
import { formatPrice } from "@/lib/format";
import { getDashboardStats, listOrders } from "@/server/orders";

export default async function AdminDashboard() {
  const [stats, recent] = await Promise.all([getDashboardStats(), listOrders(5)]);
  const cards = [
    { label: "Sản phẩm đang bán", value: `${stats.activeProducts}/${stats.products}`, href: "/admin/products" },
    { label: "Hết hàng", value: stats.outOfStock, href: "/admin/products?stock=0" },
    { label: "Đơn mới chờ xử lý", value: stats.pendingOrders, href: "/admin/orders" },
    { label: "Doanh thu (trừ đơn huỷ)", value: formatPrice(stats.revenue), href: "/admin/orders" },
  ];

  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-extrabold">Tổng quan</h1>
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {cards.map((c) => (
          <Link key={c.label} href={c.href} className="rounded-2xl bg-white p-5 shadow-sm hover:shadow-md">
            <p className="text-sm text-slate-500">{c.label}</p>
            <p className="mt-2 text-2xl font-extrabold">{c.value}</p>
          </Link>
        ))}
      </div>

      <section className="rounded-2xl bg-white p-5 shadow-sm">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-bold">Đơn hàng gần đây</h2>
          <Link href="/admin/orders" className="text-sm font-semibold text-brand">Xem tất cả →</Link>
        </div>
        {recent.length === 0 ? (
          <p className="text-sm text-slate-500">Chưa có đơn hàng.</p>
        ) : (
          <ul className="divide-y divide-slate-100">
            {recent.map((o) => (
              <li key={o.id} className="flex flex-wrap items-center gap-3 py-3 text-sm">
                <span className="font-mono font-semibold">{o.id}</span>
                <span className="text-slate-600">{o.customer.name}</span>
                <span className="ml-auto font-bold">{formatPrice(o.total)}</span>
                <OrderStatusBadge status={o.status} />
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
