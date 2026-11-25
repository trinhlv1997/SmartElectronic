// Nội dung tĩnh của website (menu, giải pháp, tin tức, thông tin liên hệ).

export type ContactInfo = { hotline: string; email: string; address: string };

/** Giá trị mặc định; admin sửa trong /admin/settings (lưu ở D1, đọc qua getContactInfo). */
export const DEFAULT_CONTACT: ContactInfo = {
  hotline: "1900 0000",
  email: "lienhe@smartelectronic.vn",
  address: "Số 1 Đường Ánh Sáng, Quận Cầu Giấy, Hà Nội",
};

/** Liên kết tel: từ số hotline hiển thị (bỏ dấu cách, chấm, gạch, ngoặc). */
export function telHref(hotline: string): string {
  return `tel:${hotline.replace(/[^\d+]/g, "")}`;
}

export const SOLUTIONS = [
  { id: "smart-home", title: "Nhà thông minh", icon: "🏡", desc: "Chiếu sáng, công tắc và cảm biến điều khiển qua điện thoại.", category: "smart" },
  { id: "office", title: "Văn phòng xanh", icon: "🏢", desc: "Chiếu sáng chống chói, tiết kiệm đến 60% điện năng.", category: "panel" },
  { id: "factory", title: "Nhà xưởng", icon: "🏭", desc: "Đèn high-bay công suất lớn, độ bền cao.", category: "outdoor" },
  { id: "school", title: "Trường học", icon: "🏫", desc: "Ánh sáng chuẩn học đường bảo vệ thị lực.", category: "household" },
  { id: "street", title: "Chiếu sáng đô thị", icon: "🌃", desc: "Đèn đường LED điều khiển tập trung.", category: "outdoor" },
  { id: "solar", title: "Điện mặt trời áp mái", icon: "☀️", desc: "Giảm hoá đơn tiền điện cho gia đình và doanh nghiệp.", category: "solar" },
] as const;

export const FIELDS = [
  { title: "Smart Home", sub: "Ngôi nhà thông minh, an toàn và tiện nghi", icon: "🏡", from: "from-brand-dark", to: "to-sky-500", category: "smart" },
  { title: "Smart City", sub: "Chiếu sáng đô thị xanh, hiện đại", icon: "🌆", from: "from-slate-800", to: "to-slate-600", category: "outdoor" },
  { title: "Green Energy", sub: "Năng lượng sạch từ mặt trời", icon: "🌞", from: "from-amber-500", to: "to-yellow-400", category: "solar" },
] as const;

export const REASONS = [
  { icon: "🏭", title: "Sản xuất hiện đại", desc: "Dây chuyền tự động, kiểm soát chất lượng từng sản phẩm." },
  { icon: "🔗", title: "Hệ sinh thái đồng bộ", desc: "Từ bóng đèn đến giải pháp thông minh trên một nền tảng." },
  { icon: "🛡️", title: "Bảo hành chính hãng", desc: "Đổi mới 1-1 trong thời gian bảo hành, hỗ trợ tận nơi." },
  { icon: "🚚", title: "Giao hàng toàn quốc", desc: "Mạng lưới đại lý và kho hàng phủ khắp 63 tỉnh thành." },
];

export const STATS = [
  { value: "63", label: "Tỉnh thành phủ sóng" },
  { value: "500+", label: "Sản phẩm" },
  { value: "2.000+", label: "Đại lý & điểm bán" },
  { value: "24/7", label: "Hỗ trợ khách hàng" },
];

export const NEWS = [
  {
    slug: "chon-den-led-cho-phong-khach",
    title: "Cách chọn đèn LED phù hợp cho phòng khách",
    excerpt: "Nhiệt độ màu, công suất và số lượng đèn cần thiết cho từng diện tích phòng.",
    date: "2026-11-10", icon: "🛋️",
  },
  {
    slug: "tiet-kiem-dien-mua-he",
    title: "5 mẹo tiết kiệm điện cho gia đình",
    excerpt: "Thay đèn LED, dùng cảm biến và hẹn giờ thiết bị giúp giảm đáng kể hoá đơn tiền điện.",
    date: "2026-10-28", icon: "💰",
  },
  {
    slug: "dien-mat-troi-ap-mai-co-loi",
    title: "Điện mặt trời áp mái có thực sự đáng đầu tư?",
    excerpt: "Phân tích chi phí, thời gian hoàn vốn và những lưu ý khi lắp đặt.",
    date: "2026-10-15", icon: "🔆",
  },
];
