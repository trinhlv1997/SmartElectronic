import type { Product } from "@/lib/types";

// Kích thước ảnh lưu trong KV. Ảnh được nén ở trình duyệt trước khi upload (xem imageCompress.ts).
export const IMAGE_SIZES = { lg: 1600, sm: 480 } as const;
export type ImageSize = keyof typeof IMAGE_SIZES;
export const MAX_IMAGES_PER_PRODUCT = 10;
export const MAX_UPLOAD_BYTES = { lg: 2_000_000, sm: 300_000 } as const;

export function imageSrc(id: string, size: ImageSize): string {
  return `/img/${id}/${size}`;
}

/** srcset cho <img>: trình duyệt tự chọn bản 480px hoặc 1600px theo kích thước hiển thị. */
export function imageSrcSet(id: string, width: number): string {
  const lgWidth = Math.min(width, IMAGE_SIZES.lg);
  const smWidth = Math.min(width, IMAGE_SIZES.sm);
  return lgWidth > smWidth ? `${imageSrc(id, "sm")} ${smWidth}w, ${imageSrc(id, "lg")} ${lgWidth}w` : `${imageSrc(id, "lg")} ${lgWidth}w`;
}

/** Ảnh bìa: ảnh upload đầu tiên, nếu không có thì URL ngoài, nếu không có nữa thì null (hiện emoji). */
export function coverImage(p: Pick<Product, "images" | "imageUrl">) {
  const first = p.images[0];
  if (first) return { src: imageSrc(first.id, "sm"), srcSet: imageSrcSet(first.id, first.width), width: first.width, height: first.height };
  if (p.imageUrl) return { src: p.imageUrl, srcSet: undefined, width: undefined, height: undefined };
  return null;
}
