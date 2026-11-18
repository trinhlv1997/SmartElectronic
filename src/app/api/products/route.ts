import { NextResponse } from "next/server";
import { getActiveProductsByIds } from "@/server/products";

// GET /api/products?ids=p1,p2 — giỏ hàng (client) lấy giá/tồn kho mới nhất từ D1.
export async function GET(request: Request) {
  const ids = (new URL(request.url).searchParams.get("ids") ?? "")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean)
    .slice(0, 50);
  const products = await getActiveProductsByIds(ids);
  return NextResponse.json({ products }, { headers: { "Cache-Control": "no-store" } });
}
