"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { loginDemo } from "@/lib/auth/fakeUser";
import { getStoredUser } from "@/lib/auth/fakeUser";
import { Ticket, Sparkles, Gift, Heart } from "lucide-react";
import toast from "react-hot-toast";

const FLOATING_VOUCHERS = [
  { title: "Voucher Tha Thứ", emoji: "🙏", rotate: "-12deg", top: "10%", left: "5%" },
  { title: "1 Đêm Tự Do", emoji: "🌙", rotate: "8deg", top: "20%", right: "8%" },
  { title: "Voucher Ôm", emoji: "🤗", rotate: "-5deg", bottom: "30%", left: "3%" },
  { title: "Chọn Phim", emoji: "🎬", rotate: "12deg", bottom: "25%", right: "5%" },
];

export default function LoginPage() {
  const router = useRouter();

  useEffect(() => {
    if (getStoredUser()) {
      router.replace("/create");
    }
  }, [router]);

  const handleDemoLogin = () => {
    loginDemo();
    toast.success("Chào mừng bạn! 🎉");
    router.push("/create");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-cream to-amber-50 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Floating voucher decorations */}
      {FLOATING_VOUCHERS.map((v, i) => (
        <div
          key={i}
          className="absolute hidden md:flex items-center gap-2 bg-white rounded-xl px-3 py-2 shadow-md border border-gray-100 text-sm animate-float opacity-70"
          style={{
            transform: `rotate(${v.rotate})`,
            top: v.top,
            left: v.left,
            right: v.right,
            bottom: v.bottom,
            animationDelay: `${i * 0.7}s`,
          }}
        >
          <span className="text-xl">{v.emoji}</span>
          <span className="font-medium text-gray-700">{v.title}</span>
        </div>
      ))}

      {/* Main card */}
      <div className="w-full max-w-md bg-white rounded-3xl shadow-xl border border-gray-100 p-8 relative z-10">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-primary rounded-2xl shadow-voucher mb-4">
            <Ticket className="w-9 h-9 text-white" />
          </div>
          <h1 className="text-3xl font-display font-black text-gradient">VoucherAI</h1>
          <p className="text-gray-500 mt-2 text-sm">
            Tặng quà ý nghĩa hơn, bằng cảm xúc thật 💕
          </p>
        </div>

        {/* Features highlight */}
        <div className="grid grid-cols-3 gap-3 mb-8">
          {[
            { emoji: "✨", text: "AI generate" },
            { emoji: "🎨", text: "6 themes" },
            { emoji: "🔗", text: "Share link" },
          ].map((f) => (
            <div key={f.text} className="text-center p-3 bg-gray-50 rounded-xl">
              <div className="text-2xl mb-1">{f.emoji}</div>
              <div className="text-xs text-gray-500 font-medium">{f.text}</div>
            </div>
          ))}
        </div>

        {/* Login button */}
        <button
          onClick={handleDemoLogin}
          className="w-full btn-primary flex items-center justify-center gap-3 text-base py-4 mb-4"
        >
          <Sparkles className="w-5 h-5" />
          Đăng nhập Demo &amp; Tạo Voucher
        </button>

        <p className="text-center text-xs text-gray-400 mt-4">
          MVP Demo — Không cần tài khoản thật
        </p>

        {/* Bottom deco */}
        <div className="mt-8 pt-6 border-t border-gray-100 flex items-center justify-center gap-4 text-gray-300">
          <Gift className="w-5 h-5" />
          <span className="text-xs">Miễn phí • Cá nhân hóa • Ý nghĩa</span>
          <Heart className="w-5 h-5" />
        </div>
      </div>
    </div>
  );
}
