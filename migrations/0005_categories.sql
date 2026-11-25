-- Danh mục sản phẩm do admin quản lý trong /admin/categories (trước đây cố định trong code).
-- id là slug dùng trong URL (/products?category=<id>) và cột products.category.
CREATE TABLE categories (
  id          TEXT PRIMARY KEY,
  label       TEXT NOT NULL,
  icon        TEXT NOT NULL DEFAULT '📦',
  sort_order  INTEGER NOT NULL DEFAULT 0,
  created_at  TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')),
  updated_at  TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now'))
);

INSERT OR IGNORE INTO categories (id, label, icon, sort_order) VALUES
  ('downlight', 'Đèn LED Downlight', '🔆', 10),
  ('panel', 'Đèn LED Panel', '🔲', 20),
  ('bulb', 'Bóng đèn LED', '💡', 30),
  ('outdoor', 'Đèn đường & pha', '🔦', 40),
  ('electrical', 'Thiết bị điện', '🔌', 50),
  ('smart', 'Thiết bị thông minh', '📶', 60),
  ('solar', 'Năng lượng mặt trời', '☀️', 70),
  ('household', 'Đồ gia dụng', '🏠', 80);
