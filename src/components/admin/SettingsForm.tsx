"use client";

import { useActionState } from "react";
import { saveSettingsAction } from "@/app/admin/actions";
import type { ContactInfo } from "@/data/site";

export default function SettingsForm({ contact }: { contact: ContactInfo }) {
  const [state, action, pending] = useActionState(saveSettingsAction, undefined);
  const values = state?.values ?? contact;
  const err = state?.errors ?? {};

  const input = "mt-1 w-full rounded-lg border px-3 py-2 text-sm outline-none focus:border-brand";
  const cls = (k: keyof ContactInfo) => `${input} ${err[k] ? "border-red-400" : "border-slate-300"}`;
  const Err = ({ k }: { k: keyof ContactInfo }) => (err[k] ? <span className="mt-1 block text-xs text-red-600">{err[k]}</span> : null);
  const label = "block text-sm font-medium";

  return (
    <form action={action} className="max-w-2xl space-y-5 rounded-2xl bg-white p-6 shadow-sm" noValidate>
      <div>
        <h2 className="font-bold">Thông tin liên hệ</h2>
        <p className="mt-1 text-sm text-slate-500">Hiển thị ở thanh trên cùng, chân trang và trang Liên hệ của website.</p>
      </div>

      <label className={label}>
        Địa chỉ *
        <input key={`address-${values.address}`} name="address" defaultValue={values.address} placeholder="Số nhà, đường, quận/huyện, tỉnh/thành" className={cls("address")} maxLength={300} />
        <Err k="address" />
      </label>
      <div className="grid gap-4 sm:grid-cols-2">
        <label className={label}>
          Email *
          <input key={`email-${values.email}`} name="email" type="email" defaultValue={values.email} placeholder="lienhe@tencongty.vn" className={cls("email")} maxLength={120} />
          <Err k="email" />
        </label>
        <label className={label}>
          Hotline *
          <input key={`hotline-${values.hotline}`} name="hotline" type="tel" defaultValue={values.hotline} placeholder="1900 0000" className={cls("hotline")} maxLength={30} />
          <Err k="hotline" />
        </label>
      </div>

      {state?.error && <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">{state.error}</p>}
      {state?.message && <p className="rounded-lg bg-green-50 px-3 py-2 text-sm text-green-700">✓ {state.message}</p>}

      <button disabled={pending} className="rounded-full bg-brand px-6 py-2.5 text-sm font-bold text-white hover:bg-brand-dark disabled:opacity-60">
        {pending ? "Đang lưu..." : "Lưu cài đặt"}
      </button>
    </form>
  );
}
