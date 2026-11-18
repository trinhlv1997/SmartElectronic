"use client";

import Link from "next/link";
import { useState } from "react";
import { useCart } from "@/context/CartContext";
import { CATEGORIES } from "@/data/categories";
import { CONTACT, SOLUTIONS } from "@/data/site";

type NavItem = { label: string; href: string; mega?: "products" | "solutions" };

const NAV: NavItem[] = [
  { label: "Sản phẩm", href: "/products", mega: "products" },
  { label: "Giải pháp", href: "/#giai-phap", mega: "solutions" },
  { label: "Tin tức", href: "/news" },
  { label: "Về chúng tôi", href: "/about" },
  { label: "Liên hệ", href: "/contact" },
];

function MegaMenu({ kind, onNavigate }: { kind: "products" | "solutions"; onNavigate?: () => void }) {
  if (kind === "products") {
    return (
      <div className="grid grid-cols-2 gap-1 lg:grid-cols-4">
        {CATEGORIES.map((c) => (
          <Link
            key={c.id}
            href={`/products?category=${c.id}`}
            onClick={onNavigate}
            className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm hover:bg-brand-50 hover:text-brand"
          >
            <span className="text-xl">{c.icon}</span>
            {c.label}
          </Link>
        ))}
      </div>
    );
  }
  return (
    <div className="grid grid-cols-1 gap-1 lg:grid-cols-3">
      {SOLUTIONS.map((s) => (
        <Link
          key={s.id}
          href={`/products?category=${s.category}`}
          onClick={onNavigate}
          className="flex gap-3 rounded-lg px-3 py-2.5 hover:bg-brand-50"
        >
          <span className="text-2xl">{s.icon}</span>
          <span>
            <span className="block text-sm font-semibold">{s.title}</span>
            <span className="block text-xs text-slate-500">{s.desc}</span>
          </span>
        </Link>
      ))}
    </div>
  );
}

export default function Header() {
  const { totalQuantity, hydrated } = useCart();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  return (
    <header className="sticky top-0 z-30 bg-white shadow-sm">
      {/* Top bar */}
      <div className="bg-brand text-xs text-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-1.5">
          <span className="truncate">Chào mừng bạn đến với SmartElectronic — Giải pháp chiếu sáng & thiết bị điện thông minh</span>
          <span className="hidden shrink-0 gap-4 sm:flex">
            <a href={`tel:${CONTACT.hotline.replace(/\s/g, "")}`}>☎ Hotline: <strong>{CONTACT.hotline}</strong></a>
            <a href={`mailto:${CONTACT.email}`}>✉ {CONTACT.email}</a>
          </span>
        </div>
      </div>

      {/* Main header */}
      <div className="relative border-b border-slate-200">
        <div className="mx-auto flex max-w-7xl items-center gap-6 px-4">
          <Link href="/" className="flex shrink-0 items-center gap-2 py-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-full bg-brand text-xl text-white">⚡</span>
            <span className="leading-tight">
              <span className="block text-lg font-extrabold uppercase tracking-tight text-brand">SmartElectronic</span>
              <span className="block text-[10px] uppercase tracking-widest text-slate-500">Light & Smart Living</span>
            </span>
          </Link>

          <nav className="hidden h-full flex-1 items-stretch justify-center lg:flex">
            {NAV.map((item) => (
              <div key={item.label} className="group">
                <Link
                  href={item.href}
                  className="flex h-full items-center px-4 py-5 text-sm font-bold uppercase tracking-wide group-hover:text-brand"
                >
                  {item.label}
                  {item.mega && <span className="ml-1 text-[10px]">▼</span>}
                </Link>
                {item.mega && (
                  <div className="invisible absolute inset-x-0 top-full border-t-2 border-brand bg-white opacity-0 shadow-xl transition group-hover:visible group-hover:opacity-100">
                    <div className="mx-auto max-w-7xl px-4 py-6">
                      <MegaMenu kind={item.mega} />
                    </div>
                  </div>
                )}
              </div>
            ))}
          </nav>

          <div className="ml-auto flex items-center gap-2 lg:ml-0">
            <button
              type="button"
              onClick={() => setSearchOpen((v) => !v)}
              className="flex h-10 w-10 items-center justify-center rounded-full hover:bg-slate-100"
              aria-label="Tìm kiếm"
            >
              🔍
            </button>
            <Link href="/cart" className="relative flex h-10 w-10 items-center justify-center rounded-full hover:bg-slate-100" aria-label="Giỏ hàng">
              🛒
              {hydrated && totalQuantity > 0 && (
                <span className="absolute -right-0.5 -top-0.5 min-w-5 rounded-full bg-brand px-1 text-center text-[11px] font-bold leading-5 text-white">
                  {totalQuantity}
                </span>
              )}
            </Link>
            <button
              type="button"
              onClick={() => setMobileOpen((v) => !v)}
              className="flex h-10 w-10 items-center justify-center rounded-full text-xl hover:bg-slate-100 lg:hidden"
              aria-label="Menu"
            >
              {mobileOpen ? "✕" : "☰"}
            </button>
          </div>
        </div>

        {searchOpen && (
          <div className="border-t border-slate-200 bg-white">
            <form action="/products" className="mx-auto flex max-w-3xl gap-2 px-4 py-3" onSubmit={() => setSearchOpen(false)}>
              <input
                name="q"
                autoFocus
                placeholder="Nhập tên hoặc mã sản phẩm..."
                className="flex-1 rounded-full border border-slate-300 px-4 py-2 text-sm outline-none focus:border-brand"
              />
              <button className="rounded-full bg-brand px-5 text-sm font-semibold text-white hover:bg-brand-dark">Tìm</button>
            </form>
          </div>
        )}
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="max-h-[75vh] overflow-y-auto border-b border-slate-200 bg-white lg:hidden">
          {NAV.map((item) => (
            <div key={item.label} className="border-b border-slate-100 px-4 py-3">
              <Link href={item.href} onClick={() => setMobileOpen(false)} className="text-sm font-bold uppercase">
                {item.label}
              </Link>
              {item.mega && (
                <div className="mt-2">
                  <MegaMenu kind={item.mega} onNavigate={() => setMobileOpen(false)} />
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </header>
  );
}
