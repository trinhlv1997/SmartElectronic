"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

const SLIDES = [
  {
    eyebrow: "Chiếu sáng thông minh",
    title: "Kiến tạo không gian sống xanh",
    desc: "Hệ sinh thái đèn LED và thiết bị điều khiển thông minh cho mọi ngôi nhà Việt.",
    href: "/products?category=smart",
    icon: "💡",
    bg: "from-[#a8121a] via-[#d71920] to-[#f0533a]",
  },
  {
    eyebrow: "Năng lượng mặt trời",
    title: "Tiết kiệm đến 70% tiền điện",
    desc: "Giải pháp điện mặt trời áp mái trọn gói: khảo sát, thi công, bảo hành dài hạn.",
    href: "/products?category=solar",
    icon: "☀️",
    bg: "from-[#7c2d12] via-[#c2410c] to-[#f59e0b]",
  },
  {
    eyebrow: "Thiết bị điện",
    title: "An toàn cho mọi gia đình",
    desc: "Ổ cắm, aptomat, công tắc đạt chuẩn — bền bỉ, chống cháy, bảo hành chính hãng.",
    href: "/products?category=electrical",
    icon: "🔌",
    bg: "from-[#111827] via-[#1f2937] to-[#d71920]",
  },
];

export default function HeroSlider() {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (paused) return;
    const t = setInterval(() => setIndex((i) => (i + 1) % SLIDES.length), 5000);
    return () => clearInterval(t);
  }, [paused]);

  const go = (delta: number) => setIndex((i) => (i + delta + SLIDES.length) % SLIDES.length);

  return (
    <section
      className="relative overflow-hidden"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      aria-roledescription="carousel"
    >
      <div className="flex transition-transform duration-700 ease-out" style={{ transform: `translateX(-${index * 100}%)` }}>
        {SLIDES.map((s, i) => (
          <div key={s.title} className={`w-full shrink-0 bg-gradient-to-r ${s.bg}`} aria-hidden={i !== index}>
            <div className="mx-auto flex min-h-[340px] max-w-7xl items-center gap-8 px-4 py-12 sm:min-h-[460px]">
              <div className="max-w-xl text-white">
                <p className="mb-3 text-sm font-semibold uppercase tracking-[0.2em] text-white/80">{s.eyebrow}</p>
                <h1 className="text-3xl font-extrabold uppercase leading-tight sm:text-5xl">{s.title}</h1>
                <p className="mt-4 text-white/90 sm:text-lg">{s.desc}</p>
                <Link
                  href={s.href}
                  tabIndex={i === index ? 0 : -1}
                  className="mt-8 inline-block rounded-full bg-white px-7 py-3 text-sm font-bold uppercase text-brand shadow-lg hover:bg-brand-50"
                >
                  Khám phá ngay
                </Link>
              </div>
              <div className="ml-auto hidden h-72 w-72 items-center justify-center rounded-full bg-white/10 text-[9rem] ring-8 ring-white/10 md:flex">
                {s.icon}
              </div>
            </div>
          </div>
        ))}
      </div>

      <button onClick={() => go(-1)} aria-label="Slide trước" className="absolute left-3 top-1/2 hidden h-11 w-11 -translate-y-1/2 rounded-full bg-black/25 text-xl text-white hover:bg-black/40 sm:block">‹</button>
      <button onClick={() => go(1)} aria-label="Slide sau" className="absolute right-3 top-1/2 hidden h-11 w-11 -translate-y-1/2 rounded-full bg-black/25 text-xl text-white hover:bg-black/40 sm:block">›</button>

      <div className="absolute bottom-5 left-1/2 flex -translate-x-1/2 gap-2">
        {SLIDES.map((s, i) => (
          <button
            key={s.title}
            onClick={() => setIndex(i)}
            aria-label={`Slide ${i + 1}`}
            className={`h-2.5 rounded-full transition-all ${i === index ? "w-8 bg-white" : "w-2.5 bg-white/50"}`}
          />
        ))}
      </div>
    </section>
  );
}
