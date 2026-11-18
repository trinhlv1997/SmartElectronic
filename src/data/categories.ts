import type { Category } from "@/lib/types";

// Danh mục cố định trong code (khớp cột products.category trong D1).
export const CATEGORIES: { id: Category; label: string; icon: string }[] = [
  { id: "downlight", label: "Đèn LED Downlight", icon: "🔆" },
  { id: "panel", label: "Đèn LED Panel", icon: "🔲" },
  { id: "bulb", label: "Bóng đèn LED", icon: "💡" },
  { id: "outdoor", label: "Đèn đường & pha", icon: "🔦" },
  { id: "electrical", label: "Thiết bị điện", icon: "🔌" },
  { id: "smart", label: "Thiết bị thông minh", icon: "📶" },
  { id: "solar", label: "Năng lượng mặt trời", icon: "☀️" },
  { id: "household", label: "Đồ gia dụng", icon: "🏠" },
];

export function isCategory(value: unknown): value is Category {
  return CATEGORIES.some((c) => c.id === value);
}

export function categoryLabel(id: Category): string {
  return CATEGORIES.find((c) => c.id === id)?.label ?? id;
}
