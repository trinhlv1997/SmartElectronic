import { normalizeText, type ProductFilters } from "@/lib/productFilters";
import type { Category, Product } from "@/lib/types";

export const CATEGORIES: { id: Category; label: string; icon: string }[] = [
  { id: "downlight", label: "Đèn LED Downlight", icon: "🔆" },
  { id: "panel", label: "Đèn LED Panel", icon: "🔲" },
  { id: "bulb", label: "Bóng đèn LED", icon: "💡" },
  { id: "outdoor", label: "Đèn đường & pha", icon: "🔦" },
  { id: "electrical", label: "Thiết bị điện", icon: "🔌" },
  { id: "smart", label: "Thiết bị thông minh", icon: "📶" },
  { id: "solar", label: "Năng lượng mặt trời", icon: "☀️" },
  { id: "household", label: "Đồ gia dụng", icon: "🏠" },
];

// Dữ liệu mẫu. Khi có database, thay các hàm bên dưới bằng truy vấn thật —
// các trang chỉ gọi qua getProducts/getProductBySlug/getProductsByIds.
const PRODUCTS: Product[] = [
  {
    id: "p1", slug: "den-led-downlight-am-tran-9w", sku: "SE-DL01 110/9W", name: "Đèn LED Downlight âm trần 9W",
    category: "downlight", price: 95000, oldPrice: 120000, stock: 300, rating: 4.7, icon: "🔆",
    description: "Đèn âm trần tiết kiệm điện, ánh sáng không nhấp nháy, bảo vệ mắt. Phù hợp phòng khách, phòng ngủ, văn phòng.",
    specs: { "Công suất": "9W", "Quang thông": "810 lm", "Nhiệt độ màu": "3000K / 4000K / 6500K", "Lỗ khoét": "Ø110mm", "Tuổi thọ": "25.000 giờ" },
    featured: true,
  },
  {
    id: "p2", slug: "den-led-downlight-doi-mau-12w", sku: "SE-DL02 ĐM 135/12W", name: "Đèn LED Downlight đổi màu 12W",
    category: "downlight", price: 165000, stock: 180, rating: 4.6, icon: "🔆",
    description: "Đổi 3 màu ánh sáng bằng công tắc, mặt đèn nhôm đúc tản nhiệt tốt.",
    specs: { "Công suất": "12W", "Quang thông": "1080 lm", "Nhiệt độ màu": "3 chế độ", "Lỗ khoét": "Ø135mm" },
  },
  {
    id: "p3", slug: "den-led-panel-600x600-40w", sku: "SE-P01 600x600/40W", name: "Đèn LED Panel 600x600 40W",
    category: "panel", price: 459000, oldPrice: 520000, stock: 120, rating: 4.8, icon: "🔲",
    description: "Đèn panel lắp trần thả văn phòng, trường học. Ánh sáng đều, chống chói UGR<19.",
    specs: { "Công suất": "40W", "Quang thông": "4000 lm", "Kích thước": "600 x 600 mm", "CRI": "> 80" },
    featured: true,
  },
  {
    id: "p4", slug: "den-led-panel-tron-18w", sku: "SE-P02 T225/18W", name: "Đèn LED Panel tròn 18W",
    category: "panel", price: 189000, stock: 90, rating: 4.4, icon: "🔲",
    description: "Thiết kế siêu mỏng, lắp âm trần thạch cao, ánh sáng dịu mắt.",
    specs: { "Công suất": "18W", "Quang thông": "1620 lm", "Đường kính": "225mm" },
  },
  {
    id: "p5", slug: "bong-den-led-bulb-12w", sku: "SE-B01 A70/12W", name: "Bóng đèn LED Bulb 12W",
    category: "bulb", price: 45000, oldPrice: 55000, stock: 1000, rating: 4.7, icon: "💡",
    description: "Bóng bulb đuôi E27 thay thế bóng sợi đốt, tiết kiệm 85% điện năng.",
    specs: { "Công suất": "12W", "Đuôi": "E27", "Quang thông": "1100 lm", "Tuổi thọ": "20.000 giờ" },
    featured: true,
  },
  {
    id: "p6", slug: "bong-den-led-tube-t8-1m2", sku: "SE-T8 120/20W", name: "Bóng đèn LED Tube T8 1m2 20W",
    category: "bulb", price: 79000, stock: 500, rating: 4.5, icon: "💡",
    description: "Ống thuỷ tinh phủ nhựa an toàn, thay thế trực tiếp đèn huỳnh quang.",
    specs: { "Công suất": "20W", "Chiều dài": "1.2m", "Quang thông": "2000 lm" },
  },
  {
    id: "p7", slug: "den-duong-led-100w", sku: "SE-CSD01 100W", name: "Đèn đường LED 100W",
    category: "outdoor", price: 2450000, stock: 25, rating: 4.6, icon: "🔦",
    description: "Chiếu sáng đường phố, khu đô thị. Chống nước IP66, chống sét 10kV.",
    specs: { "Công suất": "100W", "Hiệu suất": "140 lm/W", "Cấp bảo vệ": "IP66", "Chống sét": "10kV" },
  },
  {
    id: "p8", slug: "den-pha-led-50w", sku: "SE-CP01 50W", name: "Đèn pha LED 50W",
    category: "outdoor", price: 590000, oldPrice: 690000, stock: 60, rating: 4.5, icon: "🔦",
    description: "Chiếu sáng sân vườn, biển quảng cáo, nhà xưởng. Vỏ nhôm đúc bền bỉ.",
    specs: { "Công suất": "50W", "Cấp bảo vệ": "IP65", "Góc chiếu": "120°" },
  },
  {
    id: "p9", slug: "o-cam-keo-dai-4-lo", sku: "SE-OC01 4L/3M", name: "Ổ cắm kéo dài 4 lỗ 3m",
    category: "electrical", price: 159000, stock: 200, rating: 4.6, icon: "🔌",
    description: "Lõi dây đồng, có cầu chì bảo vệ quá tải, nắp che an toàn cho trẻ em.",
    specs: { "Số lỗ": "4", "Dây": "3m, 2x1.0mm²", "Công suất tối đa": "2500W" },
  },
  {
    id: "p10", slug: "aptomat-mcb-1p-32a", sku: "SE-MCB 1P/32A", name: "Aptomat MCB 1P 32A",
    category: "electrical", price: 89000, stock: 0, rating: 4.4, icon: "⚡",
    description: "Bảo vệ quá tải và ngắn mạch cho mạch điện dân dụng.",
    specs: { "Số cực": "1P", "Dòng định mức": "32A", "Dòng cắt": "6kA" },
  },
  {
    id: "p11", slug: "cong-tac-thong-minh-wifi-3-nut", sku: "SE-SW3 WIFI", name: "Công tắc thông minh Wi-Fi 3 nút",
    category: "smart", price: 690000, oldPrice: 850000, stock: 70, rating: 4.7, icon: "📶",
    description: "Điều khiển đèn qua app điện thoại, hẹn giờ, kịch bản tự động, điều khiển bằng giọng nói.",
    specs: { "Kết nối": "Wi-Fi 2.4GHz", "Số nút": "3", "Mặt": "Kính cường lực" },
    featured: true,
  },
  {
    id: "p12", slug: "cam-bien-chuyen-dong", sku: "SE-PIR01", name: "Cảm biến chuyển động hồng ngoại",
    category: "smart", price: 290000, stock: 80, rating: 4.5, icon: "📡",
    description: "Tự động bật đèn khi có người, tiết kiệm điện hành lang, cầu thang, nhà vệ sinh.",
    specs: { "Góc quét": "120°", "Khoảng cách": "8m", "Kết nối": "Zigbee" },
  },
  {
    id: "p13", slug: "den-nang-luong-mat-troi-100w", sku: "SE-SOL 100W", name: "Đèn năng lượng mặt trời 100W",
    category: "solar", price: 1290000, oldPrice: 1590000, stock: 40, rating: 4.6, icon: "☀️",
    description: "Không tốn tiền điện, tự sáng khi trời tối, kèm điều khiển từ xa.",
    specs: { "Công suất": "100W", "Pin": "LiFePO4", "Thời gian sáng": "10-12 giờ", "Cấp bảo vệ": "IP67" },
    featured: true,
  },
  {
    id: "p14", slug: "tam-pin-mat-troi-450w", sku: "SE-PV 450W", name: "Tấm pin mặt trời Mono 450W",
    category: "solar", price: 2890000, stock: 30, rating: 4.7, icon: "🔋",
    description: "Pin Mono PERC hiệu suất cao cho hệ điện mặt trời áp mái.",
    specs: { "Công suất": "450W", "Hiệu suất": "20.8%", "Bảo hành": "12 năm" },
  },
  {
    id: "p15", slug: "phich-giu-nhiet-2-lit", sku: "SE-PH 2L", name: "Phích giữ nhiệt 2 lít",
    category: "household", price: 185000, stock: 150, rating: 4.8, icon: "🫖",
    description: "Ruột thuỷ tinh giữ nhiệt trên 24 giờ, vỏ thép sơn tĩnh điện.",
    specs: { "Dung tích": "2 lít", "Giữ nhiệt": "> 24 giờ" },
  },
  {
    id: "p16", slug: "den-ban-led-chong-can", sku: "SE-RD01 6W", name: "Đèn bàn LED chống cận",
    category: "household", price: 349000, oldPrice: 399000, stock: 65, rating: 4.7, icon: "🪔",
    description: "Ánh sáng chuẩn học đường, không nhấp nháy, điều chỉnh 3 mức sáng.",
    specs: { "Công suất": "6W", "CRI": "> 90", "Mức sáng": "3 mức" },
    featured: true,
  },
];

