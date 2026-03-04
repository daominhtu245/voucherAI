"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@/lib/hooks/useUser";
import { Voucher } from "@/types/voucher";
import VoucherCard from "@/components/voucher/VoucherCard";
import { PlusCircle, Gift, Ticket, ExternalLink, Copy } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import toast from "react-hot-toast";

const STATUS_LABELS: Record<string, { label: string; color: string }> = {
  active: { label: "Chờ nhận", color: "bg-green-100 text-green-700" },
  claimed: { label: "Đã nhận", color: "bg-blue-100 text-blue-700" },
  used: { label: "Đã dùng", color: "bg-gray-100 text-gray-500" },
  expired: { label: "Hết hạn", color: "bg-red-100 text-red-500" },
};

export default function ProfilePage() {
  const { user, loading } = useUser();
  const router = useRouter();
  const [vouchers, setVouchers] = useState<Voucher[]>([]);
  const [fetching, setFetching] = useState(false);
  const [selectedVoucher, setSelectedVoucher] = useState<Voucher | null>(null);

  useEffect(() => {
    if (!loading && !user) router.replace("/login");
  }, [user, loading, router]);

  useEffect(() => {
    if (!user) return;
    setFetching(true);
    fetch(`/api/vouchers?userId=${user.id}`)
      .then((r) => r.json())
      .then((data) => setVouchers(data.vouchers || []))
      .catch(() => setVouchers([]))
      .finally(() => setFetching(false));
  }, [user]);

  const handleCopyLink = async (voucher: Voucher) => {
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
    await navigator.clipboard.writeText(`${appUrl}/claim/${voucher.claim_token}`);
    toast.success("Đã copy link! 🔗");
  };

  if (loading || !user) return null;

  return (
    <div className="max-w-2xl mx-auto px-4 py-8 pb-24 sm:pb-8">
      {/* Profile header */}
      <div className="card mb-6">
        <div className="flex items-center gap-4">
          {user.avatar_url ? (
            <Image src={user.avatar_url} alt={user.full_name} width={64} height={64} className="rounded-2xl" />
          ) : (
            <div className="w-16 h-16 bg-primary rounded-2xl flex items-center justify-center">
              <span className="text-white text-2xl font-black">{user.full_name.charAt(0)}</span>
            </div>
          )}
          <div>
            <h1 className="text-xl font-display font-black text-gray-900">{user.full_name}</h1>
            <p className="text-sm text-gray-500">@{user.username}</p>
          </div>
        </div>
        <div className="grid grid-cols-3 gap-3 mt-6">
          {[
            { label: "Đã tặng", value: vouchers.length, icon: "🎁" },
            { label: "Đã claim", value: vouchers.filter((v) => v.status !== "active").length, icon: "✅" },
            { label: "Active", value: vouchers.filter((v) => v.status === "active").length, icon: "⚡" },
          ].map((stat) => (
            <div key={stat.label} className="text-center p-3 bg-gray-50 rounded-xl">
              <div className="text-2xl mb-1">{stat.icon}</div>
              <div className="text-2xl font-black text-gray-900">{stat.value}</div>
              <div className="text-xs text-gray-500 font-medium">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="flex items-center justify-between mb-4">
        <h2 className="font-display font-black text-gray-900">Voucher của tôi</h2>
        <Link href="/create" className="flex items-center gap-1 text-sm text-primary font-semibold">
          <PlusCircle className="w-4 h-4" />Tạo mới
        </Link>
      </div>

      {fetching && (
        <div className="space-y-3">
          {[1,2,3].map(i => <div key={i} className="skeleton h-24 rounded-2xl" />)}
        </div>
      )}

      {!fetching && vouchers.length === 0 && (
        <div className="text-center py-16 space-y-4">
          <div className="text-6xl">🎟️</div>
          <h3 className="font-display font-bold text-xl text-gray-700">Chưa có voucher nào</h3>
          <p className="text-gray-400 text-sm">Tạo voucher đầu tiên và tặng người thân yêu nhé!</p>
          <Link href="/create" className="btn-primary inline-flex items-center gap-2 mt-4">
            <Ticket className="w-4 h-4" />Tạo voucher ngay
          </Link>
        </div>
      )}

      {!fetching && vouchers.length > 0 && (
        <div className="space-y-4">
          {vouchers.map((v) => (
            <div key={v.id} className="card hover:shadow-md transition-shadow cursor-pointer" onClick={() => setSelectedVoucher(selectedVoucher?.id === v.id ? null : v)}>
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    <span className="font-bold text-gray-900 truncate">{v.title}</span>
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium shrink-0 ${STATUS_LABELS[v.status]?.color}`}>
                      {STATUS_LABELS[v.status]?.label}
                    </span>
                  </div>
                  <p className="text-sm text-gray-500 truncate">{v.description}</p>
                  {v.recipient_name && <p className="text-xs text-gray-400 mt-1">Dành cho: <strong>{v.recipient_name}</strong></p>}
                </div>
                <div className="flex gap-2 shrink-0">
                  <button onClick={(e) => { e.stopPropagation(); handleCopyLink(v); }} className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center hover:bg-rose-50 hover:text-primary transition-colors" title="Copy link">
                    <Copy className="w-4 h-4" />
                  </button>
                  <Link href={`/claim/${v.claim_token}`} onClick={(e) => e.stopPropagation()} className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center hover:bg-rose-50 hover:text-primary transition-colors" title="Xem voucher" target="_blank">
                    <ExternalLink className="w-4 h-4" />
                  </Link>
                </div>
              </div>
              {selectedVoucher?.id === v.id && (
                <div className="mt-4 pt-4 border-t border-gray-100">
                  <VoucherCard voucher={v} size="md" />
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
