export type Category =
  | "downlight"
  | "panel"
  | "bulb"
  | "outdoor"
  | "electrical"
  | "smart"
  | "solar"
  | "household";

export interface Product {
  id: string;
  slug: string;
  sku: string; // mã sản phẩm hiển thị trên thẻ
  name: string;
  category: Category;
  price: number; // VND
  oldPrice?: number; // VND, giá trước khi giảm
  stock: number;
  rating: number; // 0-5
  icon: string; // hiển thị khi chưa có ảnh
  imageUrl?: string;
  description: string;
  specs: Record<string, string>;
  featured: boolean;
  active: boolean; // false = ẩn khỏi website
  sortOrder: number;
  updatedAt?: string;
}

export interface CartItem {
  productId: string;
  quantity: number;
}

export interface OrderInput {
  customer: {
    name: string;
    phone: string;
    address: string;
    note?: string;
  };
  items: CartItem[];
}

export const ORDER_STATUSES = [
  { id: "new", label: "Mới", color: "bg-blue-100 text-blue-700" },
  { id: "confirmed", label: "Đã xác nhận", color: "bg-amber-100 text-amber-700" },
  { id: "shipping", label: "Đang giao", color: "bg-violet-100 text-violet-700" },
  { id: "done", label: "Hoàn thành", color: "bg-green-100 text-green-700" },
  { id: "cancelled", label: "Đã huỷ", color: "bg-slate-200 text-slate-600" },
] as const;

export type OrderStatus = (typeof ORDER_STATUSES)[number]["id"];

export interface OrderLine {
  productId: string;
  name: string;
  unitPrice: number;
  quantity: number;
}

export interface Order {
  id: string;
  createdAt: string;
  customer: OrderInput["customer"];
  lines: OrderLine[];
  total: number;
  status: OrderStatus;
}
