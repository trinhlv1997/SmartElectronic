"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

type Slide = {
  eyebrow: string;
  title: string;
  desc: string;
  href: string;
  cta: string;
  bg: string;
  /** Product artwork shown on the right (files in public/banners). Without it the LED illustration is drawn. */
  image?: { src: string; alt: string };
  highlights?: string[];
};

// Slide copy only uses claims from the LeMan product artwork (energy saving, 30,000 h lifetime,
// 2-year warranty, nationwide free shipping, genuine products).
const SLIDES: Slide[] = [
  {
    eyebrow: "LED Bulb LeMan",
    title: "Tiết kiệm – Bền bỉ cho mọi không gian",
    desc: "Bóng đèn LED tiết kiệm điện năng, ánh sáng ổn định và tự nhiên cho nhà ở, cửa hàng, văn phòng.",
    href: "/products?category=bulb",
    cta: "Xem bóng đèn LED",
    bg: "from-brand-dark via-brand to-sky-400",
    image: { src: "/banners/leman-led-bulb.jpg", alt: "Bóng đèn LED Bulb LeMan tiết kiệm điện, bảo hành 2 năm" },
    highlights: ["Tiết kiệm điện", "Ánh sáng tự nhiên", "Bảo hành 2 năm"],
  },
  {
    eyebrow: "Đèn LED âm trần LeMan",
    title: "Ánh sáng dịu mắt, tiết kiệm điện",
    desc: "Tuổi thọ lên đến 30.000 giờ, thiết kế viền vàng sang trọng cho phòng khách, phòng ngủ và văn phòng.",
    href: "/products?category=downlight",
    cta: "Xem đèn âm trần",
    bg: "from-navy via-brand-dark to-brand",
    image: { src: "/banners/leman-led-downlight.jpg", alt: "Đèn LED âm trần LeMan 8W viền vàng, tuổi thọ 30.000 giờ" },
    highlights: ["Tuổi thọ 30.000 giờ", "Dịu mắt", "Chính hãng"],
  },
  {
    eyebrow: "LeMan cam kết",
    title: "Bảo hành 2 năm – Free ship toàn quốc",
    desc: "Sản phẩm chính hãng, chất lượng ổn định. Bảo hành nhanh chóng, hỗ trợ tận tâm — an tâm sử dụng, hiệu quả dài lâu.",
    href: "/products",
    cta: "Mua sắm ngay",
    bg: "from-brand to-sky-500",
    highlights: ["Bảo hành 2 năm", "Free ship toàn quốc", "Sản phẩm chính hãng"],
  },
];

/** Glowing LED bulb illustration (original artwork) for slides without a product photo. */
function LedBulbArt() {
  return (
    <svg viewBox="0 0 320 320" className="h-full w-full" role="img" aria-label="Bóng đèn LED tiết kiệm điện">
      <defs>
        <radialGradient id="hero-glow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#fff7d6" stopOpacity="0.95" />
          <stop offset="55%" stopColor="#ffe9a3" stopOpacity="0.35" />
          <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="hero-glass" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="100%" stopColor="#e8f1fc" />
        </linearGradient>
        <linearGradient id="hero-base" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#d9dee6" />
          <stop offset="100%" stopColor="#9aa4b2" />
        </linearGradient>
      </defs>
      <circle cx="160" cy="150" r="146" fill="url(#hero-glow)" />
      <g stroke="#ffe08a" strokeWidth="6" strokeLinecap="round" opacity="0.9">
        <line x1="160" y1="8" x2="160" y2="30" />
        <line x1="62" y1="48" x2="78" y2="64" />
        <line x1="258" y1="48" x2="242" y2="64" />
        <line x1="24" y1="138" x2="46" y2="138" />
        <line x1="296" y1="138" x2="274" y2="138" />
      </g>
      <path d="M160 44c-52 0-90 38-90 88 0 30 14 52 32 70 10 10 14 20 14 32v14h88v-14c0-12 4-22 14-32 18-18 32-40 32-70 0-50-38-88-90-88z" fill="url(#hero-glass)" stroke="#ffffff" strokeWidth="3" />
      <path d="M136 210v-46l24-30 24 30v46" fill="none" stroke="#d4a12a" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" />
      <rect x="114" y="248" width="92" height="14" rx="7" fill="url(#hero-base)" />
      <rect x="118" y="266" width="84" height="12" rx="6" fill="url(#hero-base)" />
      <rect x="124" y="282" width="72" height="12" rx="6" fill="url(#hero-base)" />
      <path d="M140 298h40l-8 14h-24z" fill="#7b8594" />
      <path d="M232 214c22-6 40 6 44 26-22 6-40-6-44-26z" fill="#4ade80" />
      <path d="M236 218c14 8 24 14 36 20" stroke="#15803d" strokeWidth="3" fill="none" strokeLinecap="round" />
    </svg>
  );
}

export default function HeroSlider() {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (paused) return;
    const t = setInterval(() => setIndex((i) => (i + 1) % SLIDES.length), 6000);
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
            <div className="mx-auto flex min-h-[340px] max-w-7xl flex-col items-center gap-8 px-4 pb-16 pt-10 md:flex-row md:py-12 lg:min-h-[480px]">
              <div className="w-full max-w-xl text-white">
                <p className="mb-3 text-sm font-semibold uppercase tracking-[0.2em] text-white/80">{s.eyebrow}</p>
                <h1 className="text-3xl font-extrabold uppercase leading-tight sm:text-5xl">{s.title}</h1>
                <p className="mt-4 text-white/90 sm:text-lg">{s.desc}</p>
                {s.highlights && (
                  <ul className="mt-5 flex flex-wrap gap-2">
                    {s.highlights.map((h) => (
                      <li key={h} className="rounded-full bg-white/15 px-3 py-1 text-xs font-semibold text-white ring-1 ring-white/30 sm:text-sm">
                        <span className="mr-1 text-gold">✓</span>
                        {h}
                      </li>
                    ))}
                  </ul>
                )}
                <Link
                  href={s.href}
                  tabIndex={i === index ? 0 : -1}
                  className="mt-8 inline-block rounded-full bg-white px-7 py-3 text-sm font-bold uppercase text-brand shadow-lg hover:bg-brand-50"
                >
                  {s.cta}
                </Link>
              </div>
              <div className="w-56 shrink-0 sm:w-72 md:ml-auto md:w-80 lg:w-[400px]">
                {s.image ? (
                  // eslint-disable-next-line @next/next/no-img-element -- static banner served from Workers assets
                  <img
                    src={s.image.src}
                    alt={s.image.alt}
                    loading={i === 0 ? "eager" : "lazy"}
                    className="h-auto w-full rounded-3xl shadow-2xl ring-4 ring-white/40"
                  />
                ) : (
                  <div className="aspect-square w-full rounded-full bg-white/10 p-6 ring-8 ring-white/10">
                    <LedBulbArt />
                  </div>
                )}
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
