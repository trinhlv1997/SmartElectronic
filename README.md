# SmartElectronic

Website bán đồ điện tử viết bằng Next.js 15 (App Router), React 19, TypeScript và Tailwind CSS v4.

## Yêu cầu

Node.js 22.12 trở lên (https://nodejs.org) — Wrangler (Cloudflare CLI) yêu cầu Node 22.

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
| `npm run preview` | Build và chạy thử trên runtime Cloudflare (workerd) tại máy |
| `npm run deploy` | Build và deploy lên Cloudflare Workers |

## Tính năng

- Trang chủ: banner, danh mục, sản phẩm nổi bật
- Danh sách sản phẩm: lọc theo danh mục, tìm kiếm, sắp xếp
- Chi tiết sản phẩm: giá, giảm giá, tồn kho, thông số
- Giỏ hàng lưu trong localStorage
- Đặt hàng COD qua `POST /api/orders`

Dữ liệu sản phẩm và đơn hàng hiện là dữ liệu mẫu (`src/data/products.ts`, `src/lib/orders.ts`); cần thay bằng database khi triển khai thật.

## Deploy lên Cloudflare Workers (gói free)

Dùng adapter [OpenNext for Cloudflare](https://opennext.js.org/cloudflare).

```bash
npx wrangler login   # chỉ cần lần đầu
npm run deploy       # site chạy tại https://smart-electronic.<subdomain>.workers.dev
```

### Tự động deploy khi push (Cloudflare Workers Builds)

Repo được kết nối với Cloudflare Workers Builds: mỗi lần push lên nhánh `main`, Cloudflare tự build và deploy. Các nhánh khác được build thành bản preview riêng.

- Build command: `npx opennextjs-cloudflare build`
- Deploy command: `npx opennextjs-cloudflare deploy`
- Phiên bản Node lấy từ `.nvmrc` (22).

Cấu hình ở `wrangler.jsonc` và `open-next.config.ts`. Cache dùng Workers static assets (miễn phí, không cần R2) nên trang dựng sẵn không được tạo lại định kỳ (không có ISR); muốn cập nhật nội dung thì deploy lại.
