# SmartElectronic

Website bán đồ điện tử viết bằng Next.js 15 (App Router), React 19, TypeScript và Tailwind CSS v4.

## Yêu cầu

Node.js 22.12 trở lên (https://nodejs.org) — Wrangler (Cloudflare CLI) yêu cầu Node 22.

## Chạy dự án

```bash
npm install
cp .dev.vars.example .dev.vars                  # mật khẩu admin cho môi trường dev
npx wrangler d1 migrations apply DB --local     # tạo database D1 local + dữ liệu mẫu
npm run dev                                      # http://localhost:3000, quản trị: /admin
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

## Quản trị (/admin)

Sản phẩm, giá, tồn kho và đơn hàng lưu trong **Cloudflare D1**. Trang `/admin` (đăng nhập bằng mật khẩu) cho phép:

- Thêm / sửa / xoá sản phẩm, ẩn/hiện, đánh dấu nổi bật, ảnh (URL), thông số
- Sửa nhanh giá bán, giá gốc, tồn kho ngay trên bảng
- Xem đơn hàng, đổi trạng thái (huỷ đơn tự hoàn tồn kho)

Thay đổi hiển thị trên website ngay, không cần deploy lại.

### Secrets

| Tên | Mô tả |
| --- | --- |
| `ADMIN_PASSWORD` | Mật khẩu đăng nhập /admin |
| `AUTH_SECRET` | Chuỗi ngẫu nhiên ký cookie phiên đăng nhập (`openssl rand -hex 32`) |

Dev: đặt trong `.dev.vars`. Production: `npx wrangler secret put ADMIN_PASSWORD` và `npx wrangler secret put AUTH_SECRET`.

### Database

Schema nằm trong `migrations/`. Thêm migration mới: `npx wrangler d1 migrations create DB <ten>`, rồi áp dụng bằng `npx wrangler d1 migrations apply DB --local` (dev) và `--remote` (production, **trước** khi deploy code dùng schema mới).

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

Cấu hình ở `wrangler.jsonc` và `open-next.config.ts`. Các trang website đọc D1 mỗi request (không cache), nên sửa trong /admin là thấy ngay.
