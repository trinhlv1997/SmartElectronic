import { NextResponse } from "next/server";
import { isAdmin } from "@/server/auth";
import { addProductImage } from "@/server/images";

// POST multipart: productId, lg (File), sm (File), width, height.
// Dùng route handler thay vì server action vì server action giới hạn body 1MB.
export async function POST(request: Request) {
  if (!(await isAdmin())) return NextResponse.json({ error: "Chưa đăng nhập." }, { status: 401 });

  let fd: FormData;
  try {
    fd = await request.formData();
  } catch {
    return NextResponse.json({ error: "Dữ liệu không hợp lệ." }, { status: 400 });
  }
  const lg = fd.get("lg");
  const sm = fd.get("sm");
  if (!(lg instanceof File) || !(sm instanceof File)) {
    return NextResponse.json({ error: "Thiếu file ảnh." }, { status: 400 });
  }

  const result = await addProductImage({
    productId: String(fd.get("productId") ?? ""),
    lg,
    sm,
    width: Number(fd.get("width")),
    height: Number(fd.get("height")),
  });
  if (!result.ok) return NextResponse.json({ error: result.error }, { status: result.status });
  return NextResponse.json({ image: result.image }, { status: 201 });
}
