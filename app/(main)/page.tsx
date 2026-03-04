"use client";

import { useState } from "react";
import Link from "next/link";
import { Ticket, Sparkles, Heart, Zap, Gift, ArrowRight } from "lucide-react";
import VoucherCard from "@/components/voucher/VoucherCard";

const DEMO_VOUCHERS = [
  {
    title: "Voucher Tha Thứ",
    description: "1 lần được ngủ quên mà không bị nhắn tin 50 cái liên tiếp",
    fine_print: "* Chỉ áp dụng khi báo thức đã reng ít nhất 3 lần",
    theme_id: "retro" as const,
    primary_color: "#D4820A",
    recipient_name: "Minh",
  },
  {
    title: "Voucher 1 Đêm Tự Do",
    description: "Được chơi game đến tận 2 giờ sáng mà không bị nhắc nhở",
    fine_print: "* Không áp dụng vào buổi sáng hôm sau khi thức dậy muộn",
    theme_id: "y2k" as const,
    primary_color: "#8B00FF",
    recipient_name: "Hùng",
  },
  {
    title: "Voucher Ôm Không Giới Hạn",
    description: "1 buổi tối được ôm thoải mái, không bị than là nóng",
    fine_print: "* Điều khoản: người tặng có quyền ngủ quên giữa chừng",
    theme_id: "cute" as const,
    primary_color: "#FF69B4",
    recipient_name: "Linh",
  },
];

const FEATURES = [
  { emoji: "✨", title: "AI Generate", desc: "Claude AI tạo nội dung hài hước, xúc động, cá nhân hóa theo dịp" },
  { emoji: "🎨", title: "6 Themes", desc: "Retro, Luxury, Cute, Minimal, Y2K, Nature — mỗi theme một mood" },
  { emoji: "🔗", title: "Share Link", desc: "Gửi link để người nhận claim. Không cần app, không cần cài đặt" },
  { emoji: "🎊", title: "Claim Animation", desc: "Người nhận mở quà với confetti đẹp, gây wow effect" },
];

