import { useState, useMemo } from "react";
import { useLocation } from "wouter";
import { ArrowLeft, Copy, Save, Plus, Trash2, Check, FileCode } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { applyFieldValues, extractFieldsFromTemplate, type ScriptField } from "@/lib/scriptTemplates";
import { saveCustomTemplate, saveScript } from "@/lib/storage";
import { useToast } from "@/hooks/use-toast";

export default function CustomScriptEditor() {
  const [, navigate] = useLocation();
  const { toast } = useToast();

  const [scriptName, setScriptName] = useState("");
  const [websiteName, setWebsiteName] = useState("");
  const [rawTemplate, setRawTemplate] = useState(`<script>
(function() {
  // Paste script của bạn vào đây
  // Sử dụng {{TEN_BIEN}} để tạo trường có thể thay thế
  // Ví dụ: var url = '{{WEBSITE_URL}}';
})();
</script>`);
  const [fieldValues, setFieldValues] = useState<Record<string, string>>({});
  const [customFields, setCustomFields] = useState<ScriptField[]>([]);
  const [copied, setCopied] = useState(false);

  const detectedPlaceholders = useMemo(() => extractFieldsFromTemplate(rawTemplate), [rawTemplate]);

  const generatedScript = useMemo(() => applyFieldValues(rawTemplate, fieldValues), [rawTemplate, fieldValues]);

  const handleAddField = () => {
    const key = `FIELD_${customFields.length + 1}`;
    setCustomFields((prev) => [
      ...prev,
      { key, label: "", placeholder: "", type: "text" },
    ]);
  };

  const handleRemoveField = (idx: number) => {
    setCustomFields((prev) => prev.filter((_, i) => i !== idx));
  };

  const handleFieldMeta = (idx: number, prop: keyof ScriptField, value: string) => {
    setCustomFields((prev) =>
      prev.map((f, i) => (i === idx ? { ...f, [prop]: value } : f))
    );
  };

  const handleCopy = async () => {
    await navigator.clipboard.writeText(generatedScript);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    toast({ title: "Đã copy!", description: "Script đã được copy vào clipboard." });
  };

  const handleSaveAsTemplate = () => {
    if (!scriptName.trim()) {
      toast({ title: "Thiếu tên", description: "Nhập tên template trước khi lưu.", variant: "destructive" });
      return;
    }
    const template = {
      id: `custom_${Date.now()}`,
      name: scriptName,
      description: "Template tùy chỉnh",
      category: "Tùy chỉnh",
      fields: customFields.filter((f) => f.label),
      template: rawTemplate,
    };
    saveCustomTemplate(template);
    toast({ title: "Đã lưu template!", description: "Template đã được lưu vào thư viện của bạn." });
  };

  const handleSaveScript = () => {
    if (!websiteName.trim()) {
      toast({ title: "Thiếu tên website", description: "Vui lòng nhập tên website để lưu.", variant: "destructive" });
      return;
    }
    saveScript({
      templateId: "custom",
      templateName: scriptName || "Script tùy chỉnh",
      websiteName,
      fieldValues,
      generatedScript,
    });
    toast({ title: "Đã lưu script!", description: "Script đã được lưu thành công." });
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center gap-3">
          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => navigate("/")}>
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <div className="flex items-center gap-2 flex-1">
            <FileCode className="w-4 h-4 text-blue-600" />
            <h1 className="text-sm font-semibold text-gray-900">Script tùy chỉnh</h1>
          </div>
          <div className="flex items-center gap-2">
            <Button size="sm" variant="outline" className="gap-1.5 h-8 text-xs" onClick={handleCopy}>
              {copied ? <Check className="w-3.5 h-3.5 text-green-600" /> : <Copy className="w-3.5 h-3.5" />}
              {copied ? "Đã copy" : "Copy script"}
            </Button>
            <Button size="sm" variant="outline" className="gap-1.5 h-8 text-xs" onClick={handleSaveAsTemplate}>
              <Save className="w-3.5 h-3.5" />
              Lưu template
            </Button>
            <Button size="sm" className="gap-1.5 h-8 text-xs" onClick={handleSaveScript}>
              <Save className="w-3.5 h-3.5" />
              Lưu script
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left */}
        <div className="space-y-4">
          <Card>
            <CardHeader className="pb-3 pt-4 px-4">
              <CardTitle className="text-sm">Thông tin</CardTitle>
            </CardHeader>
            <CardContent className="px-4 pb-4 space-y-3">
              <div className="space-y-1.5">
                <Label className="text-xs">Tên template/script</Label>
                <Input
                  placeholder="VD: Popup đăng nhập"
                  value={scriptName}
                  onChange={(e) => setScriptName(e.target.value)}
                  className="text-sm"
                />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs">Tên website (để lưu)</Label>
                <Input
                  placeholder="VD: JunJin Store"
                  value={websiteName}
                  onChange={(e) => setWebsiteName(e.target.value)}
                  className="text-sm"
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3 pt-4 px-4">
              <CardTitle className="text-sm">Script template</CardTitle>
              <CardDescription className="text-xs">
                Paste script của bạn vào đây. Dùng{" "}
                <code className="bg-gray-100 px-1 rounded text-xs">{"{{TEN_BIEN}}"}</code>{" "}
                (chữ hoa, gạch dưới) để tạo trường thay thế
              </CardDescription>
            </CardHeader>
            <CardContent className="px-4 pb-4">
              <Textarea
                value={rawTemplate}
                onChange={(e) => setRawTemplate(e.target.value)}
                className="font-mono text-xs min-h-[300px] resize-none"
                placeholder="Paste script của bạn..."
              />
              {detectedPlaceholders.length > 0 && (
                <div className="mt-2 flex flex-wrap gap-1">
                  <span className="text-xs text-gray-500">Phát hiện:</span>
                  {detectedPlaceholders.map((p) => (
                    <Badge key={p} variant="secondary" className="text-xs font-mono">
                      {`{{${p}}}`}
                    </Badge>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Custom fields */}
          <Card>
            <CardHeader className="pb-2 pt-4 px-4">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-sm">Trường nhập (tùy chọn)</CardTitle>
                  <CardDescription className="text-xs">Khai báo nhãn cho từng placeholder</CardDescription>
                </div>
                <Button size="sm" variant="outline" className="h-7 text-xs gap-1.5" onClick={handleAddField}>
                  <Plus className="w-3.5 h-3.5" />
                  Thêm
                </Button>
              </div>
            </CardHeader>
            <CardContent className="px-4 pb-4 space-y-3">
              {customFields.length === 0 && (
                <p className="text-xs text-gray-400 text-center py-2">
                  Thêm trường để đặt nhãn và mô tả cho từng placeholder
                </p>
              )}
              {customFields.map((field, idx) => (
                <div key={idx} className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
                  <div className="flex-1 grid grid-cols-2 gap-2">
                    <Input
                      placeholder="Key (VD: WEBSITE_URL)"
                      value={field.key}
                      onChange={(e) => handleFieldMeta(idx, "key", e.target.value.toUpperCase().replace(/\s/g, "_"))}
                      className="text-xs h-7 font-mono"
                    />
                    <Input
                      placeholder="Nhãn hiển thị"
                      value={field.label}
                      onChange={(e) => handleFieldMeta(idx, "label", e.target.value)}
                      className="text-xs h-7"
                    />
                  </div>
                  <Button
                    size="icon"
                    variant="ghost"
                    className="h-7 w-7 text-red-400 hover:text-red-600"
                    onClick={() => handleRemoveField(idx)}
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </Button>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Fill values */}
          {detectedPlaceholders.length > 0 && (
            <Card>
              <CardHeader className="pb-3 pt-4 px-4">
                <CardTitle className="text-sm">Điền giá trị</CardTitle>
              </CardHeader>
              <CardContent className="px-4 pb-4 space-y-3">
                {detectedPlaceholders.map((key) => {
                  const customField = customFields.find((f) => f.key === key);
                  return (
                    <div key={key} className="space-y-1.5">
                      <Label className="text-xs font-medium">
                        {customField?.label || key}
                        <span className="ml-1 text-gray-400 font-mono text-xs">{`{{${key}}}`}</span>
                      </Label>
                      <Input
                        placeholder={customField?.placeholder || `Giá trị cho ${key}`}
                        value={fieldValues[key] ?? ""}
                        onChange={(e) => setFieldValues((prev) => ({ ...prev, [key]: e.target.value }))}
                        className="text-sm"
                      />
                    </div>
                  );
                })}
              </CardContent>
            </Card>
          )}
        </div>

        {/* Right: Preview */}
        <div>
          <Card className="sticky top-20">
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
              <pre className="bg-gray-900 text-gray-100 rounded-lg p-4 text-xs overflow-auto max-h-[600px] leading-relaxed whitespace-pre-wrap break-all">
                {generatedScript || <span className="text-gray-500">Script sẽ xuất hiện ở đây...</span>}
              </pre>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
