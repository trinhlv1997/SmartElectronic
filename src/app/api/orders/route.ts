import { NextResponse } from "next/server";
import type { OrderInput } from "@/lib/types";
import { createOrder } from "@/server/orders";

export async function POST(request: Request) {
  let body: OrderInput;
  try {
    body = (await request.json()) as OrderInput;
  } catch {
    return NextResponse.json({ error: "Dữ liệu không hợp lệ." }, { status: 400 });
  }

  const result = await createOrder(body);
  if (!result.ok) return NextResponse.json({ error: result.error }, { status: 400 });
  return NextResponse.json({ order: result.order }, { status: 201 });
}
