"use client";

import { IMAGE_SIZES, MAX_UPLOAD_BYTES } from "@/lib/images";

export interface CompressedImage {
  lg: Blob;
  sm: Blob;
  width: number; // kích thước bản lg
  height: number;
}

async function toBlob(canvas: HTMLCanvasElement, type: string, quality: number): Promise<Blob | null> {
  return new Promise((resolve) => canvas.toBlob(resolve, type, quality));
}

/** Thu nhỏ về cạnh dài tối đa maxSide rồi mã hoá WebP (Safari cũ không mã hoá WebP → JPEG). */
async function encode(bitmap: ImageBitmap, maxSide: number, maxBytes: number) {
  const scale = Math.min(1, maxSide / Math.max(bitmap.width, bitmap.height));
  const width = Math.round(bitmap.width * scale);
  const height = Math.round(bitmap.height * scale);
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Trình duyệt không hỗ trợ canvas.");
  ctx.imageSmoothingQuality = "high";

  for (const quality of [0.82, 0.7, 0.55]) {
    ctx.clearRect(0, 0, width, height);
    ctx.drawImage(bitmap, 0, 0, width, height);
    let blob = await toBlob(canvas, "image/webp", quality);
    if (!blob || blob.type !== "image/webp") {
      // JPEG không có nền trong suốt → phủ nền trắng
      ctx.fillStyle = "#fff";
      ctx.fillRect(0, 0, width, height);
      ctx.drawImage(bitmap, 0, 0, width, height);
      blob = await toBlob(canvas, "image/jpeg", quality + 0.05);
    }
    if (blob && blob.size <= maxBytes) return { blob, width, height };
  }
  throw new Error("Ảnh quá lớn, không nén được xuống dưới giới hạn.");
}

export async function compressImage(file: File): Promise<CompressedImage> {
  let bitmap: ImageBitmap;
  try {
    bitmap = await createImageBitmap(file, { imageOrientation: "from-image" });
  } catch {
    throw new Error("Không đọc được ảnh (định dạng HEIC/RAW chưa hỗ trợ — hãy dùng JPG/PNG/WebP).");
  }
  try {
    const lg = await encode(bitmap, IMAGE_SIZES.lg, MAX_UPLOAD_BYTES.lg);
    const sm = await encode(bitmap, IMAGE_SIZES.sm, MAX_UPLOAD_BYTES.sm);
    return { lg: lg.blob, sm: sm.blob, width: lg.width, height: lg.height };
  } finally {
    bitmap.close();
  }
}
