import { normalizeText } from "@/lib/productFilters";
import type { ProductInput } from "./products";

export type FieldErrors = Partial<Record<string, string>>;
export type ParseResult = { ok: true; data: ProductInput } | { ok: false; errors: FieldErrors };

export function slugify(s: string): string {
  return normalizeText(s).replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 80);
}

const str = (fd: FormData, k: string) => String(fd.get(k) ?? "").trim();

function int(fd: FormData, k: string): number | null | "invalid" {
  const raw = str(fd, k).replace(/[.,\s₫đ]/g, "");
  if (raw === "") return null;
  const n = Number(raw);
  return Number.isInteger(n) && n >= 0 ? n : "invalid";
}

/** "Công suất: 9W" mỗi dòng → { "Công suất": "9W" } */
export function parseSpecs(text: string): Record<string, string> {
  const specs: Record<string, string> = {};
  for (const line of text.split("\n")) {
    const i = line.indexOf(":");
    if (i <= 0) continue;
    const key = line.slice(0, i).trim();
    const value = line.slice(i + 1).trim();
    if (key && value) specs[key] = value;
  }
  return specs;
}

export function specsToText(specs: Record<string, string>): string {
  return Object.entries(specs).map(([k, v]) => `${k}: ${v}`).join("\n");
}

/** `categoryIds`: danh mục hiện có (đọc từ D1 bởi action gọi hàm này). */
export function parseProductForm(fd: FormData, categoryIds: ReadonlySet<string>): ParseResult {
  const errors: FieldErrors = {};
  const name = str(fd, "name");
  const slug = slugify(str(fd, "slug") || name);
  const sku = str(fd, "sku");
  const category = str(fd, "category");
  const price = int(fd, "price");
  const oldPrice = int(fd, "oldPrice");
  const stock = int(fd, "stock");
  const sortOrder = int(fd, "sortOrder");
  const rating = Number(str(fd, "rating") || "5");
  const imageUrl = str(fd, "imageUrl");

  if (!name) errors.name = "Nhập tên sản phẩm.";
  if (!slug) errors.slug = "Slug không hợp lệ.";
  if (!sku) errors.sku = "Nhập mã sản phẩm.";
  if (!categoryIds.has(category)) errors.category = "Chọn danh mục.";
  if (price === null || price === "invalid") errors.price = "Giá phải là số nguyên ≥ 0.";
  if (oldPrice === "invalid") errors.oldPrice = "Giá gốc phải là số nguyên ≥ 0.";
  else if (typeof oldPrice === "number" && typeof price === "number" && oldPrice <= price) {
    errors.oldPrice = "Giá gốc phải lớn hơn giá bán (bỏ trống nếu không giảm giá).";
  }
  if (stock === null || stock === "invalid") errors.stock = "Tồn kho phải là số nguyên ≥ 0.";
  if (sortOrder === "invalid") errors.sortOrder = "Thứ tự phải là số nguyên ≥ 0.";
  if (!Number.isFinite(rating) || rating < 0 || rating > 5) errors.rating = "Đánh giá từ 0 đến 5.";
  if (imageUrl && !/^https?:\/\/\S+$/i.test(imageUrl)) errors.imageUrl = "URL ảnh phải bắt đầu bằng http(s)://";

  if (Object.keys(errors).length > 0) return { ok: false, errors };

  return {
    ok: true,
    data: {
      name: name.slice(0, 200),
      slug,
      sku: sku.slice(0, 60),
      category: category as ProductInput["category"],
      price: price as number,
      oldPrice: typeof oldPrice === "number" ? oldPrice : undefined,
      stock: stock as number,
      rating: Math.round(rating * 10) / 10,
      icon: str(fd, "icon") || "📦",
      imageUrl: imageUrl || undefined,
      description: str(fd, "description").slice(0, 5000),
      specs: parseSpecs(String(fd.get("specs") ?? "")),
      featured: fd.get("featured") === "on",
      active: fd.get("active") === "on",
      sortOrder: typeof sortOrder === "number" ? sortOrder : 0,
    },
  };
}
