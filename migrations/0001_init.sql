-- Sản phẩm. Giá lưu bằng số nguyên VND. specs là JSON object {"Tên": "Giá trị"}.
CREATE TABLE products (
  id          TEXT PRIMARY KEY,
  slug        TEXT NOT NULL UNIQUE,
  sku         TEXT NOT NULL,
  name        TEXT NOT NULL,
  category    TEXT NOT NULL,
  price       INTEGER NOT NULL CHECK (price >= 0),
  old_price   INTEGER CHECK (old_price IS NULL OR old_price >= 0),
  -- CHECK đảm bảo đặt hàng vượt tồn kho làm cả batch (transaction) thất bại.
  stock       INTEGER NOT NULL DEFAULT 0 CHECK (stock >= 0),
  rating      REAL NOT NULL DEFAULT 5,
  icon        TEXT NOT NULL DEFAULT '📦',
  image_url   TEXT,
  description TEXT NOT NULL DEFAULT '',
  specs       TEXT NOT NULL DEFAULT '{}',
  featured    INTEGER NOT NULL DEFAULT 0,
  active      INTEGER NOT NULL DEFAULT 1,
  sort_order  INTEGER NOT NULL DEFAULT 0,
  created_at  TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')),
  updated_at  TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now'))
);
CREATE INDEX idx_products_category ON products(category);
CREATE INDEX idx_products_active ON products(active, sort_order);

CREATE TABLE orders (
  id             TEXT PRIMARY KEY,
  created_at     TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')),
  customer_name  TEXT NOT NULL,
  phone          TEXT NOT NULL,
  address        TEXT NOT NULL,
  note           TEXT,
  total          INTEGER NOT NULL,
  status         TEXT NOT NULL DEFAULT 'new' -- new | confirmed | shipping | done | cancelled
);
CREATE INDEX idx_orders_created ON orders(created_at DESC);

-- Lưu snapshot tên + đơn giá lúc đặt để đơn cũ không đổi khi sửa giá sản phẩm.
CREATE TABLE order_items (
  order_id    TEXT NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  product_id  TEXT NOT NULL,
  name        TEXT NOT NULL,
  unit_price  INTEGER NOT NULL,
  quantity    INTEGER NOT NULL CHECK (quantity > 0),
  PRIMARY KEY (order_id, product_id)
);
