import Link from "next/link";
import { CATEGORIES } from "@/data/categories";
import { CONTACT, SOLUTIONS } from "@/data/site";

export default function Footer() {
  return (
    <footer className="mt-16 bg-[#1b1b1f] text-sm text-slate-300">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-12 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <p className="text-lg font-extrabold uppercase text-white">SmartElectronic</p>
          <p className="mt-1 text-xs uppercase tracking-widest text-brand">Light & Smart Living</p>
          <ul className="mt-4 space-y-2">
            <li>📍 {CONTACT.address}</li>
            <li>☎ Hotline: <strong className="text-white">{CONTACT.hotline}</strong></li>
            <li>✉ {CONTACT.email}</li>
          </ul>
        </div>
        <div>
          <p className="mb-4 font-bold uppercase text-white">Sản phẩm</p>
          <ul className="space-y-2">
            {CATEGORIES.slice(0, 6).map((c) => (
              <li key={c.id}><Link href={`/products?category=${c.id}`} className="hover:text-white">{c.label}</Link></li>
            ))}
          </ul>
        </div>
        <div>
          <p className="mb-4 font-bold uppercase text-white">Giải pháp</p>
          <ul className="space-y-2">
            {SOLUTIONS.map((s) => (
              <li key={s.id}><Link href={`/products?category=${s.category}`} className="hover:text-white">{s.title}</Link></li>
            ))}
          </ul>
        </div>
        <div>
          <p className="mb-4 font-bold uppercase text-white">Hỗ trợ khách hàng</p>
          <ul className="space-y-2">
            <li><Link href="/about" className="hover:text-white">Giới thiệu công ty</Link></li>
            <li><Link href="/news" className="hover:text-white">Tin tức</Link></li>
            <li><Link href="/contact" className="hover:text-white">Liên hệ</Link></li>
            <li><Link href="/cart" className="hover:text-white">Giỏ hàng</Link></li>
          </ul>
          <div className="mt-5 flex gap-2">
            {["f", "▶", "in"].map((s) => (
              <span key={s} className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 text-xs font-bold text-white">{s}</span>
            ))}
          </div>
        </div>
      </div>
      <div className="border-t border-white/10 py-4 text-center text-xs text-slate-500">
        © {new Date().getFullYear()} SmartElectronic. All rights reserved.
      </div>
    </footer>
  );
}
