const vnd = new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" });

export function formatPrice(value: number): string {
  return vnd.format(value);
}

export function discountPercent(price: number, oldPrice?: number): number | null {
  if (!oldPrice || oldPrice <= price) return null;
  return Math.round(((oldPrice - price) / oldPrice) * 100);
}
