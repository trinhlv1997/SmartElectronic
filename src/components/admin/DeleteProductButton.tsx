"use client";

import { deleteProductAction } from "@/app/admin/actions";

export default function DeleteProductButton({ id, name }: { id: string; name: string }) {
  return (
    <form
      action={deleteProductAction.bind(null, id)}
      onSubmit={(e) => {
        if (!confirm(`Xoá vĩnh viễn “${name}”? Đơn hàng cũ vẫn giữ tên và giá lúc đặt.\nNếu chỉ muốn tạm ẩn, hãy bỏ chọn “Hiển thị trên website”.`)) e.preventDefault();
      }}
    >
      <button className="rounded-full border border-red-300 px-4 py-2 text-sm font-semibold text-red-600 hover:bg-red-50">Xoá sản phẩm</button>
    </form>
  );
}
