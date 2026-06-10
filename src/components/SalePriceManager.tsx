import { useState, useEffect, useRef } from "react";
import { Tag, Plus, X, Percent, Calculator, Link, Trash2, ChevronDown, ChevronUp, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";

interface SalePriceManagerProps {
  fieldValues: Record<string, string>;
  onFieldChange: (key: string, value: string) => void;
}

interface PriceItem {
  slug: string;
  giaGoc: number;
  giaDien: number;
  phanTram: number;
  url?: string;
}

function extractSlug(url: string): string | null {
  const u = url.trim();
  // Try _pNUMBER pattern first (most specific)
  const m = u.match(/_p(\d+)/);
  if (m) return `p${m[1]}`;
  // Fallback: last path segment before query/hash
  const path = u.replace(/[?#].*$/, "").replace(/\/$/, "");
  const seg = path.split("/").pop();
  return seg && seg.length > 2 ? seg : null;
}

function formatVND(n: number): string {
  return n.toLocaleString("vi-VN") + "₫";
}

function itemsToEntries(items: PriceItem[]): string {
  return items
    .map((item) => `    { slug: '${item.slug}', phanTram: ${item.phanTram}, giaGoc: ${item.giaGoc} }`)
    .join(",\n");
}

function entriesFromField(raw: string): PriceItem[] {
  if (!raw.trim()) return [];
  const regex = /\{\s*slug:\s*['"]([^'"]+)['"]\s*,\s*phanTram:\s*([\d.]+)\s*(?:,\s*giaGoc:\s*([\d.]+))?\s*\}/g;
  const items: PriceItem[] = [];
  let m: RegExpExecArray | null;
  while ((m = regex.exec(raw)) !== null) {
    const pt = parseFloat(m[2]);
    const goc = m[3] ? parseFloat(m[3]) : 0;
    items.push({ slug: m[1], giaGoc: goc, giaDien: goc > 0 ? Math.round(goc * pt) : 0, phanTram: pt });
  }
  return items;
}

export default function SalePriceManager({ fieldValues, onFieldChange }: SalePriceManagerProps) {
  const { toast } = useToast();
  const [items, setItems] = useState<PriceItem[]>([]);

  // Ref to prevent circular update: internal commit → fieldValues change → re-parse
  const internalUpdate = useRef(false);

  // Form state
  const [urlInput, setUrlInput] = useState("");
  const [slugInput, setSlugInput] = useState("");
  const [giaGocInput, setGiaGocInput] = useState("");
  const [giaDienInput, setGiaDienInput] = useState("");

  // Edit inline state
  const [editingSlug, setEditingSlug] = useState<string | null>(null);
  const [editGiaGoc, setEditGiaGoc] = useState("");
  const [editGiaDien, setEditGiaDien] = useState("");

  // Watch fieldValues["CAU_HINH_ENTRIES"] — re-parse when parent updates it (e.g. paste auto-fill)
  useEffect(() => {
    if (internalUpdate.current) {
      internalUpdate.current = false;
      return;
    }
    const raw = fieldValues["CAU_HINH_ENTRIES"] ?? "";
    setItems(raw.trim() ? entriesFromField(raw) : []);
  }, [fieldValues["CAU_HINH_ENTRIES"]]);

  const commit = (updated: PriceItem[]) => {
    internalUpdate.current = true;
    setItems(updated);
    onFieldChange("CAU_HINH_ENTRIES", itemsToEntries(updated));
  };

  const calcPhanTram = (goc: number, dien: number) =>
    goc > 0 && dien > 0 ? parseFloat((dien / goc).toFixed(6)) : 0;

  const handleUrlBlur = () => {
    const slug = extractSlug(urlInput);
    if (slug) setSlugInput(slug);
  };

  const handleAdd = () => {
    const slug = slugInput.trim();
    if (!slug) {
      toast({ title: "Thiếu slug", description: "Nhập URL hoặc slug sản phẩm.", variant: "destructive" });
      return;
    }
    const goc = parseInt(giaGocInput.replace(/\D/g, ""), 10);
    const dien = parseInt(giaDienInput.replace(/\D/g, ""), 10);
    if (!goc || !dien) {
      toast({ title: "Thiếu giá", description: "Nhập giá gốc và giá muốn hiển thị.", variant: "destructive" });
      return;
    }
    if (dien >= goc) {
      toast({ title: "Giá không hợp lệ", description: "Giá muốn hiển thị phải nhỏ hơn giá gốc.", variant: "destructive" });
      return;
    }
    const phanTram = calcPhanTram(goc, dien);
    const existing = items.findIndex((i) => i.slug === slug);
    let updated: PriceItem[];
    if (existing >= 0) {
      updated = items.map((i, idx) =>
        idx === existing ? { ...i, giaGoc: goc, giaDien: dien, phanTram, url: urlInput.trim() } : i
      );
      toast({ title: "Đã cập nhật", description: `Slug "${slug}" → giảm ${Math.round((1 - phanTram) * 100)}%` });
    } else {
      updated = [...items, { slug, giaGoc: goc, giaDien: dien, phanTram, url: urlInput.trim() }];
      toast({ title: "Đã thêm", description: `"${slug}" → giảm ${Math.round((1 - phanTram) * 100)}%` });
    }
    commit(updated);
    setUrlInput(""); setSlugInput(""); setGiaGocInput(""); setGiaDienInput("");
  };

  const handleRemove = (slug: string) => commit(items.filter((i) => i.slug !== slug));

  const handleEditSave = (slug: string) => {
    const goc = parseInt(editGiaGoc.replace(/\D/g, ""), 10);
    const dien = parseInt(editGiaDien.replace(/\D/g, ""), 10);
    if (!goc || !dien || dien >= goc) {
      toast({ title: "Giá không hợp lệ", description: "Giá muốn hiển thị phải nhỏ hơn giá gốc.", variant: "destructive" });
      return;
    }
    const phanTram = calcPhanTram(goc, dien);
    commit(items.map((i) => i.slug === slug ? { ...i, giaGoc: goc, giaDien: dien, phanTram } : i));
    setEditingSlug(null);
  };

  // Live preview for form
  const previewGoc = parseInt(giaGocInput.replace(/\D/g, ""), 10) || 0;
  const previewDien = parseInt(giaDienInput.replace(/\D/g, ""), 10) || 0;
  const previewPt = previewGoc > 0 && previewDien > 0 ? calcPhanTram(previewGoc, previewDien) : null;
  const previewDiscount = previewPt !== null ? Math.round((1 - previewPt) * 100) : null;

  return (
    <div className="space-y-4">
      {/* Add form */}
      <Card className="border-green-200 bg-green-50/30">
        <CardHeader className="pb-2 pt-4 px-4">
          <CardTitle className="text-sm flex items-center gap-2 text-green-700">
            <Plus className="w-4 h-4" />
            Thêm sản phẩm & giá ưu đãi
          </CardTitle>
          <p className="text-xs text-gray-500">Paste URL sản phẩm để tự lấy slug, sau đó nhập giá gốc và giá muốn hiển thị</p>
        </CardHeader>
        <CardContent className="px-4 pb-4 space-y-3">
          {/* URL → slug */}
          <div className="flex gap-2">
            <div className="flex-1 space-y-1">
              <label className="text-xs font-medium text-gray-600 flex items-center gap-1">
                <Link className="w-3 h-3" /> URL sản phẩm
              </label>
              <Input
                placeholder="https://junjin.ratxin.vn/..._p125020"
                value={urlInput}
                onChange={(e) => setUrlInput(e.target.value)}
                onBlur={handleUrlBlur}
                onKeyDown={(e) => e.key === "Enter" && handleUrlBlur()}
                className="text-xs h-8"
              />
            </div>
            <div className="w-32 space-y-1">
              <label className="text-xs font-medium text-gray-600 flex items-center gap-1">
                <Tag className="w-3 h-3" /> Slug (tự lấy)
              </label>
              <Input
                placeholder="p125020"
                value={slugInput}
                onChange={(e) => setSlugInput(e.target.value)}
                className="text-xs h-8 font-mono"
              />
            </div>
          </div>

          {/* Price inputs */}
          <div className="flex gap-2 items-end">
            <div className="flex-1 space-y-1">
              <label className="text-xs font-medium text-gray-600">Giá gốc (₫)</label>
              <Input
                placeholder="VD: 285000"
                value={giaGocInput}
                onChange={(e) => setGiaGocInput(e.target.value)}
                className="text-xs h-8 font-mono"
              />
            </div>
            <ArrowRight className="w-4 h-4 text-gray-400 mb-1.5 flex-shrink-0" />
            <div className="flex-1 space-y-1">
              <label className="text-xs font-medium text-gray-600">Giá muốn hiển thị (₫)</label>
              <Input
                placeholder="VD: 91200"
                value={giaDienInput}
                onChange={(e) => setGiaDienInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleAdd()}
                className="text-xs h-8 font-mono"
              />
            </div>

            {/* Live preview badge */}
            <div className="flex-shrink-0 mb-0.5 min-w-[72px] text-center">
              {previewDiscount !== null && previewDiscount > 0 && previewDiscount < 100 ? (
                <div className="flex flex-col items-center">
                  <span className="text-xs font-bold text-red-600 bg-red-50 border border-red-200 rounded px-2 py-0.5">
                    -{previewDiscount}%
                  </span>
                  <span className="text-xs text-gray-400 mt-0.5">
                    {formatVND(previewDien)}
                  </span>
                </div>
              ) : (
                <span className="text-xs text-gray-300">–</span>
              )}
            </div>

            <Button size="sm" className="h-8 text-xs gap-1 flex-shrink-0" onClick={handleAdd}>
              <Plus className="w-3.5 h-3.5" />
              Thêm
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Items table */}
      <Card>
        <CardHeader className="pb-2 pt-4 px-4">
          <CardTitle className="text-sm flex items-center gap-2">
            <Calculator className="w-4 h-4 text-blue-600" />
            Danh sách sản phẩm giảm giá
            <Badge variant="secondary" className="text-xs ml-auto">{items.length} sản phẩm</Badge>
            {items.length > 0 && (
              <Button
                size="sm" variant="ghost"
                className="h-6 text-xs text-red-500 px-2 gap-1"
                onClick={() => { commit([]); toast({ title: "Đã xóa tất cả" }); }}
              >
                <Trash2 className="w-3 h-3" /> Xóa tất cả
              </Button>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent className="px-4 pb-4">
          {items.length === 0 ? (
            <p className="text-xs text-gray-400 italic py-2">Chưa có sản phẩm nào. Thêm sản phẩm ở trên.</p>
          ) : (
            <div className="rounded-lg border border-gray-200 overflow-hidden">
              <div
                className="grid text-xs font-semibold text-gray-500 bg-gray-50 border-b border-gray-200 px-3 py-2"
                style={{ gridTemplateColumns: "140px 1fr 1fr 80px 72px auto" }}
              >
                <span>Slug</span>
                <span>Giá gốc</span>
                <span>Giá hiển thị</span>
                <span className="text-center">Giảm %</span>
                <span className="text-center">phanTram</span>
                <span></span>
              </div>
              {items.map((item) => (
                <div key={item.slug}>
                  <div
                    className="grid items-center px-3 py-2 border-b border-gray-100 last:border-0 hover:bg-gray-50 cursor-pointer"
                    style={{ gridTemplateColumns: "140px 1fr 1fr 80px 72px auto" }}
                    onClick={() => {
                      if (editingSlug === item.slug) { setEditingSlug(null); return; }
                      setEditingSlug(item.slug);
                      setEditGiaGoc(item.giaGoc > 0 ? String(item.giaGoc) : "");
                      setEditGiaDien(item.giaDien > 0 ? String(item.giaDien) : "");
                    }}
                  >
                    <code className="text-xs font-mono font-bold text-gray-800 truncate">{item.slug}</code>
                    <span className="text-xs text-gray-600">
                      {item.giaGoc > 0 ? formatVND(item.giaGoc) : <span className="text-gray-300 italic">chưa có</span>}
                    </span>
                    <span className="text-xs text-green-700 font-medium">
                      {item.giaDien > 0 ? formatVND(item.giaDien) : <span className="text-gray-300 italic">chưa có</span>}
                    </span>
                    <div className="flex justify-center">
                      <span className="inline-block bg-red-100 text-red-700 border border-red-200 rounded px-1.5 py-0.5 text-xs font-bold">
                        -{Math.round((1 - item.phanTram) * 100)}%
                      </span>
                    </div>
                    <span className="text-xs font-mono text-gray-500 text-center">{item.phanTram}</span>
                    <button
                      onClick={(e) => { e.stopPropagation(); handleRemove(item.slug); }}
                      className="p-1 text-gray-400 hover:text-red-500 transition-colors"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Inline edit row */}
                  {editingSlug === item.slug && (
                    <div className="px-3 py-2 bg-blue-50 border-b border-blue-100 flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
                      <span className="text-xs text-blue-600 font-medium w-24 flex-shrink-0">Sửa giá:</span>
                      <Input
                        placeholder="Giá gốc"
                        value={editGiaGoc}
                        onChange={(e) => setEditGiaGoc(e.target.value)}
                        className="text-xs h-7 w-28 font-mono"
                      />
                      <ArrowRight className="w-3 h-3 text-gray-400 flex-shrink-0" />
                      <Input
                        placeholder="Giá hiển thị"
                        value={editGiaDien}
                        onChange={(e) => setEditGiaDien(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && handleEditSave(item.slug)}
                        className="text-xs h-7 w-28 font-mono"
                      />
                      {editGiaGoc && editGiaDien && parseInt(editGiaDien) < parseInt(editGiaGoc) && (
                        <span className="text-xs font-bold text-red-600 bg-red-50 border border-red-200 rounded px-2 py-0.5">
                          -{Math.round((1 - parseInt(editGiaDien) / parseInt(editGiaGoc)) * 100)}%
                        </span>
                      )}
                      <Button size="sm" className="h-7 text-xs px-3 ml-auto" onClick={() => handleEditSave(item.slug)}>Lưu</Button>
                      <Button size="sm" variant="outline" className="h-7 text-xs px-2" onClick={() => setEditingSlug(null)}>Hủy</Button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Generated entries preview */}
      {items.length > 0 && (
        <div className="flex items-start gap-2 p-3 bg-green-50 border border-green-200 rounded-lg">
          <Percent className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
          <div className="min-w-0 flex-1">
            <p className="text-xs font-semibold text-green-700 mb-1">CAU_HINH sẵn sàng ({items.length} sản phẩm):</p>
            <pre className="text-xs text-green-800 font-mono whitespace-pre-wrap break-all">
              {`var CAU_HINH = [\n${itemsToEntries(items)}\n];`}
            </pre>
          </div>
        </div>
      )}
    </div>
  );
}
