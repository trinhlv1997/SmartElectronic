import { coverImage } from "@/lib/images";
import type { Product } from "@/lib/types";

/** Ảnh bìa nhỏ (giỏ hàng, bảng admin); không có ảnh thì hiện emoji. */
export default function ProductThumb({ product, className = "" }: { product: Pick<Product, "images" | "imageUrl" | "icon">; className?: string }) {
  const cover = coverImage(product);
  return (
    <span className={`flex shrink-0 items-center justify-center overflow-hidden rounded-lg bg-slate-100 ${className}`}>
      {cover ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={cover.src} alt="" loading="lazy" className="h-full w-full object-contain" />
      ) : (
        product.icon
      )}
    </span>
  );
}
