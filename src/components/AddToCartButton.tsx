"use client";

import { useState } from "react";
import { useCart } from "@/context/CartContext";

export default function AddToCartButton({
  productId,
  disabled,
  className = "",
}: {
  productId: string;
  disabled?: boolean;
  className?: string;
}) {
  const { add } = useCart();
  const [added, setAdded] = useState(false);

  return (
    <button
      type="button"
      disabled={disabled}
      onClick={() => {
        add(productId);
        setAdded(true);
        setTimeout(() => setAdded(false), 1200);
      }}
      className={`rounded-full border-2 border-brand px-4 py-2 text-sm font-bold text-brand transition hover:bg-brand hover:text-white disabled:cursor-not-allowed disabled:border-slate-300 disabled:text-slate-400 disabled:hover:bg-transparent ${added ? "bg-brand text-white" : ""} ${className}`}
    >
      {disabled ? "Hết hàng" : added ? "✓ Đã thêm vào giỏ" : "Thêm vào giỏ"}
    </button>
  );
}
