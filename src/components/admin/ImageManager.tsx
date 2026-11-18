"use client";

import { useRouter } from "next/navigation";
import { useEffect, useRef, useState, useTransition } from "react";
import { deleteImageAction, reorderImagesAction } from "@/app/admin/actions";
import { compressImage } from "@/lib/imageCompress";
import { imageSrc, MAX_IMAGES_PER_PRODUCT } from "@/lib/images";
import type { ProductImage } from "@/lib/types";

type Upload = { key: string; name: string; status: "nén..." | "tải lên..." | "xong" | "lỗi"; info?: string };

const kb = (n: number) => `${Math.round(n / 1024)} KB`;

export default function ImageManager({ productId, images }: { productId: string; images: ProductImage[] }) {
  const router = useRouter();
  const [order, setOrder] = useState(images);
  const [uploads, setUploads] = useState<Upload[]>([]);
  const [dragging, setDragging] = useState(false);
  const [isPending, startTransition] = useTransition();
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => setOrder(images), [images]);

  const busy = uploads.some((u) => u.status === "nén..." || u.status === "tải lên...");
  const remaining = MAX_IMAGES_PER_PRODUCT - order.length;
  const patch = (key: string, p: Partial<Upload>) => setUploads((list) => list.map((u) => (u.key === key ? { ...u, ...p } : u)));

  async function handleFiles(files: FileList | File[]) {
    const list = [...files].filter((f) => f.type.startsWith("image/") || /\.(heic|heif)$/i.test(f.name)).slice(0, Math.max(0, remaining));
    if (list.length === 0) return;
    const items = list.map((f, i) => ({ key: `${Date.now()}-${i}`, name: f.name, status: "nén..." as const }));
    setUploads((u) => [...items, ...u].slice(0, 20));

    // Tuần tự để giữ đúng thứ tự ảnh và không vượt giới hạn tốc độ ghi KV.
    for (const [i, file] of list.entries()) {
      const key = items[i].key;
      try {
        const c = await compressImage(file);
        patch(key, { status: "tải lên...", info: `${kb(file.size)} → ${kb(c.lg.size)} + ${kb(c.sm.size)}` });
        const fd = new FormData();
        fd.set("productId", productId);
        fd.set("width", String(c.width));
        fd.set("height", String(c.height));
        const ext = c.lg.type === "image/webp" ? "webp" : "jpg";
        fd.set("lg", c.lg, `lg.${ext}`);
        fd.set("sm", c.sm, `sm.${ext}`);
        const res = await fetch("/api/admin/images", { method: "POST", body: fd });
        const data = (await res.json().catch(() => ({}))) as { error?: string };
        if (!res.ok) throw new Error(data.error ?? `Lỗi ${res.status}`);
        patch(key, { status: "xong" });
      } catch (err) {
        patch(key, { status: "lỗi", info: err instanceof Error ? err.message : "Lỗi không xác định" });
      }
    }
    router.refresh();
  }

  function saveOrder(next: ProductImage[]) {
    setOrder(next);
    startTransition(() => reorderImagesAction(productId, next.map((x) => x.id)));
  }

  function move(index: number, delta: number) {
    const j = index + delta;
    if (j < 0 || j >= order.length) return;
    const next = [...order];
    [next[index], next[j]] = [next[j], next[index]];
    saveOrder(next);
  }

  function remove(id: string) {
    if (!confirm("Xoá ảnh này?")) return;
    setOrder((o) => o.filter((x) => x.id !== id));
    startTransition(() => deleteImageAction(id));
  }

  return (
    <section className="space-y-4 rounded-2xl bg-white p-6 shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h2 className="font-bold">
          Hình ảnh <span className="font-normal text-slate-500">({order.length}/{MAX_IMAGES_PER_PRODUCT})</span>
        </h2>
        <p className="text-xs text-slate-500">Ảnh đầu tiên là ảnh bìa. Ảnh tự nén sang WebP (1600px + 480px) trước khi tải lên.</p>
      </div>

      {order.length > 0 && (
        <ul className={`grid grid-cols-2 gap-3 sm:grid-cols-3 xl:grid-cols-5 ${isPending ? "opacity-70" : ""}`}>
          {order.map((img, i) => (
            <li key={img.id} className={`group relative overflow-hidden rounded-xl border-2 ${i === 0 ? "border-brand" : "border-slate-200"}`}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={imageSrc(img.id, "sm")} alt="" width={img.width} height={img.height} className="aspect-square w-full bg-slate-50 object-contain" />
              {i === 0 && <span className="absolute left-2 top-2 rounded-full bg-brand px-2 py-0.5 text-[11px] font-bold text-white">Ảnh bìa</span>}
              <div className="flex items-center justify-between gap-1 border-t border-slate-100 bg-white p-1.5 text-xs">
                <span className="flex gap-1">
                  <button type="button" onClick={() => move(i, -1)} disabled={i === 0} className="rounded px-2 py-1 hover:bg-slate-100 disabled:opacity-30" aria-label="Lên trước">←</button>
                  <button type="button" onClick={() => move(i, 1)} disabled={i === order.length - 1} className="rounded px-2 py-1 hover:bg-slate-100 disabled:opacity-30" aria-label="Ra sau">→</button>
                </span>
                {i !== 0 && (
                  <button type="button" onClick={() => saveOrder([img, ...order.filter((x) => x.id !== img.id)])} className="rounded px-1.5 py-1 font-semibold text-brand hover:bg-brand-50">
                    Đặt bìa
                  </button>
                )}
                <button type="button" onClick={() => remove(img.id)} className="rounded px-2 py-1 text-red-600 hover:bg-red-50" aria-label="Xoá ảnh">✕</button>
              </div>
            </li>
          ))}
        </ul>
      )}

      {remaining > 0 ? (
        <div
          onDragOver={(e) => {
            e.preventDefault();
            setDragging(true);
          }}
          onDragLeave={() => setDragging(false)}
          onDrop={(e) => {
            e.preventDefault();
            setDragging(false);
            if (!busy) handleFiles(e.dataTransfer.files);
          }}
          onClick={() => !busy && inputRef.current?.click()}
          className={`flex cursor-pointer flex-col items-center justify-center gap-1 rounded-xl border-2 border-dashed px-4 py-8 text-center text-sm transition ${
            dragging ? "border-brand bg-brand-50" : "border-slate-300 hover:border-brand hover:bg-slate-50"
          } ${busy ? "cursor-wait opacity-60" : ""}`}
        >
          <span className="text-3xl">🖼️</span>
          <span className="font-semibold">{busy ? "Đang xử lý..." : "Kéo thả ảnh vào đây hoặc bấm để chọn"}</span>
          <span className="text-xs text-slate-500">JPG, PNG, WebP · chọn được nhiều ảnh · còn {remaining} ảnh</span>
          <input
            ref={inputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp,image/heic,image/heif"
            multiple
            hidden
            onChange={(e) => {
              if (e.target.files) handleFiles(e.target.files);
              e.target.value = "";
            }}
          />
        </div>
      ) : (
        <p className="rounded-lg bg-slate-50 p-3 text-center text-sm text-slate-500">Đã đủ {MAX_IMAGES_PER_PRODUCT} ảnh. Xoá bớt để thêm ảnh mới.</p>
      )}

      {uploads.length > 0 && (
        <ul className="space-y-1 text-xs">
          {uploads.map((u) => (
            <li key={u.key} className="flex flex-wrap gap-2">
              <span className="max-w-60 truncate font-medium">{u.name}</span>
              <span className={u.status === "lỗi" ? "text-red-600" : u.status === "xong" ? "text-green-600" : "text-slate-500"}>
                {u.status === "xong" ? "✓ xong" : u.status}
              </span>
              {u.info && <span className="text-slate-500">{u.info}</span>}
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
