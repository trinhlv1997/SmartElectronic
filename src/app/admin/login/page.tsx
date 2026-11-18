import type { Metadata } from "next";
import { redirect } from "next/navigation";
import LoginForm from "@/components/admin/LoginForm";
import { isAdmin, isAuthConfigured } from "@/server/auth";

export const metadata: Metadata = { title: "Đăng nhập quản trị | SmartElectronic", robots: { index: false } };
export const dynamic = "force-dynamic";

export default async function LoginPage({ searchParams }: { searchParams: Promise<{ next?: string }> }) {
  if (await isAdmin()) redirect("/admin");
  const { next } = await searchParams;
  const configured = await isAuthConfigured();

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-100 px-4">
      <div className="w-full max-w-sm rounded-2xl bg-white p-8 shadow-xl">
        <div className="mb-6 text-center">
          <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-brand text-2xl text-white">⚡</span>
          <h1 className="mt-3 text-xl font-extrabold uppercase">Quản trị SmartElectronic</h1>
        </div>
        {configured ? (
          <LoginForm next={next} />
        ) : (
          <p className="rounded-lg bg-amber-50 p-3 text-sm text-amber-800">
            Trang quản trị chưa được cấu hình. Cần đặt secret <code>ADMIN_PASSWORD</code> và <code>AUTH_SECRET</code> (xem README).
          </p>
        )}
      </div>
    </div>
  );
}
