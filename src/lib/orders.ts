import { getProductsByIds } from "@/data/products";
import type { OrderInput } from "@/lib/types";

export interface Order {
  id: string;
  createdAt: string;
  customer: OrderInput["customer"];
  lines: { productId: string; name: string; unitPrice: number; quantity: number }[];
  total: number;
}

// Lưu tạm trong bộ nhớ — mất khi restart server. Thay bằng database khi triển khai thật.
const orders = new Map<string, Order>();

export type CreateOrderResult = { ok: true; order: Order } | { ok: false; error: string };

export function createOrder(input: OrderInput): CreateOrderResult {
  const { customer, items } = input ?? {};
  if (!customer?.name?.trim() || !customer?.address?.trim()) {
    return { ok: false, error: "Vui lòng nhập họ tên và địa chỉ." };
  }
  if (!/^0\d{9}$/.test(customer.phone ?? "")) {
    return { ok: false, error: "Số điện thoại không hợp lệ (10 số, bắt đầu bằng 0)." };
  }
  if (!Array.isArray(items) || items.length === 0) {
    return { ok: false, error: "Giỏ hàng trống." };
  }

  // Giá luôn lấy từ dữ liệu server, không tin giá client gửi lên.
  const products = getProductsByIds(items.map((i) => i.productId));
  const lines: Order["lines"] = [];
  for (const item of items) {
    const product = products.find((p) => p.id === item.productId);
    if (!product) return { ok: false, error: `Sản phẩm ${item.productId} không tồn tại.` };
    if (!Number.isInteger(item.quantity) || item.quantity < 1) {
      return { ok: false, error: `Số lượng không hợp lệ cho ${product.name}.` };
    }
    if (item.quantity > product.stock) {
      return { ok: false, error: `${product.name} chỉ còn ${product.stock} sản phẩm.` };
    }
    lines.push({ productId: product.id, name: product.name, unitPrice: product.price, quantity: item.quantity });
  }

  const order: Order = {
    id: `SE${Date.now().toString(36).toUpperCase()}`,
    createdAt: new Date().toISOString(),
    customer: {
      name: customer.name.trim(),
      phone: customer.phone,
      address: customer.address.trim(),
      note: customer.note?.trim() || undefined,
    },
    lines,
    total: lines.reduce((sum, l) => sum + l.unitPrice * l.quantity, 0),
  };
  orders.set(order.id, order);
  return { ok: true, order };
}
