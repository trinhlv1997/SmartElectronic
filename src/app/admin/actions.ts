"use server";

// Server actions của trang quản trị. Mỗi action là một endpoint công khai,
// nên PHẢI gọi requireAdmin() trước khi làm bất cứ việc gì.
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { ORDER_STATUSES, type OrderStatus } from "@/lib/types";
import { checkPassword, endSession, requireAdmin, startSession } from "@/server/auth";
import { updateOrderStatus } from "@/server/orders";
import { type FieldErrors, parseProductForm } from "@/server/productForm";
import { deleteProductImage, reorderProductImages } from "@/server/images";
import { createProduct, deleteProduct, updateProduct, updateProductQuick } from "@/server/products";
import { type CategoryErrors, createCategory, deleteCategory, getCategories, parseCategoryForm, updateCategory } from "@/server/categories";
import { type ContactErrors, parseContactForm, saveContactInfo } from "@/server/settings";

export type FormState = { error?: string; errors?: FieldErrors; message?: string } | undefined;

export async function loginAction(_prev: FormState, fd: FormData): Promise<FormState> {
  const password = String(fd.get("password") ?? "");
  if (!password || !(await checkPassword(password))) {
    // làm chậm thử mật khẩu hàng loạt
    await new Promise((r) => setTimeout(r, 800));
    return { error: "Mật khẩu không đúng." };
  }
  await startSession();
  const next = String(fd.get("next") ?? "");
  redirect(next.startsWith("/admin") ? next : "/admin");
}

export async function logoutAction(): Promise<void> {
  await endSession();
  redirect("/admin/login");
}

function isUniqueSlugError(err: unknown) {
  return String(err).includes("UNIQUE") && String(err).includes("slug");
}

export async function saveProductAction(id: string | null, _prev: FormState, fd: FormData): Promise<FormState> {
  await requireAdmin();
  const categories = await getCategories();
  const parsed = parseProductForm(fd, new Set(categories.map((c) => c.id)));
  if (!parsed.ok) return { error: "Vui lòng kiểm tra lại các trường được đánh dấu.", errors: parsed.errors };

  let newId: string | null = null;
  try {
    if (id) await updateProduct(id, parsed.data);
    else newId = await createProduct(parsed.data);
  } catch (err) {
    if (isUniqueSlugError(err)) return { error: "Slug đã được dùng cho sản phẩm khác.", errors: { slug: "Slug bị trùng." } };
    throw err;
  }
  revalidatePath("/admin/products");
  // Tạo mới → sang trang sửa để thêm ảnh (ảnh cần id sản phẩm).
  if (newId) redirect(`/admin/products/${newId}?created=1`);
  redirect(`/admin/products?saved=${encodeURIComponent(parsed.data.name)}`);
}

export async function quickUpdateAction(id: string, _prev: FormState, fd: FormData): Promise<FormState> {
  await requireAdmin();
  const num = (k: string) => {
    const raw = String(fd.get(k) ?? "").replace(/[.,\s₫đ]/g, "");
    if (raw === "") return undefined;
    const n = Number(raw);
    return Number.isInteger(n) && n >= 0 ? n : NaN;
  };
  const price = num("price");
  const oldPrice = num("oldPrice");
  const stock = num("stock");
  if (price === undefined || Number.isNaN(price)) return { error: "Giá không hợp lệ" };
  if (stock === undefined || Number.isNaN(stock)) return { error: "Tồn kho không hợp lệ" };
  if (Number.isNaN(oldPrice)) return { error: "Giá gốc không hợp lệ" };
  if (oldPrice !== undefined && oldPrice <= price) return { error: "Giá gốc phải > giá bán" };

  await updateProductQuick(id, { price, oldPrice, stock, active: fd.get("active") === "on" });
  revalidatePath("/admin/products");
  return { message: "Đã lưu" };
}

export async function deleteProductAction(id: string): Promise<void> {
  await requireAdmin();
  await deleteProduct(id);
  revalidatePath("/admin/products");
  redirect("/admin/products");
}

export async function updateOrderStatusAction(id: string, _prev: FormState, fd: FormData): Promise<FormState> {
  await requireAdmin();
  const status = String(fd.get("status")) as OrderStatus;
  if (!ORDER_STATUSES.some((s) => s.id === status)) return { error: "Trạng thái không hợp lệ" };
  const result = await updateOrderStatus(id, status);
  revalidatePath("/admin/orders");
  revalidatePath("/admin");
  return result.ok ? { message: "Đã cập nhật" } : { error: result.error };
}

export async function deleteImageAction(imageId: string): Promise<void> {
  await requireAdmin();
  const productId = await deleteProductImage(imageId);
  if (productId) revalidatePath(`/admin/products/${productId}`);
}

export async function reorderImagesAction(productId: string, orderedIds: string[]): Promise<void> {
  await requireAdmin();
  if (!Array.isArray(orderedIds) || orderedIds.length > 50 || !orderedIds.every((x) => typeof x === "string")) return;
  await reorderProductImages(productId, orderedIds);
  revalidatePath(`/admin/products/${productId}`);
}

export type SettingsState = { error?: string; errors?: ContactErrors; message?: string; values?: { hotline: string; email: string; address: string } } | undefined;

export async function saveSettingsAction(_prev: SettingsState, fd: FormData): Promise<SettingsState> {
  await requireAdmin();
  const parsed = parseContactForm(fd);
  if (!parsed.ok) return { error: "Vui lòng kiểm tra lại các trường được đánh dấu.", errors: parsed.errors, values: parsed.values };
  await saveContactInfo(parsed.data);
  // header, footer and contact page read these on every request; refresh any cached render too
  revalidatePath("/", "layout");
  return { message: "Đã lưu thông tin liên hệ.", values: parsed.data };
}

export type CategoryState = { error?: string; errors?: CategoryErrors; message?: string } | undefined;

function isUniqueIdError(err: unknown) {
  return String(err).includes("UNIQUE") && String(err).includes("categories");
}

/** Tạo (id = null) hoặc sửa danh mục. Mã danh mục chỉ đặt lúc tạo. */
export async function saveCategoryAction(id: string | null, _prev: CategoryState, fd: FormData): Promise<CategoryState> {
  await requireAdmin();
  const parsed = parseCategoryForm(fd, id === null);
  if (!parsed.ok) return { error: "Vui lòng kiểm tra lại các trường được đánh dấu.", errors: parsed.errors };
  try {
    if (id === null) await createCategory(parsed.id, parsed.data);
    else if (!(await updateCategory(id, parsed.data))) return { error: "Danh mục không còn tồn tại." };
  } catch (err) {
    if (isUniqueIdError(err)) return { error: "Mã danh mục đã tồn tại.", errors: { id: "Mã bị trùng." } };
    throw err;
  }
  // menus, filters and product forms everywhere read the category list
  revalidatePath("/", "layout");
  return { message: id === null ? `Đã thêm danh mục “${parsed.data.label}”.` : "Đã lưu." };
}

export async function deleteCategoryAction(id: string): Promise<CategoryState> {
  await requireAdmin();
  const result = await deleteCategory(id);
  if (result === "in_use") return { error: "Danh mục còn sản phẩm — chuyển sản phẩm sang danh mục khác trước khi xóa." };
  revalidatePath("/", "layout");
  return { message: "Đã xóa danh mục." };
}
