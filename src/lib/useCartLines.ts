"use client";

import { useMemo } from "react";
import { useCart } from "@/context/CartContext";
import { getProductsByIds } from "@/data/products";
import type { Product } from "@/lib/types";

export interface CartLine {
  product: Product;
  quantity: number;
}

// Ghép item trong giỏ với dữ liệu sản phẩm. Bỏ qua item có productId không còn tồn tại.
export function useCartLines() {
  const { items } = useCart();
  return useMemo(() => {
    const products = getProductsByIds(items.map((i) => i.productId));
    const lines: CartLine[] = items.flatMap((i) => {
      const product = products.find((p) => p.id === i.productId);
      return product ? [{ product, quantity: i.quantity }] : [];
    });
    const subtotal = lines.reduce((sum, l) => sum + l.product.price * l.quantity, 0);
    return { lines, subtotal };
  }, [items]);
}
