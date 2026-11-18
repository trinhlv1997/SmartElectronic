"use client";

import { useEffect, useMemo, useState } from "react";
import { useCart } from "@/context/CartContext";
import type { Product } from "@/lib/types";

export interface CartLine {
  product: Product;
  quantity: number;
}

/**
 * Ghép item trong giỏ (chỉ lưu id + số lượng) với giá/tồn kho mới nhất từ /api/products.
 * Item có sản phẩm đã bị xoá/ẩn sẽ bị bỏ qua.
 */
export function useCartLines() {
  const { items, hydrated } = useCart();
  // key = bộ id đã tải xong; loading khi key khác bộ id hiện tại (vừa thêm sản phẩm mới vào giỏ).
  const [fetched, setFetched] = useState<{ key: string; products: Product[] } | null>(null);
  const idsKey = useMemo(() => [...new Set(items.map((i) => i.productId))].sort().join(","), [items]);

  useEffect(() => {
    if (!hydrated) return;
    if (!idsKey) {
      setFetched({ key: "", products: [] });
      return;
    }
    const controller = new AbortController();
    fetch(`/api/products?ids=${encodeURIComponent(idsKey)}`, { signal: controller.signal })
      .then((r) => (r.ok ? r.json() : Promise.reject(r.status)))
      .then((data) => data as { products: Product[] })
      .then((data) => setFetched({ key: idsKey, products: data.products }))
      .catch((err) => {
        if (err?.name !== "AbortError") setFetched({ key: idsKey, products: [] });
      });
    return () => controller.abort();
  }, [idsKey, hydrated]);

  return useMemo(() => {
    const products = fetched?.products ?? [];
    const lines: CartLine[] = items.flatMap((i) => {
      const product = products.find((p) => p.id === i.productId);
      return product ? [{ product, quantity: i.quantity }] : [];
    });
    const subtotal = lines.reduce((sum, l) => sum + l.product.price * l.quantity, 0);
    // Chỉ "đang tải" khi giỏ có id chưa được fetch (thêm mới); xoá/đổi số lượng thì không nháy.
    const fetchedIds = new Set(fetched?.key.split(",") ?? []);
    const loading = !hydrated || fetched === null || items.some((i) => !fetchedIds.has(i.productId));
    return { lines, subtotal, loading };
  }, [items, fetched, hydrated]);
}
