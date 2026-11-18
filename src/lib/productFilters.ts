// Bộ lọc sản phẩm được lưu hoàn toàn trên URL (?q=&category=&min=&max=&stock=1&sale=1&sort=)
// để có thể chia sẻ link, dùng nút Back và render phía server.
// File này không có "use client" nên dùng được ở cả server và client component.
import type { Category, Product } from "@/lib/types";

export const SORTS = [
  { id: "price-asc", label: "Giá tăng dần" },
  { id: "price-desc", label: "Giá giảm dần" },
  { id: "rating", label: "Đánh giá cao" },
  { id: "discount", label: "Giảm giá nhiều" },
] as const;

export type SortId = (typeof SORTS)[number]["id"];

export const PRICE_RANGES: { label: string; min?: number; max?: number }[] = [
  { label: "Dưới 100.000₫", max: 100000 },
  { label: "100.000₫ – 500.000₫", min: 100000, max: 500000 },
  { label: "500.000₫ – 1 triệu", min: 500000, max: 1000000 },
  { label: "1 – 3 triệu", min: 1000000, max: 3000000 },
  { label: "Trên 3 triệu", min: 3000000 },
];

export interface ProductFilters {
  q?: string;
  category?: Category;
  min?: number;
  max?: number;
  inStock?: boolean;
  onSale?: boolean;
  sort?: SortId;
}

type RawParams = Record<string, string | string[] | undefined>;

const first = (v: string | string[] | undefined) => (Array.isArray(v) ? v[0] : v);

function parsePrice(v: string | undefined): number | undefined {
  if (!v) return undefined;
  const n = Number(v.replace(/[^\d]/g, ""));
  return Number.isFinite(n) && n > 0 ? n : undefined;
}

export function parseFilters(params: RawParams, isCategory: (v: unknown) => v is Category): ProductFilters {
  const q = first(params.q)?.trim().slice(0, 100) || undefined;
  const categoryRaw = first(params.category);
  const sortRaw = first(params.sort);
  let min = parsePrice(first(params.min));
  let max = parsePrice(first(params.max));
  if (min !== undefined && max !== undefined && min > max) [min, max] = [max, min];

  return {
    q,
    category: isCategory(categoryRaw) ? categoryRaw : undefined,
    min,
    max,
    inStock: first(params.stock) === "1" || undefined,
    onSale: first(params.sale) === "1" || undefined,
    sort: SORTS.find((s) => s.id === sortRaw)?.id,
  };
}

export function filtersHref(f: ProductFilters): string {
  const sp = new URLSearchParams();
  if (f.q) sp.set("q", f.q);
  if (f.category) sp.set("category", f.category);
  if (f.min !== undefined) sp.set("min", String(f.min));
  if (f.max !== undefined) sp.set("max", String(f.max));
  if (f.inStock) sp.set("stock", "1");
  if (f.onSale) sp.set("sale", "1");
  if (f.sort) sp.set("sort", f.sort);
  const qs = sp.toString();
  return qs ? `/products?${qs}` : "/products";
}

/** Số bộ lọc đang bật (không tính sắp xếp). */
export function countActiveFilters(f: ProductFilters): number {
  return [f.q, f.category, f.min !== undefined || f.max !== undefined, f.inStock, f.onSale].filter(Boolean).length;
}

/** Bỏ dấu tiếng Việt + lowercase để "den led" khớp "Đèn LED". */
export function normalizeText(s: string): string {
  return s
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/đ/g, "d")
    .replace(/Đ/g, "D")
    .toLowerCase()
    .trim();
}

/** Lọc + sắp xếp một danh sách sản phẩm theo bộ lọc (thuần, không truy cập DB). */
export function filterProducts(products: Product[], f: ProductFilters, labelOf: (c: Category) => string): Product[] {
  const tokens = f.q ? normalizeText(f.q).split(/\s+/).filter(Boolean) : [];

  const list = products.filter((p) => {
    if (f.category && p.category !== f.category) return false;
    if (f.min !== undefined && p.price < f.min) return false;
    if (f.max !== undefined && p.price > f.max) return false;
    if (f.inStock && p.stock === 0) return false;
    if (f.onSale && !(p.oldPrice && p.oldPrice > p.price)) return false;
    if (tokens.length) {
      const haystack = normalizeText(`${p.name} ${p.sku} ${labelOf(p.category)}`);
      if (!tokens.every((t) => haystack.includes(t))) return false;
    }
    return true;
  });

  const discount = (p: Product) => (p.oldPrice ? (p.oldPrice - p.price) / p.oldPrice : 0);
  switch (f.sort) {
    case "price-asc": return [...list].sort((a, b) => a.price - b.price);
    case "price-desc": return [...list].sort((a, b) => b.price - a.price);
    case "rating": return [...list].sort((a, b) => b.rating - a.rating);
    case "discount": return [...list].sort((a, b) => discount(b) - discount(a));
    default: return list;
  }
}
