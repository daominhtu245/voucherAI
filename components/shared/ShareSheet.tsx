"use client";

import { useState } from "react";
import { Copy, Download, X, Check, Link2, ExternalLink } from "lucide-react";
import toast from "react-hot-toast";

interface ShareSheetProps {
  claimUrl: string;
  voucherTitle: string;
  onClose: () => void;
}

export default function ShareSheet({ claimUrl, voucherTitle, onClose }: ShareSheetProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(claimUrl);
      setCopied(true);
      toast.success("Đã copy link! 🔗");
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error("Không thể copy, thử copy thủ công nhé");
    }
  };

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `Voucher: ${voucherTitle}`,
          text: `Tặng bạn voucher đặc biệt này nhé! 🎁`,
          url: claimUrl,
        });
      } catch {
        // User cancelled
      }
    } else {
      handleCopy();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Sheet */}
      <div className="relative w-full sm:max-w-md bg-white rounded-t-3xl sm:rounded-3xl p-6 shadow-xl animate-slide-up">
        {/* Handle */}
        <div className="w-12 h-1 bg-gray-200 rounded-full mx-auto mb-6 sm:hidden" />

        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors"
        >
          <X className="w-4 h-4 text-gray-500" />
        </button>

        {/* Header */}
        <div className="text-center mb-6">
          <div className="text-4xl mb-2">🎉</div>
          <h3 className="text-xl font-display font-black text-gray-900">Voucher đã sẵn sàng!</h3>
          <p className="text-sm text-gray-500 mt-1">Chia sẻ link để người nhận claim</p>
        </div>

        {/* URL display */}
        <div className="bg-gray-50 rounded-2xl p-4 mb-4 flex items-center gap-3">
          <Link2 className="w-4 h-4 text-primary shrink-0" />
          <span className="text-sm text-gray-600 truncate flex-1">{claimUrl}</span>
        </div>

        {/* Action buttons */}
        <div className="space-y-3">
          <button
            onClick={handleCopy}
            className={`w-full flex items-center justify-center gap-3 py-4 rounded-2xl font-bold text-sm transition-all active:scale-98 ${
              copied
                ? "bg-success text-white"
                : "bg-primary text-white hover:bg-red-500"
            }`}
          >
            {copied ? <Check className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
            {copied ? "Đã copy!" : "Copy link"}
          </button>

          {typeof navigator !== "undefined" && "share" in navigator && (
            <button
              onClick={handleNativeShare}
              className="w-full flex items-center justify-center gap-3 py-4 rounded-2xl font-bold text-sm btn-secondary"
            >
              <ExternalLink className="w-5 h-5" />
              Chia sẻ qua app
            </button>
          )}

          <button
            onClick={onClose}
            className="w-full py-3 text-sm text-gray-400 hover:text-gray-600 transition-colors"
          >
            Xem hồ sơ của tôi →
          </button>
        </div>

        {/* Tips */}
        <p className="text-xs text-center text-gray-400 mt-4">
          💡 Gửi link cho người nhận qua Zalo, Messenger hoặc IG Story
        </p>
      </div>
    </div>
  );
}
