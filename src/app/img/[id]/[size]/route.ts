import { getImageFile } from "@/server/images";

// GET /img/<id>/<lg|sm>: trả ảnh từ KV. Id ảnh là ngẫu nhiên và nội dung không bao giờ đổi
// (sửa = xoá + upload ảnh mới) nên cache "immutable" 1 năm ở trình duyệt/CDN.
export async function GET(_req: Request, { params }: { params: Promise<{ id: string; size: string }> }) {
  const { id, size } = await params;
  if (!/^[a-f0-9]{16}$/.test(id) || (size !== "lg" && size !== "sm")) {
    return new Response("Not found", { status: 404 });
  }
  const { value, metadata } = await getImageFile(id, size);
  if (!value) return new Response("Not found", { status: 404, headers: { "Cache-Control": "public, max-age=60" } });

  return new Response(value, {
    headers: {
      "Content-Type": metadata?.mime ?? "image/webp",
      "Cache-Control": "public, max-age=31536000, immutable",
      "X-Content-Type-Options": "nosniff",
    },
  });
}
