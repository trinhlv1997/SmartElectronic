import { ORDER_STATUSES, type OrderStatus } from "@/lib/types";

export default function OrderStatusBadge({ status }: { status: OrderStatus }) {
  const s = ORDER_STATUSES.find((x) => x.id === status) ?? ORDER_STATUSES[0];
  return <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${s.color}`}>{s.label}</span>;
}
