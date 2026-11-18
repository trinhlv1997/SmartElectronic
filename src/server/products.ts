// Truy cập bảng products. Chỉ import từ server component / route handler / server action.
import { categoryLabel, isCategory } from "@/data/categories";
import { filterProducts, type ProductFilters } from "@/lib/productFilters";
import type { Category, Product } from "@/lib/types";
import { getDb } from "./db";

interface ProductRow {
  id: string;
  slug: string;
  sku: string;
  name: string;
  category: string;
  price: number;
  old_price: number | null;
  stock: number;
  rating: number;
  icon: string;
  image_url: string | null;
  description: string;
  specs: string;
  featured: number;
  active: number;
  sort_order: number;
  updated_at: string;
}

function toProduct(r: ProductRow): Product {
  let specs: Record<string, string> = {};
  try {
    specs = JSON.parse(r.specs);
  } catch {
    // specs hỏng: hiển thị rỗng thay vì làm sập trang
  }
  return {
    id: r.id,
    slug: r.slug,
    sku: r.sku,
    name: r.name,
    category: (isCategory(r.category) ? r.category : "household") as Category,
    price: r.price,
    oldPrice: r.old_price ?? undefined,
    stock: r.stock,
    rating: r.rating,
    icon: r.icon,
    imageUrl: r.image_url ?? undefined,
    description: r.description,
    specs,
    featured: r.featured === 1,
    active: r.active === 1,
    sortOrder: r.sort_order,
    updatedAt: r.updated_at,
  };
}

const ORDER_BY = "ORDER BY sort_order, created_at";

/* ---------- Website (chỉ sản phẩm đang hiển thị) ---------- */

export async function listActiveProducts(): Promise<Product[]> {
  const db = await getDb();
  const { results } = await db.prepare(`SELECT * FROM products WHERE active = 1 ${ORDER_BY}`).all<ProductRow>();
  return results.map(toProduct);
}

export async function searchProducts(f: ProductFilters) {
  const all = await listActiveProducts();
  const products = filterProducts(all, f, categoryLabel);
  // Số sản phẩm mỗi danh mục khi áp các bộ lọc còn lại.
  const counts = {} as Record<Category, number>;
  for (const p of filterProducts(all, { ...f, category: undefined, sort: undefined }, categoryLabel)) {
    counts[p.category] = (counts[p.category] ?? 0) + 1;
  }
  return { products, categoryCounts: counts };
}

export async function getActiveProductBySlug(slug: string): Promise<Product | null> {
  const db = await getDb();
  const row = await db.prepare("SELECT * FROM products WHERE slug = ? AND active = 1").bind(slug).first<ProductRow>();
  return row ? toProduct(row) : null;
}

export async function getActiveProductsByIds(ids: string[]): Promise<Product[]> {
  if (ids.length === 0) return [];
  const db = await getDb();
  const placeholders = ids.map(() => "?").join(",");
  const { results } = await db
    .prepare(`SELECT * FROM products WHERE active = 1 AND id IN (${placeholders})`)
    .bind(...ids)
    .all<ProductRow>();
  return results.map(toProduct);
}

/* ---------- Admin ---------- */

export async function listAllProducts(): Promise<Product[]> {
  const db = await getDb();
  const { results } = await db.prepare(`SELECT * FROM products ${ORDER_BY}`).all<ProductRow>();
  return results.map(toProduct);
}

export async function getProductById(id: string): Promise<Product | null> {
  const db = await getDb();
  const row = await db.prepare("SELECT * FROM products WHERE id = ?").bind(id).first<ProductRow>();
  return row ? toProduct(row) : null;
}

export type ProductInput = Omit<Product, "id" | "updatedAt">;

const NOW = "strftime('%Y-%m-%dT%H:%M:%fZ', 'now')";

function inputParams(p: ProductInput) {
  return [
    p.slug, p.sku, p.name, p.category, p.price, p.oldPrice ?? null, p.stock, p.rating, p.icon,
    p.imageUrl ?? null, p.description, JSON.stringify(p.specs), p.featured ? 1 : 0, p.active ? 1 : 0, p.sortOrder,
  ];
}

export async function createProduct(p: ProductInput): Promise<string> {
  const db = await getDb();
  const id = `p_${crypto.randomUUID().slice(0, 8)}`;
  await db
    .prepare(
      `INSERT INTO products (id, slug, sku, name, category, price, old_price, stock, rating, icon, image_url, description, specs, featured, active, sort_order)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    )
    .bind(id, ...inputParams(p))
    .run();
  return id;
}

export async function updateProduct(id: string, p: ProductInput): Promise<void> {
  const db = await getDb();
  await db
    .prepare(
      `UPDATE products SET slug = ?, sku = ?, name = ?, category = ?, price = ?, old_price = ?, stock = ?, rating = ?, icon = ?,
       image_url = ?, description = ?, specs = ?, featured = ?, active = ?, sort_order = ?, updated_at = ${NOW} WHERE id = ?`,
    )
    .bind(...inputParams(p), id)
    .run();
}

/** Sửa nhanh giá / tồn kho / trạng thái hiển thị từ bảng danh sách. */
export async function updateProductQuick(
  id: string,
  q: { price: number; oldPrice?: number; stock: number; active: boolean },
): Promise<void> {
  const db = await getDb();
  await db
    .prepare(`UPDATE products SET price = ?, old_price = ?, stock = ?, active = ?, updated_at = ${NOW} WHERE id = ?`)
    .bind(q.price, q.oldPrice ?? null, q.stock, q.active ? 1 : 0, id)
    .run();
}

export async function deleteProduct(id: string): Promise<void> {
  const db = await getDb();
  // order_items giữ snapshot tên/giá nên xoá sản phẩm không ảnh hưởng đơn cũ.
  await db.prepare("DELETE FROM products WHERE id = ?").bind(id).run();
}