export function getProducts(f: ProductFilters = {}): Product[] {
  const tokens = f.q ? normalizeText(f.q).split(/\s+/).filter(Boolean) : [];

  const list = PRODUCTS.filter((p) => {
    if (f.category && p.category !== f.category) return false;
    if (f.min !== undefined && p.price < f.min) return false;
    if (f.max !== undefined && p.price > f.max) return false;
    if (f.inStock && p.stock === 0) return false;
    if (f.onSale && !(p.oldPrice && p.oldPrice > p.price)) return false;
    if (tokens.length) {
      const label = CATEGORIES.find((c) => c.id === p.category)?.label ?? "";
      const haystack = normalizeText(`${p.name} ${p.sku} ${label}`);
      if (!tokens.every((t) => haystack.includes(t))) return false;
    }
    return true;
  });

  const discount = (p: Product) => (p.oldPrice ? (p.oldPrice - p.price) / p.oldPrice : 0);
  switch (f.sort) {
    case "price-asc": return [...list].sort((a, b) => a.price - b.price);
    case "price-desc": return [...list].sort((a, b) => b.price - a.price);
    case "rating": return [...list].sort((a, b) => b.rating - a.rating);
    case "discount": return [...list].sort((a, b) => discount(b) - discount(a));
    default: return list;
  }
}

/** Số sản phẩm của từng danh mục khi áp các bộ lọc còn lại (để hiển thị cạnh tên danh mục). */
export function getCategoryCounts(f: ProductFilters): Record<Category, number> {
  const counts = Object.fromEntries(CATEGORIES.map((c) => [c.id, 0])) as Record<Category, number>;
  for (const p of getProducts({ ...f, category: undefined, sort: undefined })) counts[p.category]++;
  return counts;
}

export function getFeaturedProducts(): Product[] {
  return PRODUCTS.filter((p) => p.featured);
}

export function getProductBySlug(slug: string): Product | undefined {
  return PRODUCTS.find((p) => p.slug === slug);
}

export function getProductsByIds(ids: string[]): Product[] {
  return PRODUCTS.filter((p) => ids.includes(p.id));
}

export function getAllProducts(): Product[] {
  return PRODUCTS;
}

export function isCategory(value: unknown): value is Category {
  return CATEGORIES.some((c) => c.id === value);
}
