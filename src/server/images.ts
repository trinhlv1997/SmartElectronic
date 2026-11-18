// Ảnh sản phẩm: metadata trong D1 (product_images), file trong KV (binding MEDIA).
import { MAX_IMAGES_PER_PRODUCT, MAX_UPLOAD_BYTES, type ImageSize } from "@/lib/images";
import type { ProductImage } from "@/lib/types";
import { getDb, getEnv } from "./db";

const kvKey = (id: string, size: ImageSize) => `img/${id}/${size}`;
const ALLOWED_MIME = ["image/webp", "image/jpeg", "image/png"];

interface ImageRow {
  id: string;
  product_id: string;
  width: number;
  height: number;
}

/** Ảnh của nhiều sản phẩm, gom theo product_id, đã sắp theo thứ tự (ảnh bìa đầu tiên). */
export async function imagesByProduct(productIds?: string[]): Promise<Map<string, ProductImage[]>> {
  const db = await getDb();
  const sql = "SELECT id, product_id, width, height FROM product_images";
  const order = " ORDER BY product_id, sort_order, created_at";
  const stmt =
    productIds === undefined
      ? db.prepare(sql + order)
      : productIds.length === 0
        ? null
        : db.prepare(`${sql} WHERE product_id IN (${productIds.map(() => "?").join(",")})${order}`).bind(...productIds);
  const map = new Map<string, ProductImage[]>();
  if (!stmt) return map;
  const { results } = await stmt.all<ImageRow>();
  for (const r of results) {
    const list = map.get(r.product_id) ?? [];
    list.push({ id: r.id, width: r.width, height: r.height });
    map.set(r.product_id, list);
  }
  return map;
}

export type UploadResult = { ok: true; image: ProductImage } | { ok: false; error: string; status: number };

export async function addProductImage(input: {
  productId: string;
  lg: File;
  sm: File;
  width: number;
  height: number;
}): Promise<UploadResult> {
  const { productId, lg, sm, width, height } = input;
  for (const [size, file] of [["lg", lg], ["sm", sm]] as const) {
    if (!ALLOWED_MIME.includes(file.type)) return { ok: false, status: 415, error: "Chỉ nhận ảnh WebP, JPEG hoặc PNG." };
    if (file.size > MAX_UPLOAD_BYTES[size]) return { ok: false, status: 413, error: "Ảnh quá lớn sau khi nén." };
  }
  if (!Number.isInteger(width) || !Number.isInteger(height) || width < 1 || height < 1 || width > 4000 || height > 4000) {
    return { ok: false, status: 400, error: "Kích thước ảnh không hợp lệ." };
  }

  const db = await getDb();
  const stats = await db
    .prepare("SELECT (SELECT COUNT(*) FROM products WHERE id = ?1) AS product, COUNT(*) AS n, COALESCE(MAX(sort_order), -1) AS max_order FROM product_images WHERE product_id = ?1")
    .bind(productId)
    .first<{ product: number; n: number; max_order: number }>();
  if (!stats?.product) return { ok: false, status: 404, error: "Không tìm thấy sản phẩm." };
  if (stats.n >= MAX_IMAGES_PER_PRODUCT) return { ok: false, status: 400, error: `Tối đa ${MAX_IMAGES_PER_PRODUCT} ảnh mỗi sản phẩm.` };

  const id = crypto.randomUUID().replace(/-/g, "").slice(0, 16);
  const { MEDIA } = await getEnv();
  // Ghi KV trước, D1 sau: nếu D1 lỗi thì chỉ còn file mồ côi trong KV (vô hại), không có record trỏ tới file không tồn tại.
  await Promise.all([
    MEDIA.put(kvKey(id, "lg"), await lg.arrayBuffer(), { metadata: { mime: lg.type } }),
    MEDIA.put(kvKey(id, "sm"), await sm.arrayBuffer(), { metadata: { mime: sm.type } }),
  ]);
  await db
    .prepare("INSERT INTO product_images (id, product_id, sort_order, width, height, bytes, mime) VALUES (?, ?, ?, ?, ?, ?, ?)")
    .bind(id, productId, stats.max_order + 1, width, height, lg.size + sm.size, lg.type)
    .run();
  return { ok: true, image: { id, width, height } };
}

export async function getImageFile(id: string, size: ImageSize) {
  const { MEDIA } = await getEnv();
  return MEDIA.getWithMetadata<{ mime: string }>(kvKey(id, size), { type: "stream", cacheTtl: 86400 });
}

async function deleteKvFiles(ids: string[]) {
  if (ids.length === 0) return;
  const { MEDIA } = await getEnv();
  await Promise.all(ids.flatMap((id) => [MEDIA.delete(kvKey(id, "lg")), MEDIA.delete(kvKey(id, "sm"))]));
}

export async function deleteProductImage(imageId: string): Promise<string | null> {
  const db = await getDb();
  const row = await db.prepare("DELETE FROM product_images WHERE id = ? RETURNING product_id").bind(imageId).first<{ product_id: string }>();
  if (row) await deleteKvFiles([imageId]);
  return row?.product_id ?? null;
}

/** Xoá toàn bộ file ảnh của sản phẩm trong KV (gọi trước khi xoá sản phẩm; D1 tự cascade). */
export async function deleteAllProductImageFiles(productId: string): Promise<void> {
  const db = await getDb();
  const { results } = await db.prepare("SELECT id FROM product_images WHERE product_id = ?").bind(productId).all<{ id: string }>();
  await deleteKvFiles(results.map((r) => r.id));
}

/** Ghi lại thứ tự ảnh của sản phẩm theo mảng id (phần tử đầu = ảnh bìa). */
export async function reorderProductImages(productId: string, orderedIds: string[]): Promise<void> {
  const db = await getDb();
  await db.batch(
    orderedIds.map((id, i) => db.prepare("UPDATE product_images SET sort_order = ? WHERE id = ? AND product_id = ?").bind(i, id, productId)),
  );
}
