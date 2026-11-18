"use client";

import { useState } from "react";
import { imageSrc, imageSrcSet } from "@/lib/images";
import type { Product } from "@/lib/types";

/** Ảnh chính + dải thumbnail. Ảnh chính dùng srcset nên điện thoại chỉ tải bản 480px. */
export default function ProductGallery({ product }: { product: Product }) {
  const [active, setActive] = useState(0);
  const images = product.images;
  const box = "flex aspect-square items-center justify-center overflow-hidden rounded-2xl bg-slate-50 shadow-sm";

  if (images.length === 0) {
    return (
      <div className={`${box} text-[10rem]`}>
        {product.imageUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={product.imageUrl} alt={product.name} className="h-full w-full object-contain" />
        ) : (
          product.icon
        )}
      </div>
    );
  }

  const main = images[Math.min(active, images.length - 1)];
  return (
    <div className="space-y-3">
      <div className={box}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          key={main.id}
          src={imageSrc(main.id, "lg")}
          srcSet={imageSrcSet(main.id, main.width)}
          sizes="(min-width: 768px) 600px, 100vw"
          width={main.width}
          height={main.height}
          alt={product.name}
          fetchPriority="high"
          className="h-full w-full object-contain"
        />
      </div>
      {images.length > 1 && (
        <div className="flex gap-2 overflow-x-auto pb-1">
          {images.map((img, i) => (
            <button
              key={img.id}
              type="button"
              onClick={() => setActive(i)}
              aria-label={`Ảnh ${i + 1}`}
              aria-current={i === active}
              className={`h-20 w-20 shrink-0 overflow-hidden rounded-lg border-2 bg-slate-50 ${i === active ? "border-brand" : "border-transparent hover:border-slate-300"}`}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={imageSrc(img.id, "sm")} alt="" loading="lazy" width={img.width} height={img.height} className="h-full w-full object-contain" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
