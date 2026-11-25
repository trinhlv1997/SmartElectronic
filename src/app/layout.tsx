import type { Metadata } from "next";
import { Be_Vietnam_Pro } from "next/font/google";
import "./globals.css";

const font = Be_Vietnam_Pro({
  subsets: ["latin", "vietnamese"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-be-vietnam",
});

export const metadata: Metadata = {
  title: "LeMan Electrical & Lighting — Đèn LED & thiết bị điện chính hãng",
  description: "Đèn LED, thiết bị điện, thiết bị thông minh và giải pháp năng lượng mặt trời chính hãng.",
};

// Root layout chỉ chứa font + CSS. Website khách dùng app/(shop)/layout.tsx, trang quản trị dùng app/admin.
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="vi" className={font.variable}>
      <body className="min-h-screen font-sans antialiased">{children}</body>
    </html>
  );
}
