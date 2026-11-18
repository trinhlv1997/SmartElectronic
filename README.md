# SmartElectronic

Website bán đồ điện tử viết bằng Next.js 15 (App Router), React 19, TypeScript và Tailwind CSS v4.

## Yêu cầu

Node.js 20 trở lên (https://nodejs.org).

## Chạy dự án

```bash
npm install
npm run dev        # http://localhost:3000
```

| Lệnh | Mô tả |
| --- | --- |
| `npm run dev` | Chạy môi trường phát triển |
| `npm run build` | Build bản production |
| `npm start` | Chạy bản đã build |
| `npm run lint` | Kiểm tra ESLint |
| `npm run typecheck` | Kiểm tra kiểu TypeScript |

## Tính năng

- Trang chủ: banner, danh mục, sản phẩm nổi bật
- Danh sách sản phẩm: lọc theo danh mục, tìm kiếm, sắp xếp
- Chi tiết sản phẩm: giá, giảm giá, tồn kho, thông số
- Giỏ hàng lưu trong localStorage
- Đặt hàng COD qua `POST /api/orders`

Dữ liệu sản phẩm và đơn hàng hiện là dữ liệu mẫu (`src/data/products.ts`, `src/lib/orders.ts`); cần thay bằng database khi triển khai thật.
