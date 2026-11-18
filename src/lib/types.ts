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
  icon: string; // placeholder thay cho ảnh thật
  description: string;
  specs: Record<string, string>;
  featured?: boolean;
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
