-- Ảnh sản phẩm. File ảnh nằm trong KV (binding MEDIA) ở key img/<id>/lg và img/<id>/sm;
-- bảng này chỉ giữ metadata + thứ tự. Ảnh có sort_order nhỏ nhất là ảnh bìa.
CREATE TABLE product_images (
  id          TEXT PRIMARY KEY,
  product_id  TEXT NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  sort_order  INTEGER NOT NULL DEFAULT 0,
  width       INTEGER NOT NULL,
  height      INTEGER NOT NULL,
  bytes       INTEGER NOT NULL,
  mime        TEXT NOT NULL,
  created_at  TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now'))
);
CREATE INDEX idx_product_images_product ON product_images(product_id, sort_order);
