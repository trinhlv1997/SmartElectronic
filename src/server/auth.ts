// Đăng nhập admin bằng một mật khẩu (secret ADMIN_PASSWORD).
// Phiên = cookie "<hết hạn>.<HMAC-SHA256(AUTH_SECRET)>" — không cần bảng session.
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { getEnv } from "./db";

const COOKIE = "se_admin";
const MAX_AGE = 60 * 60 * 24 * 7; // 7 ngày

const enc = new TextEncoder();

async function hmac(secret: string, data: string): Promise<Uint8Array> {
  const key = await crypto.subtle.importKey("raw", enc.encode(secret), { name: "HMAC", hash: "SHA-256" }, false, ["sign"]);
  return new Uint8Array(await crypto.subtle.sign("HMAC", key, enc.encode(data)));
}

function timingSafeEqual(a: Uint8Array, b: Uint8Array): boolean {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a[i] ^ b[i];
  return diff === 0;
}

const b64url = (bytes: Uint8Array) => btoa(String.fromCharCode(...bytes)).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");

/** null khi chưa đặt secret → admin bị khoá hoàn toàn (không ai đăng nhập được) thay vì lỗi 500. */
async function getSecrets(): Promise<{ password: string; secret: string } | null> {
  const env = await getEnv();
  if (!env.ADMIN_PASSWORD || !env.AUTH_SECRET) return null;
  return { password: env.ADMIN_PASSWORD, secret: env.AUTH_SECRET };
}

export async function isAuthConfigured(): Promise<boolean> {
  return (await getSecrets()) !== null;
}

export async function checkPassword(input: string): Promise<boolean> {
  const secrets = await getSecrets();
  if (!secrets) return false;
  const { password, secret } = secrets;
  // So sánh HMAC của hai chuỗi để thời gian so sánh không phụ thuộc vào nội dung.
  return timingSafeEqual(await hmac(secret, `pw:${input}`), await hmac(secret, `pw:${password}`));
}

export async function startSession(): Promise<void> {
  const secrets = await getSecrets();
  if (!secrets) throw new Error("Admin chưa được cấu hình.");
  const { secret } = secrets;
  const exp = Math.floor(Date.now() / 1000) + MAX_AGE;
  const sig = b64url(await hmac(secret, `admin:${exp}`));
  (await cookies()).set(COOKIE, `${exp}.${sig}`, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: MAX_AGE,
  });
}

export async function endSession(): Promise<void> {
  (await cookies()).delete(COOKIE);
}

export async function isAdmin(): Promise<boolean> {
  const value = (await cookies()).get(COOKIE)?.value;
  if (!value) return false;
  const [expStr, sig] = value.split(".");
  const exp = Number(expStr);
  if (!sig || !Number.isFinite(exp) || exp < Date.now() / 1000) return false;
  const secrets = await getSecrets();
  if (!secrets) return false;
  const { secret } = secrets;
  const expected = b64url(await hmac(secret, `admin:${exp}`));
  return timingSafeEqual(enc.encode(sig), enc.encode(expected));
}

/** Gọi ở đầu MỌI trang admin và MỌI server action admin (server action là endpoint công khai). */
export async function requireAdmin(): Promise<void> {
  if (!(await isAdmin())) redirect("/admin/login");
}
