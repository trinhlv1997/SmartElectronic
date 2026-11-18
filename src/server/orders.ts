import type { Order, OrderInput, OrderLine, OrderStatus } from "@/lib/types";
import { getDb } from "./db";

export type CreateOrderResult = { ok: true; order: Order } | { ok: false; error: string };

interface PriceRow {
  id: string;
  name: string;
  price: number;
  stock: number;
}

export async function createOrder(input: OrderInput): Promise<CreateOrderResult> {
  const { customer, items } = input ?? {};
  if (!customer?.name?.trim() || !customer?.address?.trim()) {
    return { ok: false, error: "Vui lòng nhập họ tên và địa chỉ." };
  }
  if (!/^0\d{9}$/.test(customer.phone ?? "")) {
    return { ok: false, error: "Số điện thoại không hợp lệ (10 số, bắt đầu bằng 0)." };
  }
  if (!Array.isArray(items) || items.length === 0 || items.length > 50) {
    return { ok: false, error: "Giỏ hàng trống." };
  }

  const db = await getDb();
  const ids = [...new Set(items.map((i) => String(i.productId)))];
  const { results } = await db
    .prepare(`SELECT id, name, price, stock FROM products WHERE active = 1 AND id IN (${ids.map(() => "?").join(",")})`)
    .bind(...ids)
    .all<PriceRow>();

  // Giá luôn lấy từ database, không tin giá client gửi lên.
  const lines: OrderLine[] = [];
  for (const item of items) {
    const product = results.find((p) => p.id === item.productId);
    if (!product) return { ok: false, error: "Có sản phẩm không còn bán, vui lòng kiểm tra lại giỏ hàng." };
    if (!Number.isInteger(item.quantity) || item.quantity < 1) {
      return { ok: false, error: `Số lượng không hợp lệ cho ${product.name}.` };
    }
    if (item.quantity > product.stock) {
      return { ok: false, error: `${product.name} chỉ còn ${product.stock} sản phẩm.` };
    }
    lines.push({ productId: product.id, name: product.name, unitPrice: product.price, quantity: item.quantity });
  }

  const order: Order = {
    id: `SE${Date.now().toString(36).toUpperCase()}${crypto.randomUUID().slice(0, 2).toUpperCase()}`,
    createdAt: new Date().toISOString(),
    customer: {
      name: customer.name.trim().slice(0, 100),
      phone: customer.phone,
      address: customer.address.trim().slice(0, 300),
      note: customer.note?.trim().slice(0, 500) || undefined,
    },
    lines,
    total: lines.reduce((sum, l) => sum + l.unitPrice * l.quantity, 0),
    status: "new",
  };

  // batch() chạy trong một transaction. Nếu có người mua trước làm stock không đủ,
  // CHECK (stock >= 0) làm câu UPDATE lỗi và toàn bộ đơn bị rollback.
  try {
    await db.batch([
      db
        .prepare("INSERT INTO orders (id, created_at, customer_name, phone, address, note, total, status) VALUES (?, ?, ?, ?, ?, ?, ?, 'new')")
        .bind(order.id, order.createdAt, order.customer.name, order.customer.phone, order.customer.address, order.customer.note ?? null, order.total),
      ...lines.flatMap((l) => [
        db.prepare("INSERT INTO order_items (order_id, product_id, name, unit_price, quantity) VALUES (?, ?, ?, ?, ?)")
          .bind(order.id, l.productId, l.name, l.unitPrice, l.quantity),
        db.prepare("UPDATE products SET stock = stock - ? WHERE id = ?").bind(l.quantity, l.productId),
      ]),
    ]);
  } catch (err) {
    if (String(err).includes("CHECK constraint")) {
      return { ok: false, error: "Sản phẩm vừa hết hàng, vui lòng kiểm tra lại giỏ hàng." };
    }
    throw err;
  }
  return { ok: true, order };
}

interface OrderRow {
  id: string;
  created_at: string;
  customer_name: string;
  phone: string;
  address: string;
  note: string | null;
  total: number;
  status: OrderStatus;
}

interface ItemRow {
  order_id: string;
  product_id: string;
  name: string;
  unit_price: number;
  quantity: number;
}

export async function listOrders(limit = 100): Promise<Order[]> {
  const db = await getDb();
  const [orders, items] = await db.batch([
    db.prepare("SELECT * FROM orders ORDER BY created_at DESC LIMIT ?").bind(limit),
    db.prepare("SELECT * FROM order_items WHERE order_id IN (SELECT id FROM orders ORDER BY created_at DESC LIMIT ?)").bind(limit),
  ]);
  const itemRows = items.results as ItemRow[];
  return (orders.results as OrderRow[]).map((o) => ({
    id: o.id,
    createdAt: o.created_at,
    customer: { name: o.customer_name, phone: o.phone, address: o.address, note: o.note ?? undefined },
    total: o.total,
    status: o.status,
    lines: itemRows
      .filter((i) => i.order_id === o.id)
      .map((i) => ({ productId: i.product_id, name: i.name, unitPrice: i.unit_price, quantity: i.quantity })),
  }));
}

/** Đổi trạng thái đơn. Huỷ đơn thì hoàn lại tồn kho; mở lại đơn đã huỷ thì trừ lại. */
export async function updateOrderStatus(id: string, status: OrderStatus): Promise<{ ok: boolean; error?: string }> {
  const db = await getDb();
  const current = await db.prepare("SELECT status FROM orders WHERE id = ?").bind(id).first<{ status: OrderStatus }>();
  if (!current) return { ok: false, error: "Không tìm thấy đơn hàng." };
  if (current.status === status) return { ok: true };

  const stmts = [db.prepare("UPDATE orders SET status = ? WHERE id = ?").bind(status, id)];
  const sign = status === "cancelled" ? 1 : current.status === "cancelled" ? -1 : 0;
  if (sign !== 0) {
    stmts.push(
      db
        .prepare(
          `UPDATE products SET stock = stock + ? * (SELECT quantity FROM order_items WHERE order_id = ? AND product_id = products.id)
           WHERE id IN (SELECT product_id FROM order_items WHERE order_id = ?)`,
        )
        .bind(sign, id, id),
    );
  }
  try {
    await db.batch(stmts);
  } catch (err) {
    if (String(err).includes("CHECK constraint")) return { ok: false, error: "Không đủ tồn kho để mở lại đơn này." };
    throw err;
  }
  return { ok: true };
}

export async function getDashboardStats() {
  const db = await getDb();
  const [p, o] = await db.batch([
    db.prepare("SELECT COUNT(*) AS total, SUM(active) AS active, SUM(CASE WHEN stock = 0 THEN 1 ELSE 0 END) AS out_of_stock FROM products"),
    db.prepare(
      `SELECT COUNT(*) AS total,
              SUM(CASE WHEN status = 'new' THEN 1 ELSE 0 END) AS pending,
              COALESCE(SUM(CASE WHEN status != 'cancelled' THEN total ELSE 0 END), 0) AS revenue
       FROM orders`,
    ),
  ]);
  const pr = p.results[0] as { total: number; active: number | null; out_of_stock: number | null };
  const or = o.results[0] as { total: number; pending: number | null; revenue: number };
  return {
    products: pr.total,
    activeProducts: pr.active ?? 0,
    outOfStock: pr.out_of_stock ?? 0,
    orders: or.total,
    pendingOrders: or.pending ?? 0,
    revenue: or.revenue,
  };
}
