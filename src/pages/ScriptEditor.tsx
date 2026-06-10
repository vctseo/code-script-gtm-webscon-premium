import { useState, useEffect, useMemo } from "react";
import { useLocation, useParams } from "wouter";
import { ArrowLeft, Copy, Save, Eye, EyeOff, Check, RefreshCw, FileCode, ClipboardPaste, ChevronDown, ChevronUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SCRIPT_TEMPLATES, applyFieldValues, extractFieldsFromTemplate } from "@/lib/scriptTemplates";
import { saveScript, updateScript, getSavedScripts, getCustomTemplates, type SavedScript } from "@/lib/storage";
import { useToast } from "@/hooks/use-toast";
import VideoAvatarManager from "@/components/VideoAvatarManager";
import SalePriceManager from "@/components/SalePriceManager";

interface ScriptEditorProps {
  mode: "new" | "edit";
  templateId?: string;
  savedId?: string;
}

export default function ScriptEditor({ mode, templateId, savedId }: ScriptEditorProps) {
  const [, navigate] = useLocation();
  const { toast } = useToast();

  const [fieldValues, setFieldValues] = useState<Record<string, string>>({});
  const [customTemplate, setCustomTemplate] = useState("");
  const [websiteName, setWebsiteName] = useState("");
  const [showPreview, setShowPreview] = useState(true);
  const [copied, setCopied] = useState(false);
  const [saved, setSaved] = useState(false);
  const [existingSaved, setExistingSaved] = useState<SavedScript | null>(null);
  const [showPasteBox, setShowPasteBox] = useState(false);
  const [pasteText, setPasteText] = useState("");
  const [parseResult, setParseResult] = useState<{ filled: string[]; missed: string[] } | null>(null);

  const [showSalePricePasteBox, setShowSalePricePasteBox] = useState(false);
  const [salePricePasteText, setSalePricePasteText] = useState("");
  const [salePriceParseResult, setSalePriceParseResult] = useState<{ filled: string[]; missed: string[] } | null>(null);

  // Parse old generated script for warehouse-contact template
  const parseWarehouseScript = (raw: string) => {
    const try1 = (pattern: RegExp) => {
      const m = raw.match(pattern);
      return m ? m[1].trim() : null;
    };
    const extracted: Record<string, string> = {};
    const filled: string[] = [];
    const missed: string[] = [];

    const patterns: Record<string, RegExp> = {
      PRIMARY_COLOR: /var C1\s*=\s*'(#[0-9a-fA-F]{3,6})'/,
      MAP_URL:      /var MAP_URL\s*=\s*'([^']+)'/,
      PHONE:        /zalo\.me\/([^"']+)/,
      ADDRESS:      /Đ[iị]a ch[iỉ]:<\/strong>\s*([^<]+)<\/li>/,
      BRAND_NAME:   /alt="([^"]+)"\s*\/?>/,
      WEBSITE_URL:  /href="([^"]+)\/dang-nhap"/,
      IMAGE_URL:    /var AVATAR_URL\s*=\s*'([^']+)'/,
      PERSON_NAME:  /white-space:nowrap[^>]*>([^<]+)<\/div>/,
    };

    const labels: Record<string, string> = {
      PRIMARY_COLOR: "Màu thương hiệu",
      MAP_URL: "URL Google Maps", PHONE: "Số điện thoại",
      ADDRESS: "Địa chỉ", BRAND_NAME: "Tên thương hiệu",
      WEBSITE_URL: "URL website", IMAGE_URL: "URL ảnh",
      PERSON_NAME: "Nhãn người dùng",
    };

    for (const [key, pat] of Object.entries(patterns)) {
      const val = try1(pat);
      if (val) {
        extracted[key] = val;
        filled.push(labels[key]);
      } else {
        missed.push(labels[key]);
      }
    }
    return { extracted, filled, missed };
  };

  const handlePasteAutoFill = () => {
    if (!pasteText.trim()) return;
    const { extracted, filled, missed } = parseWarehouseScript(pasteText);
    if (filled.length === 0) {
      toast({ title: "Không tìm thấy dữ liệu", description: "Script dán vào không khớp định dạng.", variant: "destructive" });
      return;
    }
    setFieldValues((prev) => ({ ...prev, ...extracted }));
    setParseResult({ filled, missed });
    toast({ title: `Đã điền ${filled.length} trường`, description: filled.join(", ") });
  };

  // Parse old generated script for sale-price template
  const parseSalePriceScript = (raw: string) => {
    const m = raw.match(/var CAU_HINH\s*=\s*\[\s*([\s\S]*?)\s*\];/);
    if (m && m[1].trim()) {
      const entries = m[1].trim();
      return { extracted: { CAU_HINH_ENTRIES: entries }, filled: ["Danh sách sản phẩm & % giảm"], missed: [] };
    }
    return { extracted: {}, filled: [], missed: ["Danh sách sản phẩm & % giảm"] };
  };

  const handlePasteSalePriceAutoFill = () => {
    if (!salePricePasteText.trim()) return;
    const { extracted, filled, missed } = parseSalePriceScript(salePricePasteText);
    if (filled.length === 0) {
      toast({ title: "Không tìm thấy dữ liệu", description: "Script dán vào không khớp định dạng.", variant: "destructive" });
      return;
    }
    setFieldValues((prev) => ({ ...prev, ...extracted }));
    setSalePriceParseResult({ filled, missed });
    toast({ title: `Đã điền ${filled.length} trường`, description: filled.join(", ") });
  };

  const allTemplates = useMemo(() => {
    const custom = getCustomTemplates();
    return [...SCRIPT_TEMPLATES, ...custom];
  }, []);

  const template = useMemo(() => {
    const id = templateId;
    return allTemplates.find((t) => t.id === id) ?? null;
  }, [templateId, allTemplates]);

  useEffect(() => {
    if (mode === "edit" && savedId) {
      const scripts = getSavedScripts();
      const found = scripts.find((s) => s.id === savedId);
      if (found) {
        setExistingSaved(found);
        setFieldValues(found.fieldValues);
        setWebsiteName(found.websiteName);
      }
    }
  }, [mode, savedId]);

  useEffect(() => {
    if (template) {
      const defaults: Record<string, string> = {};
      template.fields.forEach((f) => {
        if (!fieldValues[f.key]) {
          defaults[f.key] = "";
        }
      });
      setFieldValues((prev) => ({ ...defaults, ...prev }));
    }
  }, [template]);

  const effectiveTemplate = useMemo(() => {
    if (template) return template.template;
    if (mode === "edit" && existingSaved) {
      const tmpl = allTemplates.find((t) => t.id === existingSaved.templateId);
      return tmpl?.template ?? customTemplate;
    }
    return customTemplate;
  }, [template, customTemplate, existingSaved, mode, allTemplates]);

  const generatedScript = useMemo(() => {
    return applyFieldValues(effectiveTemplate, fieldValues);
  }, [effectiveTemplate, fieldValues]);

  const remainingPlaceholders = useMemo(() => {
    return extractFieldsFromTemplate(generatedScript);
  }, [generatedScript]);

  const handleFieldChange = (key: string, value: string) => {
    setFieldValues((prev) => ({ ...prev, [key]: value }));
    setSaved(false);
  };

  const handleCopy = async () => {
    await navigator.clipboard.writeText(generatedScript);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    toast({ title: "Đã copy!", description: "Script đã được copy vào clipboard." });
  };

  const handleSave = () => {
    if (!websiteName.trim()) {
      toast({ title: "Thiếu tên website", description: "Vui lòng nhập tên website để lưu.", variant: "destructive" });
      return;
    }

    const scriptData = {
      templateId: template?.id ?? existingSaved?.templateId ?? "custom",
      templateName: template?.name ?? existingSaved?.templateName ?? "Script tùy chỉnh",
      websiteName: websiteName.trim(),
      fieldValues,
      generatedScript,
    };

    if (mode === "edit" && existingSaved) {
      updateScript(existingSaved.id, scriptData);
      toast({ title: "Đã cập nhật!", description: "Script đã được lưu thành công." });
    } else {
      saveScript(scriptData);
      toast({ title: "Đã lưu!", description: "Script đã được lưu thành công." });
    }

    setSaved(true);
  };

  const editedTemplate = mode === "edit" && existingSaved
    ? allTemplates.find((t) => t.id === existingSaved.templateId)
    : template;

  const fields = editedTemplate?.fields ?? [];
  const activeTemplateId = editedTemplate?.id ?? template?.id;
  const isSaleBadge = activeTemplateId === "sale-badge";
  const isVideoAvatar = activeTemplateId === "video-avatar";
  const isSalePrice = activeTemplateId === "sale-price";
  // For special templates: hide fields managed by custom UI
  const basicFields = isVideoAvatar
    ? fields.filter((f) => f.key !== "VIDEO_MAP_ENTRIES")
    : isSalePrice
    ? fields.filter((f) => f.key !== "CAU_HINH_ENTRIES")
    : fields;

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center gap-3">
          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => navigate("/")}>
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <div className="flex items-center gap-2 flex-1 min-w-0">
            <FileCode className="w-4 h-4 text-blue-600 flex-shrink-0" />
            <h1 className="text-sm font-semibold text-gray-900 truncate">
              {mode === "edit" ? "Chỉnh sửa script" : (template?.name ?? "Tạo script mới")}
            </h1>
          </div>
          <div className="flex items-center gap-2">
            <Button
              size="sm"
              variant="outline"
              className="gap-1.5 h-8 text-xs"
              onClick={() => setShowPreview(!showPreview)}
            >
              {showPreview ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
              {showPreview ? "Ẩn" : "Xem"} preview
            </Button>
            <Button
              size="sm"
              variant="outline"
              className="gap-1.5 h-8 text-xs"
              onClick={handleCopy}
            >
              {copied ? <Check className="w-3.5 h-3.5 text-green-600" /> : <Copy className="w-3.5 h-3.5" />}
              {copied ? "Đã copy" : "Copy"}
            </Button>
            <Button size="sm" className="gap-1.5 h-8 text-xs" onClick={handleSave}>
              {saved ? <Check className="w-3.5 h-3.5" /> : <Save className="w-3.5 h-3.5" />}
              {saved ? "Đã lưu" : "Lưu"}
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-6">
        <div className={`grid gap-6 ${showPreview ? "grid-cols-1 lg:grid-cols-2" : "grid-cols-1"}`}>
          {/* Left: Form */}
          <div className="space-y-4">
            {/* Website name */}
            <Card>
              <CardHeader className="pb-3 pt-4 px-4">
                <CardTitle className="text-sm">Tên website / Nhãn lưu</CardTitle>
                <CardDescription className="text-xs">Dùng để nhận diện script khi lưu</CardDescription>
              </CardHeader>
              <CardContent className="px-4 pb-4">
                <Input
                  placeholder="VD: JunJin Store, Website bán hàng A..."
                  value={websiteName}
                  onChange={(e) => setWebsiteName(e.target.value)}
                  className="text-sm"
                />
              </CardContent>
            </Card>

            {/* Paste old script to auto-fill — sale-price */}
            {activeTemplateId === "sale-price" && (
              <Card className="border-blue-200">
                <CardHeader
                  className="pb-2 pt-3 px-4 cursor-pointer select-none"
                  onClick={() => { setShowSalePricePasteBox((v) => !v); setSalePriceParseResult(null); }}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <ClipboardPaste className="w-4 h-4 text-blue-500" />
                      <CardTitle className="text-sm text-blue-700">Tự điền từ script cũ</CardTitle>
                    </div>
                    {showSalePricePasteBox
                      ? <ChevronUp className="w-4 h-4 text-gray-400" />
                      : <ChevronDown className="w-4 h-4 text-gray-400" />
                    }
                  </div>
                  <CardDescription className="text-xs">
                    Dán script đã copy trước đó — tự nhận diện và điền lại danh sách sản phẩm & % giảm
                  </CardDescription>
                </CardHeader>

                {showSalePricePasteBox && (
                  <CardContent className="px-4 pb-4 space-y-3">
                    <Textarea
                      placeholder="Dán toàn bộ script cũ vào đây..."
                      value={salePricePasteText}
                      onChange={(e) => { setSalePricePasteText(e.target.value); setSalePriceParseResult(null); }}
                      className="font-mono text-xs min-h-[120px] resize-none bg-gray-50"
                      spellCheck={false}
                    />

                    <Button
                      size="sm"
                      className="gap-1.5 h-8 text-xs bg-blue-600 hover:bg-blue-700 text-white"
                      onClick={handlePasteSalePriceAutoFill}
                      disabled={!salePricePasteText.trim()}
                    >
                      <ClipboardPaste className="w-3.5 h-3.5" />
                      Tự điền thông tin
                    </Button>

                    {salePriceParseResult && (
                      <div className="space-y-1.5">
                        {salePriceParseResult.filled.length > 0 && (
                          <div className="flex flex-wrap gap-1">
                            {salePriceParseResult.filled.map((f) => (
                              <span key={f} className="inline-flex items-center gap-1 text-xs bg-green-50 text-green-700 border border-green-200 px-2 py-0.5 rounded-full font-medium">
                                <Check className="w-3 h-3" /> {f}
                              </span>
                            ))}
                          </div>
                        )}
                        {salePriceParseResult.missed.length > 0 && (
                          <div className="flex flex-wrap gap-1">
                            {salePriceParseResult.missed.map((f) => (
                              <span key={f} className="inline-flex items-center gap-1 text-xs bg-amber-50 text-amber-700 border border-amber-200 px-2 py-0.5 rounded-full">
                                ⚠ {f}
                              </span>
                            ))}
                          </div>
                        )}
                        {salePriceParseResult.missed.length > 0 && (
                          <p className="text-xs text-amber-600">Các trường trên cần điền tay.</p>
                        )}
                      </div>
                    )}
                  </CardContent>
                )}
              </Card>
            )}

            {/* Paste old script to auto-fill — warehouse-contact only */}
            {activeTemplateId === "warehouse-contact" && (
              <Card className="border-blue-200">
                <CardHeader
                  className="pb-2 pt-3 px-4 cursor-pointer select-none"
                  onClick={() => { setShowPasteBox((v) => !v); setParseResult(null); }}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <ClipboardPaste className="w-4 h-4 text-blue-500" />
                      <CardTitle className="text-sm text-blue-700">Tự điền từ script cũ</CardTitle>
                    </div>
                    {showPasteBox
                      ? <ChevronUp className="w-4 h-4 text-gray-400" />
                      : <ChevronDown className="w-4 h-4 text-gray-400" />
                    }
                  </div>
                  <CardDescription className="text-xs">
                    Dán script đã copy trước đó — tự nhận diện và điền lại các trường
                  </CardDescription>
                </CardHeader>

                {showPasteBox && (
                  <CardContent className="px-4 pb-4 space-y-3">
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
                          <div className="flex flex-wrap gap-1">
                            {parseResult.filled.map((f) => (
                              <span key={f} className="inline-flex items-center gap-1 text-xs bg-green-50 text-green-700 border border-green-200 px-2 py-0.5 rounded-full font-medium">
                                <Check className="w-3 h-3" /> {f}
                              </span>
                            ))}
                          </div>
                        )}
                        {parseResult.missed.length > 0 && (
                          <div className="flex flex-wrap gap-1">
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
                  </CardContent>
                )}
              </Card>
            )}

            {/* Fields */}
            {basicFields.length > 0 && (
              <Card>
                <CardHeader className="pb-3 pt-4 px-4">
                  <CardTitle className="text-sm">Thông tin cần điền</CardTitle>
                  <CardDescription className="text-xs">
                    Điền thông tin vào các trường bên dưới, script sẽ tự động cập nhật
                  </CardDescription>
                </CardHeader>
                <CardContent className="px-4 pb-4 space-y-4">
                  {basicFields.map((field) => (
                    <div key={field.key} className="space-y-1.5">
                      <Label className="text-xs font-medium text-gray-700">
                        {field.label}
                        <span className="ml-1 font-mono text-gray-400 text-xs">
                          {`{{${field.key}}}`}
                        </span>
                      </Label>
                      {field.description && (
                        <p className="text-xs text-gray-400">{field.description}</p>
                      )}
                      {field.type === "textarea" ? (
                        <Textarea
                          placeholder={field.placeholder}
                          value={fieldValues[field.key] ?? ""}
                          onChange={(e) => handleFieldChange(field.key, e.target.value)}
                          className="text-sm min-h-[80px] resize-none"
                        />
                      ) : field.type === "color" ? (
                        (() => {
                          const rawVal = fieldValues[field.key] ?? "";
                          const trimmed = rawVal.trim();
                          const withHash = trimmed && !trimmed.startsWith("#") ? "#" + trimmed : trimmed;
                          const isValid = /^#([0-9A-Fa-f]{3}|[0-9A-Fa-f]{6})$/.test(withHash);
                          const expandShort = (h: string) =>
                            /^#[0-9A-Fa-f]{3}$/.test(h)
                              ? "#" + h.slice(1).split("").map((c) => c + c).join("")
                              : h;
                          const fallback = (field.placeholder.match(/#[0-9A-Fa-f]{6}/)?.[0]
                            ?? expandShort(field.placeholder.match(/#[0-9A-Fa-f]{3,6}/)?.[0] ?? "#66ba32"));
                          const colorPickerValue = isValid ? expandShort(withHash).toLowerCase() : fallback.toLowerCase();
                          const onTextChange = (val: string) => {
                            const t = val.trim();
                            if (!t) { handleFieldChange(field.key, ""); return; }
                            handleFieldChange(field.key, t.startsWith("#") ? t : "#" + t);
                          };
                          return (
                            <div className="space-y-1.5">
                              <div className="flex items-center gap-2">
                                <input
                                  type="color"
                                  aria-label="Chọn màu"
                                  value={colorPickerValue}
                                  onChange={(e) => handleFieldChange(field.key, e.target.value.toUpperCase())}
                                  className="h-9 w-11 rounded-md border border-gray-200 cursor-pointer bg-white p-1 flex-shrink-0"
                                />
                                <Input
                                  type="text"
                                  placeholder={field.placeholder}
                                  value={rawVal}
                                  onChange={(e) => onTextChange(e.target.value)}
                                  className="text-sm font-mono uppercase flex-1"
                                  maxLength={7}
                                />
                              </div>
                              {trimmed && !isValid && (
                                <p className="text-xs text-amber-600">
                                  ⚠ Mã màu chưa hợp lệ. Dùng dạng <code className="bg-gray-100 px-1 rounded">#RRGGBB</code> hoặc <code className="bg-gray-100 px-1 rounded">#RGB</code>.
                                </p>
                              )}
                              {isValid && (
                                <div className="flex items-center gap-2 text-xs text-gray-500">
                                  <span
                                    className="w-4 h-4 rounded border border-gray-200 flex-shrink-0"
                                    style={{ background: withHash }}
                                  />
                                  Xem trước: <span className="font-mono text-gray-700">{withHash.toUpperCase()}</span>
                                </div>
                              )}
                            </div>
                          );
                        })()
                      ) : (
                        <Input
                          type={field.type === "url" ? "url" : "text"}
                          placeholder={field.placeholder}
                          value={fieldValues[field.key] ?? ""}
                          onChange={(e) => handleFieldChange(field.key, e.target.value)}
                          className="text-sm"
                        />
                      )}
                    </div>
                  ))}
                </CardContent>
              </Card>
            )}

            {/* Sale badge: info panel (no per-ID management needed anymore) */}
            {isSaleBadge && (
              <div className="rounded-lg border border-blue-200 bg-blue-50/60 p-4 text-sm text-blue-900 space-y-1.5">
                <p className="font-semibold">Tự động gắn nhãn cho tất cả sản phẩm</p>
                <p className="text-xs text-blue-800/90">
                  Script sẽ quét mọi URL chứa <code className="bg-white/70 px-1 rounded">_p</code> trên trang. Tất cả sản phẩm đều được gắn badge <strong>SIÊU SALE</strong> (góc dưới), kèm 1 nhãn trạng thái ngẫu nhiên (góc trên): 🔥 Cháy hàng, 😅 Xả Kho, 📦 Hàng còn ít, ❤️ Yêu thích nhất.
                </p>
                <p className="text-xs text-blue-800/90">
                  Nhãn trạng thái được gán ổn định theo ID sản phẩm (cùng 1 sản phẩm luôn ra cùng 1 nhãn), phân bố đều ~25% mỗi loại. Không cần nhập danh sách ID.
                </p>
              </div>
            )}

            {/* Video avatar manager */}
            {isVideoAvatar && (
              <VideoAvatarManager
                fieldValues={fieldValues}
                onFieldChange={handleFieldChange}
              />
            )}

            {/* Sale price manager */}
            {isSalePrice && (
              <SalePriceManager
                fieldValues={fieldValues}
                onFieldChange={handleFieldChange}
              />
            )}

            {/* Status */}
            {remainingPlaceholders.length > 0 && (
              <div className="flex items-start gap-2 p-3 bg-amber-50 border border-amber-200 rounded-lg">
                <RefreshCw className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-xs font-medium text-amber-700">Còn {remainingPlaceholders.length} trường chưa điền:</p>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {remainingPlaceholders.map((p) => (
                      <Badge key={p} variant="outline" className="text-xs text-amber-700 border-amber-300 font-mono">
                        {`{{${p}}}`}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {remainingPlaceholders.length === 0 && generatedScript && (
              <div className="flex items-center gap-2 p-3 bg-green-50 border border-green-200 rounded-lg">
                <Check className="w-4 h-4 text-green-600" />
                <p className="text-xs font-medium text-green-700">Script đã sẵn sàng! Bấm Copy để dùng.</p>
              </div>
            )}
          </div>

          {/* Right: Preview */}
          {showPreview && (
            <div>
              <Card className="h-full">
                <CardHeader className="pb-2 pt-4 px-4">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-sm">Preview script</CardTitle>
                    <Button size="sm" variant="ghost" className="h-7 text-xs gap-1.5" onClick={handleCopy}>
                      {copied ? <Check className="w-3.5 h-3.5 text-green-600" /> : <Copy className="w-3.5 h-3.5" />}
                      {copied ? "Đã copy" : "Copy"}
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="px-4 pb-4">
                  <Tabs defaultValue="formatted">
                    <TabsList className="h-7 mb-3">
                      <TabsTrigger value="formatted" className="text-xs h-6 px-2">Đã format</TabsTrigger>
                      <TabsTrigger value="raw" className="text-xs h-6 px-2">Script thô</TabsTrigger>
                    </TabsList>
                    <TabsContent value="formatted">
                      <div className="relative">
                        <pre className="bg-gray-900 text-gray-100 rounded-lg p-4 text-xs overflow-auto max-h-[600px] leading-relaxed whitespace-pre-wrap break-all">
                          {generatedScript || <span className="text-gray-500">Script sẽ xuất hiện ở đây...</span>}
                        </pre>
                      </div>
                    </TabsContent>
                    <TabsContent value="raw">
                      <Textarea
                        readOnly
                        value={generatedScript}
                        className="font-mono text-xs min-h-[400px] bg-gray-50 resize-none"
                      />
                    </TabsContent>
                  </Tabs>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
