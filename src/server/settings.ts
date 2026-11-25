import { DEFAULT_CONTACT, type ContactInfo } from "@/data/site";
import { getDb } from "./db";

// Thông tin liên hệ chỉnh được trong /admin/settings, lưu ở bảng D1 site_settings.
const KEYS: Record<keyof ContactInfo, string> = {
  hotline: "contact.hotline",
  email: "contact.email",
  address: "contact.address",
};

/** Thông tin liên hệ hiện tại; khóa chưa lưu (hoặc bảng chưa migrate) thì dùng mặc định. */
export async function getContactInfo(): Promise<ContactInfo> {
  try {
    const db = await getDb();
    const { results } = await db
      .prepare("SELECT key, value FROM site_settings WHERE key IN (?, ?, ?)")
      .bind(KEYS.hotline, KEYS.email, KEYS.address)
      .all<{ key: string; value: string }>();
    const stored = new Map(results.map((r) => [r.key, r.value]));
    return {
      hotline: stored.get(KEYS.hotline) ?? DEFAULT_CONTACT.hotline,
      email: stored.get(KEYS.email) ?? DEFAULT_CONTACT.email,
      address: stored.get(KEYS.address) ?? DEFAULT_CONTACT.address,
    };
  } catch (err) {
    // Website không được sập chỉ vì thiếu migration 0004: hiện giá trị mặc định.
    console.error("getContactInfo: falling back to defaults", err);
    return { ...DEFAULT_CONTACT };
  }
}

export async function saveContactInfo(info: ContactInfo): Promise<void> {
  const db = await getDb();
  const upsert = db.prepare(
    `INSERT INTO site_settings (key, value) VALUES (?, ?)
     ON CONFLICT(key) DO UPDATE SET value = excluded.value, updated_at = strftime('%Y-%m-%dT%H:%M:%fZ', 'now')`,
  );
  await db.batch([
    upsert.bind(KEYS.hotline, info.hotline),
    upsert.bind(KEYS.email, info.email),
    upsert.bind(KEYS.address, info.address),
  ]);
}

export type ContactErrors = Partial<Record<keyof ContactInfo, string>>;

/** Kiểm tra dữ liệu form cài đặt liên hệ. */
export function parseContactForm(fd: FormData): { ok: true; data: ContactInfo } | { ok: false; errors: ContactErrors; values: ContactInfo } {
  const values: ContactInfo = {
    hotline: String(fd.get("hotline") ?? "").trim().replace(/\s+/g, " "),
    email: String(fd.get("email") ?? "").trim().toLowerCase(),
    address: String(fd.get("address") ?? "").trim().replace(/\s+/g, " "),
  };
  const errors: ContactErrors = {};
  const digits = values.hotline.replace(/\D/g, "");
  if (!values.hotline) errors.hotline = "Nhập số hotline.";
  else if (!/^[0-9+().\s-]+$/.test(values.hotline) || digits.length < 6 || digits.length > 15)
    errors.hotline = "Hotline chỉ gồm số (6–15 chữ số), có thể có dấu cách, +, -, (, ).";
  if (!values.email) errors.email = "Nhập email.";
  else if (values.email.length > 120 || !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(values.email)) errors.email = "Email không hợp lệ.";
  if (values.address.length < 5) errors.address = "Nhập địa chỉ (tối thiểu 5 ký tự).";
  else if (values.address.length > 300) errors.address = "Địa chỉ tối đa 300 ký tự.";
  return Object.keys(errors).length ? { ok: false, errors, values } : { ok: true, data: values };
}
