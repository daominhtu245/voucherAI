"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Voucher } from "@/types/voucher";
import ClaimReveal from "@/components/claim/ClaimReveal";
import { Ticket } from "lucide-react";
import Link from "next/link";

export default function ClaimPage() {
  const params = useParams();
  const token = params.token as string;
  const [voucher, setVoucher] = useState<Voucher | null | undefined>(undefined);
  const [claimed, setClaimed] = useState(false);

  useEffect(() => {
    fetch(`/api/claim/${token}`)
      .then((r) => r.json())
      .then((data) => setVoucher(data.voucher ?? null))
      .catch(() => setVoucher(null));
  }, [token]);

  const handleClaim = async () => {
    const res = await fetch(`/api/claim/${token}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "claim" }),
    });
    const data = await res.json();
    if (data.voucher) {
      setVoucher(data.voucher);
      setClaimed(true);
    }
  };

  if (voucher === undefined) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-rose-50 via-cream to-amber-50 flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-gray-500 text-sm">Đang tải voucher...</p>
        </div>
      </div>
    );
  }

  if (!voucher) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-rose-50 via-cream to-amber-50 flex items-center justify-center p-4">
        <div className="text-center max-w-sm space-y-6">
          <div className="text-6xl">😕</div>
          <h1 className="text-2xl font-display font-black text-gray-800">Không tìm thấy voucher</h1>
          <p className="text-gray-500">
            Link có thể không tồn tại hoặc server đã khởi động lại (demo mode).
          </p>
          <Link href="/" className="btn-primary inline-flex items-center gap-2">
            <Ticket className="w-4 h-4" />
            Tạo voucher của riêng bạn
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-cream to-amber-50">
      <div className="max-w-lg mx-auto px-4 pt-6 pb-2">
        <Link href="/" className="flex items-center gap-2 text-primary font-display font-bold text-lg">
          <Ticket className="w-6 h-6" />
          VoucherAI
        </Link>
      </div>
      <div className="max-w-lg mx-auto px-4 py-8 min-h-[80vh] flex items-center">
        <div className="w-full">
          <ClaimReveal voucher={voucher} onClaim={handleClaim} claimed={claimed} />
        </div>
      </div>
    </div>
  );
}
