"use client";

import { useState, useEffect, useCallback } from "react";
import { Voucher } from "@/types/voucher";
import VoucherCard from "@/components/voucher/VoucherCard";
import { Gift, Sparkles, Copy, Check, Heart } from "lucide-react";
import toast from "react-hot-toast";

interface ClaimRevealProps {
  voucher: Voucher;
  onClaim: () => void;
  claimed: boolean;
}

export default function ClaimReveal({ voucher, onClaim, claimed }: ClaimRevealProps) {
  const [revealed, setRevealed] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [copied, setCopied] = useState(false);

  const triggerConfetti = useCallback(async () => {
    const confetti = (await import("canvas-confetti")).default;
    confetti({
      particleCount: 150,
      spread: 80,
      origin: { y: 0.6 },
      colors: ["#FF6B6B", "#FFD93D", "#6BCB77", "#4D96FF", "#FF922B"],
    });
    setTimeout(() => {
      confetti({
        particleCount: 80,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors: ["#FF6B6B", "#FFD93D"],
      });
      confetti({
        particleCount: 80,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors: ["#6BCB77", "#4D96FF"],
      });
    }, 200);
  }, []);

  const handleReveal = () => {
    setRevealed(true);
    setShowConfetti(true);
    triggerConfetti();
  };

  const handleClaim = () => {
    onClaim();
    triggerConfetti();
  };

  const handleCopyCreator = async () => {
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
    await navigator.clipboard.writeText(appUrl);
    setCopied(true);
    toast.success("Đã copy link! Chia sẻ cho bạn bè nhé 🎁");
    setTimeout(() => setCopied(false), 2000);
  };

  if (claimed) {
    return (
      <div className="text-center space-y-6 animate-scale-in">
        <div className="text-6xl mb-4">🎊</div>
        <h2 className="text-2xl font-display font-black text-gray-900">
          Bạn đã nhận voucher!
        </h2>
        <p className="text-gray-500">
          Từ <strong>{voucher.creator_name || "người bạn thân"}</strong> với tất cả tình yêu thương 💕
        </p>

        <VoucherCard voucher={voucher} size="lg" className="voucher-shadow" />

        <div className="bg-rose-50 rounded-2xl p-4 border border-rose-100">
          <p className="text-sm text-rose-700 font-medium mb-1">
            💡 Muốn tặng voucher cho người khác?
          </p>
          <p className="text-xs text-rose-500">
            Tạo voucher của riêng bạn miễn phí tại VoucherAI
          </p>
          <button
            onClick={handleCopyCreator}
            className="mt-3 flex items-center gap-2 mx-auto text-xs font-bold text-rose-600 hover:text-rose-800 transition-colors"
          >
            {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
            {copied ? "Đã copy!" : "Copy link VoucherAI"}
          </button>
        </div>
      </div>
    );
  }

  if (!revealed) {
    return (
      <div className="text-center space-y-8 animate-fade-in">
        {/* Gift box */}
        <div className="relative inline-block">
          <div className="w-36 h-36 mx-auto bg-gradient-to-br from-primary to-pink-400 rounded-3xl shadow-glow flex items-center justify-center animate-float">
            <Gift className="w-20 h-20 text-white" />
          </div>
          <div className="absolute -top-3 -right-3 w-10 h-10 bg-accent rounded-full flex items-center justify-center animate-bounce-slow shadow-glow-gold">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
        </div>

        <div className="space-y-3">
          <p className="text-gray-500 text-sm font-medium">
            {voucher.creator_name || "Ai đó"} đã tặng bạn một điều đặc biệt
          </p>
          <h1 className="text-3xl font-display font-black text-gray-900 leading-tight">
            Bạn có 1 món quà đang chờ 🎁
          </h1>
          <p className="text-gray-400 text-sm">Bấm để khám phá bí mật bên trong</p>
        </div>

        <button
          onClick={handleReveal}
          className="btn-primary text-lg py-5 px-10 animate-pulse-slow shadow-voucher"
        >
          Mở quà ngay! ✨
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Revealed voucher */}
      <div className={`${showConfetti ? "animate-scale-in" : ""}`}>
        <div className="text-center mb-4">
          <p className="text-sm text-gray-500 font-medium">
            {voucher.creator_name} đã tặng bạn
          </p>
        </div>
        <VoucherCard voucher={voucher} size="lg" className="voucher-shadow" />
      </div>

      {/* Status badges */}
      {voucher.status === "claimed" && (
        <div className="text-center bg-amber-50 rounded-2xl p-4 border border-amber-200">
          <p className="text-amber-700 font-medium text-sm">
            ⚠️ Voucher này đã được nhận rồi
          </p>
        </div>
      )}

      {voucher.status === "used" && (
        <div className="text-center bg-gray-50 rounded-2xl p-4 border border-gray-200">
          <p className="text-gray-500 font-medium text-sm">
            ✅ Voucher này đã được sử dụng
          </p>
        </div>
      )}

      {voucher.status === "active" && (
        <button
          onClick={handleClaim}
          className="w-full btn-primary text-lg py-5 flex items-center justify-center gap-3 shadow-voucher"
        >
          <Heart className="w-5 h-5" />
          Nhận Voucher này!
        </button>
      )}

      <p className="text-center text-xs text-gray-400">
        Tặng bởi{" "}
        <span className="font-semibold text-primary">VoucherAI.app</span> ·{" "}
        Tạo voucher miễn phí cho người thân yêu 💕
      </p>
    </div>
  );
}
