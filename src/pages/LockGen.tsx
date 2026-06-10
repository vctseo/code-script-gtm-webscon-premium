import { useState } from "react";
import { ArrowLeft, ClipboardPaste, Check, Lock, Copy } from "lucide-react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";

function djb2(s: string): number {
  let h = 5381;
  for (let i = 0; i < s.length; i++) {
    h = Math.imul(h, 33) + s.charCodeAt(i);
    h = h | 0;
  }
  return h;
}

function normalizeDomain(raw: string): string {
  return raw.trim().toLowerCase()
    .replace(/^https?:\/\//, "")
    .replace(/^www\./, "")
    .split("/")[0];
}

const LOCK_FN = `var _L=HASH,_f=function(s){var h=5381;for(var i=0;i<s.length;i++){h=(Math.imul(h,33)+s.charCodeAt(i))|0;}return h;},_d=location.hostname.replace(/^www\\./,'');if(_f(_d)!==_L)return;`;

export default function LockGen() {
  const { toast } = useToast();
  const [domain, setDomain] = useState("");
  const [lockCode, setLockCode] = useState("");
  const [hashDisplay, setHashDisplay] = useState<number | null>(null);
  const [normalizedDomain, setNormalizedDomain] = useState("");
  const [copied, setCopied] = useState(false);

  const generate = () => {
    if (!domain.trim()) return;
    const nd = normalizeDomain(domain);
    const hash = djb2(nd);
    const code = LOCK_FN.replace("HASH", String(hash));
    setNormalizedDomain(nd);
    setHashDisplay(hash);
    setLockCode(code);
    setCopied(false);
  };

  const copyCode = async () => {
    if (!lockCode) return;
    await navigator.clipboard.writeText(lockCode);
    setCopied(true);
    toast({ title: "Đã copy lock code!" });
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200 px-4 py-3 flex items-center gap-3">
        <Link href="/">
          <button className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors">
            <ArrowLeft className="w-4 h-4 text-gray-600" />
          </button>
        </Link>
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-indigo-600 flex items-center justify-center">
            <Lock className="w-4 h-4 text-white" />
          </div>
          <div>
            <h1 className="text-sm font-semibold text-gray-900">Lock Code Generator</h1>
            <p className="text-xs text-gray-500">Khóa toàn bộ script theo domain — dock, footer, popup đều bị chặn khi sai domain</p>
          </div>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 py-8 space-y-6">
        {/* Input */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm">Nhập domain cần khóa</CardTitle>
            <CardDescription className="text-xs">Chỉ cần domain — không cần https, www, hay đường dẫn</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div>
              <Label className="text-xs mb-1.5 block text-gray-600">Domain</Label>
              <div className="flex gap-2">
                <Input
                  value={domain}
                  onChange={(e) => setDomain(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && generate()}
                  placeholder="VD: hungblack.vn"
                  className="font-mono text-sm"
                  spellCheck={false}
                />
                <Button onClick={generate} disabled={!domain.trim()} className="bg-indigo-600 hover:bg-indigo-700 shrink-0">
                  <Lock className="w-4 h-4 mr-1.5" />
                  Tạo Lock
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Result */}
        {lockCode && (
          <>
            <Card className="border-indigo-200">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-sm text-indigo-700">Dòng lock code</CardTitle>
                    <CardDescription className="text-xs mt-0.5">
                      Dán làm <strong>dòng đầu tiên</strong> bên trong{" "}
                      <code className="bg-gray-100 px-1 rounded text-indigo-600 text-[11px]">(function(){"{"}</code>
                    </CardDescription>
                  </div>
                  <Button
                    size="sm"
                    variant={copied ? "default" : "outline"}
                    className={`gap-1.5 h-8 text-xs shrink-0 ${copied ? "bg-green-600 hover:bg-green-700 text-white border-green-600" : ""}`}
                    onClick={copyCode}
                  >
                    {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                    {copied ? "Đã copy!" : "Copy"}
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="px-4 pb-4">
                <div
                  className="bg-gray-900 rounded-lg px-4 py-3 font-mono text-xs text-cyan-300 leading-relaxed break-all cursor-pointer select-all"
                  onClick={copyCode}
                  title="Bấm để copy"
                >
                  {lockCode}
                </div>
                <p className="text-xs text-gray-500 mt-2">
                  ✓ Khóa cho: <strong className="text-indigo-600">{normalizedDomain}</strong>
                  <span className="ml-2 text-gray-400">(hash: {hashDisplay})</span>
                </p>
              </CardContent>
            </Card>

            {/* How to use */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">Cách dán vào script (template Kho & Liên hệ)</CardTitle>
              </CardHeader>
              <CardContent className="px-4 pb-4">
                <div className="bg-gray-900 rounded-lg px-4 py-3 font-mono text-xs leading-6 overflow-x-auto">
                  <p className="text-gray-400">{"<script>"}</p>
                  <p className="text-gray-400">{"(function(){"}</p>
                  <p className="text-cyan-300 bg-indigo-900/40 px-1 rounded">
                    {"  "}{lockCode.substring(0, 55)}<span className="text-indigo-400">...</span>
                    <span className="ml-2 text-indigo-400 font-sans not-italic text-[10px]">← dán ĐẦU TIÊN</span>
                  </p>
                  <p className="text-gray-500 italic">{"  /* thay địa chỉ bảo hành */"}</p>
                  <p className="text-green-400">{"  window._jjGate = true; "}
                    <span className="text-gray-500 font-sans">{"// tự set bởi template"}</span>
                  </p>
                  <p className="text-gray-500 italic">{"  /* inject dock CSS + HTML + event */"}</p>
                  <p className="text-gray-400">{"})();"}</p>
                  <p className="text-gray-400">{"</script>"}</p>
                  <p className="text-gray-600 mt-1">{"<script>"}</p>
                  <p className="text-gray-600">{"(function(){"}</p>
                  <p className="text-amber-400">{"  if(!window._jjGate)return; "}
                    <span className="text-gray-600 font-sans">{"// tự có trong template"}</span>
                  </p>
                  <p className="text-gray-600 italic">{"  /* footer + popup — cũng bị chặn */"}</p>
                  <p className="text-gray-600">{"})();"}</p>
                  <p className="text-gray-600">{"</script>"}</p>
                </div>
                <ul className="mt-3 space-y-1.5 text-xs text-gray-600">
                  <li className="flex gap-2"><span className="text-indigo-500 font-bold">1.</span> Copy dòng lock ở trên</li>
                  <li className="flex gap-2"><span className="text-indigo-500 font-bold">2.</span> Mở script trong GTM, tìm <code className="bg-gray-100 px-1 rounded text-[11px]">(function(){"{"}</code> <strong>đầu tiên</strong></li>
                  <li className="flex gap-2"><span className="text-indigo-500 font-bold">3.</span> Dán lock code làm <strong>dòng đầu tiên</strong> bên trong</li>
                  <li className="flex gap-2 text-green-700"><span className="font-bold">✓</span> Template Kho &amp; Liên hệ đã được cập nhật: dock, footer, popup đều bị chặn tự động</li>
                </ul>
              </CardContent>
            </Card>
          </>
        )}
      </main>
    </div>
  );
}
