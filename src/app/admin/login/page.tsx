import type { Metadata } from "next";
import { redirect } from "next/navigation";
import LoginForm from "@/components/admin/LoginForm";
import { isAdmin } from "@/server/auth";

export const metadata: Metadata = { title: "Đăng nhập quản trị | SmartElectronic", robots: { index: false } };
export const dynamic = "force-dynamic";

export default async function LoginPage({ searchParams }: { searchParams: Promise<{ next?: string }> }) {
  if (await isAdmin()) redirect("/admin");
  const { next } = await searchParams;

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-100 px-4">
      <div className="w-full max-w-sm rounded-2xl bg-white p-8 shadow-xl">
        <div className="mb-6 text-center">
          <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-brand text-2xl text-white">⚡</span>
          <h1 className="mt-3 text-xl font-extrabold uppercase">Quản trị SmartElectronic</h1>
        </div>
        <LoginForm next={next} />
      </div>
    </div>
  );
}
