import Link from "next/link";

export default function ShopNotFound() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-20 text-center">
      <p className="text-5xl">🔍</p>
      <h1 className="mt-4 text-2xl font-bold">Không tìm thấy sản phẩm hoặc trang</h1>
      <Link href="/products" className="mt-6 inline-block rounded-full bg-brand px-6 py-2.5 font-semibold text-white hover:bg-brand-dark">
        Xem sản phẩm
      </Link>
    </div>
  );
}
