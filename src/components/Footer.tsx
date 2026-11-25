import Link from "next/link";
import { type ContactInfo, SOLUTIONS, telHref } from "@/data/site";
import type { CategoryInfo } from "@/lib/types";

export default function Footer({ contact, categories }: { contact: ContactInfo; categories: CategoryInfo[] }) {
  return (
    <footer className="mt-16 bg-navy text-sm text-slate-300">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-12 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <p className="text-2xl font-extrabold uppercase leading-none tracking-tight text-white">
            LeMan<sup className="ml-0.5 align-super text-[10px] font-bold">®</sup>
          </p>
          <p className="mt-1 text-xs font-bold uppercase tracking-[0.14em] text-gold">Electrical &amp; Lighting</p>
          <ul className="mt-4 space-y-2">
            <li>📍 {contact.address}</li>
            <li>☎ Hotline: <a href={telHref(contact.hotline)} className="font-bold text-white hover:underline">{contact.hotline}</a></li>
            <li>✉ <a href={`mailto:${contact.email}`} className="hover:text-white hover:underline">{contact.email}</a></li>
          </ul>
        </div>
        <div>
          <p className="mb-4 font-bold uppercase text-white">Sản phẩm</p>
          <ul className="space-y-2">
            {categories.slice(0, 6).map((c) => (
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
        © {new Date().getFullYear()} LeMan Electrical &amp; Lighting. All rights reserved.
      </div>
    </footer>
  );
}
