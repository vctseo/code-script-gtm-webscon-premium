import { useState, useEffect } from "react";
import { Youtube, Image as ImageIcon, Plus, X, Check, RefreshCw, Trash2, FileCode, ChevronDown, ChevronUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";

interface VideoAvatarManagerProps {
  fieldValues: Record<string, string>;
  onFieldChange: (key: string, value: string) => void;
}

interface VideoPair {
  imgId: string;
  ytId: string;
  imgUrl?: string;
  ytUrl?: string;
}

function extractImgId(url: string): string | null {
  const m = url.trim().match(/\/p-\d+\/(\d+)-/);
  return m ? m[1] : null;
}

function extractYtId(url: string): string | null {
  const u = url.trim();
  // youtube.com/watch?v=ID, youtu.be/ID, youtube.com/shorts/ID, or bare 11-char ID
  const m = u.match(/(?:v=|youtu\.be\/|\/shorts\/)([a-zA-Z0-9_-]{11})/);
  if (m) return m[1];
  if (/^[a-zA-Z0-9_-]{11}$/.test(u)) return u;
  return null;
}

function pairsToEntries(pairs: VideoPair[]): string {
  return pairs.map((p) => `    '${p.imgId}': '${p.ytId}'`).join(",\n");
}

function entriesFromField(raw: string): VideoPair[] {
  if (!raw.trim()) return [];
  const lines = raw.split(/[\n,]+/);
  const pairs: VideoPair[] = [];
  for (const line of lines) {
    const m = line.match(/'(\d+)'\s*:\s*'([a-zA-Z0-9_-]{11})'/);
    if (m) pairs.push({ imgId: m[1], ytId: m[2] });
  }
  return pairs;
}

function parseScriptForPairs(script: string): VideoPair[] {
  const regex = /['"](\d{10,})['"]\s*:\s*['"]([a-zA-Z0-9_-]{11})['"]/g;
  const pairs: VideoPair[] = [];
  const seen = new Set<string>();
  let m: RegExpExecArray | null;
  while ((m = regex.exec(script)) !== null) {
    if (!seen.has(m[1])) {
      seen.add(m[1]);
      pairs.push({ imgId: m[1], ytId: m[2] });
    }
  }
  return pairs;
}

export default function VideoAvatarManager({ fieldValues, onFieldChange }: VideoAvatarManagerProps) {
  const { toast } = useToast();
  const [imgInput, setImgInput] = useState("");
  const [ytInput, setYtInput] = useState("");
  const [pairs, setPairs] = useState<VideoPair[]>([]);
  const [importScript, setImportScript] = useState("");
  const [showImport, setShowImport] = useState(false);

  // Load existing pairs from field on mount
  useEffect(() => {
    const raw = fieldValues["VIDEO_MAP_ENTRIES"] ?? "";
    if (raw.trim()) {
      setPairs(entriesFromField(raw));
    }
  }, []);

  // Sync pairs → field value whenever pairs change
  const commitPairs = (updated: VideoPair[]) => {
    setPairs(updated);
    onFieldChange("VIDEO_MAP_ENTRIES", pairsToEntries(updated));
  };

  const handleMatch = () => {
    const imgLines = imgInput.split("\n").map((l) => l.trim()).filter(Boolean);
    const ytLines = ytInput.split("\n").map((l) => l.trim()).filter(Boolean);

    if (imgLines.length === 0 || ytLines.length === 0) {
      toast({
        title: "Thiếu dữ liệu",
        description: "Vui lòng nhập ít nhất 1 URL ảnh và 1 URL YouTube.",
        variant: "destructive",
      });
      return;
    }

    const len = Math.min(imgLines.length, ytLines.length);
    const newPairs: VideoPair[] = [];
    const errors: string[] = [];

    for (let i = 0; i < len; i++) {
      const imgId = extractImgId(imgLines[i]);
      const ytId = extractYtId(ytLines[i]);

      if (!imgId) {
        errors.push(`Dòng ${i + 1}: không lấy được timestamp từ URL ảnh`);
        continue;
      }
      if (!ytId) {
        errors.push(`Dòng ${i + 1}: không lấy được ID YouTube`);
        continue;
      }
      newPairs.push({ imgId, ytId, imgUrl: imgLines[i], ytUrl: ytLines[i] });
    }

    if (errors.length > 0) {
      toast({
        title: `${errors.length} dòng lỗi`,
        description: errors.slice(0, 3).join(" | ") + (errors.length > 3 ? "…" : ""),
        variant: "destructive",
      });
    }

    if (newPairs.length === 0) return;

    // Merge: keep existing, add/overwrite by imgId
    const merged = [...pairs];
    let added = 0;
    let updated = 0;
    for (const np of newPairs) {
      const existing = merged.findIndex((p) => p.imgId === np.imgId);
      if (existing >= 0) {
        merged[existing] = np;
        updated++;
      } else {
        merged.push(np);
        added++;
      }
    }

    commitPairs(merged);
    setImgInput("");
    setYtInput("");

    toast({
      title: "Ghép cặp thành công!",
      description: `+${added} mới, ${updated} cập nhật. Tổng: ${merged.length} cặp.`,
    });
  };

  const handleImportScript = () => {
    if (!importScript.trim()) {
      toast({ title: "Chưa có script", description: "Vui lòng dán script cũ vào ô trên.", variant: "destructive" });
      return;
    }
    const found = parseScriptForPairs(importScript);
    if (found.length === 0) {
      toast({ title: "Không tìm thấy cặp nào", description: "Script không chứa VIDEO_MAP hợp lệ.", variant: "destructive" });
      return;
    }
    const merged = [...pairs];
    let added = 0, updated = 0;
    for (const np of found) {
      const idx = merged.findIndex((p) => p.imgId === np.imgId);
      if (idx >= 0) { merged[idx] = np; updated++; } else { merged.push(np); added++; }
    }
    commitPairs(merged);
    setImportScript("");
    setShowImport(false);
    toast({ title: "Đã nhập từ script cũ!", description: `+${added} mới, ${updated} cập nhật. Tổng: ${merged.length} cặp.` });
  };

  const handleRemove = (imgId: string) => {
    commitPairs(pairs.filter((p) => p.imgId !== imgId));
  };

  const handleClearAll = () => {
    commitPairs([]);
    toast({ title: "Đã xóa tất cả", description: "Danh sách cặp ảnh–video đã được xóa." });
  };

  return (
    <div className="space-y-4">
      {/* Import from old script */}
      <Card className="border-amber-200 bg-amber-50/30">
        <CardHeader className="pb-0 pt-4 px-4">
          <button
            className="w-full flex items-center justify-between text-left"
            onClick={() => setShowImport((v) => !v)}
          >
            <CardTitle className="text-sm flex items-center gap-2 text-amber-700">
              <FileCode className="w-4 h-4" />
              Nhập từ script cũ
            </CardTitle>
            <div className="flex items-center gap-2">
              <span className="text-xs text-amber-600">Dán script GTM cũ để tải danh sách cặp có sẵn</span>
              {showImport ? <ChevronUp className="w-4 h-4 text-amber-600" /> : <ChevronDown className="w-4 h-4 text-amber-600" />}
            </div>
          </button>
        </CardHeader>
        {showImport && (
          <CardContent className="px-4 pb-4 pt-3 space-y-3">
            <Textarea
              placeholder={"Dán toàn bộ script cũ vào đây (bao gồm cả VIDEO_MAP)\nVD:\nvar VIDEO_MAP = {\n  '1774455267822': 'Pe837ti67S0',\n  '1774681285984': 'rRp-bplZlZs'\n};"}
              value={importScript}
              onChange={(e) => setImportScript(e.target.value)}
              className="text-xs min-h-[120px] resize-none font-mono"
            />
            <div className="flex items-center justify-between">
              <p className="text-xs text-gray-400">
                Tự động tìm tất cả cặp <code className="bg-gray-100 px-1 rounded">timestamp: youtubeId</code> trong script
              </p>
              <div className="flex gap-2">
                <Button size="sm" variant="outline" className="h-7 text-xs" onClick={() => { setImportScript(""); setShowImport(false); }}>
                  Hủy
                </Button>
                <Button size="sm" className="h-7 text-xs gap-1.5 bg-amber-600 hover:bg-amber-700" onClick={handleImportScript}>
                  <FileCode className="w-3.5 h-3.5" />
                  Nhập danh sách
                </Button>
              </div>
            </div>
          </CardContent>
        )}
      </Card>

      {/* Two-column paste area */}
      <Card className="border-purple-200 bg-purple-50/30">
        <CardHeader className="pb-2 pt-4 px-4">
          <CardTitle className="text-sm flex items-center gap-2 text-purple-700">
            <RefreshCw className="w-4 h-4" />
            Ghép cặp ảnh – video
          </CardTitle>
          <p className="text-xs text-gray-500">
            Paste URL ảnh và URL YouTube tương ứng theo từng dòng → Bấm Ghép cặp
          </p>
        </CardHeader>
        <CardContent className="px-4 pb-4 space-y-3">
          <div className="grid grid-cols-2 gap-3">
            {/* Image URLs */}
            <div className="space-y-1.5">
              <div className="flex items-center gap-1.5 text-xs font-semibold text-gray-600">
                <ImageIcon className="w-3.5 h-3.5 text-blue-500" />
                URL ảnh sản phẩm
              </div>
              <Textarea
                placeholder={"Paste URL ảnh, mỗi dòng 1 URL\nVD:\nhttps://r6i.pen.dropbuy.vn/md/s-1064/p-125434/1773120431464-img.jpg\nhttps://r6i.pen.dropbuy.vn/md/s-1064/p-125434/1774455267822-img.jpg"}
                value={imgInput}
                onChange={(e) => setImgInput(e.target.value)}
                className="text-xs min-h-[120px] resize-none font-mono"
              />
              <p className="text-xs text-gray-400">
                Lấy timestamp: <code className="bg-gray-100 px-1 rounded">/p-XXXXX/<strong>TIMESTAMP</strong>-...</code>
              </p>
            </div>

            {/* YouTube URLs */}
            <div className="space-y-1.5">
              <div className="flex items-center gap-1.5 text-xs font-semibold text-gray-600">
                <Youtube className="w-3.5 h-3.5 text-red-500" />
                URL YouTube tương ứng
              </div>
              <Textarea
                placeholder={"Paste URL YouTube tương ứng (cùng thứ tự)\nVD:\nhttps://www.youtube.com/watch?v=Pe837ti67S0\nhttps://www.youtube.com/watch?v=rRp-bplZlZs"}
                value={ytInput}
                onChange={(e) => setYtInput(e.target.value)}
                className="text-xs min-h-[120px] resize-none font-mono"
              />
              <p className="text-xs text-gray-400">
                Hỗ trợ: <code className="bg-gray-100 px-1 rounded">watch?v=ID</code> · <code className="bg-gray-100 px-1 rounded">shorts/ID</code> · <code className="bg-gray-100 px-1 rounded">youtu.be/ID</code> · ID thẳng
              </p>
            </div>
          </div>

          <div className="flex items-center justify-between pt-1">
            <span className="text-xs text-gray-400">
              {imgInput.split("\n").filter(Boolean).length} URL ảnh ·{" "}
              {ytInput.split("\n").filter(Boolean).length} URL YouTube
            </span>
            <Button size="sm" className="h-8 text-xs gap-1.5" onClick={handleMatch}>
              <Plus className="w-3.5 h-3.5" />
              Ghép cặp & thêm vào danh sách
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Pairs table */}
      <Card>
        <CardHeader className="pb-2 pt-4 px-4">
          <CardTitle className="text-sm flex items-center gap-2">
            <Youtube className="w-4 h-4 text-red-500" />
            Danh sách cặp ảnh–video
            <Badge variant="secondary" className="text-xs ml-auto">{pairs.length} cặp</Badge>
            {pairs.length > 0 && (
              <Button
                size="sm"
                variant="ghost"
                className="h-6 text-xs text-red-500 px-2 gap-1"
                onClick={handleClearAll}
              >
                <Trash2 className="w-3 h-3" />
                Xóa tất cả
              </Button>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent className="px-4 pb-4">
          {pairs.length === 0 ? (
            <p className="text-xs text-gray-400 italic py-2">Chưa có cặp nào. Dùng ô trên để ghép cặp.</p>
          ) : (
            <div className="rounded-lg border border-gray-200 overflow-hidden">
              <div
                className="grid text-xs font-semibold text-gray-500 bg-gray-50 border-b border-gray-200 px-3 py-2"
                style={{ gridTemplateColumns: "1fr 1fr auto" }}
              >
                <span className="flex items-center gap-1"><ImageIcon className="w-3 h-3" /> Timestamp ảnh</span>
                <span className="flex items-center gap-1"><Youtube className="w-3 h-3 text-red-500" /> YouTube ID</span>
                <span></span>
              </div>
              {pairs.map((pair) => (
                <div
                  key={pair.imgId}
                  className="grid items-center px-3 py-2 border-b border-gray-100 last:border-0 hover:bg-gray-50"
                  style={{ gridTemplateColumns: "1fr 1fr auto" }}
                >
                  <div className="space-y-0.5">
                    <code className="text-xs font-mono font-bold text-gray-800">{pair.imgId}</code>
                    {pair.imgUrl && (
                      <p className="text-xs text-gray-400 truncate" title={pair.imgUrl}>
                        {pair.imgUrl.replace(/https?:\/\/[^/]+/, "").slice(0, 35)}…
                      </p>
                    )}
                  </div>
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-1.5">
                      <code className="text-xs font-mono font-bold text-red-700">{pair.ytId}</code>
                      <a
                        href={`https://www.youtube.com/watch?v=${pair.ytId}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-blue-500 hover:underline"
                      >
                        ↗
                      </a>
                    </div>
                    {pair.ytUrl && (
                      <p className="text-xs text-gray-400 truncate" title={pair.ytUrl}>
                        youtube.com/watch?v={pair.ytId}
                      </p>
                    )}
                  </div>
                  <button
                    onClick={() => handleRemove(pair.imgId)}
                    className="p-1 text-gray-400 hover:text-red-500 transition-colors"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Generated entries preview */}
      {pairs.length > 0 && (
        <div className="flex items-start gap-2 p-3 bg-green-50 border border-green-200 rounded-lg">
          <Check className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
          <div className="min-w-0 flex-1">
            <p className="text-xs font-semibold text-green-700 mb-1">VIDEO_MAP đã sẵn sàng ({pairs.length} cặp):</p>
            <pre className="text-xs text-green-800 font-mono whitespace-pre-wrap break-all">
              {`var VIDEO_MAP = {\n${pairsToEntries(pairs)}\n};`}
            </pre>
          </div>
        </div>
      )}
    </div>
  );
}
