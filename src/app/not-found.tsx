import Link from "next/link";

export default function NotFound() {
  return (
    <div className="py-20 text-center">
      <h1 className="text-2xl font-bold">Không tìm thấy trang</h1>
      <Link href="/products" className="mt-4 inline-block text-brand hover:underline">← Xem sản phẩm</Link>
    </div>
  );
}
