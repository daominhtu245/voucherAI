/**
 * MVP: Lưu vouchers trong localStorage thay vì Supabase
 * Full Plan: thay bằng Supabase calls
 */
import { Voucher, CreateVoucherInput } from "@/types/voucher";
import { generateToken } from "./token";

const VOUCHERS_KEY = "voucher_ai_vouchers";

function getAll(): Voucher[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(VOUCHERS_KEY);
    return raw ? (JSON.parse(raw) as Voucher[]) : [];
  } catch {
    return [];
  }
}

function saveAll(vouchers: Voucher[]): void {
  if (typeof window !== "undefined") {
    localStorage.setItem(VOUCHERS_KEY, JSON.stringify(vouchers));
  }
}

export function createVoucher(input: CreateVoucherInput, creatorId: string, creatorName: string): Voucher {
  const voucher: Voucher = {
    id: crypto.randomUUID(),
    creator_id: creatorId,
    creator_name: creatorName,
    ...input,
    font_family: "Nunito",
    claim_token: generateToken(),
    status: "active",
    is_public: input.is_public,
    view_count: 0,
    like_count: 0,
    share_count: 0,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };
  const all = getAll();
  all.unshift(voucher);
  saveAll(all);
  return voucher;
}

export function getVoucherByToken(token: string): Voucher | null {
  const all = getAll();
  return all.find((v) => v.claim_token === token) ?? null;
}

export function getVoucherById(id: string): Voucher | null {
  const all = getAll();
  return all.find((v) => v.id === id) ?? null;
}

export function getUserVouchers(userId: string): Voucher[] {
  return getAll().filter((v) => v.creator_id === userId);
}

export function claimVoucher(token: string, claimedById: string): Voucher | null {
  const all = getAll();
  const idx = all.findIndex((v) => v.claim_token === token);
  if (idx === -1) return null;
  const voucher = all[idx];
  if (voucher.status !== "active") return voucher;
  all[idx] = {
    ...voucher,
    status: "claimed",
    claimed_at: new Date().toISOString(),
    claimed_by: claimedById,
    updated_at: new Date().toISOString(),
  };
  saveAll(all);
  return all[idx];
}

export function useVoucher(token: string): Voucher | null {
  const all = getAll();
  const idx = all.findIndex((v) => v.claim_token === token);
  if (idx === -1) return null;
  all[idx] = {
    ...all[idx],
    status: "used",
    used_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };
  saveAll(all);
  return all[idx];
}
