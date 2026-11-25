import type { Metadata } from "next";
import PageBanner from "@/components/PageBanner";
import { telHref } from "@/data/site";
import { getContactInfo } from "@/server/settings";

export const metadata: Metadata = { title: "Liên hệ | LeMan" };

export default async function ContactPage() {
  const contact = await getContactInfo();
  const input = "w-full rounded-lg border border-slate-300 px-3 py-2 outline-none focus:border-brand";
  return (
    <>
      <PageBanner title="Liên hệ" crumbs={[{ label: "Liên hệ" }]} />
      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-10 lg:grid-cols-2">
        <div className="space-y-4">
          <h2 className="text-xl font-extrabold uppercase">Thông tin liên hệ</h2>
          <ul className="space-y-3 text-slate-700">
            <li>📍 {contact.address}</li>
            <li>☎ Hotline: <a href={telHref(contact.hotline)} className="font-bold text-brand">{contact.hotline}</a></li>
            <li>✉ <a href={`mailto:${contact.email}`} className="text-brand">{contact.email}</a></li>
            <li>🕗 Thứ 2 – Thứ 7: 8:00 – 17:30</li>
          </ul>
        </div>
        {/* Form tĩnh: chưa có API nhận liên hệ, gửi qua email mặc định của trình duyệt. */}
        <form action={`mailto:${contact.email}`} method="post" encType="text/plain" className="space-y-4 rounded-2xl border border-slate-200 p-6">
          <h2 className="text-xl font-extrabold uppercase">Gửi yêu cầu tư vấn</h2>
          <input name="name" required placeholder="Họ và tên" className={input} />
          <input name="phone" required placeholder="Số điện thoại" className={input} />
          <textarea name="message" rows={4} placeholder="Nội dung cần tư vấn" className={input} />
          <button className="rounded-full bg-brand px-6 py-2.5 font-bold text-white hover:bg-brand-dark">Gửi yêu cầu</button>
        </form>
      </div>
    </>
  );
}
