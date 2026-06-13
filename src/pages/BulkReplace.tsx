import { useState, useMemo, useRef } from "react";
import { Link } from "wouter";
import {
  ArrowLeft, Copy, Check, RefreshCw, Layers, Phone, User, Globe,
  ClipboardPaste, ChevronDown, ChevronUp, Palette,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import rawScript from "@/lib/masterScript.txt?raw";

const BRAND_TOTAL   = (rawScript.match(/\{\{BRAND_NAME\}\}/g)    || []).length;
const PHONE_TOTAL   = (rawScript.match(/\{\{PHONE_NUMBER\}\}/g)  || []).length
                    + (rawScript.match(/\{\{PHONE_DOT\}\}/g)     || []).length;
const STAFF_TOTAL   = (rawScript.match(/\{\{STAFF_NAME\}\}/g)    || []).length;
const SITE_TOTAL    = (rawScript.match(/\{\{SITE\}\}/g)          || []).length;
const TOTAL_ALL     = BRAND_TOTAL + PHONE_TOTAL + STAFF_TOTAL + SITE_TOTAL;

function formatPhoneDot(raw: string): string {
  const d = raw.replace(/\D/g, "");
  if (d.length === 10) return `${d.slice(0,4)}.${d.slice(4,7)}.${d.slice(7)}`;
  if (d.length === 11) return `${d.slice(0,4)}.${d.slice(4,7)}.${d.slice(7)}`;
  return d;
}

const BRAND_COLOR_HEXES = ["#003366", "#008C99", "#D1C300", "#D4AF37"];
const DEFAULT_BRAND_FIRST = "#003366";

function normalizeHex(raw: string): string {
  let v = raw.trim();
  if (!v) return "";
  if (!v.startsWith("#")) v = "#" + v;
  if (/^#([0-9A-Fa-f]{3}|[0-9A-Fa-f]{6})$/.test(v)) return v.toUpperCase().replace(/^#/, "#");
  return "";
}

function rgbaToHex(raw: string): string {
  if (!raw) return "";
  const m = raw.trim().match(/rgba?\s*\(\s*(\d{1,3})\s*[, ]\s*(\d{1,3})\s*[, ]\s*(\d{1,3})(?:\s*[,/]\s*([\d.]+%?))?\s*\)/i);
  if (!m) return "";
  const r = +m[1], g = +m[2], b = +m[3];
  if (r > 255 || g > 255 || b > 255) return "";
  const h = (n: number) => ("0" + n.toString(16)).slice(-2);
  return ("#" + h(r) + h(g) + h(b)).toUpperCase();
}

interface ParseResult { filled: string[]; missed: string[] }

function parseMasterScript(text: string): { vals: Record<string, string>; filled: string[]; missed: string[] } {
  const match1 = (re: RegExp) => { const m = text.match(re); return m ? m[1].trim() : null; };

  const patterns: Record<string, RegExp> = {
    BRAND_NAME:   /badge\.innerHTML\s*=\s*'&#x2605;\s+([^&]+)\s+&nbsp;/,
    PHONE_NUMBER: /zalo\.me\/([^"']+)/,
    STAFF_NAME:   /\(em ([^)]+)\)/,
    SITE:         /Đã mua tại ([^'"\n\\]+)/,
    BRAND_COLOR:  /linear-gradient\(to right,\s*(#[0-9A-Fa-f]{3,8})/,
  };

  const labels: Record<string, string> = {
    BRAND_NAME: "Tên thương hiệu",
    PHONE_NUMBER: "Số điện thoại",
    STAFF_NAME: "Tên nhân viên",
    SITE: "Domain website",
    BRAND_COLOR: "Mã màu hiển thị",
  };

  const vals: Record<string, string> = {};
  const filled: string[] = [];
  const missed: string[] = [];

  for (const [key, pat] of Object.entries(patterns)) {
    const val = match1(pat);
    if (key === "BRAND_COLOR") {
      const normalized = val ? normalizeHex(val) : "";
      if (normalized && normalized.toUpperCase() !== DEFAULT_BRAND_FIRST.toUpperCase()) {
        vals[key] = normalized;
        filled.push(labels[key]);
      }
      continue;
    }
    if (val) { vals[key] = val; filled.push(labels[key]); }
    else { missed.push(labels[key]); }
  }

  return { vals, filled, missed };
}

export default function BulkReplace() {
  const [brandName,    setBrandName]    = useState("");
  const [phoneNumber,  setPhoneNumber]  = useState("");
  const [staffName,    setStaffName]    = useState("");
  const [siteUrl,      setSiteUrl]      = useState("");
  const [brandColor,   setBrandColor]   = useState("");
  const [rgbaInput,    setRgbaInput]    = useState("");
  const [copied,       setCopied]       = useState(false);
  const [showPasteBox, setShowPasteBox] = useState(false);
  const [pasteText,    setPasteText]    = useState("");
  const [parseResult,  setParseResult]  = useState<ParseResult | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const { toast } = useToast();

  const rawPhone      = phoneNumber.replace(/\D/g, "");
  const dotPhone      = formatPhoneDot(rawPhone);
  const cleanSite     = siteUrl.trim().replace(/\/$/, "");
  const cleanColor    = normalizeHex(brandColor);

  const outputScript = useMemo(() => {
    let s = rawScript;
    s = s.split("{{BRAND_NAME}}").join(brandName.trim() || "{{BRAND_NAME}}");
    s = s.split("{{PHONE_NUMBER}}").join(rawPhone       || "{{PHONE_NUMBER}}");
    s = s.split("{{PHONE_DOT}}").join(dotPhone          || "{{PHONE_DOT}}");
    s = s.split("{{STAFF_NAME}}").join(staffName.trim() || "{{STAFF_NAME}}");
    s = s.split("{{SITE}}").join(cleanSite              || "{{SITE}}");
    if (cleanColor) {
      for (const orig of BRAND_COLOR_HEXES) {
        s = s.split(orig).join(cleanColor);
      }
    }
    return s;
  }, [brandName, rawPhone, dotPhone, staffName, cleanSite, cleanColor]);

  const canCopy = brandName.trim().length > 0
               && rawPhone.length >= 9
               && staffName.trim().length > 0
               && cleanSite.length > 0;

  const replacedBrand = brandName.trim()       ? BRAND_TOTAL : 0;
  const replacedPhone = rawPhone.length >= 9   ? PHONE_TOTAL : 0;
  const replacedStaff = staffName.trim()        ? STAFF_TOTAL : 0;
  const replacedSite  = cleanSite.length > 0   ? SITE_TOTAL  : 0;
  const replacedTotal = replacedBrand + replacedPhone + replacedStaff + replacedSite;

  const handlePasteAutoFill = () => {
    if (!pasteText.trim()) return;
    const { vals, filled, missed } = parseMasterScript(pasteText);
    if (filled.length === 0) {
      toast({ title: "Không tìm thấy dữ liệu", description: "Script dán vào không khớp định dạng.", variant: "destructive" });
      return;
    }
    if (vals.BRAND_NAME)   setBrandName(vals.BRAND_NAME);
    if (vals.PHONE_NUMBER) setPhoneNumber(vals.PHONE_NUMBER);
    if (vals.STAFF_NAME)   setStaffName(vals.STAFF_NAME);
    if (vals.SITE)         setSiteUrl(vals.SITE);
    if (vals.BRAND_COLOR)  setBrandColor(vals.BRAND_COLOR);
    setParseResult({ filled, missed });
    toast({ title: `Đã điền ${filled.length} trường`, description: filled.join(", ") });
  };

  const handleCopy = async () => {
    if (!canCopy) return;
    try {
      await navigator.clipboard.writeText(outputScript);
      setCopied(true);
      toast({
        title: "Đã copy!",
        description: `Script (${outputScript.length.toLocaleString()} ký tự) đã được copy vào clipboard.`,
      });
      setTimeout(() => setCopied(false), 2500);
    } catch {
      if (textareaRef.current) {
        textareaRef.current.select();
        document.execCommand("copy");
        setCopied(true);
        toast({ title: "Đã copy!", description: "Script đã được copy vào clipboard." });
        setTimeout(() => setCopied(false), 2500);
      }
    }
  };

  const handleReset = () => {
    setBrandName("");
    setPhoneNumber("");
    setStaffName("");
    setSiteUrl("");
    setBrandColor("");
    setRgbaInput("");
    setPasteText("");
    setParseResult(null);
    setCopied(false);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Link href="/">
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <ArrowLeft className="w-4 h-4" />
              </Button>
            </Link>
            <div className="w-8 h-8 rounded-lg bg-violet-600 flex items-center justify-center">
              <Layers className="w-4 h-4 text-white" />
            </div>
            <div>
              <h1 className="text-base font-bold text-gray-900 leading-none">Bulk Copy Tool</h1>
              <p className="text-xs text-gray-500">Thay thương hiệu & số điện thoại trong toàn bộ script</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="secondary" className="text-xs hidden sm:flex">
              {TOTAL_ALL} vị trí thay thế
            </Badge>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-8 space-y-6">
        {/* Info card */}
        <div className="bg-violet-50 border border-violet-200 rounded-xl p-4 text-sm text-violet-800">
          <p className="font-semibold mb-1">Hướng dẫn sử dụng</p>
          <p className="text-violet-700 text-xs leading-relaxed">
            Nhập tên thương hiệu, số điện thoại, tên nhân viên và domain website. Toàn bộ{" "}
            <strong>{TOTAL_ALL} vị trí</strong> ({BRAND_TOTAL} thương hiệu + {PHONE_TOTAL} số điện thoại + {STAFF_TOTAL} nhân viên + {SITE_TOTAL} domain) sẽ được thay thế tự động.
          </p>
        </div>

        {/* Paste old script — auto-fill */}
        <div className="bg-white border border-blue-200 rounded-xl overflow-hidden">
          <button
            type="button"
            className="w-full flex items-center justify-between px-5 py-3.5 text-left hover:bg-blue-50 transition-colors"
            onClick={() => { setShowPasteBox((v) => !v); setParseResult(null); }}
          >
            <div className="flex items-center gap-2.5">
              <ClipboardPaste className="w-4 h-4 text-blue-500 flex-shrink-0" />
              <div>
                <p className="text-sm font-semibold text-blue-700 leading-none">Tự điền từ script cũ</p>
                <p className="text-xs text-gray-500 mt-0.5">Dán script đã copy trước đó — tự nhận diện và điền lại các trường</p>
              </div>
            </div>
            {showPasteBox
              ? <ChevronUp className="w-4 h-4 text-gray-400 flex-shrink-0" />
              : <ChevronDown className="w-4 h-4 text-gray-400 flex-shrink-0" />
            }
          </button>

          {showPasteBox && (
            <div className="px-5 pb-5 pt-1 space-y-3 border-t border-blue-100">
              <Textarea
                placeholder="Dán toàn bộ script cũ vào đây..."
                value={pasteText}
                onChange={(e) => { setPasteText(e.target.value); setParseResult(null); }}
                className="font-mono text-xs min-h-[120px] resize-none bg-gray-50"
                spellCheck={false}
              />

              <Button
                size="sm"
                className="gap-1.5 h-8 text-xs bg-blue-600 hover:bg-blue-700 text-white"
                onClick={handlePasteAutoFill}
                disabled={!pasteText.trim()}
              >
                <ClipboardPaste className="w-3.5 h-3.5" />
                Tự điền thông tin
              </Button>

              {parseResult && (
                <div className="space-y-1.5">
                  {parseResult.filled.length > 0 && (
                    <div className="flex flex-wrap gap-1.5">
                      {parseResult.filled.map((f) => (
                        <span key={f} className="inline-flex items-center gap-1 text-xs bg-green-50 text-green-700 border border-green-200 px-2 py-0.5 rounded-full font-medium">
                          <Check className="w-3 h-3" /> {f}
                        </span>
                      ))}
                    </div>
                  )}
                  {parseResult.missed.length > 0 && (
                    <div className="flex flex-wrap gap-1.5">
                      {parseResult.missed.map((f) => (
                        <span key={f} className="inline-flex items-center gap-1 text-xs bg-amber-50 text-amber-700 border border-amber-200 px-2 py-0.5 rounded-full">
                          ⚠ {f}
                        </span>
                      ))}
                    </div>
                  )}
                  {parseResult.missed.length > 0 && (
                    <p className="text-xs text-amber-600">Các trường trên cần điền tay.</p>
                  )}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Input area */}
        <div className="bg-white border border-gray-200 rounded-xl p-6 space-y-5">

          {/* Brand name field */}
          <div className="space-y-2">
            <Label htmlFor="brand-name" className="text-sm font-semibold text-gray-700">
              Tên thương hiệu
              <span className="ml-2 text-xs font-normal text-violet-500 bg-violet-50 px-1.5 py-0.5 rounded">
                {BRAND_TOTAL} vị trí
              </span>
            </Label>
            <Input
              id="brand-name"
              placeholder="Ví dụ: Bán Rẻ - Mua Khéo"
              value={brandName}
              onChange={(e) => setBrandName(e.target.value)}
              className="text-sm"
              autoFocus
            />
            {brandName.trim() ? (
              <p className="text-xs text-violet-600 font-medium">
                ✓ Thay thế {BRAND_TOTAL} vị trí → "{brandName.trim()}"
              </p>
            ) : (
              <p className="text-xs text-gray-400">
                Placeholder:{" "}
                <code className="bg-gray-100 px-1 rounded">{"{{BRAND_NAME}}"}</code>
              </p>
            )}
          </div>

          {/* Phone number field */}
          <div className="space-y-2">
            <Label htmlFor="phone-number" className="text-sm font-semibold text-gray-700">
              Số điện thoại / Zalo
              <span className="ml-2 text-xs font-normal text-blue-500 bg-blue-50 px-1.5 py-0.5 rounded">
                {PHONE_TOTAL} vị trí
              </span>
            </Label>
            <div className="relative">
              <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                id="phone-number"
                placeholder="Ví dụ: 0858279868"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                className="pl-9 text-sm"
                inputMode="tel"
              />
            </div>
            {rawPhone.length >= 9 ? (
              <p className="text-xs text-blue-600 font-medium">
                ✓ Số thô: <strong>{rawPhone}</strong> &nbsp;|&nbsp; Có chấm: <strong>{dotPhone}</strong>
              </p>
            ) : (
              <p className="text-xs text-gray-400">
                Sẽ tự sinh cả 2 dạng:{" "}
                <code className="bg-gray-100 px-1 rounded">0858279868</code> và{" "}
                <code className="bg-gray-100 px-1 rounded">0858.279.868</code>
              </p>
            )}
          </div>

          {/* Staff name field */}
          <div className="space-y-2">
            <Label htmlFor="staff-name" className="text-sm font-semibold text-gray-700">
              Tên nhân viên
              <span className="ml-2 text-xs font-normal text-orange-500 bg-orange-50 px-1.5 py-0.5 rounded">
                {STAFF_TOTAL} vị trí
              </span>
            </Label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                id="staff-name"
                placeholder="Ví dụ: Thắng, Đức, Trang..."
                value={staffName}
                onChange={(e) => setStaffName(e.target.value)}
                className="pl-9 text-sm"
              />
            </div>
            {staffName.trim() ? (
              <p className="text-xs text-orange-600 font-medium">
                ✓ Sẽ hiện là: <strong>(em {staffName.trim()})</strong> trong script
              </p>
            ) : (
              <p className="text-xs text-gray-400">
                Placeholder:{" "}
                <code className="bg-gray-100 px-1 rounded">{"(em {{STAFF_NAME}})"}</code>
              </p>
            )}
          </div>

          {/* Site / domain field */}
          <div className="space-y-2">
            <Label htmlFor="site-url" className="text-sm font-semibold text-gray-700">
              Domain website
              <span className="ml-2 text-xs font-normal text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded">
                {SITE_TOTAL} vị trí
              </span>
            </Label>
            <div className="relative">
              <Globe className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                id="site-url"
                placeholder="Ví dụ: junjin.ratxin.vn"
                value={siteUrl}
                onChange={(e) => setSiteUrl(e.target.value)}
                className="pl-9 text-sm"
                inputMode="url"
              />
            </div>
            {cleanSite ? (
              <p className="text-xs text-emerald-600 font-medium">
                ✓ Thay thế {SITE_TOTAL} vị trí → "{cleanSite}"
              </p>
            ) : (
              <p className="text-xs text-gray-400">
                Nhập domain không có dấu / cuối. Placeholder:{" "}
                <code className="bg-gray-100 px-1 rounded">{"{{SITE}}"}</code>
              </p>
            )}
          </div>

          {/* Brand color field — OPTIONAL */}
          <div className="pt-1 border-t border-dashed border-gray-200 space-y-2">
            <Label htmlFor="brand-color" className="text-sm font-semibold text-gray-700 flex items-center gap-2">
              <Palette className="w-4 h-4 text-pink-500" />
              Mã màu hiển thị
              <span className="text-xs font-normal text-gray-400">(tùy chọn)</span>
              <span className="ml-auto text-xs font-normal text-pink-500 bg-pink-50 px-1.5 py-0.5 rounded">
                Brand color
              </span>
            </Label>
            <div className="flex items-center gap-2">
              <input
                type="color"
                aria-label="Chọn màu"
                value={cleanColor || DEFAULT_BRAND_FIRST}
                onChange={(e) => setBrandColor(e.target.value.toUpperCase())}
                className="h-10 w-12 rounded-md border border-gray-200 cursor-pointer bg-white p-1 flex-shrink-0"
              />
              <div className="relative flex-1">
                <Palette className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  id="brand-color"
                  placeholder="Ví dụ: #DC2626 — bỏ trống = màu mặc định (xanh)"
                  value={brandColor}
                  onChange={(e) => setBrandColor(e.target.value)}
                  className="pl-9 text-sm font-mono uppercase"
                  maxLength={7}
                />
              </div>
            </div>

            {/* RGBA → HEX converter helper */}
            <div className="rounded-lg border border-dashed border-pink-200 bg-pink-50/40 p-3 space-y-2">
              <div className="flex items-center gap-2 text-xs font-semibold text-pink-700">
                <span className="font-mono bg-white border border-pink-200 px-1.5 py-0.5 rounded">RGBA</span>
                <span className="text-pink-400">→</span>
                <span className="font-mono bg-white border border-pink-200 px-1.5 py-0.5 rounded">HEX</span>
                <span className="text-pink-600 font-normal">— chuyển đổi nhanh</span>
              </div>
              <div className="flex items-center gap-2">
                <Input
                  placeholder="Dán: rgba(73, 148, 33, 1) hoặc rgb(73,148,33)"
                  value={rgbaInput}
                  onChange={(e) => setRgbaInput(e.target.value)}
                  className="text-sm font-mono flex-1 bg-white"
                />
                {(() => {
                  const hex = rgbaToHex(rgbaInput);
                  if (!hex) {
                    return rgbaInput.trim() ? (
                      <span className="text-xs text-amber-600 whitespace-nowrap">⚠ Sai cú pháp</span>
                    ) : (
                      <span className="text-xs text-gray-400 whitespace-nowrap">Chưa có dữ liệu</span>
                    );
                  }
                  return (
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <span
                        className="w-6 h-6 rounded border border-white shadow-sm"
                        style={{ background: hex }}
                      />
                      <span className="text-xs font-mono font-semibold text-pink-700">{hex}</span>
                      <Button
                        type="button"
                        size="sm"
                        className="h-7 text-xs bg-pink-600 hover:bg-pink-700 text-white gap-1"
                        onClick={() => { setBrandColor(hex); }}
                      >
                        <Palette className="w-3 h-3" />
                        Dùng màu này
                      </Button>
                    </div>
                  );
                })()}
              </div>
              <p className="text-[11px] text-gray-500 leading-relaxed">
                Hỗ trợ: <code className="bg-white px-1 rounded">rgb(r,g,b)</code>, <code className="bg-white px-1 rounded">rgba(r,g,b,a)</code> hoặc <code className="bg-white px-1 rounded">rgba(r g b / a)</code>. Độ trong suốt (alpha) sẽ bị bỏ qua khi chuyển sang HEX.
              </p>
            </div>
            {cleanColor ? (
              <div className="flex items-start gap-2 p-3 bg-pink-50 border border-pink-200 rounded-lg">
                <span
                  className="w-5 h-5 rounded-md border border-white shadow-sm flex-shrink-0 mt-0.5"
                  style={{ background: cleanColor }}
                />
                <div>
                  <p className="text-xs text-pink-700 font-semibold">
                    Màu thương hiệu: <span className="font-mono">{cleanColor}</span>
                  </p>
                  <p className="text-xs text-pink-600 mt-0.5">
                    Sẽ thay toàn bộ màu mặc định ({BRAND_COLOR_HEXES.join(", ")}) bằng màu này.
                  </p>
                </div>
              </div>
            ) : brandColor.trim() ? (
              <p className="text-xs text-amber-600">
                ⚠ Mã màu chưa hợp lệ. Dùng dạng <code className="bg-gray-100 px-1 rounded">#RRGGBB</code> hoặc <code className="bg-gray-100 px-1 rounded">#RGB</code>.
              </p>
            ) : (
              <div className="flex items-center gap-2">
                <span
                  className="w-4 h-4 rounded border border-gray-200 flex-shrink-0"
                  style={{ background: `linear-gradient(to right, ${BRAND_COLOR_HEXES.join(",")})` }}
                />
                <p className="text-xs text-gray-400">
                  Bỏ trống = giữ màu mặc định (gradient xanh–vàng). Điền mã hex để dùng màu khác cho domain này.
                </p>
              </div>
            )}
          </div>

          {/* Status + copy button */}
          {replacedTotal > 0 && (
            <p className="text-xs text-green-600 font-medium">
              ✓ Đã điền {replacedTotal}/{TOTAL_ALL} vị trí
              {replacedTotal < TOTAL_ALL && (
                <span className="text-amber-500">
                  {" "}— còn {TOTAL_ALL - replacedTotal} vị trí chưa điền
                </span>
              )}
            </p>
          )}

          <div className="flex gap-3">
            <Button
              onClick={handleCopy}
              className={`flex-1 gap-2 text-white ${lockLine ? "bg-indigo-600 hover:bg-indigo-700" : "bg-violet-600 hover:bg-violet-700"}`}
              disabled={!canCopy}
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4" />
                  Đã copy!
                </>
              ) : lockLine ? (
                <>
                  <Lock className="w-4 h-4" />
                  Copy script (đã khoá)
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4" />
                  Copy toàn bộ script
                </>
              )}
            </Button>
            {(brandName || phoneNumber || staffName || siteUrl || lockDomain || brandColor) && (
              <Button
                variant="ghost"
                size="icon"
                className="h-10 w-10 text-gray-400 hover:text-gray-600"
                onClick={handleReset}
                title="Xóa tất cả"
              >
                <RefreshCw className="w-4 h-4" />
              </Button>
            )}
          </div>

          {!canCopy && (brandName || phoneNumber || staffName || siteUrl) && (
            <p className="text-xs text-amber-600">
              ⚠ Cần điền đủ Tên thương hiệu, Số điện thoại, Tên nhân viên và Domain để có thể copy.
            </p>
          )}
        </div>

        {/* Script preview */}
        <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
          <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100 bg-gray-50">
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-gray-600">Nội dung script</span>
              <Badge variant="outline" className="text-xs">
                {outputScript.length.toLocaleString()} ký tự
              </Badge>
              {lockLine && (
                <Badge className="text-xs bg-indigo-100 text-indigo-700 border-indigo-200 gap-1">
                  <Lock className="w-2.5 h-2.5" /> {IIFE_COUNT} block đã khoá
                </Badge>
              )}
            </div>
            <Button
              variant="outline"
              size="sm"
              className="h-7 gap-1.5 text-xs"
              onClick={handleCopy}
              disabled={!canCopy}
            >
              {copied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
              {copied ? "Đã copy" : "Copy"}
            </Button>
          </div>
          <textarea
            ref={textareaRef}
            readOnly
            value={outputScript}
            className="w-full h-[480px] p-4 font-mono text-xs text-gray-700 bg-gray-50 resize-none focus:outline-none leading-relaxed"
            spellCheck={false}
          />
        </div>
      </main>
    </div>
  );
}
