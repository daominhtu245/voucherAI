import { NextRequest, NextResponse } from "next/server";
import { getVoucherByToken, updateVoucher } from "@/lib/voucher/db";

export async function GET(_req: NextRequest, { params }: { params: { token: string } }) {
  const voucher = getVoucherByToken(params.token);
  if (!voucher) return NextResponse.json({ error: "Không tìm thấy voucher" }, { status: 404 });
  // Tăng view count
  updateVoucher(params.token, { view_count: voucher.view_count + 1 });
  return NextResponse.json({ voucher });
}

export async function PATCH(req: NextRequest, { params }: { params: { token: string } }) {
  const { action } = await req.json();
  const voucher = getVoucherByToken(params.token);
  if (!voucher) return NextResponse.json({ error: "Không tìm thấy voucher" }, { status: 404 });

  if (action === "claim" && voucher.status === "active") {
    const updated = updateVoucher(params.token, {
      status: "claimed",
      claimed_at: new Date().toISOString(),
      claimed_by: "guest",
    });
    return NextResponse.json({ voucher: updated });
  }

  if (action === "use" && voucher.status === "claimed") {
    const updated = updateVoucher(params.token, {
      status: "used",
      used_at: new Date().toISOString(),
    });
    return NextResponse.json({ voucher: updated });
  }

  return NextResponse.json({ voucher });
}
