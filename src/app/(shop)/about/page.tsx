import type { Metadata } from "next";
import PageBanner from "@/components/PageBanner";
import { REASONS, STATS } from "@/data/site";

export const metadata: Metadata = { title: "Về chúng tôi | SmartElectronic" };

export default function AboutPage() {
  return (
    <>
      <PageBanner title="Về chúng tôi" crumbs={[{ label: "Về chúng tôi" }]} />
      <div className="mx-auto max-w-5xl space-y-10 px-4 py-10">
        <section className="space-y-4 text-slate-700">
          <h2 className="text-xl font-extrabold uppercase text-ink">SmartElectronic</h2>
          <p>
            SmartElectronic cung cấp đèn LED, thiết bị điện, thiết bị nhà thông minh và giải pháp năng lượng mặt trời
            cho gia đình, doanh nghiệp và công trình. Chúng tôi hướng tới những không gian sống xanh, an toàn và tiết kiệm năng lượng.
          </p>
          <p>
            Mọi sản phẩm đều được kiểm định chất lượng, bảo hành chính hãng và được đội ngũ kỹ thuật hỗ trợ tư vấn, lắp đặt tận nơi.
          </p>
        </section>
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          {STATS.map((s) => (
            <div key={s.label} className="rounded-2xl bg-brand-50 p-6 text-center">
              <p className="text-3xl font-extrabold text-brand">{s.value}</p>
              <p className="mt-1 text-sm text-slate-600">{s.label}</p>
            </div>
          ))}
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          {REASONS.map((r) => (
            <div key={r.title} className="flex gap-4 rounded-2xl border border-slate-200 p-5">
              <span className="text-3xl">{r.icon}</span>
              <div>
                <h3 className="font-bold">{r.title}</h3>
                <p className="mt-1 text-sm text-slate-600">{r.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
