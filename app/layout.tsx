import type { Metadata } from "next";
import "./globals.css";
import { Toaster } from "react-hot-toast";

export const metadata: Metadata = {
  title: "VoucherAI — Tặng voucher cảm xúc bằng AI",
  description: "Tạo và tặng voucher cảm xúc cá nhân hóa được generate bởi AI. Ý nghĩa hơn quà vật chất!",
  keywords: ["voucher", "tặng quà", "AI", "Valentine", "sinh nhật", "cảm xúc"],
  openGraph: {
    title: "VoucherAI — Tặng voucher cảm xúc bằng AI",
    description: "Tạo voucher độc đáo, tặng người thân yêu 🎁",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="vi">
      <body className="min-h-screen bg-cream antialiased">
        {children}
        <Toaster
          position="top-center"
          toastOptions={{
            style: {
              borderRadius: "12px",
              fontFamily: "Inter, sans-serif",
              fontSize: "14px",
            },
            success: {
              iconTheme: { primary: "#6BCB77", secondary: "white" },
            },
            error: {
              iconTheme: { primary: "#FF6B6B", secondary: "white" },
            },
          }}
        />
      </body>
    </html>
  );
}
