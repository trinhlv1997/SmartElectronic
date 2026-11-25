-- Cài đặt website do admin chỉnh trong /admin/settings (khóa dạng "contact.hotline").
-- Khóa chưa có dòng nào thì website dùng giá trị mặc định trong src/data/site.ts.
CREATE TABLE site_settings (
  key         TEXT PRIMARY KEY,
  value       TEXT NOT NULL,
  updated_at  TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now'))
);
