import type { Metadata } from "next";
import Link from "next/link";
import { logoutAction } from "@/app/admin/actions";
import { requireAdmin } from "@/server/auth";

export const metadata: Metadata = { title: "Quản trị | SmartElectronic", robots: { index: false } };
export const dynamic = "force-dynamic";

const NAV = [
  { href: "/admin", label: "Tổng quan", icon: "📊" },
  { href: "/admin/products", label: "Sản phẩm", icon: "📦" },
  { href: "/admin/orders", label: "Đơn hàng", icon: "🧾" },
];

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  await requireAdmin();

  return (
    <div className="min-h-screen bg-slate-100 lg:flex">
      <aside className="bg-[#1b1b1f] text-slate-300 lg:sticky lg:top-0 lg:h-screen lg:w-60 lg:shrink-0">
        <div className="flex items-center gap-2 px-5 py-4">
          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-brand text-white">⚡</span>
          <span className="font-extrabold uppercase text-white">Admin</span>
        </div>
        <nav className="flex gap-1 overflow-x-auto px-3 pb-3 lg:flex-col lg:pb-0">
          {NAV.map((n) => (
            <Link key={n.href} href={n.href} className="flex shrink-0 items-center gap-3 rounded-lg px-3 py-2 text-sm hover:bg-white/10 hover:text-white">
              <span>{n.icon}</span>
              {n.label}
            </Link>
          ))}
          <Link href="/" target="_blank" className="flex shrink-0 items-center gap-3 rounded-lg px-3 py-2 text-sm hover:bg-white/10 hover:text-white">
            <span>🌐</span>Xem website
          </Link>
          <form action={logoutAction} className="lg:mt-4 lg:border-t lg:border-white/10 lg:pt-4">
            <button className="flex w-full shrink-0 items-center gap-3 rounded-lg px-3 py-2 text-sm hover:bg-white/10 hover:text-white">
              <span>↩</span>Đăng xuất
            </button>
          </form>
        </nav>
      </aside>
      <main className="min-w-0 flex-1 p-4 sm:p-8">{children}</main>
    </div>
  );
}
