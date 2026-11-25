import Link from "next/link";
import type { Product } from "@/lib/types";
import { discountPercent, formatPrice } from "@/lib/format";
import { coverImage } from "@/lib/images";
import AddToCartButton from "./AddToCartButton";

export default function ProductCard({ product }: { product: Product }) {
  const discount = discountPercent(product.price, product.oldPrice);
  const cover = coverImage(product);

  return (
    <div className="group flex flex-col overflow-hidden rounded-xl border border-slate-200 bg-white transition hover:-translate-y-1 hover:border-brand/40 hover:shadow-xl">
      <Link
        href={`/products/${product.slug}`}
        className="relative flex aspect-square items-center justify-center overflow-hidden bg-gradient-to-br from-slate-50 to-slate-100 text-7xl"
      >
        {cover ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={cover.src}
            srcSet={cover.srcSet}
            sizes="(min-width: 1280px) 300px, (min-width: 1024px) 25vw, 50vw"
            width={cover.width}
            height={cover.height}
            alt={product.name}
            loading="lazy"
            decoding="async"
            className="h-full w-full object-contain p-3 transition group-hover:scale-105"
          />
        ) : (
          <span className="transition group-hover:scale-110">{product.icon}</span>
        )}
        {discount && (
          <span className="absolute left-3 top-3 rounded-full bg-gold px-2.5 py-0.5 text-xs font-bold text-navy">-{discount}%</span>
        )}
        {product.stock === 0 && (
          <span className="absolute right-3 top-3 rounded-full bg-slate-700 px-2.5 py-0.5 text-xs font-semibold text-white">Hết hàng</span>
        )}
      </Link>
      <div className="flex flex-1 flex-col p-4">
        <Link href={`/products/${product.slug}`} className="line-clamp-2 min-h-[2.75rem] font-semibold leading-snug hover:text-brand">
          {product.name}
        </Link>
        <p className="mt-1 text-xs text-slate-500">Mã: {product.sku}</p>
        <div className="mt-auto pt-3">
          <div className="flex items-baseline gap-2">
            <span className="text-lg font-extrabold text-brand">{formatPrice(product.price)}</span>
            {product.oldPrice && <span className="text-xs text-slate-400 line-through">{formatPrice(product.oldPrice)}</span>}
          </div>
          <AddToCartButton productId={product.id} disabled={product.stock === 0} className="mt-3 w-full" />
        </div>
      </div>
    </div>
  );
}
