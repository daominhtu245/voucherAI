import { NextRequest, NextResponse } from "next/server";
import { generateToken } from "@/lib/voucher/token";
import { saveVoucher, getUserVouchers } from "@/lib/voucher/db";
import { CreateVoucherInput, Voucher } from "@/types/voucher";

export async function POST(req: NextRequest) {
  try {
    const body: CreateVoucherInput & { creator_id: string; creator_name: string } = await req.json();

    if (!body.title || !body.description || !body.occasion || !body.tone || !body.relationship) {
      return NextResponse.json({ error: "Thiếu thông tin bắt buộc" }, { status: 400 });
    }

    const claim_token = generateToken();
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

    const voucher: Voucher = {
      id: crypto.randomUUID(),
      creator_id: body.creator_id || "demo-user-1",
      creator_name: body.creator_name || "Bạn Demo",
      title: body.title,
      description: body.description,
      fine_print: body.fine_print,
      occasion: body.occasion,
      tone: body.tone,
      relationship: body.relationship,
      recipient_name: body.recipient_name,
      theme_id: body.theme_id || "retro",
      primary_color: body.primary_color || "#FF6B6B",
      font_family: "Nunito",
      claim_token,
      status: "active",
      expires_at: body.expires_at,
      claimed_at: undefined,
      claimed_by: undefined,
      used_at: undefined,
      is_public: body.is_public ?? false,
      view_count: 0,
      like_count: 0,
      share_count: 0,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    // Lưu server-side để claim từ bất kỳ trình duyệt nào
    saveVoucher(voucher);

    return NextResponse.json({
      voucher,
      claim_url: `${appUrl}/claim/${claim_token}`,
    });
  } catch (err) {
    console.error("Create voucher error:", err);
    return NextResponse.json({ error: "Không thể tạo voucher" }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  const userId = req.nextUrl.searchParams.get("userId");
  if (!userId) return NextResponse.json({ vouchers: [] });
  return NextResponse.json({ vouchers: getUserVouchers(userId) });
}