export default function HomePage() {
  const [activeDemo, setActiveDemo] = useState(0);

  return (
    <div className="min-h-screen">
      {/* Hero section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-rose-50 via-cream to-amber-50 pt-16 pb-24">
        {/* Background decorations */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-10 left-10 w-48 h-48 bg-primary/5 rounded-full blur-3xl" />
          <div className="absolute bottom-10 right-10 w-64 h-64 bg-accent/10 rounded-full blur-3xl" />
        </div>

        <div className="max-w-6xl mx-auto px-4 relative">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left: text */}
            <div className="text-center lg:text-left">
              <div className="inline-flex items-center gap-2 bg-rose-100 text-primary px-4 py-2 rounded-full text-sm font-bold mb-6">
                <Sparkles className="w-4 h-4" />
                Powered by Anthropic Claude AI
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-display font-black text-gray-900 leading-tight mb-6">
                Tặng quà{" "}
                <span className="text-gradient">ý nghĩa</span>{" "}
                hơn tiền 💕
              </h1>

              <p className="text-lg text-gray-600 mb-8 max-w-lg">
                Tạo voucher cảm xúc cá nhân hóa bằng AI — hài hước, lãng mạn, ấm áp.
                Người nhận claim qua link, không cần tải app.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <Link
                  href="/login"
                  className="btn-primary text-base py-4 px-8 flex items-center justify-center gap-2 shadow-voucher"
                >
                  <Ticket className="w-5 h-5" />
                  Tạo Voucher Miễn Phí
                </Link>
                <Link
                  href="#demo"
                  className="btn-secondary text-base py-4 px-8 flex items-center justify-center gap-2"
                >
                  Xem Demo
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>

              {/* Social proof */}
              <div className="mt-8 flex items-center gap-4 justify-center lg:justify-start">
                <div className="flex -space-x-2">
                  {["🧑", "👩", "👦", "👧", "🧒"].map((emoji, i) => (
                    <div key={i} className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-pink-400 flex items-center justify-center text-sm border-2 border-white">
                      {emoji}
                    </div>
                  ))}
                </div>
                <p className="text-sm text-gray-500">
                  <strong className="text-gray-800">1,234+</strong> vouchers đã được tặng
                </p>
              </div>
            </div>

            {/* Right: demo carousel */}
            <div id="demo" className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-accent/5 rounded-3xl" />
              <div className="relative p-6">
                <div className="mb-4 flex gap-2 justify-center">
                  {DEMO_VOUCHERS.map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setActiveDemo(i)}
                      className={`w-2 h-2 rounded-full transition-all ${
                        i === activeDemo ? "w-6 bg-primary" : "bg-gray-300"
                      }`}
                    />
                  ))}
                </div>
                <VoucherCard
                  voucher={DEMO_VOUCHERS[activeDemo]}
                  size="lg"
                  className="voucher-shadow animate-float"
                />
                <div className="mt-4 flex justify-center gap-3">
                  {DEMO_VOUCHERS.map((v, i) => (
                    <button
                      key={i}
                      onClick={() => setActiveDemo(i)}
                      className={`text-xs px-3 py-1.5 rounded-full font-semibold transition-all ${
                        i === activeDemo
                          ? "bg-primary text-white"
                          : "bg-white text-gray-500 border border-gray-200 hover:border-rose-200"
                      }`}
                    >
                      {v.theme_id}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 bg-white">
        <div className="max-w-5xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-display font-black text-gray-900 mb-4">
              Tại sao chọn VoucherAI?
            </h2>
            <p className="text-gray-500 max-w-xl mx-auto">
              Thay vì tặng quà vật chất đắt tiền hay tin nhắn nhàm chán,
              hãy tặng những khoảnh khắc thật sự ý nghĩa.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {FEATURES.map((f) => (
              <div key={f.title} className="card text-center hover:shadow-md transition-shadow">
                <div className="text-4xl mb-4">{f.emoji}</div>
                <h3 className="font-display font-bold text-gray-900 mb-2">{f.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-20 bg-gradient-to-br from-rose-50 to-cream">
        <div className="max-w-4xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-display font-black text-gray-900 mb-4">
              Chỉ 3 bước đơn giản 🚀
            </h2>
          </div>

          <div className="grid sm:grid-cols-3 gap-8">
            {[
              { step: "1", icon: <Sparkles className="w-6 h-6" />, title: "Nhập thông tin", desc: "Chọn dịp, tone, người nhận. AI sẽ generate 5 ý tưởng voucher độc đáo." },
              { step: "2", icon: <Gift className="w-6 h-6" />, title: "Chọn & Chỉnh sửa", desc: "Chọn ý tưởng yêu thích, chỉnh sửa, pick theme đẹp. Preview realtime." },
              { step: "3", icon: <Zap className="w-6 h-6" />, title: "Share Link", desc: "Copy link gửi cho người nhận. Họ mở link, xem animation, claim voucher." },
            ].map((s) => (
              <div key={s.step} className="text-center">
                <div className="w-14 h-14 bg-primary rounded-2xl flex items-center justify-center text-white mx-auto mb-4 shadow-voucher">
                  {s.icon}
                </div>
                <div className="text-xs font-bold text-primary mb-1">BƯỚC {s.step}</div>
                <h3 className="font-display font-bold text-gray-900 mb-2">{s.title}</h3>
                <p className="text-sm text-gray-500">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-gradient-to-r from-primary to-pink-500">
        <div className="max-w-2xl mx-auto px-4 text-center">
          <h2 className="text-3xl sm:text-4xl font-display font-black text-white mb-4">
            Sẵn sàng tặng quà chưa? 🎁
          </h2>
          <p className="text-rose-100 mb-8">
            Miễn phí, không cần đăng ký. Tạo ngay trong 2 phút!
          </p>
          <Link
            href="/login"
            className="inline-flex items-center gap-2 bg-white text-primary font-bold text-lg py-4 px-10 rounded-2xl hover:bg-rose-50 active:scale-95 transition-all shadow-lg"
          >
            <Heart className="w-5 h-5" />
            Tạo Voucher Miễn Phí
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-8 text-center text-sm">
        <div className="flex items-center justify-center gap-2 mb-2">
          <Ticket className="w-4 h-4 text-primary" />
          <span className="text-white font-display font-bold">VoucherAI</span>
        </div>
        <p>MVP Demo · Powered by Anthropic Claude AI</p>
      </footer>
    </div>
  );
}
