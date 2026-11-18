import OrderStatusForm from "@/components/admin/OrderStatusForm";
import { formatPrice } from "@/lib/format";
import { listOrders } from "@/server/orders";

export default async function AdminOrdersPage() {
  const orders = await listOrders(100);

  return (
    <div className="space-y-5">
      <h1 className="text-2xl font-extrabold">Đơn hàng <span className="text-base font-normal text-slate-500">({orders.length} gần nhất)</span></h1>
      <p className="text-xs text-slate-500">Chuyển đơn sang “Đã huỷ” sẽ hoàn lại tồn kho; mở lại đơn đã huỷ sẽ trừ tồn kho lần nữa.</p>
      {orders.length === 0 && <p className="rounded-2xl bg-white p-8 text-center text-slate-500 shadow-sm">Chưa có đơn hàng.</p>}
      <div className="space-y-4">
        {orders.map((o) => (
          <article key={o.id} className="rounded-2xl bg-white p-5 shadow-sm">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="font-mono font-bold">{o.id}</p>
                <p className="text-xs text-slate-500">{new Date(o.createdAt).toLocaleString("vi-VN", { timeZone: "Asia/Ho_Chi_Minh" })}</p>
              </div>
              <OrderStatusForm id={o.id} status={o.status} />
            </div>
            <div className="mt-4 grid gap-4 text-sm md:grid-cols-2">
              <div className="space-y-1">
                <p><span className="text-slate-500">Khách:</span> <b>{o.customer.name}</b></p>
                <p><span className="text-slate-500">SĐT:</span> <a href={`tel:${o.customer.phone}`} className="text-brand">{o.customer.phone}</a></p>
                <p><span className="text-slate-500">Địa chỉ:</span> {o.customer.address}</p>
                {o.customer.note && <p><span className="text-slate-500">Ghi chú:</span> {o.customer.note}</p>}
              </div>
              <div>
                <ul className="space-y-1">
                  {o.lines.map((l) => (
                    <li key={l.productId} className="flex justify-between gap-3">
                      <span>{l.name} × {l.quantity}</span>
                      <span className="shrink-0">{formatPrice(l.unitPrice * l.quantity)}</span>
                    </li>
                  ))}
                </ul>
                <p className="mt-2 flex justify-between border-t border-slate-100 pt-2 font-bold">
                  <span>Tổng</span><span className="text-brand">{formatPrice(o.total)}</span>
                </p>
              </div>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
