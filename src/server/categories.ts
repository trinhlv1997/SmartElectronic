// Danh mục sản phẩm (bảng D1 `categories`), quản lý trong /admin/categories.
import { cache } from "react";
import { DEFAULT_CATEGORIES } from "@/data/categories";
import type { CategoryInfo } from "@/lib/types";
import { getDb } from "./db";

interface CategoryRow {
  id: string;
  label: string;
  icon: string;
  sort_order: number;
}

const toInfo = (r: CategoryRow): CategoryInfo => ({ id: r.id, label: r.label, icon: r.icon, sortOrder: r.sort_order });

/**
 * Danh mục theo thứ tự hiển thị. Gói bằng React cache() nên layout, header, bộ lọc… trong cùng một
 * request chỉ đọc D1 một lần. Bảng chưa migrate → dùng danh sách mặc định để website không sập.
 */
export const getCategories = cache(async (): Promise<CategoryInfo[]> => {
  try {
    const db = await getDb();
    const { results } = await db.prepare("SELECT id, label, icon, sort_order FROM categories ORDER BY sort_order, label").all<CategoryRow>();
    return results.map(toInfo);
  } catch (err) {
    console.error("getCategories: falling back to defaults", err);
    return DEFAULT_CATEGORIES;
  }
});

/** Danh mục kèm số sản phẩm (kể cả sản phẩm đang ẩn) cho trang quản trị. */
export async function listCategoriesWithCounts(): Promise<(CategoryInfo & { productCount: number })[]> {
  const db = await getDb();
  const { results } = await db
    .prepare(
      `SELECT c.id, c.label, c.icon, c.sort_order, (SELECT COUNT(*) FROM products p WHERE p.category = c.id) AS product_count
         FROM categories c ORDER BY c.sort_order, c.label`,
    )
    .all<CategoryRow & { product_count: number }>();
  return results.map((r) => ({ ...toInfo(r), productCount: r.product_count }));
}

export interface CategoryInput {
  label: string;
  icon: string;
  sortOrder: number;
}

export async function createCategory(id: string, input: CategoryInput): Promise<void> {
  const db = await getDb();
  await db
    .prepare("INSERT INTO categories (id, label, icon, sort_order) VALUES (?, ?, ?, ?)")
    .bind(id, input.label, input.icon, input.sortOrder)
    .run();
}

export async function updateCategory(id: string, input: CategoryInput): Promise<boolean> {
  const db = await getDb();
  const res = await db
    .prepare(
      "UPDATE categories SET label = ?, icon = ?, sort_order = ?, updated_at = strftime('%Y-%m-%dT%H:%M:%fZ', 'now') WHERE id = ?",
    )
    .bind(input.label, input.icon, input.sortOrder, id)
    .run();
  return (res.meta.changes ?? 0) > 0;
}

/**
 * Xóa danh mục chưa có sản phẩm nào. Điều kiện nằm ngay trong câu DELETE để không có khe hở
 * giữa lúc kiểm tra và lúc xóa (ai đó vừa thêm sản phẩm vào danh mục).
 */
export async function deleteCategory(id: string): Promise<"deleted" | "in_use" | "not_found"> {
  const db = await getDb();
  const res = await db
    .prepare("DELETE FROM categories WHERE id = ? AND NOT EXISTS (SELECT 1 FROM products WHERE category = ?)")
    .bind(id, id)
    .run();
  if ((res.meta.changes ?? 0) > 0) return "deleted";
  const exists = await db.prepare("SELECT 1 FROM categories WHERE id = ?").bind(id).first();
  return exists ? "in_use" : "not_found";
}

export type CategoryErrors = Partial<Record<"id" | "label" | "icon" | "sortOrder", string>>;

const ID_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

/** Kiểm tra form danh mục. `id` chỉ đọc khi tạo mới (sau đó không đổi vì nằm trong URL và sản phẩm). */
export function parseCategoryForm(
  fd: FormData,
  isNew: boolean,
): { ok: true; id: string; data: CategoryInput } | { ok: false; errors: CategoryErrors } {
  const label = String(fd.get("label") ?? "").trim().replace(/\s+/g, " ");
  const icon = String(fd.get("icon") ?? "").trim() || "📦";
  const sortRaw = String(fd.get("sortOrder") ?? "").trim();
  const sortOrder = sortRaw === "" ? 0 : Number(sortRaw);
  const id = String(fd.get("id") ?? "").trim().toLowerCase();

  const errors: CategoryErrors = {};
  if (!label) errors.label = "Nhập tên danh mục.";
  else if (label.length > 60) errors.label = "Tên tối đa 60 ký tự.";
  if ([...icon].length > 4) errors.icon = "Biểu tượng là 1 emoji (ví dụ 💡).";
  if (!Number.isInteger(sortOrder) || sortOrder < 0 || sortOrder > 9999) errors.sortOrder = "Thứ tự là số nguyên 0–9999.";
  if (isNew) {
    if (!id) errors.id = "Nhập mã danh mục.";
    else if (id.length > 40 || !ID_PATTERN.test(id)) errors.id = "Mã chỉ gồm chữ thường không dấu, số và dấu gạch ngang (vd: den-tuong).";
  }
  return Object.keys(errors).length ? { ok: false, errors } : { ok: true, id, data: { label, icon, sortOrder } };
}
