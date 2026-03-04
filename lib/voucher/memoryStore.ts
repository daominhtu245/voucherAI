/**
 * Server-side in-memory store — persists across requests trong cùng 1 server session.
 * Hoạt động tốt cho local demo. Production → thay bằng Supabase/Redis.
 */
import { Voucher } from "@/types/voucher";

// Module-level singleton — Next.js dev server giữ module alive giữa các requests
const store = new Map<string, Voucher>();

export function saveVoucher(v: Voucher): void {
  store.set(v.claim_token, v);
}

export function getVoucherByToken(token: string): Voucher | undefined {
  return store.get(token);
}

export function getUserVouchers(userId: string): Voucher[] {
  return Array.from(store.values())
    .filter((v) => v.creator_id === userId)
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
}

export function updateVoucher(token: string, patch: Partial<Voucher>): Voucher | null {
  const existing = store.get(token);
  if (!existing) return null;
  const updated = { ...existing, ...patch, updated_at: new Date().toISOString() };
  store.set(token, updated);
  return updated;
}
