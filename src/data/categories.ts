import type { Category, CategoryInfo } from "@/lib/types";

// Danh mục được quản lý trong /admin/categories (bảng D1 `categories`).
// Danh sách này chỉ là dự phòng khi bảng chưa được migrate (xem getCategories()).
export const DEFAULT_CATEGORIES: CategoryInfo[] = [
  { id: "downlight", label: "Đèn LED Downlight", icon: "🔆", sortOrder: 10 },
  { id: "panel", label: "Đèn LED Panel", icon: "🔲", sortOrder: 20 },
  { id: "bulb", label: "Bóng đèn LED", icon: "💡", sortOrder: 30 },
  { id: "outdoor", label: "Đèn đường & pha", icon: "🔦", sortOrder: 40 },
  { id: "electrical", label: "Thiết bị điện", icon: "🔌", sortOrder: 50 },
  { id: "smart", label: "Thiết bị thông minh", icon: "📶", sortOrder: 60 },
  { id: "solar", label: "Năng lượng mặt trời", icon: "☀️", sortOrder: 70 },
  { id: "household", label: "Đồ gia dụng", icon: "🏠", sortOrder: 80 },
];

/** Type guard bound to the current category list. */
export function isCategoryIn(categories: readonly CategoryInfo[]) {
  const ids = new Set(categories.map((c) => c.id));
  return (value: unknown): value is Category => typeof value === "string" && ids.has(value);
}

/** Label lookup bound to the current category list (falls back to the id). */
export function labelOf(categories: readonly CategoryInfo[]) {
  const labels = new Map(categories.map((c) => [c.id, c.label]));
  return (id: Category): string => labels.get(id) ?? id;
}
