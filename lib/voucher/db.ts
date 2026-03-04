/**
 * Vercel KV (Upstash Redis) — dữ liệu persist qua restart, accessible từ mọi browser.
 */
import { kv } from "@vercel/kv";
import { Voucher } from "@/types/voucher";

export async function saveVoucher(v: Voucher): Promise<void> {
  await kv.set(`voucher:${v.claim_token}`, v);
  // Index by user để lấy danh sách
  await kv.lpush(`user:${v.creator_id}:vouchers`, v.claim_token);
}

export async function getVoucherByToken(token: string): Promise<Voucher | null> {
  return kv.get<Voucher>(`voucher:${token}`);
}

export async function getUserVouchers(userId: string): Promise<Voucher[]> {
  const tokens = await kv.lrange<string>(`user:${userId}:vouchers`, 0, -1);
  if (!tokens.length) return [];
  const vouchers = await Promise.all(
    tokens.map((t) => kv.get<Voucher>(`voucher:${t}`))
  );
  return (vouchers.filter(Boolean) as Voucher[]).sort(
    (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  );
}

export async function updateVoucher(
  token: string,
  patch: Partial<Voucher>
): Promise<Voucher | null> {
  const existing = await getVoucherByToken(token);
  if (!existing) return null;
  const updated: Voucher = { ...existing, ...patch, updated_at: new Date().toISOString() };
  await kv.set(`voucher:${token}`, updated);
  return updated;
}
