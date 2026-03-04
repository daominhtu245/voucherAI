"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@/lib/hooks/useUser";
import { Occasion, Tone, Relationship, ThemeId, AISuggestion, OCCASIONS, RELATIONSHIPS } from "@/types/voucher";
import ToneSelector from "@/components/ai/ToneSelector";
import ContentEditor from "@/components/voucher/ContentEditor";
import LayoutPicker from "@/components/voucher/LayoutPicker";
import VoucherCard from "@/components/voucher/VoucherCard";
import ShareSheet from "@/components/shared/ShareSheet";
import { Sparkles, ChevronRight, ChevronLeft, Check, RefreshCw, Wand2 } from "lucide-react";
import toast from "react-hot-toast";

const STEPS = ["Thông tin", "AI Magic", "Giao diện", "Hoàn tất"];

export default function CreatePage() {
  const { user, loading } = useUser();
  const router = useRouter();

  const [step, setStep] = useState(0);
  const [occasion, setOccasion] = useState<Occasion | "">("");
  const [relationship, setRelationship] = useState<Relationship | "">("");
  const [recipientName, setRecipientName] = useState("");
  const [customHint, setCustomHint] = useState("");
  const [tone, setTone] = useState<Tone | "">("");

  // AI state — random pick
  const [allSuggestions, setAllSuggestions] = useState<AISuggestion[]>([]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [aiLoading, setAiLoading] = useState(false);
  const [aiGenerated, setAiGenerated] = useState(false);

  const [content, setContent] = useState({ title: "", description: "", fine_print: "" });
  const [themeId, setThemeId] = useState<ThemeId>("retro");
  const [suggestedTheme, setSuggestedTheme] = useState<ThemeId | undefined>();
  const [primaryColor, setPrimaryColor] = useState("#FF6B6B");
  const [isPublic, setIsPublic] = useState(false);
  const [expiresAt, setExpiresAt] = useState("");
  const [creating, setCreating] = useState(false);
  const [shareData, setShareData] = useState<{ claimUrl: string } | null>(null);
  const [tab, setTab] = useState<"ai" | "manual">("ai");

  useEffect(() => {
    if (!loading && !user) router.replace("/login");
  }, [user, loading, router]);

  // Áp dụng suggestion hiện tại vào content
  useEffect(() => {
    if (!allSuggestions.length) return;
    const s = allSuggestions[currentIdx];
    setContent({ title: s.title, description: s.description, fine_print: s.fine_print });
    setThemeId(s.suggested_theme);
    setSuggestedTheme(s.suggested_theme);
  }, [allSuggestions, currentIdx]);

  const generateAI = async () => {
    if (!occasion || !tone || !relationship) {
      toast.error("Vui lòng điền đầy đủ thông tin ở Bước 1");
      return;
    }
    setAiLoading(true);
    setAiGenerated(false);
    try {
      const res = await fetch("/api/ai/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          occasion, tone, relationship,
          recipient_name: recipientName || "người nhận",
          custom_hint: customHint,
          count: 5,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      const suggestions: AISuggestion[] = data.suggestions || [];
      // Random pick ngay lập tức
      const randomIdx = Math.floor(Math.random() * suggestions.length);
      setAllSuggestions(suggestions);
      setCurrentIdx(randomIdx);
      setAiGenerated(true);
    } catch (e) {
      toast.error("AI bị lỗi, thử lại nhé!");
      console.error(e);
    } finally {
      setAiLoading(false);
    }
  };

  const handleShuffle = () => {
    if (!allSuggestions.length) return;
    const nextIdx = (currentIdx + 1) % allSuggestions.length;
    setCurrentIdx(nextIdx);
    toast(`Voucher ${nextIdx + 1}/${allSuggestions.length} ✨`, { icon: "🎲" });
  };

  const canGoNext = () => {
    if (step === 0) return !!occasion && !!relationship;
    if (step === 1) return !!content.title && !!content.description;
    return true;
  };

  const handleNext = () => {
    if (!canGoNext()) {
      toast.error("Vui lòng điền đầy đủ thông tin");
      return;
    }
    setStep((s) => Math.min(s + 1, 3));
  };

  const handleCreate = async () => {
    if (!user || !content.title || !content.description || !occasion || !tone || !relationship) {
      toast.error("Thiếu thông tin bắt buộc");
      return;
    }
    setCreating(true);
    try {
      const res = await fetch("/api/vouchers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: content.title,
          description: content.description,
          fine_print: content.fine_print,
          occasion,
          tone,
          relationship,
          recipient_name: recipientName || undefined,
          theme_id: themeId,
          primary_color: primaryColor,
          expires_at: expiresAt || undefined,
          is_public: isPublic,
          creator_id: user.id,
          creator_name: user.full_name,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setShareData({ claimUrl: data.claim_url });
      toast.success("Voucher đã được tạo! 🎉");
    } catch {
      toast.error("Lỗi khi tạo voucher");
    } finally {
      setCreating(false);
    }
  };

  if (loading || !user) return null;

  return (
    <div className="min-h-screen bg-cream pb-24 sm:pb-8">
      <div className="max-w-2xl mx-auto px-4 pt-6">
        {/* Progress */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            {STEPS.map((s, i) => (
              <div key={s} className={`flex items-center gap-1.5 text-xs font-semibold ${i <= step ? "text-primary" : "text-gray-400"}`}>
                <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${i < step ? "bg-primary text-white" : i === step ? "bg-primary text-white ring-4 ring-rose-100" : "bg-gray-200 text-gray-400"}`}>
                  {i < step ? <Check className="w-3.5 h-3.5" /> : i + 1}
                </div>
                <span className="hidden sm:block">{s}</span>
              </div>
            ))}
          </div>
          <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden">
            <div className="h-full bg-gradient-to-r from-primary to-pink-400 rounded-full transition-all duration-500" style={{ width: `${((step + 1) / STEPS.length) * 100}%` }} />
          </div>
        </div>

        {/* STEP 0: Thông tin */}
        {step === 0 && (
          <div className="space-y-6 animate-slide-up">
            <div>
              <h2 className="text-2xl font-display font-black text-gray-900 mb-1">Bạn muốn tặng ai? 🎁</h2>
              <p className="text-gray-500 text-sm">AI sẽ tự chọn voucher bất ngờ cho bạn!</p>
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-3">Dịp tặng</label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {(Object.entries(OCCASIONS) as [Occasion, typeof OCCASIONS[Occasion]][]).map(([id, occ]) => (
                  <button key={id} onClick={() => setOccasion(id)} className={`p-3 rounded-2xl border-2 text-sm font-semibold transition-all active:scale-95 ${occasion === id ? "border-primary bg-rose-50 text-primary" : "border-gray-200 bg-white text-gray-700 hover:border-rose-200"}`}>
                    <div className="text-2xl mb-1">{occ.emoji}</div>
                    {occ.label}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Mối quan hệ</label>
              <div className="grid grid-cols-3 gap-2">
                {(Object.entries(RELATIONSHIPS) as [Relationship, typeof RELATIONSHIPS[Relationship]][]).map(([id, rel]) => (
                  <button key={id} onClick={() => setRelationship(id)} className={`p-3 rounded-xl border-2 text-xs font-semibold transition-all active:scale-95 ${relationship === id ? "border-primary bg-rose-50 text-primary" : "border-gray-200 bg-white text-gray-700 hover:border-rose-200"}`}>
                    <div className="text-xl mb-1">{rel.emoji}</div>
                    {rel.label}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Tên người nhận <span className="font-normal text-gray-400">(tùy chọn)</span></label>
              <input type="text" value={recipientName} onChange={(e) => setRecipientName(e.target.value)} placeholder="VD: Minh, Linh, Ba, Mẹ..." className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl text-sm focus:outline-none focus:border-primary transition-colors" />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Gợi ý cá nhân cho AI <span className="font-normal text-gray-400">(tùy chọn)</span></label>
              <textarea value={customHint} onChange={(e) => setCustomHint(e.target.value)} placeholder="VD: hay ngủ quên hẹn, thích ăn mì, ghét dọn nhà..." rows={2} className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl text-sm focus:outline-none focus:border-primary transition-colors resize-none placeholder:text-gray-400" />
              <p className="text-xs text-gray-400 mt-1">Càng cụ thể, voucher càng hài hước và ý nghĩa!</p>
            </div>
          </div>
        )}

        {/* STEP 1: AI Magic — random pick */}
        {step === 1 && (
          <div className="space-y-6 animate-slide-up">
            <div>
              <h2 className="text-2xl font-display font-black text-gray-900 mb-1">AI Magic ✨</h2>
              <p className="text-gray-500 text-sm">AI sẽ tạo và chọn ngẫu nhiên 1 voucher bất ngờ cho bạn!</p>
            </div>

            {/* Tabs */}
            <div className="flex bg-gray-100 rounded-xl p-1">
              <button onClick={() => setTab("ai")} className={`flex-1 py-2 text-sm font-semibold rounded-lg transition-all ${tab === "ai" ? "bg-white shadow text-primary" : "text-gray-500"}`}>✨ AI tạo bất ngờ</button>
              <button onClick={() => setTab("manual")} className={`flex-1 py-2 text-sm font-semibold rounded-lg transition-all ${tab === "manual" ? "bg-white shadow text-primary" : "text-gray-500"}`}>✏️ Tự viết</button>
            </div>

            {tab === "ai" && (
              <div className="space-y-5">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-3">Chọn tone cảm xúc</label>
                  <ToneSelector value={tone} onChange={setTone} />
                </div>

                <button onClick={generateAI} disabled={aiLoading || !tone} className="w-full btn-primary flex items-center justify-center gap-2 py-4 text-base">
                  <Wand2 className="w-5 h-5" />
                  {aiLoading ? "AI đang tạo bất ngờ..." : "🎲 Tạo Voucher Bất Ngờ"}
                </button>

                {aiLoading && (
                  <div className="flex flex-col items-center gap-3 py-6">
                    <div className="flex gap-1">
                      {[0,1,2].map(i => (
                        <div key={i} className="w-3 h-3 bg-primary rounded-full animate-bounce" style={{ animationDelay: `${i * 0.15}s` }} />
                      ))}
                    </div>
                    <p className="text-sm text-gray-500">AI đang tạo nội dung đặc biệt cho bạn...</p>
                  </div>
                )}

                {aiGenerated && !aiLoading && (
                  <div className="space-y-4 animate-scale-in">
                    {/* Reveal card */}
                    <div className="relative">
                      <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-accent text-gray-800 text-xs font-black px-4 py-1 rounded-full flex items-center gap-1.5 shadow-md z-10">
                        <Sparkles className="w-3.5 h-3.5" />
                        Voucher bất ngờ {currentIdx + 1}/{allSuggestions.length}
                      </div>
                      <VoucherCard voucher={{ ...content, theme_id: themeId, recipient_name: recipientName }} size="lg" className="voucher-shadow pt-4" />
                    </div>

                    {/* Shuffle */}
                    <button onClick={handleShuffle} className="w-full btn-secondary flex items-center justify-center gap-2">
                      <RefreshCw className="w-4 h-4" />
                      Thử voucher khác ({(currentIdx + 1) % allSuggestions.length + 1}/{allSuggestions.length})
                    </button>

                    {/* Edit */}
                    <details className="bg-gray-50 rounded-2xl overflow-hidden">
                      <summary className="px-4 py-3 text-sm font-semibold text-gray-600 cursor-pointer hover:bg-gray-100 transition-colors flex items-center gap-2">
                        ✏️ Chỉnh sửa nội dung (nếu muốn)
                      </summary>
                      <div className="px-4 pb-4">
                        <ContentEditor value={content} onChange={setContent} />
                      </div>
                    </details>
                  </div>
                )}
              </div>
            )}

            {tab === "manual" && (
              <ContentEditor value={content} onChange={setContent} />
            )}
          </div>
        )}

        {/* STEP 2: Layout */}
        {step === 2 && (
          <div className="space-y-6 animate-slide-up">
            <div>
              <h2 className="text-2xl font-display font-black text-gray-900 mb-1">Chọn giao diện 🎨</h2>
              <p className="text-gray-500 text-sm">Preview realtime phía dưới</p>
            </div>
            <VoucherCard voucher={{ ...content, theme_id: themeId, primary_color: primaryColor, recipient_name: recipientName, expires_at: expiresAt || undefined }} size="md" className="voucher-shadow" />
            <LayoutPicker value={themeId} onChange={setThemeId} suggestedTheme={suggestedTheme} />
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Màu nhấn</label>
              <div className="flex items-center gap-3">
                <input type="color" value={primaryColor} onChange={(e) => setPrimaryColor(e.target.value)} className="w-12 h-12 rounded-xl cursor-pointer border-2 border-gray-200" />
                <div className="flex gap-2 flex-wrap">
                  {["#FF6B6B","#FFD93D","#6BCB77","#4D96FF","#FF922B","#E64980","#7950F2"].map((c) => (
                    <button key={c} onClick={() => setPrimaryColor(c)} className={`w-8 h-8 rounded-full border-2 transition-transform active:scale-90 ${primaryColor === c ? "border-gray-800 scale-110" : "border-transparent"}`} style={{ backgroundColor: c }} />
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* STEP 3: Settings */}
        {step === 3 && (
          <div className="space-y-6 animate-slide-up">
            <div>
              <h2 className="text-2xl font-display font-black text-gray-900 mb-1">Cài đặt & Gửi 🚀</h2>
              <p className="text-gray-500 text-sm">Sắp xong rồi!</p>
            </div>
            <VoucherCard voucher={{ ...content, theme_id: themeId, primary_color: primaryColor, recipient_name: recipientName, expires_at: expiresAt || undefined }} size="lg" className="voucher-shadow" />
            <div className="card space-y-5">
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-semibold text-gray-800 text-sm">Hiển thị trên Wall</div>
                  <div className="text-xs text-gray-400">Ẩn danh, giúp lan truyền VoucherAI</div>
                </div>
                <button onClick={() => setIsPublic((p) => !p)} className={`w-12 h-6 rounded-full transition-colors relative ${isPublic ? "bg-primary" : "bg-gray-200"}`}>
                  <span className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${isPublic ? "translate-x-6" : ""}`} />
                </button>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Ngày hết hạn <span className="text-gray-400 font-normal">(tùy chọn)</span></label>
                <input type="date" value={expiresAt} onChange={(e) => setExpiresAt(e.target.value)} min={new Date().toISOString().split("T")[0]} className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl text-sm focus:outline-none focus:border-primary transition-colors" />
              </div>
            </div>
            <button onClick={handleCreate} disabled={creating} className="w-full btn-primary text-base py-5 flex items-center justify-center gap-2">
              {creating ? "Đang tạo..." : <><Sparkles className="w-5 h-5" />Tạo Voucher & Lấy Link</>}
            </button>
          </div>
        )}

        {/* Nav */}
        <div className="flex items-center justify-between mt-8 pb-8">
          <button onClick={() => setStep((s) => Math.max(s - 1, 0))} disabled={step === 0} className="flex items-center gap-2 btn-secondary disabled:opacity-30">
            <ChevronLeft className="w-4 h-4" />
            Quay lại
          </button>
          {step < 3 && (
            <button onClick={handleNext} disabled={!canGoNext()} className="flex items-center gap-2 btn-primary disabled:opacity-40">
              Tiếp theo
              <ChevronRight className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {shareData && (
        <ShareSheet claimUrl={shareData.claimUrl} voucherTitle={content.title} onClose={() => { setShareData(null); router.push("/profile"); }} />
      )}
    </div>
  );
}
