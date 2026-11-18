import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 px-4 text-center">
      <p className="text-6xl font-extrabold text-brand">404</p>
      <h1 className="text-xl font-bold">Không tìm thấy trang</h1>
      <Link href="/" className="rounded-full bg-brand px-6 py-2.5 font-semibold text-white hover:bg-brand-dark">Về trang chủ</Link>
    </div>
  );
}
