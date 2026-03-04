/**
 * SQLite storage — dữ liệu persist qua restart server.
 * File DB: <project_root>/voucher-ai.db
 */
import path from "path";
import { Voucher } from "@/types/voucher";

/* eslint-disable */
const Database = require("better-sqlite3");
/* eslint-enable */

const DB_PATH = path.join(process.cwd(), "voucher-ai.db");

// Singleton
let _db: ReturnType<typeof Database> | null = null;

function getDb() {
  if (!_db) {
    _db = new Database(DB_PATH);
    _db.pragma("journal_mode = WAL");
    _db.exec(`
      CREATE TABLE IF NOT EXISTS vouchers (
        id TEXT PRIMARY KEY,
        claim_token TEXT UNIQUE NOT NULL,
        creator_id TEXT,
        creator_name TEXT,
        title TEXT NOT NULL,
        description TEXT NOT NULL,
        fine_print TEXT,
        occasion TEXT NOT NULL,
        tone TEXT NOT NULL,
        relationship TEXT NOT NULL,
        recipient_name TEXT,
        theme_id TEXT DEFAULT 'retro',
        primary_color TEXT DEFAULT '#FF6B6B',
        font_family TEXT DEFAULT 'Nunito',
        status TEXT DEFAULT 'active',
        expires_at TEXT,
        claimed_at TEXT,
        claimed_by TEXT,
        used_at TEXT,
        is_public INTEGER DEFAULT 0,
        view_count INTEGER DEFAULT 0,
        like_count INTEGER DEFAULT 0,
        share_count INTEGER DEFAULT 0,
        created_at TEXT NOT NULL,
        updated_at TEXT NOT NULL
      )
    `);
  }
  return _db;
}

function rowToVoucher(row: Record<string, unknown>): Voucher {
  return {
    ...(row as unknown as Voucher),
    is_public: !!row.is_public,
  };
}

export function saveVoucher(v: Voucher): void {
  const db = getDb();
  db.prepare(`
    INSERT OR REPLACE INTO vouchers
    (id, claim_token, creator_id, creator_name, title, description, fine_print,
     occasion, tone, relationship, recipient_name, theme_id, primary_color,
     font_family, status, expires_at, claimed_at, claimed_by, used_at,
     is_public, view_count, like_count, share_count, created_at, updated_at)
    VALUES
    (@id, @claim_token, @creator_id, @creator_name, @title, @description, @fine_print,
     @occasion, @tone, @relationship, @recipient_name, @theme_id, @primary_color,
     @font_family, @status, @expires_at, @claimed_at, @claimed_by, @used_at,
     @is_public, @view_count, @like_count, @share_count, @created_at, @updated_at)
  `).run({
    ...v,
    fine_print: v.fine_print ?? null,
    recipient_name: v.recipient_name ?? null,
    expires_at: v.expires_at ?? null,
    claimed_at: v.claimed_at ?? null,
    claimed_by: v.claimed_by ?? null,
    used_at: v.used_at ?? null,
    is_public: v.is_public ? 1 : 0,
  });
}

export function getVoucherByToken(token: string): Voucher | null {
  const db = getDb();
  const row = db.prepare("SELECT * FROM vouchers WHERE claim_token = ?").get(token);
  return row ? rowToVoucher(row as Record<string, unknown>) : null;
}

export function getUserVouchers(userId: string): Voucher[] {
  const db = getDb();
  const rows = db.prepare(
    "SELECT * FROM vouchers WHERE creator_id = ? ORDER BY created_at DESC"
  ).all(userId) as Record<string, unknown>[];
  return rows.map(rowToVoucher);
}

export function updateVoucher(token: string, patch: Partial<Voucher>): Voucher | null {
  const db = getDb();
  const existing = getVoucherByToken(token);
  if (!existing) return null;
  const updated = { ...existing, ...patch, updated_at: new Date().toISOString() };
  saveVoucher(updated);
  return updated;
}
