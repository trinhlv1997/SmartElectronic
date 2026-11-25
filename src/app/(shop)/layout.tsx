import Footer from "@/components/Footer";
import Header from "@/components/Header";
import { CartProvider } from "@/context/CartContext";
import { getCategories } from "@/server/categories";
import { getContactInfo } from "@/server/settings";

// Sản phẩm/giá đọc từ D1 mỗi request để thay đổi trong /admin hiển thị ngay.
export const dynamic = "force-dynamic";

export default async function ShopLayout({ children }: { children: React.ReactNode }) {
  // hotline / email / address are editable in /admin/settings
  const [contact, categories] = await Promise.all([getContactInfo(), getCategories()]);
  return (
    <CartProvider>
      <div className="flex min-h-screen flex-col">
        <Header contact={contact} categories={categories} />
        <main className="flex-1">{children}</main>
        <Footer contact={contact} categories={categories} />
      </div>
    </CartProvider>
  );
}
