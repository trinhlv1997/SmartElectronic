"use client";

import { useActionState } from "react";
import { loginAction } from "@/app/admin/actions";

export default function LoginForm({ next }: { next?: string }) {
  const [state, action, pending] = useActionState(loginAction, undefined);
  return (
    <form action={action} className="space-y-4">
      <input type="hidden" name="next" value={next ?? ""} />
      <label className="block text-sm font-medium">
        Mật khẩu
        <input
          type="password"
          name="password"
          required
          autoFocus
          autoComplete="current-password"
          className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 outline-none focus:border-brand"
        />
      </label>
      {state?.error && <p className="rounded-lg bg-red-50 p-2 text-sm text-red-600">{state.error}</p>}
      <button disabled={pending} className="w-full rounded-full bg-brand py-2.5 font-bold text-white hover:bg-brand-dark disabled:opacity-60">
        {pending ? "Đang kiểm tra..." : "Đăng nhập"}
      </button>
    </form>
  );
}
