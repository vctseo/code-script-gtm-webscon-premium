import { useState, useMemo, useRef } from "react";
import { Link } from "wouter";
import { ArrowLeft, Copy, Check, RefreshCw, PenLine, Globe, Image, Palette, FileText, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { ARTICLE_BAI1, ARTICLE_BAI2, POLICY_GIAO_HANG, POLICY_THANH_TOAN, POLICY_BAO_MAT, POLICY_DOI_TRA } from "@/lib/articleTemplates";

const ARTICLES = [
  {
    id: "bai1",
    label: "Bài 1",
    title: "Hướng dẫn đăng nhập",
    desc: "Hướng dẫn từng bước đăng nhập và mua hàng giá ưu đãi",
    html: ARTICLE_BAI1,
  },
  {
    id: "bai2",
    label: "Bài 2",
    title: "Giới thiệu website",
    desc: "Giới thiệu tổng quan nền tảng, sản phẩm và mô hình kinh doanh",
    html: ARTICLE_BAI2,
  },
];

const POLICIES = [
  { label: "Chính sách giao hàng", html: POLICY_GIAO_HANG },
  { label: "Chính sách thanh toán", html: POLICY_THANH_TOAN },
  { label: "Chính sách bảo mật", html: POLICY_BAO_MAT },
  { label: "Chính sách đổi trả", html: POLICY_DOI_TRA },
];

function buildInstruction(colorCode: string) {
  const colorPart = colorCode.trim()
    ? `, theo mã màu: ${colorCode.trim()}` : "";
  return `Sửa nội dung sau thành nội dung website bán phụ kiện, công nghệ, gia dụng của tôi${colorPart}, chỉ sửa thông tin giữ nguyên màu phong cách giống code sau:

Khi trả lời hãy xuất từng bài HTML riêng biệt, mỗi bài bắt đầu bằng dòng tiêu đề === Bài X: [Tên bài] === rồi toàn bộ HTML của bài đó phải được bọc trong khối code markdown \`\`\`html ... \`\`\` (để hiện nút copy), giữa các bài cách nhau 1 dòng trống.`;
}

function buildInfoBlock(logoUrl: string, websiteInfo: string) {
  const lines: string[] = [];
  if (logoUrl.trim())     lines.push(`URL logo: ${logoUrl.trim()}`);
  if (websiteInfo.trim()) lines.push(`Thông tin website:\n${websiteInfo.trim()}`);
  return lines.length > 0 ? lines.join("\n\n") + "\n\n" : "";
}

export default function WriteArticle() {
  const [logoUrl,      setLogoUrl]      = useState("");
  const [websiteInfo,  setWebsiteInfo]  = useState("");
  const [colorCode,    setColorCode]    = useState("");
  const [copiedArticle, setCopiedArticle] = useState(false);
  const [copiedPolicy,  setCopiedPolicy]  = useState(false);
  const articleRef = useRef<HTMLTextAreaElement>(null);
  const policyRef  = useRef<HTMLTextAreaElement>(null);
  const { toast } = useToast();

  const articlePrompt = useMemo(() => {
    const instruction = buildInstruction(colorCode);
    const info = buildInfoBlock(logoUrl, websiteInfo);
    const articlesBlock = ARTICLES.map((a, i) =>
      `=== Bài ${i + 1}: ${a.title} ===\n${a.html}`
    ).join("\n\n");
    return `${instruction}\n\n${info}${articlesBlock}`;
  }, [logoUrl, websiteInfo, colorCode]);

  const policyPrompt = useMemo(() => {
    const instruction = buildInstruction(colorCode);
    const info = buildInfoBlock(logoUrl, websiteInfo);
    const policiesBlock = POLICIES.map((p, i) =>
      `=== Bài ${i + 1}: ${p.label} ===\n${p.html}`
    ).join("\n\n");
    return `${instruction}\n\n${info}${policiesBlock}`;
  }, [logoUrl, websiteInfo, colorCode]);

  const doCopy = async (text: string, ref: React.RefObject<HTMLTextAreaElement>, setFlag: (v: boolean) => void, label: string) => {
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      if (ref.current) { ref.current.select(); document.execCommand("copy"); }
    }
    setFlag(true);
    toast({ title: "Đã copy!", description: `Dán vào Gemini hoặc ChatGPT — ${label}` });
    setTimeout(() => setFlag(false), 2500);
  };

  const handleReset = () => {
    setLogoUrl("");
    setWebsiteInfo("");
    setColorCode("");
  };

  const hasInput = logoUrl || websiteInfo || colorCode;

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-4 py-3 flex items-center gap-3">
          <Link href="/">
            <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-500">
              <ArrowLeft className="w-4 h-4" />
            </Button>
          </Link>
          <div className="w-9 h-9 rounded-lg bg-emerald-600 flex items-center justify-center flex-shrink-0">
            <PenLine className="w-5 h-5 text-white" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-bold text-gray-900 leading-none">Viết bài</p>
            <p className="text-xs text-gray-500 mt-0.5">Tạo prompt để AI viết bài giới thiệu, hướng dẫn &amp; chính sách</p>
          </div>
          {hasInput && (
            <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-400 hover:text-gray-600" onClick={handleReset} title="Xóa tất cả">
              <RefreshCw className="w-4 h-4" />
            </Button>
          )}
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-8 space-y-6">

        {/* Info card */}
        <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 text-sm text-emerald-800">
          <p className="font-semibold mb-1">Hướng dẫn sử dụng</p>
          <p className="text-emerald-700 text-xs leading-relaxed">
            Điền thông tin website, nhấn <strong>Copy prompt</strong> rồi dán vào{" "}
            <strong>Gemini</strong> hoặc <strong>ChatGPT</strong>. AI sẽ viết lại nội dung
            đúng thương hiệu, đúng màu của bạn.
          </p>
        </div>

        {/* ── INPUT FIELDS ─────────────────────────────────────────── */}
        <div className="bg-white border border-gray-200 rounded-xl p-6 space-y-5">
          <p className="text-sm font-bold text-gray-800">Thông tin website của bạn</p>

          {/* Logo URL */}
          <div className="space-y-2">
            <Label htmlFor="logo-url" className="text-sm font-semibold text-gray-700">URL logo</Label>
            <div className="relative">
              <Image className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                id="logo-url"
                placeholder="https://example.com/logo.png"
                value={logoUrl}
                onChange={(e) => setLogoUrl(e.target.value)}
                className="pl-9 text-sm"
              />
            </div>
          </div>

          {/* Website info */}
          <div className="space-y-2">
            <Label htmlFor="website-info" className="text-sm font-semibold text-gray-700">Thông tin website</Label>
            <div className="relative">
              <Globe className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
              <Textarea
                id="website-info"
                placeholder={`Ví dụ:\nTên: JunJin Store\nWebsite: junjin.vn\nSĐT: 0858.279.868\nĐịa chỉ: 123 Nguyễn Trãi, Hà Nội\nGiờ mở cửa: 8h–22h\nSản phẩm: phụ kiện điện thoại, đồ gia dụng, công nghệ`}
                value={websiteInfo}
                onChange={(e) => setWebsiteInfo(e.target.value)}
                className="pl-9 text-sm min-h-[110px] resize-y"
              />
            </div>
          </div>

          {/* Color code */}
          <div className="space-y-2">
            <Label htmlFor="color-code" className="text-sm font-semibold text-gray-700">Mã màu chủ đạo</Label>
            <div className="relative">
              <Palette className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                id="color-code"
                placeholder="linear-gradient(135deg,#66ba32,#4f9823)"
                value={colorCode}
                onChange={(e) => setColorCode(e.target.value)}
                className="pl-9 text-sm font-mono"
              />
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs text-gray-400">Ví dụ:</span>
              {[
                "linear-gradient(135deg,#66ba32,#4f9823)",
                "linear-gradient(135deg,#3b82f6,#1d4ed8)",
                "linear-gradient(135deg,#e97335,#cf5d20)",
                "linear-gradient(135deg,#8b5cf6,#6d28d9)",
              ].map((ex) => (
                <button
                  key={ex}
                  type="button"
                  onClick={() => setColorCode(ex)}
                  className="flex items-center gap-1.5 text-xs text-gray-500 hover:text-gray-800 bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-md px-2 py-1 transition-colors font-mono"
                >
                  <div className="w-3 h-3 rounded-sm flex-shrink-0" style={{ background: ex }} />
                  {ex}
                </button>
              ))}
            </div>
            {colorCode.trim() && (
              <div className="flex items-center gap-2">
                <div
                  className="w-6 h-6 rounded-md flex-shrink-0 border border-gray-200"
                  style={{ background: colorCode.trim() }}
                />
                <p className="text-xs text-emerald-600 font-medium">✓ Màu sẽ được áp dụng vào prompt</p>
              </div>
            )}
          </div>
        </div>

        {/* ── SECTION 1: GIỚI THIỆU & HƯỚNG DẪN ───────────────────── */}
        <div className="bg-white border border-gray-200 rounded-xl p-6 space-y-5">
          <div className="flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-emerald-600" />
            <p className="text-sm font-bold text-gray-800">Giới thiệu &amp; hướng dẫn</p>
            <span className="text-xs text-emerald-600 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full font-semibold">
              1 prompt · 2 bài
            </span>
          </div>

          {/* Article info cards (read-only) */}
          <div className="grid grid-cols-2 sm:grid-cols-2 gap-2">
            {ARTICLES.map((art) => (
              <div key={art.id} className="rounded-lg border border-gray-100 bg-gray-50 p-3">
                <p className="text-xs font-bold text-gray-700 leading-snug">{art.title}</p>
                <p className="text-xs text-gray-400 mt-1">{(art.html.length / 1000).toFixed(0)}k ký tự HTML</p>
              </div>
            ))}
          </div>

          <p className="text-xs text-gray-500 leading-relaxed bg-emerald-50 border border-emerald-100 rounded-lg px-3 py-2">
            Prompt gộp cả 2 bài vào một lần. Dán vào AI — chờ AI viết lại cả hướng dẫn đăng nhập lẫn giới thiệu website theo thương hiệu của bạn.
          </p>

          <Button
            onClick={() => doCopy(articlePrompt, articleRef, setCopiedArticle, "Giới thiệu & Hướng dẫn")}
            className="w-full gap-2 bg-emerald-600 hover:bg-emerald-700 text-white"
          >
            {copiedArticle ? <><Check className="w-4 h-4" />Đã copy!</> : <><Copy className="w-4 h-4" />Copy prompt — Giới thiệu &amp; Hướng dẫn</>}
          </Button>

          {/* Preview */}
          <div className="rounded-lg border border-gray-100 overflow-hidden">
            <div className="flex items-center justify-between px-3 py-2 border-b border-gray-100 bg-gray-50">
              <span className="text-xs text-gray-500 font-medium">Xem trước prompt</span>
              <span className="text-xs text-gray-400">{articlePrompt.length.toLocaleString("vi-VN")} ký tự</span>
            </div>
            <textarea
              ref={articleRef}
              readOnly
              value={articlePrompt}
              className="w-full h-40 p-3 text-xs font-mono text-gray-600 bg-white resize-none border-none focus:outline-none leading-relaxed"
            />
          </div>
        </div>

        {/* ── SECTION 2: 4 BÀI CHÍNH SÁCH ─────────────────────────── */}
        <div className="bg-white border border-gray-200 rounded-xl p-6 space-y-5">
          <div className="flex items-center gap-2">
            <FileText className="w-4 h-4 text-violet-600" />
            <p className="text-sm font-bold text-gray-800">4 bài chính sách</p>
            <span className="text-xs text-violet-600 bg-violet-50 border border-violet-200 px-2 py-0.5 rounded-full font-semibold">
              1 prompt · 4 bài
            </span>
          </div>

          {/* Policy list */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {POLICIES.map((p, i) => (
              <div key={i} className="rounded-lg border border-gray-100 bg-gray-50 p-3 text-center">
                <p className="text-xs font-bold text-gray-700 leading-snug">{p.label}</p>
                <p className="text-xs text-gray-400 mt-1">{(p.html.length / 1000).toFixed(0)}k ký tự</p>
              </div>
            ))}
          </div>

          <p className="text-xs text-gray-500 leading-relaxed bg-violet-50 border border-violet-100 rounded-lg px-3 py-2">
            Prompt gộp cả 4 bài chính sách vào một lần. Dán vào AI — chờ AI viết lại toàn bộ theo màu và thông tin website của bạn.
          </p>

          <Button
            onClick={() => doCopy(policyPrompt, policyRef, setCopiedPolicy, "4 bài chính sách")}
            className="w-full gap-2 bg-violet-600 hover:bg-violet-700 text-white"
          >
            {copiedPolicy ? <><Check className="w-4 h-4" />Đã copy!</> : <><Copy className="w-4 h-4" />Copy prompt — 4 bài chính sách</>}
          </Button>

          {/* Preview */}
          <div className="rounded-lg border border-gray-100 overflow-hidden">
            <div className="flex items-center justify-between px-3 py-2 border-b border-gray-100 bg-gray-50">
              <span className="text-xs text-gray-500 font-medium">Xem trước prompt</span>
              <span className="text-xs text-gray-400">{policyPrompt.length.toLocaleString("vi-VN")} ký tự</span>
            </div>
            <textarea
              ref={policyRef}
              readOnly
              value={policyPrompt}
              className="w-full h-40 p-3 text-xs font-mono text-gray-600 bg-white resize-none border-none focus:outline-none leading-relaxed"
            />
          </div>
        </div>

      </main>
    </div>
  );
}
