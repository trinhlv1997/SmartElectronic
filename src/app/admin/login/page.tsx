import type { Metadata } from "next";
import { redirect } from "next/navigation";
import LoginForm from "@/components/admin/LoginForm";
import { isAdmin, isAuthConfigured } from "@/server/auth";

export const metadata: Metadata = { title: "Đăng nhập quản trị | LeMan", robots: { index: false } };
export const dynamic = "force-dynamic";

export default async function LoginPage({ searchParams }: { searchParams: Promise<{ next?: string }> }) {
  if (await isAdmin()) redirect("/admin");
  const { next } = await searchParams;
  const configured = await isAuthConfigured();

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-100 px-4">
      <div className="w-full max-w-sm rounded-2xl bg-white p-8 shadow-xl">
        <div className="mb-6 text-center">
          <p className="text-3xl font-extrabold uppercase leading-none tracking-tight text-navy">LeMan</p>
          <p className="mt-1 text-[10px] font-bold uppercase tracking-[0.14em] text-navy">Electrical &amp; Lighting</p>
          <h1 className="mt-4 text-lg font-extrabold uppercase">Quản trị hệ thống</h1>
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
