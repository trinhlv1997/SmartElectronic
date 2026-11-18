"use client";

import { useActionState } from "react";
import { updateOrderStatusAction } from "@/app/admin/actions";
import { ORDER_STATUSES, type OrderStatus } from "@/lib/types";

export default function OrderStatusForm({ id, status }: { id: string; status: OrderStatus }) {
  const [state, action, pending] = useActionState(updateOrderStatusAction.bind(null, id), undefined);
  return (
    <form action={action} className="text-right">
      <select
        name="status"
        defaultValue={status}
        disabled={pending}
        onChange={(e) => e.currentTarget.form?.requestSubmit()}
        className="rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-sm font-semibold outline-none focus:border-brand"
        aria-label="Trạng thái đơn"
      >
        {ORDER_STATUSES.map((s) => <option key={s.id} value={s.id}>{s.label}</option>)}
      </select>
      {state?.error && <p className="mt-1 text-xs text-red-600">{state.error}</p>}
      {state?.message && !pending && <p className="mt-1 text-xs text-green-600">✓ {state.message}</p>}
    </form>
  );
}
